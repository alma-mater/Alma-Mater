import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import Link from "next/link";
import { useRef, useState } from "react";
import { ACTION_BUTTON, CARD } from "styles";
import { Page } from "layouts/Page";
import EditRoom from "components/rooms/EditRoom";
import { Avatar } from "components/common/Avatar";
import { trpc } from "utils/trpc";

const Participants = ({ roomId }: { roomId: string }) => {
  const { data: participants } = trpc.participant.all.useQuery({ roomId });

  return (
    <div className={`${CARD} my-2`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Participants - {participants?.length}
      </h1>
      <div className="w-full flex flex-nowrap gap-1 overflow-x-scroll">
        {participants &&
          participants.map((item) => (
            <Link href={`/users/${item.userId}`}>
              <Avatar src={item.user.image} size={32} />
            </Link>
          ))}
      </div>
    </div>
  );
};

const BUCKET_URL = "https://almamater-mvp.s3.amazonaws.com";

const SentPictures = ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const [file, setFile] = useState<any>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingStatus, setUploadingStatus] = useState<any>();

  const { mutateAsync: createPresignedUrl } =
    trpc.picture.createPresignedUrl.useMutation();
  const picturesQuery = trpc.picture.getPicturesForRoom.useQuery({ roomId });

  const selectFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadPicture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    else if (file.size > 8_388_608) {
      alert(
        "Maximum file size is 8MB. Please compress or choose another file."
      );
      setFile(undefined);
      return;
    }

    setUploadingStatus("Uploading the file to AWS S3");

    const { url, fields }: { url: string; fields: any } =
      (await createPresignedUrl({
        roomId,
        filename: file.name,
      })) as any;

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }

    await fetch(url, {
      method: "POST",
      body: formData,
    });

    setFile(undefined);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    picturesQuery.refetch();
  };

  return (
    <div className={`${CARD} my-2`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Pictures Sent - {picturesQuery.data?.length}
      </h1>
      {picturesQuery.data?.map((picture) => (
        <a
          className={`${CARD} m-2 w-full text-left`}
          href={`${BUCKET_URL}/pictures/${userId}/${picture.id}`}
        >
          {picture.filename}
        </a>
      ))}
      <form
        hidden={!userId}
        className="border-t-[1px] w-full border-gray-700 p-4"
        onSubmit={uploadPicture}
      >
        <input ref={fileRef} type="file" onChange={(e) => selectFile(e)} />
        {file && (
          <button type="submit" className={`${ACTION_BUTTON} my-2`}>
            Upload a File!
          </button>
        )}
        {uploadingStatus && <p>{uploadingStatus}</p>}
      </form>
    </div>
  );
};

const ViewRoom = () => {
  const { data: session } = useSession();
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // tRPC
  const roomQuery = trpc.room.byId.useQuery({ id });
  const { data: room } = roomQuery;
  const { data: hashtags } = trpc.hashtag.all.useQuery();

  // room fetch fail
  if (roomQuery.error) {
    return (
      <NextError
        title={roomQuery.error.message}
        statusCode={roomQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!room || roomQuery.status !== "success") return "Loading...";
  return (
    <Page title={room.title}>
      <div className="my-4 lg:my-0 max-w-[60ch] mx-auto">
        <Participants roomId={room.id} />
        <h1 className="text-4xl font-extrabold">{room.title}</h1>
        <p className="my-2">{room.description}</p>
        <div className="flex items-center justify-between my-2">
          <p className="text-gray-400">
            Created {room.createdAt.toLocaleDateString("en-us")}
          </p>
        </div>
        <EditRoom
          data={room}
          hashtags={hashtags}
          session={session}
          router={router}
        />
        <SentPictures roomId={room.id} userId={session?.user?.id as string} />
      </div>
    </Page>
  );
};

export default ViewRoom;
