import type { Session } from "next-auth";
import type { User } from "@prisma/client";
import { Avatar } from "components/common/Avatar";
import Link from "next/link";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { TbBabyCarriage } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GiHospitalCross } from "react-icons/gi";

type InfoProps = { user?: (User & any) | null; session: Session | null };

export const PROFILE =
  "border-[1px] border-gray-700 gap-2 w-[100px] h-[100px] flex flex-col items-center justify-center rounded-[10px] text-xl";

export const Info = ({ user, session }: InfoProps) => {
  return (
    <div className="my-4 bg-white rounded-[10px] p-4 h-max">
      <div className="relative flex justify-around items-center">
        {/* Settings */}
        {session?.user?.id === user?.id && (
          <>
            <Link
              href="/settings"
              className="absolute top-5 left-2 hover:text-blue-500 duration-500"
            >
              <AiOutlineEdit className="w-12 h-12" />
            </Link>
            {user?.role === "SPECIALIST" && user?.id !== session?.user?.id && (
              <Link
                href={`/chat/${user?.id}`}
                className="absolute top-5 right-2 hover:text-blue-500 duration-500"
              >
                <BsFillChatRightDotsFill className="w-12 h-12" />
              </Link>
            )}
          </>
        )}
        <div className="flex flex-col items-center justify-center">
          <Avatar src={user?.image} size={100} />
          <h1 className="text-3xl font-medium mt-4">{user?.name}</h1>
        </div>
        {/* Sign Out */}
      </div>
      {/* General Info */}
      <div className="flex items-center justify-between my-4 gap-2">
        {user?.polyclinic && (
          <div className={`${PROFILE} text-center`}>
            <GiHospitalCross className="w-7 h-7" />
            {user.polyclinic.name}
          </div>
        )}
        <div className={`${PROFILE} text-center lowercase`}>
          <TbBabyCarriage className="w-7 h-7" />
          {user?.role}
        </div>
        <div className={PROFILE}>
          <AiOutlineQuestionCircle className="w-7 h-7" />
          {user?.Room.length}
        </div>
      </div>

      {user?.bio && (
        <>
          <p className="text-xl">О себе</p>
          <p className="border-[1px] border-gray-700 p-4 rounded-[10px] text-lg">
            <ReactMarkdown>{user.bio}</ReactMarkdown>
          </p>
        </>
      )}
    </div>
  );
};
