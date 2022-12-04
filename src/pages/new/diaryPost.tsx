import { Hashtag } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ACTION_BUTTON, CARD, INPUT_SELECT, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";

type FormData = {
  title: string;
  content: string;
  hashtagId: string;
  due: Date;
};

const NewDiaryPost = () => {
  const [hashtagId, setHashtagId] = useState("");
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const { data: session } = useSession();
  const { data: hashtags } = trpc.hashtag.all.useQuery();
  const utils = trpc.useContext();
  const addDiaryPost = trpc.diaryPost.add.useMutation({
    async onSuccess() {
      router.back();
      await utils.diaryPost.infinite.invalidate();
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addDiaryPost.mutateAsync({
        ...data,
        userId: session?.user?.id || "",
        hashtagId,
        due: new Date(data.due),
      });
    } catch {}
  });

  return (
    <div className={`${CARD} justify-center my-4 max-w-[48ch] mx-auto`}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-3 items-center mb-3">
          <Link
            href="/"
            className="w-max p-2 rounded-full hover:bg-gray-200 hover:duration-500"
          >
            <AiOutlineArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-2xl">Новая Запись</h2>
        </div>
        {/* Title */}
        <div className="my-2">
          <label className="text-xl" htmlFor="title">
            Название:
          </label>
          <input
            id="title"
            {...register("title")}
            type="text"
            className={INPUT_TEXT}
            disabled={addDiaryPost.isLoading}
          />
        </div>
        {/* Content */}
        <div className="my-2">
          <label className="text-xl" htmlFor="content">
            Контент:
          </label>
          <textarea
            id="content"
            {...register("content")}
            className={INPUT_TEXT}
            disabled={addDiaryPost.isLoading}
          />
        </div>
        {/* Hashtag */}
        <div className="my-2">
          <label className="text-xl" htmlFor="hashtag">
            Хэштег:
          </label>
          <select
            {...register("hashtagId")}
            id="hashtag"
            className={INPUT_SELECT}
            onChange={(e) => setHashtagId(e.currentTarget.value)}
          >
            <option selected>Click to choose</option>
            {hashtags &&
              hashtags.map((t: Hashtag) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </div>
        {/* Due Date */}
        <div className="my-2">
          <label className="text-xl block" htmlFor="hashtag">
            Дата:
          </label>
          <input
            {...register("due")}
            id="dueDate"
            type="date"
            className={INPUT_TEXT}
          />
        </div>
        {/* Submit Form */}
        <button
          className={`${ACTION_BUTTON} my-4`}
          type="submit"
          disabled={addDiaryPost.isLoading}
        >
          Добавить
        </button>
        {/* Validation Error */}
        {addDiaryPost.error && (
          <p className="text-red-500">{addDiaryPost.error.message}</p>
        )}
      </form>
    </div>
  );
};

export default NewDiaryPost;
