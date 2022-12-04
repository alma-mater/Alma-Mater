import Link from "next/link";
import { IoHeart, IoPeople } from "react-icons/io5";
import { trpc } from "utils/trpc";

type PolyclinicItemProps = {
  data: any;
  refetch: () => void;
};

export const PolyclinicItem = ({ data, refetch }: PolyclinicItemProps) => {
  const likeReview = trpc.review.like.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <article
      className="my-2 flex p-5 gap-2 flex-col bg-white rounded-xl"
      key={data.id}
    >
      <Link
        href={`/reviews/${data.id}`}
        className="max-w-max text-2xl font-semibold"
      >
        {data.title}
      </Link>
      <p className="text-gray-400">{data.content}</p>
      <div className="my-2 flex justify-between font-semibold">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2"
            onClick={() => likeReview.mutateAsync({ id: data.id })}
          >
            <IoHeart className="w-5 h-5 hover:text-red-500 hover:duration-300" />
            {data.likes}
          </button>
        </div>
      </div>
    </article>
  );
};
