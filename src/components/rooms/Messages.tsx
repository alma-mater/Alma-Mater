import { trpc } from "utils/trpc";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";

const AddMessageForm = ({ onMessagePost }: { onMessagePost: () => void }) => {
  const addMessage = trpc.message.add.useMutation();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [enterToPostMessage, setEnterToPostMessage] = useState(true);
  async function postMessage() {
    try {
      await addMessage.mutateAsync({ content });
      setContent("");
      onMessagePost();
    } catch {}
  }

  const isTyping = trpc.message.isTyping.useMutation();

  const userName = session?.user?.name;
  if (!userName) {
    return (
      <div className="flex justify-between w-full px-3 py-2 text-lg text-gray-200 bg-gray-800 rounded">
        <p className="font-bold">
          You have to{" "}
          <button
            className="inline font-bold underline"
            onClick={() => signIn()}
          >
            sign in
          </button>{" "}
          to write.
        </p>
        <button
          onClick={() => signIn()}
          data-testid="signin"
          className="h-full px-4 bg-indigo-500 rounded"
        >
          Sign In
        </button>
      </div>
    );
  }
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await postMessage();
        }}
      >
        <fieldset disabled={addMessage.isLoading} className="min-w-0">
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
              <button
                type="submit"
                className="px-4 py-1 text-gray-200 bg-indigo-500 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </fieldset>
        {addMessage.error && (
          <p style={{ color: "red" }}>{addMessage.error.message}</p>
        )}
      </form>
    </>
  );
};

export const Messages = () => {
  const messagesQuery = trpc.message.infinite.useInfiniteQuery(
    {},
    {
      getPreviousPageParam: (d) => d.prevCursor,
    }
  );
  const utils = trpc.useContext();
  const { hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage } =
    messagesQuery;

  // list of messages that are rendered
  const [messages, setMessages] = useState(() => {
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type Message = NonNullable<typeof messages>[number];
  const { data: session } = useSession();
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // fn to add and dedupe new messages onto state
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
    const msgs = messagesQuery.data?.pages.map((page) => page.items).flat();
    addMessages(msgs);
  }, [messagesQuery.data?.pages, addMessages]);

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
  // subscribe to new messages and add
  trpc.message.onAdd.useSubscription(undefined, {
    onData(message) {
      addMessages([message]);
    },
    onError(err) {
      console.error("Subscription error:", err);
      // we might have missed a message - invalidate cache
      utils.message.infinite.invalidate();
    },
  });

  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  trpc.message.whoIsTyping.useSubscription(undefined, {
    onData(data) {
      setCurrentlyTyping(data);
    },
  });

  return (
    <>
      <Head>
        <title>Prisma Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="rounded-xl flex flex-col justify-end h-full p-4 space-y-4 bg-white">
        <div className="space-y-4 overflow-y-auto">
          <button
            data-testid="loadMore"
            onClick={() => fetchPreviousPage()}
            disabled={!hasPreviousPage || isFetchingPreviousPage}
            className="px-4 py-2 text-gray-200 bg-indigo-500 rounded disabled:opacity-40"
          >
            {isFetchingPreviousPage
              ? "Loading more..."
              : hasPreviousPage
              ? "Load More"
              : "Nothing more to load"}
          </button>
          <div className="space-y-4">
            {messages?.map((item) => (
              <article key={item.id}>
                <header className="flex space-x-2 text-sm">
                  <h3 className="text-md">
                    <a
                      href={`/users/${item.authorId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.authorName}
                    </a>
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
          <AddMessageForm onMessagePost={() => scrollToBottomOfList()} />
          <p className="h-2 italic text-gray-400">
            {currentlyTyping.length
              ? `${currentlyTyping.join(", ")} typing...`
              : ""}
          </p>
        </div>
      </section>
    </>
  );
};
