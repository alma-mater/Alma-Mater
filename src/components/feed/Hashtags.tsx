import Link from "next/link";
import { AiOutlineDown } from "react-icons/ai";
import { trpc } from "utils/trpc";

export const Hashtags = () => {
  const { data } = trpc.hashtag.getSome.useQuery({ limit: 5 });

  return (
    <div className="hidden md:block bg-white p-5 rounded-xl">
      <h1 className="text-2xl font-semibold text-center">Хэштеги</h1>
      <ul>
        <Link
          href="/"
          className="flex items-center justify-between my-2 p-2 rounded-md hover:bg-gray-100 hover:duration-300"
        >
          <span className="text-xl p-2">Все</span>
        </Link>
        {data?.map((t) => (
          <li
            key={t.id}
            className="my-2 p-2 rounded-md hover:bg-gray-100 hover:duration-300"
          >
            <Link
              href={`/?hashtagId=${t.id}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="text-xl p-2">#{t.name}</span>
              </div>
              <span className="text-lg px-2 rounded bg-pink-500 text-white">
                {t.rooms.length}
              </span>
            </Link>
          </li>
        ))}
        <Link
          href="/hashtags"
          className="w-max flex items-center gap-2 text-blue-400 hover:bg-gray-100 hover:duration-500 px-4 py-2 rounded-lg"
        >
          Больше <AiOutlineDown size={16} />
        </Link>
      </ul>
    </div>
  );
};
