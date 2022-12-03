import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center px-2 rounded-xl hover:bg-gray-100 hover:duration-300"
    >
      <Image src="/logo.png" width={48} height={48} alt="logo" />
      <span className="text-xl font-medium">Almamater</span>
    </Link>
  );
};
