"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/dashboard/AppIcon";
import { convertToHumanReadable } from "@/lib/convertToHumanReadable";
import ImageSlider from "@/components/ImageSlider";
import DeleteButton from "@/components/dashboard/DeleteButton";

export default function SaleDetailsPage({ params }) {
  const [sale, setSale] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const sessionUser = session?.user;
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/sales/${params.id}`);
        if (response.ok) {
          const saleData = await response.json();
          setSale(saleData);
        } else {
          throw new Error("Failed to fetch Sale");
        }
      } catch (error) {
        console.error("Error fetching Sale:", error);
        toast.error("Failed to fetch Sale.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (!sessionUser) {
      router.push("/login");
    }
  }, [sessionUser, router]);

  console.log(sale);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-5">
        <Card className="w-full mx-2 ">
          <div className="text-center">
            <CardHeader className="flex justify-center">
              <p>
                <Skeleton className="w-40  h-3" />
              </p>
            </CardHeader>
          </div>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="text-center">
                <Skeleton className="w-36 my-2 h-3" />
                <Skeleton className="w-36 my2 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex justify-center items-center my-5">
        <p className="text-xl">sale not found</p>
      </div>
    );
  }

  // imageUrls  String[]
  // notes      String?

  const getSaleData = (sale) => {
    // Check if the sale has saleItems and if the first one has an item.
    if (sale && sale.title) {
      return {
        saleId: sale.id,
        saleTitle: sale.title,
        salePrice: sale.price,
        saleQuantity: sale.quantity,
        saleCategory: sale?.category.title,
        saleAddedBy: sale.added_by,
        saleNotes: sale.notes,
        saleUnit: sale?.unit.title,
        saleImages: sale.imageUrls,
        saleCreatedAt: convertToHumanReadable(sale.createdAt),
      };
    } else {
      return null; // Return null if there is no item data
    }
  };

  // Get sale item data or null if not available
  const saleData = sale ? getSaleData(sale) : null;

  // console.log(saleData);

  return (
    <div className="relative w-full my-6">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {/* <EditBtn link={`/dashboard/sales/update/${saleData.saleId}`} /> */}
        <DeleteButton
          className="text-sm"
          resourceTitle="sales"
          id={sale?.id}
          deleteText={
            <div className="flex items-center justify-center py-2 px-3 rounded-md bg-yellow-600 dark:bg-yellow-500 hover:bg-red-500 dark:hover:bg-red-600 outline-0 transition-colors ease-in-out text-background cursor-pointer">
              <AppIcon icon="Trash2" className="w-3 h-3" />
              Delete
            </div>
          }
          deleteConfirmationText={`This action cannot be undone. This will delete ${saleData.saleTitle}'s data`}
          skeletonWitdth="16"
          skeletonHeight="9"
          afterDelete={() => router.back()}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2 justify-center  my-12">
        {/* Essential Infos */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardContent>
            {/* Sale Details */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Sale Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Title:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.saleTitle}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Sale Price:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.salePrice}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Quantity:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.saleQuantity}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Category:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.saleCategory}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Measured In:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.saleUnit}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Sold by:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.added_by}
                </p>
              </div>
            </div>

            {/* sale  Dates*/}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Dates</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Date Sold:</p>
                <p className="text-muted-foreground text-sm">
                  {saleData.saleCreatedAt}
                </p>
              </div>
            </div>

            {/* Item Description */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Description</p>
              <p className="w-full text-start px-1 py-2">
                {" "}
                {saleData.saleNotes}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="text-start">
            <CardTitle className="text-2xl font-bold">Sale Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48 flex justify-center ">
              <ImageSlider imageUrls={saleData.saleImages || []} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
