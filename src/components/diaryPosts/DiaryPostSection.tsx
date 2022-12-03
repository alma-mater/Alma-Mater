import { useSession } from "next-auth/react";
import Link from "next/link";
import { ACTION_BUTTON, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";
import { DiaryPostItem } from "./DiaryPostItem";

export const DiaryPostSection = () => {
  const { data: session } = useSession();
  const diaryPostsQuery = trpc.diaryPost.infinite.useInfiniteQuery(
    { limit: 5, userId: session?.user?.id || "" },
    {
      getPreviousPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div className="lg:mx-4">
      <h1 className={`${NOTIFICATION} text-center`}>
        DiaryPosts page. Here are your most recent things to do.
      </h1>
      <Link href="/new/diaryPost" className={`${ACTION_BUTTON} w-full`}>
        Add DiaryPost
      </Link>
      {diaryPostsQuery.data?.pages.map((page, index) => (
        <>
          {page.items.length > 0 ? (
            <div key={page.items[0].id || index}>
              {page.items.map((item) => (
                <DiaryPostItem item={item} />
              ))}
            </div>
          ) : (
            <p className="my-4">No diaryPosts yet.</p>
          )}
        </>
      ))}
      {/* Pagination */}
      <button
        className={ACTION_BUTTON}
        onClick={() => diaryPostsQuery.fetchPreviousPage()}
        disabled={
          !diaryPostsQuery.hasPreviousPage ||
          diaryPostsQuery.isFetchingPreviousPage
        }
      >
        {diaryPostsQuery.isFetchingPreviousPage
          ? "Loading more..."
          : diaryPostsQuery.hasPreviousPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};
