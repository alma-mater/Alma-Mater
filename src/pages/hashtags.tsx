import Link from "next/link";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

const Hashtags = () => {
  const { data } = trpc.hashtag.all.useQuery();
  return (
    <div className="md:max-w-[60ch] mx-auto">
      <div className={CARD}>
        {data?.map((t) => (
          <Link
            href={`/?hashtagId=${t.id}`}
            className="flex items-center justify-between px-2 w-full rounded-md hover:bg-gray-200 hover:duration-300"
          >
            <div className="flex items-center gap-2 p-2 m-2">
              {t.image && (
                <img src={t.image} alt="Hashtag" className="w-6 h-6" />
              )}
              {t.name}
            </div>
            <span className="text-lg text-white px-2 rounded bg-pink-500">
              {t.rooms.length}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hashtags;
