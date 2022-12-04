import { PolyclinicInfo } from "components/polyclinics/PolyclinicInfo";
import { PolyclinicItem } from "components/polyclinics/PolyclinicItem";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { ACTION_BUTTON } from "styles";
import { trpc } from "utils/trpc";

const Review = ({reviewsQuery}: {reviewsQuery: any}) => {
  return (
    <div className="w-[70%]">
    <h1 className="text-3xl font-extrabold">Отзывы</h1>
    {reviewsQuery.data?.pages.map((page: any, index: any) => (
      <>
        {page.items.length > 0 && (
          <Fragment key={page.items[0].id || index}>
            {page.items.map((item: any) => (
              <div className="rounded-xl drop-shadow-xl w-full my-4">
                <PolyclinicItem
                  key={item.id}
                  data={item}
                  refetch={reviewsQuery.refetch}
                />
              </div>
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
  </div>
  )
}

const ViewPolyclinic = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const reviewsQuery = trpc.review.infinite.useInfiniteQuery({
    polyclinicId: id,
  });

  const { data: polyclinic } = trpc.polyclinic.info.useQuery({ id });

  return (
    <div className="flex gap-10 bg-white p-4 rounded-xl min-h-screen">
      <div className="w-[30%]">
        <PolyclinicInfo polyclinic={polyclinic} />
      </div>

      <Review reviewsQuery={reviewsQuery} />
    </div>
  );
};

export default ViewPolyclinic;
