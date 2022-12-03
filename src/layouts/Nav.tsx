import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BiLogInCircle } from "react-icons/bi";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HamburgerMenu } from "./HamburgerMenu";
import { Logo } from "./Logo";
import { Avatar } from "components/common/Avatar";

type NavProps = {
  links: {
    label: string;
    href: string;
  }[];
};

export const Nav = ({ links }: NavProps) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed transition border-b border-gray-500 bg-opacity-80 w-full z-10 backdrop-blur flex items-center justify-between px-4 py-2">
      <Logo />

      <div className="flex items-center gap-2 text-xl">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-lg rounded-xl py-2 px-4 hover:bg-gray-200 hover:duration-500"
          >
            {l.label}
          </Link>
        ))}
        <div className="hidden md:flex gap-2 items-center justify-around text-3xl md:text-4xl">
          {session ? (
            <Link
              href={`/users/${session.user?.id}`}
              className="rounded-full hover:ring-2 ring-gray-300"
            >
              <Avatar src={session.user?.image} size={32} />
            </Link>
          ) : (
            <button className="text-xl" onClick={() => signIn()}>
              <BiLogInCircle size={32} />
            </button>
          )}
        </div>
        {open && <HamburgerMenu session={session} />}
        <button
          aria-label="Hamburger Menu"
          type="button"
          className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center hover:ring-2 ring-gray-300 transition-all md:hidden flex"
          onClick={() => setOpen(!open)}
        >
          <GiHamburgerMenu />
        </button>
      </div>
    </nav>
  );
};
