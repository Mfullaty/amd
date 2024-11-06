import NewItemButton from "@/components/dashboard/NewItemButton";

import DataTable from "@/components/dashboard/data-table/DataTable";

export default function Expenses() {

  return (
    <>
      <div className="relative">
        <NewItemButton title={"Expense"} link={"/dashboard/expenses/new"} />
      </div>
      <div className="w-full overflow-x-auto my-8">
        <DataTable apiUrl="/api/expenses" />
      </div>
    </>
  );
}
