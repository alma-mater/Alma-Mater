import { Fragment } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import { ACTION_BUTTON, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/router";
import { RoomItem } from "components/rooms/RoomItem";

type RoomSectionProps = { session: Session | null };

const RoomsSection = ({ session }: RoomSectionProps) => {
  const { query } = useRouter();
  const hashtagId = query.hashtagId as string;

  const roomsQuery = hashtagId
    ? trpc.room.infiniteByHashtagId.useInfiniteQuery(
        { limit: 5, hashtagId },
        {
          getPreviousPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    : trpc.room.infinite.useInfiniteQuery(
        { limit: 5 },
        {
          getPreviousPageParam: (lastPage) => lastPage.nextCursor,
        }
      );

  const { data: count } = trpc.room.getCount.useQuery();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <a className="text-2xl font-semibold">Посты</a>
          <a className="text-2xl font-semibold">Вопросы</a>
          <span className="text-gray-400">{count} available</span>
        </div>

        {session && (
          <Link
            href="/new/room"
            className={`${ACTION_BUTTON} flex items-center gap-2`}
          >
            <IoAdd className="w-6 h-6" /> Add Room
          </Link>
        )}
      </div>
      {/* Displaying Rooms */}
      {roomsQuery.data?.pages.map((page, index) => (
        <>
          {page.items.length > 0 ? (
            <Fragment key={page.items[0].id || index}>
              {page.items.map((item) => (
                <RoomItem key={item.id} data={item} />
              ))}
            </Fragment>
          ) : (
            <p className={NOTIFICATION}>No rooms found for this.</p>
          )}
        </>
      ))}
      {/* Pagination */}
      <button
        className={ACTION_BUTTON}
        onClick={() => roomsQuery.fetchPreviousPage()}
        disabled={
          !roomsQuery.hasPreviousPage || roomsQuery.isFetchingPreviousPage
        }
      >
        {roomsQuery.isFetchingPreviousPage
          ? "Loading more..."
          : roomsQuery.hasPreviousPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};

export default RoomsSection;
