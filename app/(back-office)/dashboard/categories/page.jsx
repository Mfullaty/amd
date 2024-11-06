import NewItemButton from "@/components/dashboard/NewItemButton";
import DataTable from "@/components/dashboard/data-table/DataTable";

export default function Categories() {
  return (
    <>
      <div className="relative">
        <NewItemButton
          title={"Category"}
          link={"/dashboard/categories/new"}
        />
      </div>
      <div className="w-full overflow-x-auto my-16"><DataTable apiUrl="/api/categories"/></div>
    </>
  );
}
