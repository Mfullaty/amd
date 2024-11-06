import NewItemButton from "@/components/dashboard/NewItemButton";
import DataTable from "@/components/dashboard/data-table/DataTable";

export default function Customers() {
  return (
    <>
      <div className="relative">
        <NewItemButton title={"Customer"} link={"/dashboard/customers/new"} />
      </div>
      <div className="w-full overflow-x-auto my-16">
        <DataTable apiUrl="/api/customers" />
      </div>
    </>
  );
}
