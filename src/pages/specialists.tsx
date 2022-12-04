import Link from "next/link";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

const Specialists = () => {
  const { data } = trpc.user.specialists.useQuery();
  return (
    <div className="md:max-w-[60ch] mx-auto">
      <div className={CARD}>
        {data?.map((u) => (
          <Link
            href={`/users/${u.id}`}
            className="flex items-center justify-between px-2 w-full rounded-md hover:bg-gray-100 hover:duration-300"
          >
            <div className="flex items-center gap-2 p-2 m-2">
              {u.image && (
                <img src={u.image} alt="Hashtag" className="w-6 h-6" />
              )}
              {u.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Specialists;
