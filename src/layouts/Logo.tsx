import Image from "next/image";
import Link from "next/link";
import {MdOutlinePregnantWoman} from 'react-icons/md'

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center px-2 rounded-xl hover:bg-gray-100 hover:duration-300"
    >
      <MdOutlinePregnantWoman className="w-7 h-7"/>
      <span className="text-xl font-medium">Alma-Mater</span>
    </Link>
  );
};
