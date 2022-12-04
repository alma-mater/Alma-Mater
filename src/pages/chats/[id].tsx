import NextError from "next/error";
import { ChatMessages } from "components/chats/ChatMessages";
import { Page } from "layouts/Page";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

const ViewChat = () => {
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // tRPC
  const chatQuery = trpc.chat.byId.useQuery({ id });
  const { data: chat } = chatQuery;

  //   chat fetch fail
  if (chatQuery.error) {
    return (
      <NextError
        title={chatQuery.error.message}
        statusCode={chatQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!chat || chatQuery.status !== "success") return "Loading...";
  return (
    <Page title="Чат со специалистом">
      <div className="my-4 lg:my-0 max-w-[60ch] mx-auto">
        <h1 className="text-4xl font-extrabold">
          Чат - {chat.specialist.name}
        </h1>
        <div className="flex items-center justify-between my-2">
          <p className="text-gray-400">
            Создано в {chat.createdAt.toLocaleDateString("en-us")}
          </p>
        </div>
        <ChatMessages chatId={id} />
      </div>
    </Page>
  );
};

export default ViewChat;
