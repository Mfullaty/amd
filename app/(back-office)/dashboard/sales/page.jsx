import NewItemButton from "@/components/dashboard/NewItemButton";

import DataTable from "@/components/dashboard/data-table/DataTable";

export default function Sales() {
  return (
    <div>
      <div className="relative">
        <NewItemButton title={"Sale"} link={"/dashboard/sales/new"} />
      </div>
      <div className="w-full overflow-x-auto my-16">
        <DataTable apiUrl="/api/sales" />
      </div>
    </div>
  );
}
