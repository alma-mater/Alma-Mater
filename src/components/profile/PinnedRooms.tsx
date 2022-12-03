import { RoomItem } from "components/rooms/RoomItem";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type PinnedRoomsProps = { id: string; polyclinicId: string };

export const PinnedRooms = ({ id, polyclinicId }: PinnedRoomsProps) => {
  const roomsQuery = trpc.room.pinnedRooms.useQuery({ authorId: id });

  return (
    <div className="my-4">
      <h1 className="text-2xl font-semibold text-center">Pinned Rooms</h1>
      <ul>
        {roomsQuery.data ? (
          <>
            {roomsQuery.data.map((item: any) => (
              <RoomItem key={item.id} data={item} />
            ))}
          </>
        ) : (
          <p className={NOTIFICATION}>No rooms found for this.</p>
        )}
      </ul>
    </div>
  );
};
