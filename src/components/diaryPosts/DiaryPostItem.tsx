import { type DiaryPost } from "@prisma/client";
import Link from "next/link";
import { CARD } from "styles";

export const DiaryPostItem = ({ item }: { item: DiaryPost & any }) => {
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
        <p>{item.createdAt.toLocaleDateString()}</p>
      </div>
    </div>
  );
};
