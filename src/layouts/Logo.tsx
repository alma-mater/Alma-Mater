import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center px-2 rounded-xl"
    >
      <span className="text-xl font-bold">ALMAMATER</span>
    </Link>
  );
};
