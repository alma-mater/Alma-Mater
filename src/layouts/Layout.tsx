import Head from "next/head";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Nav } from "./Nav";

type LayoutProps = { children: React.ReactNode };

export const Layout = ({ children }: LayoutProps) => {
  const links = [
    { label: "Поликлиники", href: "/polyclinics" },
    { label: "Магазин", href: "/shop" },
    { label: "Беременность", href: "/workspace" },
  ];

  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Almamater is a pregnancy-tracking app created to help women all around the world."
        />
        <meta name="author" content="Jolshylar" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="Almamater - Get Pregnant Faster" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@jolshylar" />
        <meta
          name="twitter:image"
          content="https://almamater.vercel.app/card.png"
        />
        <meta property="og:site_name" content="Almamater" />
        <meta name="og:title" content="Almamater - Get Pregnant Faster" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://almamater.vercel.app/card.png"
        />
        <title>Almamater - Get Pregnant Faster</title>
      </Head>
      <Nav links={links} />
      <main ref={parent} className="py-20 px-4 sm:container mx-auto">
        {children}
      </main>
    </>
  );
};
