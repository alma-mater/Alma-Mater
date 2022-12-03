import { type DiaryPost } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

export const DiaryPostItem = ({ item }: { item: DiaryPost & any }) => {
  const [isFinished, setIsFinished] = useState(item.finished);
  const finishDiaryPost = trpc.diaryPost.finish.useQuery({ id: item.id });

  return (
    <div className={`${CARD} my-4`}>
      <div className="w-full">
        <Link href={`/workspace/diaryPosts/${item.id}`} className="text-xl">
          {item.title}
        </Link>
        <p className="text-gray-400">{item.content?.slice(0, 50)}</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="font-semibold">{item.hashtag.name}</p>
        <p>{item.due?.toLocaleDateString()}</p>
      </div>
    </div>
  );
};
