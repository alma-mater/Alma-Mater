import Link from "next/link";
import { IoCopy, IoHome, IoPerson } from "react-icons/io5";

type WorkspaceProps = { children: React.ReactNode };

export const Workspace = ({ children }: WorkspaceProps) => {
  return (
    <div className="flex flex-col items-top justify-around md:flex-row md:justify-between w-full md:w-[70%]">
      <div className="bg-white w-full md:max-w-[20%] md:h-[200px] flex justify-around md:flex-col gap-2 p-4 rounded-xl">
        <Link
          href="/workspace"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 hover:duration-300"
        >
          <IoCopy className="text-pink-500 w-5 h-5" />
          <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
            Галерея
          </span>
        </Link>

        <Link
          href="/workspace/diaryPosts"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 hover:duration-300"
        >
          <IoHome className="text-pink-500 w-5 h-5" />
          <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
            Дневник
          </span>
        </Link>

        <Link
          href="/workspace/connections"
          className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 hover:duration-300"
        >
          <IoPerson className="text-pink-500 w-5 h-5" />
          <span className="hidden md:block flex-1 ml-3 whitespace-nowrap">
            Друзья
          </span>
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
};
