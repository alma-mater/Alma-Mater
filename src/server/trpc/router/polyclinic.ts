import { publicProcedure, router } from "../trpc";

export const polyclinicRouter = router({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.polyclinic.findMany()),
});
