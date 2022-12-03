import type { Polyclinic } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { CARD, INPUT_SELECT, TEXTAREA } from "styles";
import { trpc } from "utils/trpc";

type FormData = {
  username: string;
  bio: string;
  polyclinicId: string;
};

const EditProfile = () => {
  const router = useRouter();
  // States
  const [username, setUsername] = useState<string | null | undefined>(null);
  const [bio, setBio] = useState<string | null | undefined>(null);
  const [polyclinicId, setPolyclinicId] = useState<string | null | undefined>(
    null
  );
  const [grade, setGrade] = useState<string | null | undefined>(null);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const { data: session } = useSession();
  const id = session?.user?.id as string;
  const { data: user } = trpc.user.info.useQuery({ id });
  const { data: polyclinics } = trpc.polyclinic.all.useQuery();

  const utils = trpc.useContext();
  const editProfile = trpc.user.edit.useMutation({
    async onSuccess() {
      await utils.user.info.invalidate({ id });
      router.back();
    },
  });

  const onSubmit = handleSubmit(async () => {
    try {
      await editProfile.mutateAsync({
        id,
        data: { username, bio, polyclinicId, grade },
      });
    } catch {}
  });

  useEffect(() => {
    setUsername(user?.username);
    setBio(user?.bio);
    setPolyclinicId(user?.polyclinicId);
  }, []);

  if (!session) return <>Yo u gotta sign in</>;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`my-10 flex items-center justify-center ${CARD}`}>
        <form className="w-[90%] relative" onSubmit={onSubmit}>
          <Link
            href="/"
            className="absolute w-max p-2 rounded-full hover:bg-gray-200 hover:duration-500"
          >
            <AiOutlineArrowLeft size={24} />
          </Link>
          <h2 className="text-center text-2xl leading-normal">Settings</h2>
          {/* Username */}
          <div className="my-4">
            <label className="text-xl" htmlFor="username">
              Username:
            </label>
            <input
              {...register("username")}
              id="username"
              type="text"
              className={INPUT_SELECT}
              value={username || ""}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          {/* Polyclinic */}
          <div className="my-4">
            <label className="text-xl" htmlFor="polyclinicId">
              Поликлиника:
            </label>
            <select
              {...register("polyclinicId")}
              id="polyclinicId"
              className={INPUT_SELECT}
              onChange={(e) => setPolyclinicId(e.currentTarget.value)}
            >
              <option selected>Choose a polyclinic</option>
              {polyclinics &&
                polyclinics.map((s: Polyclinic) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Bio */}
          <div className="my-4">
            <label className="text-xl" htmlFor="bio">
              О себе:
            </label>
            <textarea
              id="bio"
              {...register("bio")}
              className={TEXTAREA}
              value={bio || ""}
              onChange={(e) => setBio(e.currentTarget.value)}
              disabled={editProfile.isLoading}
            />
          </div>

          <button
            className="py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 hover:duration-500"
            type="submit"
            disabled={editProfile.isLoading}
          >
            Сохранить
          </button>

          {editProfile.error && (
            <p className="text-red-500">{editProfile.error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
