import type { ParticipantsInRooms, Room, Hashtag } from "@prisma/client";
import Link from "next/link";
import { IoPeople } from "react-icons/io5";
import { HASHTAG } from "styles";
import { Avatar } from "../common/Avatar";

type RoomItemProps = {
  data: Room & { participants: ParticipantsInRooms[]; hashtag: Hashtag | null };
};

export const RoomItem = ({ data }: RoomItemProps) => {
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
          {/* <span>{data.authorRole}</span> */}
        </Link>
        <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
      </div>
      <Link
        href={`/rooms/${data.id}`}
        className="max-w-max text-2xl font-semibold"
      >
        {data.title}
      </Link>
      <p className="text-gray-400">{data.description}</p>
      <div className="my-2 flex justify-between">
        <span className={`${HASHTAG} flex items-center gap-2`}>
          <IoPeople className="w-5 h-5" />
          {data.participants.length} participants
        </span>
        {data.hashtag && (
          <span
            className={`${HASHTAG} flex items-center gap-2`}
            key={data.hashtagId}
          >
            {data.hashtag.image && (
              <img src={data.hashtag.image} className="w-4 h-4" />
            )}
            {data.hashtag.name}
          </span>
        )}
      </div>
    </article>
  );
};
