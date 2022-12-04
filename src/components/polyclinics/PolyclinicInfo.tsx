import { Polyclinic } from "@prisma/client";
import { CARD } from "styles";

type PolyclinicInfoProps = {
  polyclinic: Polyclinic | null | undefined;
};

export const PolyclinicInfo = ({ polyclinic }: PolyclinicInfoProps) => {
  return (
    <div className={CARD}>
      <img
        className="w-48 h-48 object-cover rounded-xl"
        src={polyclinic?.image || ""}
        alt="Polyclinic Image"
      />
      <h1 className="border text-red-500">{polyclinic?.name}</h1>
      <p>{polyclinic?.about}</p>
    </div>
  );
};
