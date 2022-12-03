import { DiaryPostSection } from "components/diaryPosts/DiaryPostSection";
import { Workspace } from "layouts/Workspace";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const DiaryPosts = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  if (status === "loading") return "Loading or not authenticated...";
  return (
    <Workspace>
      <DiaryPostSection />
    </Workspace>
  );
};

export default DiaryPosts;
