import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultChatSelect = Prisma.validator<Prisma.ChatSelect>()({
  id: true,
  specialist: true,
  createdAt: true,
  updatedAt: true,
  participants: true,
  messages: true,
});

export const chatRouter = router({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 5;
      const { cursor } = input;

      const items = await ctx.prisma.chat.findMany({
        select: defaultChatSelect,
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
        specialistId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.create({
        data: input,
        select: defaultChatSelect,
      });
      return chat;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const chat = await ctx.prisma.chat.findUnique({
        where: { id },
        select: defaultChatSelect,
      });
      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No chat with id '${id}'`,
        });
      }
      return chat;
    }),
});
