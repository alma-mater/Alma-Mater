import { Fragment } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import { ACTION_BUTTON, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/router";
import { RoomItem } from "components/rooms/RoomItem";
import cn from "classnames";

type RoomSectionProps = { session: Session | null };

type NavItemProps = {
  href: string;
  text: string;
};

const NavItem = ({ href, text }: NavItemProps) => {
  const { asPath } = useRouter();
  const isActive = asPath === href;

  return (
    <Link href={href} legacyBehavior>
      <a
        className={cn(
          isActive
            ? "font-bold text-gray-800 text-lg border-b-black border-b-[3px]"
            : "text-gray-600",
          "p-1 mx-3 transition-all"
        )}
      >
        {text}
      </a>
    </Link>
  );
};

const RoomsSection = ({ session }: RoomSectionProps) => {
  const { query, asPath } = useRouter();
  const hashtagId = query.hashtagId as string;
  const isQuestion = asPath === "/#questions" ? true : false;

  const roomsQuery = hashtagId
    ? trpc.room.infiniteByHashtagId.useInfiniteQuery(
        { limit: 5, hashtagId, isQuestion },
        {
          getPreviousPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    : trpc.room.infinite.useInfiniteQuery(
        { limit: 5, isQuestion },
        {
          getPreviousPageParam: (lastPage) => lastPage.nextCursor,
        }
      );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <NavItem href="/#posts" text="Посты" />
          <NavItem href="/#questions" text="Вопросы" />
        </div>

        {session && (
          <Link
            href="/new/room"
            className={`${ACTION_BUTTON} flex items-center gap-2`}
          >
            <IoAdd className="w-6 h-6" /> Создать
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
          ? "Загрузка..."
          : roomsQuery.hasPreviousPage
          ? "Показать больше"
          : "Нет постов"}
      </button>
    </div>
  );
};

export default RoomsSection;
