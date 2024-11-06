"use client";
import Login from "@/app/login/page";
import AppIcon from "@/components/dashboard/AppIcon";
import DeleteButton from "@/components/dashboard/DeleteBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { convertToHumanReadable } from "@/lib/convertToHumanReadable";
import { generateInitials } from "@/lib/generateInitials";
import { signOut, useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const sessionUser = session?.user;

  if (status === "loading" || !sessionUser) {
    return (
      <Card className="w-full mx-0 md:mx-2 h-max">
        <CardHeader className="flex flex-row justify-between items-center py-3 ">
          <CardTitle className="text-base md:text-xl font-bold">
            <Skeleton className="w-16 h-3" />
          </CardTitle>
          <Skeleton className="w-12 h-12 object-cover rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between items-center p-3 border rounded-md">
            <div>
              <Skeleton className="w-10 h-3" />
              <p className="text-sm text-muted-foreground ">
                <Skeleton className="w-10 h-3" />
              </p>
            </div>

            <button>
              <AppIcon
                icon="Pencil"
                className="w-7 h-7 text-background bg-orange-600 hover:bg-orange-700 dark:bg-indigo-400 dark:hover:bg-indigo-500  transition-colors ease-out  cursor-pointer p-1 rounded-full"
              ></AppIcon>
            </button>
          </div>
          {/* Items Details */}
          <div className="p-3 border rounded-md my-3">
            <p className="text-foreground">Your details</p>
            <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
              <p className="text-foreground text-sm">Registered on:</p>
              <Skeleton className="w-10 h-3" />
            </div>
            <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
              <p className="text-foreground text-sm">Actions:</p>
              <p className="text-muted-foreground text-sm">
                <Skeleton className="w-10 h-3" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mx-0 md:mx-2 h-max">
      <CardHeader className="flex flex-row justify-between flex-wrap gap-2 items-center py-3 ">
        <div className="flex flex-row justify-center items-center gap-2">
          <Avatar className="w-10 h-10 md:w-12 md:h-12">
            <AvatarImage src={sessionUser?.image} className="object-cover" />
            <AvatarFallback className="text-xl">
              {sessionUser ? generateInitials(sessionUser.name) : ""}
            </AvatarFallback>
          </Avatar>
          <Badge
            variant="outline"
            className="text-xs text-background bg-indigo-400"
          >
            {sessionUser?.role}
          </Badge>
        </div>
        <CardTitle className="text-base md:text-xl font-bold">
          {sessionUser?.name || ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between items-center p-3 border rounded-md">
          <div>
            <p className="text-foreground">Email</p>
            <p className="text-sm text-muted-foreground ">
              {sessionUser?.email || ""}
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            {/* <AppIcon
              icon="Pencil"
              className="w-5 h-5 text-background bg-orange-600 hover:bg-orange-700 dark:bg-indigo-400 dark:hover:bg-indigo-500  transition-colors ease-out  cursor-pointer p-1 rounded-full"
            ></AppIcon> */}
            <DeleteButton
              className="text-background bg-red-600 hover:bg-red-700 dark:bg-red-400 dark:hover:bg-red-500  transition-colors ease-out  cursor-pointer p-1 rounded-full"
              resourceTitle="users"
              id={sessionUser?.id || ""}
              deleteText={<AppIcon icon="Trash2" className="w-5 h-5"></AppIcon>}
              deleteConfirmationText="This action cannot be undone. This will delete your account and the related data"
              skeletonWitdth="5"
              skeletonHeight="5"
              afterDelete={() => signOut()}
            />
          </div>
        </div>
        {/* User  Dates*/}
        <div className="p-3 border rounded-md my-3">
          <p className="text-foreground">Dates</p>
          <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
            <p className="text-foreground text-sm">Registered On:</p>
            <p className="text-muted-foreground text-sm">
              {sessionUser?.createdAt
                ? convertToHumanReadable(sessionUser.createdAt)
                : ""}
            </p>
          </div>
          <div className="flex flex-row flex-wrap gap-3 justify-between items-center w-full py-2">
            <p className="text-foreground text-sm">Updated profile on:</p>
            <p className="text-muted-foreground text-sm">
              {sessionUser?.updatedAt
                ? convertToHumanReadable(sessionUser.updatedAt)
                : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
