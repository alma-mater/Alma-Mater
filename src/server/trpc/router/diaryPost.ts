import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const defaultDiaryPostSelect = Prisma.validator<Prisma.DiaryPostSelect>()({
  id: true,
  title: true,
  content: true,
  hashtag: true,
  user: true,
  createdAt: true,
});

export const diaryPostRouter = router({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { cursor, userId } = input;

      const items = await ctx.prisma.diaryPost.findMany({
        select: defaultDiaryPostSelect,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        where: { userId },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return { items, nextCursor };
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        hashtagId: z.string().uuid(),
        userId: z.string().cuid(),
        title: z.string(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const diaryPost = await ctx.prisma.diaryPost.create({
        data: input,
        select: defaultDiaryPostSelect,
      });
      return diaryPost;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          hashtagId: z.string().uuid(),
          title: z.string().min(1).max(64),
          content: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const diaryPost = await ctx.prisma.diaryPost.update({
        where: { id },
        data,
        select: defaultDiaryPostSelect,
      });
      return diaryPost;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.diaryPost.delete({ where: { id } });
      return { id };
    }),
  all: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;
      return ctx.prisma.diaryPost.findMany({
        orderBy: { createdAt: "desc" },
        select: defaultDiaryPostSelect,
        where: { userId },
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const diaryPost = await ctx.prisma.diaryPost.findUnique({
        where: { id },
        select: defaultDiaryPostSelect,
      });
      if (!diaryPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No diaryPost with id '${id}'`,
        });
      }
      return diaryPost;
    }),
});
