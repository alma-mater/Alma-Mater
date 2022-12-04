import { Polyclinic } from "@prisma/client";
import { CARD } from "styles";

type PolyclinicInfoProps = {
  polyclinic: Polyclinic | null | undefined;
};

export const PolyclinicInfo = ({ polyclinic }: PolyclinicInfoProps) => {
  return (
    <div className="md:border-r p-4">
      <img
        className="w-full rounded-xl"
        src={polyclinic?.image || ""}
        alt="Polyclinic Image"
      />
      <h1 className="font-bold text-2xl mt-2 text-center">{polyclinic?.name}</h1>
      <p className="mt-2 text-lg">{polyclinic?.about}</p>
    </div>
  );
};
