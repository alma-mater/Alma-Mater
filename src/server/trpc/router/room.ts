import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultRoomSelect = Prisma.validator<Prisma.RoomSelect>()({
  id: true,
  title: true,
  description: true,
  authorName: true,
  authorImage: true,
  createdAt: true,
  updatedAt: true,
  participants: true,
  authorId: true,
  hashtagId: true,
  hashtag: true,
});

export const roomRouter = router({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
        isQuestion: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { cursor, isQuestion } = input;

      const items = await ctx.prisma.room.findMany({
        where: { isQuestion },
        select: defaultRoomSelect,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { items, nextCursor };
    }),
  infiniteByHashtagId: publicProcedure
    .input(
      z.object({
        cursor: z.date().nullish(),
        limit: z.number().min(1).max(10).default(5),
        hashtagId: z.string().uuid(),
        isQuestion: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, hashtagId } = input;
      const items = await ctx.prisma.room.findMany({
        select: defaultRoomSelect,
        orderBy: {
          updatedAt: "desc",
        },
        cursor: cursor ? { updatedAt: cursor } : undefined,
        take: limit + 1,
        where: { hashtagId },
      });
      // let prevCursor: typeof cursor | undefined = undefined;
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.updatedAt;
      }

      return { items, nextCursor };
    }),
  hashtagId: publicProcedure
    .input(
      z.object({
        hashtagId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { hashtagId } = input;
      const rooms = await ctx.prisma.room.findMany({ where: { hashtagId } });
      if (!rooms) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No rooms for hashtag id ${hashtagId}`,
        });
      }
      return rooms;
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        isQuestion: z.boolean().default(false),
        title: z.string().min(1).max(64),
        description: z.string().min(1).max(128),
        authorName: z.string().optional(),
        authorImage: z.string().optional(),
        authorId: z.string().cuid().optional(),
        hashtagId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: input,
        select: defaultRoomSelect,
      });
      return room;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const room = await ctx.prisma.room.findUnique({
        where: { id },
        select: defaultRoomSelect,
      });
      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No room with id '${id}'`,
        });
      }
      return room;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          hashtagId: z.string().uuid(),
          title: z.string().min(1).max(64),
          description: z.string().min(1).max(128),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const room = await ctx.prisma.room.update({
        where: { id },
        data,
        select: defaultRoomSelect,
      });
      return room;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.participantsInRooms.deleteMany({
        where: { roomId: id },
      });
      await ctx.prisma.room.delete({
        where: { id },
        include: { participants: true },
      });
      return { id };
    }),
  pinnedRooms: publicProcedure
    .input(z.object({ authorId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { authorId } = input;
      return await ctx.prisma.room.findMany({
        where: { authorId },
        include: { participants: true },
      });
    }),
});
