import Link from "next/link";
import { trpc } from "utils/trpc";

const Polyclinics = () => {
  const { data: polyclinics } = trpc.polyclinic.all.useQuery();
  return (
    <div>
      {polyclinics?.map((p) => (
        <div className="flex bg-white p-4 rounded-xl max-w-[60ch] mx-auto justify-between gap-4 my-6">
          <img
            className="w-[20%] h-24 object-cover rounded"
            src={p.image || ""}
            alt=""
          />
          <div className="w-full h-[100%]">
            <h1 className="text-xl font-bold">
              <Link href={`/polyclinics/${p.id}`}>{p.name}</Link>
            </h1>
            <p>{p.about}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Polyclinics;
