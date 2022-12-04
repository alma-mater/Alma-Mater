import type { Session } from "next-auth";
import type { User } from "@prisma/client";
import { Avatar } from "components/common/Avatar";
import Link from "next/link";
import { BsFillChatRightDotsFill } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GiHospitalCross } from "react-icons/gi";

type InfoProps = { user?: (User & any) | null; session: Session | null };

export const PROFILE =
  "border-[1px] border-gray-700 gap-2 w-[100px] h-[100px] flex flex-col items-center justify-center rounded-[10px] text-xl";

export const Info = ({ user, session }: InfoProps) => {
  return (
    <div className="my-4 bg-white rounded-[10px] p-4 h-max">
      <div>
        {/* Settings */}
        <div className="flex flex-col items-center justify-center">
          <Avatar src={user?.image} size={100} />
          <h1 className="text-3xl font-semibold mt-3">{user?.name}</h1>
          <p className="text-lg text-center lowercase text-gray-400">
            {user?.role}
          </p>
          {user?.bio && (
            <>
              <p className="p-4 text-lg">
                <ReactMarkdown>{user.bio}</ReactMarkdown>
              </p>
            </>
          )}
          {session?.user?.id === user?.id && (
              <Link
                href="/settings"
                className="bg-pink-500 p-2 rounded-xl text-center w-full text-white hover:bg-pink-600 duration-500"
              >
                Редактировать
              </Link>
          )}
          {user?.role === "SPECIALIST" &&
                user?.id !== session?.user?.id && (
                  <Link
                    href={`/chat/${user?.id}`}
                    className="bg-pink-500 p-2 rounded-xl text-center w-full text-white hover:bg-pink-600 duration-500"
                  >
                    Написать специалисту
                  </Link>
                )}
        </div>
        {/* Sign Out */}
      </div>
      {/* General Info */}
      <div className="my-4 gap-2 text-lg">
        {user?.polyclinic && <p>Поликлиника: {user.polyclinic.name}</p>}
        <p>Постов: {user?.Room.length}</p>
      </div>
    </div>
  );
};
