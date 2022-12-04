import { RoomItem } from "components/rooms/RoomItem";
import { useSession } from "next-auth/react";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type PinnedRoomsProps = { id: string; polyclinicId: string };

export const PinnedRooms = ({ id, polyclinicId }: PinnedRoomsProps) => {
  const roomsQuery = trpc.room.pinnedRooms.useQuery({ authorId: id });
  const { data: sesh } = useSession();

  return (
    <div className="my-4 ml-6">
      {/* Notification */}
      <h1 className="text-2xl font-semibold text-left">
        Ваши посты находятся здесь, <br />
        <span className="text-pink-500 text-3xl">{sesh?.user?.name}</span>
      </h1>
      <ul className="mt-3 grid grid-cols-1 gap-4">
        {roomsQuery.data ? (
          <>
            {roomsQuery.data.map((item: any) => (
              <div className="rounded-xl drop-shadow-2xl w-full">
                <RoomItem key={item.id} data={item} />
              </div>
            ))}
          </>
        ) : (
          <p className={NOTIFICATION}>У вас еще нет собраных постов</p>
        )}
      </ul>
    </div>
  );
};
