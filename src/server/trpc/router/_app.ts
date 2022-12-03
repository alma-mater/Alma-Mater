import { router } from "../trpc";
import { diaryPostRouter } from "./diaryPost";
import { newsRouter } from "./news";
import { pictureRouter } from "./picture";
import { participantRouter } from "./participant";
import { roomRouter } from "./room";
import { schoolRouter } from "./school";
import { hashtagRouter } from "./hashtag";
import { userRouter } from "./user";

export const appRouter = router({
  diaryPost: diaryPostRouter,
  news: newsRouter,
  picture: pictureRouter,
  participant: participantRouter,
  room: roomRouter,
  school: schoolRouter,
  hashtag: hashtagRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
