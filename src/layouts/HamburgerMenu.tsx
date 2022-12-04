import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  IoLogInOutline,
  IoPerson,
} from "react-icons/io5";
import { MdWorkOutline, MdShoppingCart } from "react-icons/md";

type HamburgerMenuProps = { session: Session | null };

const HAMBURGER_ITEM =
  "flex items-center gap-2 p-4 hover:bg-gray-200 hover:duration-500";

export const HamburgerMenu = ({ session }: HamburgerMenuProps) => {
  return (
    <div className="flex flex-col absolute right-8 top-14 rounded bg-gray-100">
      <Link href="/shop" className={HAMBURGER_ITEM}>
        <MdShoppingCart /> Магазин
      </Link>
      <Link href="/workspace" className={HAMBURGER_ITEM}>
        <MdWorkOutline /> Беременность
      </Link>
      {session ? (
        <Link href={`/users/${session.user?.id}`} className={HAMBURGER_ITEM}>
          <IoPerson /> Профиль
        </Link>
      ) : (
        <button className={HAMBURGER_ITEM} onClick={() => signIn()}>
          <IoLogInOutline /> Войти
        </button>
      )}
      {/* Social Links */}
    </div>
  );
};
