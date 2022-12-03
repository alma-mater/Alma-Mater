import Link from "next/link";
import { useSession } from "next-auth/react";
import RoomsSection from "components/feed/RoomsSection";
import { Page } from "layouts/Page";
import { Hashtags } from "components/feed/Hashtags";

const MobileHeader = () => (
  <div className="md:hidden flex items-center justify-center gap-2 my-4">
    <Link
      href="/hashtags"
      className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500"
    >
      Хештеги
    </Link>
  </div>
);

const Feed = () => {
  const { data: session } = useSession();

  return (
    <Page className="m-2" title="Feed">
      <MobileHeader />
      <div className="my-8 block md:flex md:justify-around">
        <div className="md:w-[60%]">
          <RoomsSection session={session} />
        </div>
        <div className="md:w-[30%]">
          <Hashtags />
        </div>
      </div>
    </Page>
  );
};

export default Feed;
