import Link from "next/link";
import { IoCopy, IoHome, IoPerson } from "react-icons/io5";

type WorkspaceProps = { children: React.ReactNode };

export const Workspace = ({ children }: WorkspaceProps) => {
  return (
    <div className="flex flex-col items-center justify-around w-full">
      <aside className="w-full md:max-w-max flex justify-around md:flex-col md:absolute md:top-24 md:left-5 gap-2 border-[1px] border-gray-700 p-4 rounded-xl">
        <Link
          href="/workspace"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 hover:duration-300"
        >
          <IoCopy className="text-gray-400 w-5 h-5" />
          <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
            Pictures
          </span>
        </Link>

        <Link
          href="/workspace/diaryPosts"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 hover:duration-300"
        >
          <IoHome className="text-gray-400 w-5 h-5" />
          <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
            Diary Posts
          </span>
        </Link>

        <Link
          href="/workspace/connections"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 hover:duration-300"
        >
          <IoPerson className="text-gray-400 w-5 h-5" />
          <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
            Connections
          </span>
        </Link>
      </aside>
      {children}
    </div>
  );
};
