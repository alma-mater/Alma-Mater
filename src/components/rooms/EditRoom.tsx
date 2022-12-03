import type { Room, Hashtag } from "@prisma/client";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import {
  ACTION_BUTTON,
  CARD,
  DELETE_BUTTON,
  INPUT_SELECT,
  INPUT_TEXT,
} from "styles";
import { trpc } from "utils/trpc";

type EditRoomProps = {
  data?: Room | null;
  hashtags?: Hashtag[] | null;
  session?: Session | null;
  router: any;
};

type FormData = {
  id: string;
  title: string;
  description: string;
  hashtagId: string;
};

const EditRoom = ({ data, hashtags, session, router }: EditRoomProps) => {
  const id = router.query.id as string;
  const userId = session?.user?.id as string;
  const hashtag = hashtags?.find((t: Hashtag) => t.id === data?.hashtagId);
  const [editing, setEditing] = useState(false);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();
  const { data: hasJoined } = trpc.participant.hasJoined.useQuery({
    roomId: id,
    userId,
  });
  const editRoom = trpc.room.edit.useMutation({
    async onSuccess() {
      await utils.room.byId.invalidate({ id });
      setEditing(false);
    },
  });
  const deleteRoom = trpc.room.delete.useMutation({
    async onSuccess() {
      router.push("/feed");
    },
  });
  const joinRoom = trpc.participant.join.useMutation({
    async onSuccess() {
      await utils.participant.hasJoined.invalidate({ roomId: id, userId });
      await utils.participant.all.invalidate();
    },
  });
  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtagId, setHashtagId] = useState("");

  const onSubmit = handleSubmit(async () => {
    try {
      await editRoom.mutateAsync({
        id,
        data: { title, description, hashtagId },
      });
    } catch {}
  });

  useEffect(() => {
    setTitle(data?.title || "");
    setDescription(data?.description || "");
    setHashtagId(data?.hashtagId || "");
  }, []);

  return (
    <>
      <div className="flex gap-2 my-2">
        {session && (
          <button
            disabled={hasJoined}
            className={ACTION_BUTTON}
            onClick={() => joinRoom.mutate({ userId, roomId: id })}
          >
            {hasJoined ? "Joined" : "Join"}
          </button>
        )}
        {userId === data?.authorId && (
          <>
            <button
              className={ACTION_BUTTON}
              onClick={() => setEditing(!editing)}
            >
              Edit
            </button>
            <button
              className={DELETE_BUTTON}
              onClick={() => deleteRoom.mutate({ id })}
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div className={`my-4 flex items-center justify-center ${CARD}`}>
        <form hidden={!editing} className="w-[90%]" onSubmit={onSubmit}>
          <button
            onClick={() => setEditing(false)}
            className="absolute w-max p-2 rounded-full hover:bg-gray-200 hover:duration-500"
          >
            <IoClose size={24} />
          </button>
          <h2 className="text-center text-2xl leading-normal">Редактировать</h2>
          <div className="my-4">
            <label className="text-xl" htmlFor="title">
              Title:
            </label>
            <input
              id="title"
              {...register("title")}
              className={INPUT_TEXT}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              disabled={editRoom.isLoading}
            />
          </div>
          {/* Description */}
          <div className="my-4">
            <label className="text-xl" htmlFor="description">
              Description:
            </label>
            <input
              id="description"
              {...register("description")}
              className={INPUT_TEXT}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              disabled={editRoom.isLoading}
            />
          </div>
          {/* Hashtag */}
          <div className="my-4">
            <label className="text-xl" htmlFor="hashtagId">
              Hashtag:
            </label>
            <select
              {...register("hashtagId")}
              id="hashtagId"
              className={INPUT_SELECT}
              onChange={(e) => setHashtagId(e.currentTarget.value)}
            >
              {hashtag ? (
                <option value={hashtag.id}>{hashtag.name}</option>
              ) : (
                <option selected>Choose a hashtag</option>
              )}
              {hashtags &&
                hashtags.map((t: Hashtag) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Save */}
          <button
            className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 hover:duration-500"
            onClick={() => console.log(hashtag)}
            disabled={editRoom.isLoading}
          >
            Сохранить
          </button>
          {/* Error occurred */}
          {editRoom.error && (
            <p className="text-red-500">{editRoom.error.message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default EditRoom;
