import { PolyclinicInfo } from "components/polyclinics/PolyclinicInfo";
import { PolyclinicItem } from "components/polyclinics/PolyclinicItem";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { ACTION_BUTTON } from "styles";
import { trpc } from "utils/trpc";

const ViewPolyclinic = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const reviewsQuery = trpc.review.infinite.useInfiniteQuery({
    polyclinicId: id,
  });

  const { data: polyclinic } = trpc.polyclinic.info.useQuery({ id });

  return (
    <div className="max-w-[72ch] mx-auto">
      <PolyclinicInfo polyclinic={polyclinic} />

      <div className="my-6">
        <h1 className="text-3xl font-extrabold">Reviews</h1>
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
      </div>
    </div>
  );
};

export default ViewPolyclinic;
