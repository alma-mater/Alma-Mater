import { router } from "../trpc";
import { diaryPostRouter } from "./diaryPost";
import { pictureRouter } from "./picture";
import { participantRouter } from "./participant";
import { roomRouter } from "./room";
import { polyclinicRouter } from "./polyclinic";
import { hashtagRouter } from "./hashtag";
import { userRouter } from "./user";
import { messageRouter } from "./message";
import { chatRouter } from "./chat";
import { chatMessageRouter } from "./chatMessage";
import { reviewRouter } from "./review";

export const appRouter = router({
  diaryPost: diaryPostRouter,
  picture: pictureRouter,
  participant: participantRouter,
  room: roomRouter,
  polyclinic: polyclinicRouter,
  hashtag: hashtagRouter,
  user: userRouter,
  message: messageRouter,
  chat: chatRouter,
  chatMessage: chatMessageRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
