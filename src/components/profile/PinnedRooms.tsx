import { RoomItem } from "components/rooms/RoomItem";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type PinnedRoomsProps = { id: string; polyclinicId: string };

export const PinnedRooms = ({ id, polyclinicId }: PinnedRoomsProps) => {
  const roomsQuery = trpc.room.pinnedRooms.useQuery({ authorId: id });

  return (
    <div className="my-4">
      {/* Notification */}
      <h1 className={`${NOTIFICATION} mt-0 text-center`}>
        Это ваш профиль. Вы можете изменять его по своему желанию и быть самой крутой мамой!
      </h1>
      <h1 className="text-2xl font-semibold text-center">Закрепленные посты</h1>
      <ul>
        {roomsQuery.data ? (
          <>
            {roomsQuery.data.map((item: any) => (
              <RoomItem key={item.id} data={item} />
            ))}
          </>
        ) : (
          <p className={NOTIFICATION}>У вас еще нет собраных постов</p>
        )}
      </ul>
    </div>
  );
};
