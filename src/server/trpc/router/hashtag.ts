import { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultHashtagSelect = Prisma.validator<Prisma.HashtagSelect>()({
  id: true,
  name: true,
  createdAt: true,
  rooms: true,
});

export const hashtagRouter = router({
  all: publicProcedure.query(async ({ ctx }) =>
    ctx.prisma.hashtag.findMany({
      select: defaultHashtagSelect,
      orderBy: { rooms: { _count: "desc" } },
    })
  ),
  getSome: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10) }))
    .query(async ({ ctx, input }) => {
      const { limit } = input;
      return ctx.prisma.hashtag.findMany({
        select: defaultHashtagSelect,
        take: limit - 1,
        orderBy: { rooms: { _count: "desc" } },
      });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const hashtag = await ctx.prisma.hashtag.findUnique({ where: { id } });
      return hashtag;
    }),
});
