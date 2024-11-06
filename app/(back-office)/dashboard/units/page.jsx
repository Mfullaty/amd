import NewItemButton from "@/components/dashboard/NewItemButton";
import DataTable from "@/components/dashboard/data-table/DataTable";

export default function Units() {
  return (
    <>
    <div className="relative">
      <NewItemButton
        title={"Unit"}
        link={"/dashboard/units/new"}
      />
    </div>
    <div className="w-full overflow-x-auto my-16"><DataTable apiUrl="/api/units"/></div>
    </>
  );
}