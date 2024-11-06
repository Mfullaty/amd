"use client";
import AppIcon from "@/components/dashboard/AppIcon";
import DeleteButton from "@/components/dashboard/DeleteBtn";
import EditBtn from "@/components/dashboard/EditBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { convertToHumanReadable } from "@/lib/convertToHumanReadable";
import { getData } from "@/lib/getData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnitsSingePage({ params: { id } }) {
  const [unit, setUnit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUnit = async () => {
      setIsLoading(true);
      try {
        const unit = await getData(`units/${id}`);
        setUnit(unit);
      } catch (error) {
        console.error("Error fetching Unit:", error);
        toast.error("Failed to fetch Unit.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-2 justify-center  my-3">
        {/* Essential Infos */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="flex flex-row justify-between items-center py-3 ">
            <CardTitle className="text-base md:text-xl font-bold">
              <Skeleton className="w-16 h-3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Unit Details */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Unit Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Name:</p>
                <Skeleton className="w-16 h-3" />
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Created By:</p>
                <p className="text-muted-foreground text-sm">
                  <Skeleton className="w-16 h-3" />
                </p>
              </div>
            </div>

            {/* Unit dates*/}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Dates</p>
              <div className="flex flex-row flex-wrap gap-2 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">created On:</p>
                <p className="text-muted-foreground text-sm">
                  <Skeleton className="w-16 h-3" />
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Updated On:</p>
                <p className="text-muted-foreground text-sm">
                  <Skeleton className="w-16 h-3" />
                </p>
              </div>
            </div>

            {/* Unit Description */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Abbreviation</p>
              <p className="w-full text-start px-1 py-2">
                <Skeleton className="w-16 h-3" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex justify-center items-center my-5">
        <p className="text-xl">Unit not found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row gap-2 justify-center  my-16">
        {/* Essential Infos */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="flex flex-row justify-between items-center py-3 ">
            <CardTitle className="text-base md:text-xl font-bold">
              {unit.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Items Details */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Unit Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Name:</p>
                <p className="text-muted-foreground text-sm">{unit.title}</p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Created By:</p>
                <p className="text-muted-foreground text-sm">{unit.added_by}</p>
              </div>
            </div>

            {/* category dates*/}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Dates</p>
              <div className="flex flex-row flex-wrap gap-2 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">created On:</p>
                <p className="text-muted-foreground text-sm">
                  {convertToHumanReadable(unit.createdAt)}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Updated On:</p>
                <p className="text-muted-foreground text-sm">
                  {convertToHumanReadable(unit.updatedAt)}
                </p>
              </div>
            </div>

            {/* Unit Description */}
            <div className="p-3 border rounded-md my-3">
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Abbreviation</p>
                <p className="text-muted-foreground text-sm">
                  {unit.abbreviation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute top-5 right-2 flex items-center gap-2">
        <EditBtn link={`/dashboard/units/update/${unit.id}`} />
        <DeleteButton
          className="text-sm"
          resourceTitle="units"
          id={unit.id}
          deleteText={
            <div className="flex items-center justify-center py-2 px-3 rounded-md bg-yellow-600 dark:bg-yellow-500 hover:bg-red-500 dark:hover:bg-red-600 outline-0 transition-colors ease-in-out text-background cursor-pointer">
              <AppIcon icon="Trash2" className="w-3 h-3" />
              Delete
            </div>
          }
          deleteConfirmationText={`This action cannot be undone. This will delete the ${unit.title} Unit `}
          skeletonWitdth="16"
          skeletonHeight="9"
          afterDelete={() => router.back()}
        />
      </div>
    </div>
  );
}
