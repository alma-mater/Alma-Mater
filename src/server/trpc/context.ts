import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { IncomingMessage } from "http";
import { Session } from "next-auth";
import { prisma } from "../db/client";
import ws from "ws";
import { getSession } from "next-auth/react";
import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createContext = async (
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  // const session = await getServerSession(opts.req, opts.res, nextAuthOptions);
  const session = await getSession({ req: opts.req });

  return await createContextInner({
    session,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
