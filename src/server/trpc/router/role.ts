import { publicProcedure, router } from "../trpc";

export const roleRouter = router({
  all: publicProcedure.query(({ ctx }) => ctx.prisma.role.findMany()),
});
