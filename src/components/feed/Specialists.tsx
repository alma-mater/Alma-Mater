import { Avatar } from "components/common/Avatar";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const Specialists = () => {
  const { data: specialists } = trpc.user.specialists.useQuery();
  const router = useRouter();
  const addChat = trpc.chat.add.useMutation();

  if (!specialists) return <>nothing to show</>;
  return (
    <div className="hidden md:block bg-white p-5 rounded-xl">
      <h1 className="text-2xl font-semibold text-center">Специалисты</h1>
      {specialists.map((s) => (
        <button
          key={s.id}
          className="flex items-center justify-between px-2 w-full rounded-md hover:bg-gray-100 hover:duration-300"
          onClick={async () => {
            const chat = await addChat.mutateAsync({ specialistId: s.id });
            router.push(`/chats/${chat.id}`);
          }}
        >
          <div className="flex items-center gap-2 p-2 m-2">
            <Avatar src={s.image} size={32} />
            {s.name}
          </div>
        </button>
      ))}
    </div>
  );
};
