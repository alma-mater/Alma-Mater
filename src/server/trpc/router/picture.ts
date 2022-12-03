import { TRPCError } from "@trpc/server";
import { S3 } from "aws-sdk";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

type UploadProps = {
  userId: string;
  pictureId: string;
};

export const getObjectKey = ({ userId, pictureId }: UploadProps) => {
  return `pictures/${userId}/${pictureId}`;
};

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  signatureVersion: "v4",
});

export const pictureRouter = router({
  createPresignedUrl: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        roomId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { filename, roomId } = input;
      const userId = ctx.session?.user?.id as string;
      const picture = await ctx.prisma.picture.create({
        data: { userId, filename, roomId },
      });

      const presignedPost = await new Promise((resolve, reject) => {
        s3.createPresignedPost(
          {
            Fields: {
              key: getObjectKey({
                userId,
                pictureId: picture.id,
              }),
            },
            Conditions: [
              ["starts-with", "$Content-Type", ""],
              ["content-length-range", 0, 8_388_608],
            ],
            Expires: 30,
            Bucket: process.env.AWS_S3_BUCKET_NAME,
          },
          (err, signed) => {
            if (err) return reject(err);
            resolve(signed);
          }
        );
      });

      return presignedPost as {
        url: string;
        fields: object;
      };
    }),
  getPicturesForUser: publicProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    return await ctx.prisma.picture.findMany({ where: { userId } });
  }),
  getPicturesForRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { roomId } = input;
      const room = await ctx.prisma.room.findUnique({
        where: { id: roomId },
        include: { pictures: true },
      });

      if (!room) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return room.pictures;
    }),
});
