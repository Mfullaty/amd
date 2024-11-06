"use client";
import FlutterwavePayment from "@/components/FlutterwavePayment";
import ImageSlider from "@/components/ImageSlider";
import AppIcon from "@/components/dashboard/AppIcon";
import DeleteButton from "@/components/dashboard/DeleteButton";
import EditBtn from "@/components/dashboard/EditBtn";
import { Meteors } from "@/components/ui/Meteors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { convertToHumanReadable } from "@/lib/convertToHumanReadable";
import { formatMoney } from "@/lib/formatMoney";
import { getData } from "@/lib/getData";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItemSinglePage({ params: { id } }) {
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Session
  const { data: session, status } = useSession();

  const user = session?.user;

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const fetchedItem = await getData(`items/${id}`);
        setItem(fetchedItem);
      } catch (error) {
        console.error("Error fetching Item:", error);
        toast.error("Failed to fetch Item.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-2 justify-center my-3">
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="flex flex-row justify-between items-center py-3">
            <CardTitle className="text-base md:text-xl font-bold">
              <Skeleton className="w-16 h-3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground font-bold">Item Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Name:</p>
                <Skeleton className="w-16 h-3" />
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Created By:</p>
                <p className=" text-sm">
                  <Skeleton className="w-16 h-3" />
                </p>
              </div>
            </div>
            <div className="p-3 border rounded-md my-3">
              <p className="font-bold">Dates</p>
              <div className="flex flex-row flex-wrap gap-2 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Created On:</p>
                <p className=" text-sm">
                  <Skeleton className="w-16 h-3" />
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Updated On:</p>
                <p className=" text-sm">
                  <Skeleton className="w-16 h-3" />
                </p>
              </div>
            </div>
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground font-bold">Notes</p>
              <p className="w-full text-start px-1 py-2">
                <Skeleton className="w-16 h-3" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center my-5">
        <p className="text-xl">Item not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full my-6">
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {!["CUSTOMER"].includes(user.role) && (
            <>
              <EditBtn link={`/dashboard/items/update/${item.id}`} />
              <DeleteButton
                className="text-sm"
                resourceTitle="items"
                id={item.id}
                deleteText={
                  <div className="flex items-center justify-center py-2 px-3 rounded-md bg-yellow-600 dark:bg-yellow-500 hover:bg-red-500 dark:hover:bg-red-600 outline-0 transition-colors ease-in-out text-background cursor-pointer">
                    <AppIcon icon="Trash2" className="w-3 h-3" />
                    Delete
                  </div>
                }
                deleteConfirmationText={`This action cannot be undone. This will delete the ${item.title} item`}
                skeletonWitdth="16"
                skeletonHeight="9"
                afterDelete={() => router.back()}
              />
            </>
          )}
          {["CUSTOMER"].includes(user.role) && (
            <FlutterwavePayment
              amount={item.price}
              currency="NGN"
              email={user.email}
              name={user.name}
              phone={user.phone}
              added_by="THE CUSTOMER"
              itemId={item.id}
              userId={user.id}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-center  my-3">
        {/* Essential Infos */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="flex flex-row justify-between items-center py-3">
            <CardTitle className="text-base md:text-xl font-bold">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground font-bold">Item Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm ">Item Name:</p>
                <p className=" text-sm font-bold">{item.title}</p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Item Price:</p>
                <p className="text-sm text-indigo-500 font-bold">
                  ₦{formatMoney(item.price, 0)}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Quantity</p>
                <p className=" text-sm">{item.quantity}</p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Added By</p>
                <p className=" text-sm">{item.added_by}</p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Category</p>
                <p className=" text-sm">{item.category.title}</p>
              </div>
            </div>
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground font-bold">Dates</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Added On:</p>
                <p className=" text-sm">
                  {convertToHumanReadable(item.createdAt)}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Updated On:</p>
                <p className=" text-sm">
                  {convertToHumanReadable(item.updatedAt)}
                </p>
              </div>
            </div>
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground font-bold">Notes</p>
              <p className="w-full text-start px-1 py-2">{item.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="text-start">
            <CardTitle className="text-2xl font-bold">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48 flex justify-center">
              {item.imageUrls && item.imageUrls.length > 0 ? (
                <ImageSlider imageUrls={item.imageUrls} />
              ) : (
                <h2 className="text-center flex justify-center items-center text-lg text-muted-foreground">
                  No Images for {item.title}
                </h2>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
