import type { User } from "@prisma/client";
import { DiaryPostSection } from "components/diaryPosts/DiaryPostSection";
import { Page } from "layouts/Page";
import { useSession } from "next-auth/react";
import { Info } from "./Info";
import { PinnedRooms } from "./PinnedRooms";

export const UserProfile = ({ user }: { user: User & any }) => {
  const { data: session } = useSession();

  return user?.id && user.id === session?.user?.id ? (
    <Page title="Profile" className="">
      <div className="w-full p-4 bg-white rounded-xl flex justify-start min-h-screen">
        <div className="w-[30%] border-r">
          <Info user={user} session={session} />
        </div>
        <div className="w-[70%]">
          <PinnedRooms id={user?.id} polyclinicId={user?.polyclinicId || ""} />
        </div>
      </div>
    </Page>
  ) : (
    <Page title="Profile" className="max-w-[48ch] w-full mx-auto">
      <Info user={user} session={session} />
    </Page>
  );
};
