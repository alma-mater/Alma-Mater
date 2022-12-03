import { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  username: true,
  email: true,
  emailVerified: true,
  image: true,
  bio: true,
  polyclinic: true,
  polyclinicId: true,
  rooms: true,
  Room: true,
  role: true,
  roleId: true,
});

export const userRouter = router({
  info: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().optional(),
        username: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, username } = input;
      const where = username ? { username } : { id };
      return await ctx.prisma.user.findUnique({
        where,
        select: defaultUserSelect,
      });
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: z.object({
          username: z.string().nullish(),
          polyclinicId: z.string().uuid().nullish(),
          bio: z.string().max(128).nullish(),
          roleId: z.string().uuid().nullish(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const user = await ctx.prisma.user.update({
        where: { id },
        select: defaultUserSelect,
        data,
      });
      return user;
    }),
  connections: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        polyclinicId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, polyclinicId } = input;
      return await ctx.prisma.user.findMany({
        where: { id: { not: id }, polyclinicId },
        select: defaultUserSelect,
      });
    }),
});
