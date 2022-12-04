import Link from "next/link";
import { trpc } from "utils/trpc";

export const Specialists = () => {
  const { data: specialists } = trpc.user.specialists.useQuery();

  if (!specialists) return <>nothing to show</>;
  return (
    <div className="hidden md:block bg-white p-5 rounded-xl">
      <h1 className="text-2xl font-semibold text-center">Специалисты</h1>
      {specialists.map((s) => (
        <Link
          key={s.id}
          href={`/users/${s.id}`}
          className="flex items-center justify-between px-2 w-full rounded-md hover:bg-gray-100 hover:duration-300"
        >
          <div className="flex items-center gap-2 p-2 m-2">
            {s.image && <img src={s.image} alt="Hashtag" className="w-6 h-6 rounded-xl" />}
            {s.name}
          </div>
        </Link>
      ))}
    </div>
  );
};
