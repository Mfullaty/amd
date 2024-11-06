"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { generateInitials } from "@/lib/generateInitials";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/dashboard/AppIcon";
import { convertToHumanReadable } from "@/lib/convertToHumanReadable";
import ImageSlider from "@/components/ImageSlider";
import EditBtn from "@/components/dashboard/EditBtn";
import DeleteBtn from "@/components/dashboard/DeleteBtn";
import { formatMoney } from "@/lib/formatMoney";
import { truncateText } from "@/lib/truncateText";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { checkDate } from "@/lib/checkDate";

export default function CustomerDetailsPage({ params }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
        } else {
          throw new Error("Failed to fetch Customer");
        }
      } catch (error) {
        console.error("Error fetching Customer:", error);
        toast.error("Failed to fetch Customer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

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

  if (!customer) {
    return (
      <div className="flex justify-center items-center my-5">
        <p className="text-xl">Customer not found</p>
      </div>
    );
  }

  // Collection date check
  const { isToday, isTomorrow } = checkDate(customer?.collection_date);

  // Copy Order Id
  const copyOrderId = () => {
    if (customer?.orderId) {
      navigator.clipboard
        .writeText(customer.orderId)
        .then(() => {
          toast.success("Order ID copied!");
        })
        .catch((err) => {
          console.error("Failed to copy Order ID:", err);
          toast.error("Failed to copy Order ID. Please try again.");
        });
    }
  };

  return (
    <div className="relative w-full my-6">
      <div className="relative w-ull flex justify-between items-center flex-wrap gap-2">
        {!["CUSTOMER"].includes(user.role) && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <EditBtn link={`/dashboard/customers/update/${customer?.id}`} />
            <DeleteBtn
              className="text-sm"
              resourceTitle="customers"
              id={customer?.id}
              deleteText={
                <div className="flex items-center justify-center py-2 px-3 rounded-md bg-yellow-600 dark:bg-yellow-500 hover:bg-red-500 dark:hover:bg-red-600 outline-0 transition-colors ease-in-out text-background cursor-pointer">
                  <AppIcon icon="Trash2" className="w-3 h-3" />
                  Delete
                </div>
              }
              deleteConfirmationText={`This action cannot be undone. This will delete ${customer.user?.name}'s item`}
              skeletonWitdth="16"
              skeletonHeight="9"
              afterDelete={() => router.back()}
            />
          </div>
        )}

        {isToday || isTomorrow ? (
          <>
            {isToday && ["CUSTOMER"].includes(user.role) ? (
              <div className="flicker-effect hover:bg-muted-foreground cursor-pointer p-2 bg-foreground text-background border border-red-500 rounded-md flex flex-row items-center gap-2 flex-wrap">
                <p className="text-sm font-bold">Your Work is due today!</p>
              </div>
            ) : isToday && !["CUSTOMER"].includes(user.role) ? (
              <div className="flicker-effect hover:bg-muted-foreground cursor-pointer p-2 bg-foreground text-background border border-red-500 rounded-md flex flex-row items-center gap-2 flex-wrap">
                <div className="flex flex-row items-center flex-wrap gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={customer?.user.image} />
                    <AvatarFallback className="text-xl">
                      {generateInitials(customer?.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-bold">{customer?.user.name}</p>
                </div>
                <p className="text-sm">Is due today!</p>
              </div>
            ) : isTomorrow && ["CUSTOMER"].includes(user.role) ? (
              <div className="glitch-effect hover:bg-muted cursor-pointer p-2  border border-yellow-500 rounded-md flex flex-row items-center gap-2 flex-wrap">
                <p className="text-sm font-bold">Your work is due Tomorrow!</p>
              </div>
            ) : (
              isTomorrow &&
              !["CUSTOMER"].includes(user.role) && (
                <div className="glitch-effect hover:bg-muted cursor-pointer p-2  border border-yellow-500 rounded-md flex flex-row items-center gap-2 flex-wrap">
                  <div className="flex flex-row items-center flex-wrap gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={customer.user.image} />
                      <AvatarFallback className="text-xl">
                        {generateInitials(customer.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-bold">{customer.user.name}</p>
                  </div>
                  <p className="text-sm">Is due tomorrow!</p>
                </div>
              )
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-2 justify-center  my-12">
        {/* Essential Infos */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="flex flex-row justify-between items-center py-3 ">
            <CardTitle className="text-base md:text-xl font-bold">
              {customer.user?.name}
            </CardTitle>
            <Avatar className="w-10 h-10 md:w-12 md:h-12">
              <AvatarImage src={customer.user?.image} />
              <AvatarFallback className="text-xl">
                {generateInitials(customer.user?.name)}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-between items-center p-3 border rounded-md">
              <div>
                <p className="text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground ">
                  {customer.user?.phone}
                </p>
              </div>

              <a href={`tel:${customer.user?.phone}`}>
                <AppIcon
                  icon="Phone"
                  className="w-7 h-7 text-background bg-orange-600 hover:bg-orange-700 dark:bg-indigo-400 dark:hover:bg-indigo-500  transition-colors ease-out  cursor-pointer p-1 rounded-full"
                ></AppIcon>
              </a>
            </div>
            {/* Items Details */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Item Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Name:</p>
                <p className="text-muted-foreground text-sm">
                  {customer.item?.title}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Item Price:</p>
                <p className="text-muted-foreground text-sm">
                  ₦{formatMoney(customer.item?.price, 0)}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Amount Paid:</p>
                <p className="text-muted-foreground text-sm">
                  ₦{formatMoney(customer?.price_paid, 0)}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Amount Remain:</p>
                <p className="text-muted-foreground text-sm">
                  ₦{formatMoney(customer?.price_remain, 0)}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm dark:text-indigo-500 text-indigo-700">
                  TOTAL:
                </p>
                <p className="text-muted-foreground text-sm dark:text-indigo-500 text-indigo-700">
                  ₦{formatMoney(customer?.total, 0)}
                </p>
              </div>
            </div>

            {/* Customer Order Details*/}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Order Details</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">
                  {customer?.user.id === user.id &&
                  ["CUSTOMER"].includes(user.role)
                    ? "Purchased By:"
                    : "Added By:"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {customer?.user.id === user.id ? "YOU" : customer?.added_by}
                </p>
              </div>
              {customer?.orderId !== null && customer?.orderId !== "" && (
                <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                  <p className="text-foreground text-sm">Order Id</p>
                  <p className="text-muted-foreground text-sm flex flex-row items-center group">
                    {truncateText(customer?.orderId, 15)}
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={copyOrderId}
                    >
                      <AppIcon
                        icon="Copy"
                        className="h-3 w-3 text-foreground"
                      />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </p>
                </div>
              )}
            </div>
            {/* Customer  Dates*/}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Dates</p>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Bringing Date:</p>
                <p className="text-muted-foreground text-sm">
                  {customer?.bringing_date !== null &&
                  customer?.bringing_date !== ""
                    ? convertToHumanReadable(customer?.bringing_date)
                    : "Not set yet"}
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
                <p className="text-foreground text-sm">Collection Date:</p>
                <p className="text-muted-foreground text-sm">
                  {customer?.collection_date !== null &&
                  customer?.collection_date !== ""
                    ? convertToHumanReadable(customer?.collection_date)
                    : "Not set yet"}
                </p>
              </div>
            </div>

            {/* Item Description */}
            <div className="p-3 border rounded-md my-3">
              <p className="text-foreground">Description</p>
              <p className="w-full text-start px-1 py-2">
                {customer?.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="w-full mx-0 md:mx-2 h-max">
          <CardHeader className="text-start">
            <CardTitle className="text-2xl font-bold">
              Customer Work Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48 flex justify-center ">
              <ImageSlider imageUrls={customer.imageUrls || []} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
