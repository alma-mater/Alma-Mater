import { Workspace } from "layouts/Workspace";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ACTION_BUTTON, CARD, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

const BUCKET_URL = "https://almamater-mvp.s3.amazonaws.com";

const Pictures = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });
  const userId = session?.user?.id as string;

  const { data: pictures } = trpc.picture.getPicturesForUser.useQuery();

  if (status === "loading") return "Loading or not authenticated...";
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          Здесь хранятся ваши картинки, сортированные по дате добавления.
        </h1>
        <Link href="/new/picture" className={`${ACTION_BUTTON} w-full`}>
          Добавить Картинку
        </Link>
        {pictures && pictures.length > 0 ? (
          <>
            {pictures.map((picture) => (
              <div className={`${CARD} my-4`}>
                <a
                  className="text-xl"
                  href={`${BUCKET_URL}/pictures/${userId}/${picture.id}`}
                >
                  {picture.filename}
                </a>
                <p className="text-gray-500">{`${picture.createdAt.toLocaleDateString()}, ${picture.createdAt.toLocaleTimeString()}`}</p>
              </div>
            ))}
          </>
        ) : (
          <p className={NOTIFICATION}>У вас нет изображений на данный момент</p>
        )}
      </div>
    </Workspace>
  );
};

export default Pictures;
