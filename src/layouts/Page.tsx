import Head from "next/head";

type PageProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

export const Page = ({ children, className = "", title }: PageProps) => {
  const t = `${title} | Alma Mater`;
  return (
    <>
      {title && (
        <Head>
          <title>{t}</title>
          <meta name="twitter:title" content={t} />
          <meta name="og:title" content={t} />
        </Head>
      )}
      <main className={className}>{children}</main>
    </>
  );
};
