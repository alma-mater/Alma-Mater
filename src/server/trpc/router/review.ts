import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultReviewSelect = Prisma.validator<Prisma.ReviewSelect>()({
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: true,
  authorId: true,
  likes: true,
});

export const reviewRouter = router({
  like: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.review.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
    }),
  infinite: publicProcedure
    .input(
      z.object({
        polyclinicId: z.string().uuid(),
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { polyclinicId, cursor } = input;

      const items = await ctx.prisma.review.findMany({
        where: { polyclinicId },
        select: defaultReviewSelect,
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
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(64),
        content: z.string(),
        authorId: z.string().cuid(),
        polyclinicId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.create({
        data: input,
        select: defaultReviewSelect,
      });
      return review;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const review = await ctx.prisma.review.findUnique({
        where: { id },
        select: defaultReviewSelect,
      });
      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No review with id '${id}'`,
        });
      }
      return review;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.review.delete({ where: { id } });
      return { id };
    }),
});
