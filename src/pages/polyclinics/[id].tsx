import { Avatar } from "components/common/Avatar";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { IoHeart, IoPeople } from "react-icons/io5";
import { MdPregnantWoman, MdWork } from "react-icons/md";
import { ACTION_BUTTON, CARD, HASHTAG, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type PolyclinicItemProps = {
  data: any;
  refetch: () => void;
};

const PolyclinicItem = ({ data, refetch }: PolyclinicItemProps) => {
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
      <div className="flex items-center justify-between">
        <Link
          href={`/users/${data.authorId || "ghost"}`}
          className="flex items-center gap-2 font-medium"
        >
          <Avatar src={data.authorImage} size={32} />
          <span>{data.authorName || "ghost"}</span>
          {data.authorRole === "PREGNANT" ? <MdPregnantWoman /> : <MdWork />}
        </Link>
        <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <Link
        href={`/reviews/${data.id}`}
        className="max-w-max text-2xl font-semibold"
      >
        {data.title}
      </Link>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2 flex justify-between font-semibold">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2"
            onClick={() => likeReview.mutateAsync({ id: data.id })}
          >
            <IoHeart className="w-5 h-5 hover:text-red-500 hover:duration-300" />
            {data.likes}
          </button>
          <span className="flex items-center gap-2">
            <IoPeople className="w-5 h-5" />
            {data.participants.length}
          </span>
        </div>
        {data.hashtag && (
          <span
            className={`${HASHTAG} flex items-center gap-2`}
            key={data.hashtagId}
          >
            {data.hashtag.name}
          </span>
        )}
      </div>
    </article>
  );
};

const ViewPolyclinic = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const reviewsQuery = trpc.review.infinite.useInfiniteQuery({
    polyclinicId: id,
  });

  const { data: polyclinic } = trpc.polyclinic.info.useQuery({
    id,
  });

  return (
    <>
      <div className={CARD}>
        <img
          className="w-48 h-48 object-cover rounded-xl"
          src={polyclinic?.image || ""}
          alt="Polyclinic Image"
        />
        <h1 className="border text-red-500">{polyclinic?.name}</h1>
        <p>{polyclinic?.about}</p>
      </div>
      {reviewsQuery.data?.pages.map((page, index) => (
        <>
          {page.items.length > 0 && (
            <Fragment key={page.items[0].id || index}>
              {page.items.map((item) => (
                <PolyclinicItem
                  key={item.id}
                  data={item}
                  refetch={reviewsQuery.refetch}
                />
              ))}
            </Fragment>
          )}
        </>
      ))}
      {/* Pagination */}
      <button
        className={ACTION_BUTTON}
        onClick={() => reviewsQuery.fetchPreviousPage()}
        disabled={
          !reviewsQuery.hasPreviousPage || reviewsQuery.isFetchingPreviousPage
        }
      >
        {reviewsQuery.isFetchingPreviousPage
          ? "Загрузка..."
          : reviewsQuery.hasPreviousPage
          ? "Показать больше"
          : "Нет отзывов"}
      </button>
    </>
  );
};

export default ViewPolyclinic;
