import NewItemButton from "@/components/dashboard/NewItemButton";
import DataTable from "@/components/dashboard/data-table/DataTable";
export default function Items() {
  return (
    <>
      <div className="relative">
        <NewItemButton title={"Item"} link={"/dashboard/items/new"} />
      </div>
      <div className="w-full overflow-x-auto my-16">
        <DataTable apiUrl="/api/items" />
      </div>
    </>
  );
}
