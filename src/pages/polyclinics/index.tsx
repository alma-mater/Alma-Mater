import Link from "next/link";
import { CARD } from "styles";
import { trpc } from "utils/trpc";

const Polyclinics = () => {
  const { data: polyclinics } = trpc.polyclinic.all.useQuery();
  return (
    <div>
      {polyclinics?.map((p) => (
        <div className={CARD}>
          <Link href={`/polyclinics/${p.id}`}>{p.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Polyclinics;
