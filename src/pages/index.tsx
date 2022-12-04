import Link from "next/link";
import { useSession } from "next-auth/react";
import RoomsSection from "components/feed/RoomsSection";
import { Page } from "layouts/Page";
import { Hashtags } from "components/feed/Hashtags";
import { Specialists } from "components/feed/Specialists";
import { Search } from "components/feed/Search";

const MobileHeader = () => (
  <div className="md:hidden flex items-center justify-center gap-2 my-4">
    <Link
      href="/hashtags"
      className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500"
    >
      Хештеги
    </Link>
    <Link
      href="/specialists"
      className="text-sm rounded-full border border-blue-500 py-2 px-4 text-blue-500 hover:text-gray-100 hover:bg-blue-500 hover:duration-500"
    >
      Специалисты
    </Link>
  </div>
);

const Feed = () => {
  const { data: session } = useSession();

  return (
    <Page className="m-2" title="Главная">
      <MobileHeader />
      <div className="my-4 block md:flex md:justify-between gap-10 w-full">
        <div className="max-w-[32ch] mx-auto w-full">
          <Hashtags />
        </div>
        <div className="space-y-4 min-w-[60ch]">
          <Search />
          <RoomsSection session={session} />
        </div>
        <div className="max-w-[32ch] mx-auto w-full">
          <Specialists />
          {/* </div> */}
        </div>
      </div>
    </Page>
  );
};

export default Feed;
