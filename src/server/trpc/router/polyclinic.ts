import { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const defaultPolyclinicSelect = Prisma.validator<Prisma.PolyclinicSelect>()({
  id: true,
  image: true,
  name: true,
  about: true,
  users: true,
  createdAt: true,
  updatedAt: true,
  reviews: true,
});

export const polyclinicRouter = router({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.polyclinic.findMany()),

  info: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.polyclinic.findUnique({
        where: { id },
        select: defaultPolyclinicSelect,
      });
    }),
});
