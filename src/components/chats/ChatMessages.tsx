import { trpc } from "utils/trpc";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTION_BUTTON } from "styles";

type AddChatMessageFormProps = {
  onMessagePost: () => void;
  chatId: string;
};

const AddChatMessageForm = ({
  onMessagePost,
  chatId,
}: AddChatMessageFormProps) => {
  const addChatMessage = trpc.chatMessage.add.useMutation();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);
  async function postMessage() {
    try {
      await addChatMessage.mutateAsync({ content, chatId });
      setContent("");
      onMessagePost();
    } catch {}
  }

  const isTyping = trpc.chatMessage.isTyping.useMutation();

  const userName = session?.user?.name;
  if (!userName) {
    return (
      <div className="flex justify-between w-full px-3 py-2 text-lg bg-gray-100 rounded">
        <p className="font-bold">
          Вы должны быть{" "}
          <button
            className="inline font-bold underline"
            onClick={() => signIn()}
          >
            зарегистрированы
          </button>{" "}
          чтобы написать.
        </p>
        <button
          onClick={() => signIn()}
          data-testid="signin"
          className={ACTION_BUTTON}
        >
          Регистрация
        </button>
      </div>
    );
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await postMessage();
      }}
    >
      <fieldset disabled={addChatMessage.isLoading} className="min-w-0">
        <div className="flex items-end w-full px-3 py-2 text-lg bg-gray-100 rounded">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent outline-0"
            rows={content.split(/\r|\n/).length}
            id="text"
            name="text"
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === "Shift") {
                setEnterToPostMessage(false);
              }
              if (e.key === "Enter" && enterToPostMessage) {
                postMessage();
              }
              isTyping.mutate({ typing: true });
            }}
            onKeyUp={(e) => {
              if (e.key === "Shift") {
                setEnterToPostMessage(true);
              }
            }}
            onBlur={() => {
              setEnterToPostMessage(true);
              isTyping.mutate({ typing: false });
            }}
          />
          <div>
            <button type="submit" className={ACTION_BUTTON}>
              Submit
            </button>
          </div>
        </div>
      </fieldset>
      {addChatMessage.error && (
        <p style={{ color: "red" }}>{addChatMessage.error.message}</p>
      )}
    </form>
  );
};

export const ChatMessages = ({ chatId }: { chatId: string }) => {
  const chatMessagesQuery = trpc.chatMessage.infinite.useInfiniteQuery(
    { chatId },
    {
      getPreviousPageParam: (d) => d.prevCursor,
    }
  );
  const utils = trpc.useContext();
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    chatMessagesQuery;

  // list of chatMessages that are rendered
  const [chatMessages, setMessages] = useState(() => {
    const msgs = chatMessagesQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type Message = NonNullable<typeof chatMessages>[number];
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // fn to add and dedupe new chatMessages onto state
  const addMessages = useCallback((incoming?: Message[]) => {
    setMessages((current) => {
      const map: Record<Message["id"], Message> = {};
      for (const msg of current ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  }, []);

  // when new data from `useInfiniteQuery`, merge with current state
  useEffect(() => {
    const msgs = chatMessagesQuery.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [chatMessagesQuery.data?.pages, addMessages]);

  const scrollToBottomOfList = useCallback(() => {
    if (scrollTargetRef.current == null) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [scrollTargetRef]);
  useEffect(() => {
    scrollToBottomOfList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // subscribe to new chatMessages and add
  trpc.chatMessage.onAdd.useSubscription(undefined, {
    onData(chatMessage) {
      addMessages([chatMessage]);
    },
    onError(err) {
      console.error("Subscription error:", err);
      // we might have missed a chatMessage - invalidate cache
      utils.chatMessage.infinite.invalidate();
    },
  });

  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  trpc.chatMessage.whoIsTyping.useSubscription(undefined, {
    onData(data) {
      setCurrentlyTyping(data);
    },
  });

  return (
    <section className="rounded-xl flex flex-col justify-end h-full p-4 space-y-4 bg-white">
      <div className="space-y-4 overflow-y-auto">
        <button
          data-testid="loadMore"
          onClick={() => fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetchingPreviousPage}
          className={ACTION_BUTTON}
        >
          {isFetchingPreviousPage
            ? "Загружаем побольше..."
            : hasPreviousPage
            ? "Загрузить больше"
            : "Нечего загружать"}
        </button>
        <div className="space-y-4">
          {chatMessages?.map((item) => (
            <article key={item.id}>
              <header className="flex space-x-2 text-sm">
                <h3 className="text-md">
                  {item.authorRole === "SPECIALIST" ? (
                    <a
                      href={`/users/${item.authorId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.authorName}
                    </a>
                  ) : (
                    <span>Анонимный П.</span>
                  )}
                </h3>
                <span className="text-gray-500">
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(item.createdAt)}
                </span>
              </header>
              <p className="text-xl leading-tight whitespace-pre-line">
                {item.content}
              </p>
            </article>
          ))}
          <div ref={scrollTargetRef}></div>
        </div>
      </div>
      <div className="w-full">
        <AddChatMessageForm
          chatId={chatId}
          onMessagePost={() => scrollToBottomOfList()}
        />
        <p className="h-2 italic text-gray-400">
          {currentlyTyping.length
            ? `${currentlyTyping.join(", ")} typing...`
            : ""}
        </p>
      </div>
    </section>
  );
};
