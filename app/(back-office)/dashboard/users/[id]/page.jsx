"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { generateInitials } from "@/lib/generateInitials";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import AppIcon from "@/components/dashboard/AppIcon";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Roles } from "@/lib/Roles";
import DeleteButton from "@/components/dashboard/DeleteBtn";

export default function UserDetailsPage({ params }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const { data: session } = useSession();
  const sessionUser = session?.user;
  const router = useRouter();

  // Import The roles array
  const roles = Roles;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!params?.id) {
          throw new Error("Missing user ID");
        }

        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const userData = await response.json();
        if (!userData) {
          throw new Error("Failed to fetch user");
        }

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  useEffect(() => {
    if (!sessionUser) {
      router.push("/login");
    } else if (sessionUser.id === params.id) {
      router.push("/dashboard/profile");
    }
  }, [sessionUser, params.id, router]);

  // Role update:
  const handleRoleUpdate = async (userId, newRole) => {
    if (!sessionUser) {
      toast.error("Session not found. Please log in.");
      return;
    }

    const sessionRole = sessionUser.role;
    const sessionUserId = sessionUser.id;

    if (!user) {
      toast.error("User data missing.");
      return;
    }

    const userToUpdate = user;
    const userToUpdateRole = userToUpdate.role;

    if (!["DEVELOPER", "OWNER", "ADMIN"].includes(sessionRole)) {
      toast.warning("You are not allowed to change roles!");
      return;
    }

    if (sessionRole === "OWNER" && userToUpdateRole === "DEVELOPER") {
      toast.warning("Owners cannot change roles of developers!");
      return;
    }

    if (sessionRole === "ADMIN" && sessionUserId === userId) {
      toast.warning("Admins cannot change their own role!");
      return;
    }

    if (
      sessionRole === "ADMIN" &&
      ["OWNER", "DEVELOPER"].includes(userToUpdateRole)
    ) {
      toast.warning(`Admins cannot change roles of ${userToUpdateRole}s!`);
      return;
    }

    if (userToUpdateRole === "OWNER" && newRole === "DEVELOPER") {
      toast.warning("Owners cannot be promoted to Developers!");
      return;
    }

    setUpdatingUserId(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      const updatedUser = await response.json();

      setUser((prevUser) =>
        prevUser && prevUser.id === userId
          ? { ...prevUser, role: newRole }
          : prevUser
      );
      toast.success(`Updated ${updatedUser.name} to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-5">
        <Card className="w-full max-w-lg">
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

  if (!user) {
    return (
      <div className="flex justify-center items-center my-5">
        <p className="text-xl">User not found</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center my-5">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image} />
              <AvatarFallback className="text-2xl">
                {generateInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-lg font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div
            className={`${
              ["DEVELOPER", "OWNER", "ADMIN"].includes(sessionUser?.role)
                ? "flex justify-between flex-wrap gap-4 items-center"
                : "block text-center"
            } `}
          >
            <div className="roles">
              {["DEVELOPER", "OWNER", "ADMIN"].includes(sessionUser?.role) ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="ml-auto px-2 py-1 rounded-full my-3 md:px-4 md:py-3 text-xs lowercase"
                    >
                      <p>
                        {updatingUserId === user.id ? (
                          <Skeleton className="h-7 rounded-full w-16 md:w-20" />
                        ) : (
                          user.role
                        )}
                      </p>
                      <AppIcon
                        icon="ChevronDown"
                        className="ml-2 h-4 w-4 text-muted-foreground"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-44 h-36 md:w-64 md:h-64"
                    align="end"
                  >
                    <Command>
                      <CommandInput placeholder="Select new role..." />
                      <CommandList>
                        <CommandEmpty>No roles found.</CommandEmpty>
                        <CommandGroup>
                          {roles.map((userRole) => (
                            <CommandItem
                              key={userRole.id}
                              className="space-y-1 flex flex-col items-start px-4 py-2"
                            >
                              <button
                                className="text-start w-full h-full"
                                onClick={() =>
                                  handleRoleUpdate(user.id, userRole.role)
                                }
                              >
                                <p className="font-bold">{userRole.role}</p>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                  {userRole.ability}
                                </p>
                              </button>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Role:{" "}
                  <span className="text-indigo-600 dark:text-indigo-500">
                    {user.role}
                  </span>
                </p>
              )}
            </div>

            {["DEVELOPER", "OWNER"].includes(
              sessionUser?.role || sessionUser.id === user.id
            ) && (
              <div className="DeleteButtonS">
                <DeleteButton
                  className="text-red-600 border border-muted opacity-100 hover:opacity-80 text-xs bg-white shadow-lg px-3 py-1 rounded-md"
                  resourceTitle="users"
                  id={user.id}
                  deleteText={<AppIcon icon="Trash2" className="w-5 h-5" />}
                  deleteConfirmationText="This action cannot be undone. This will delete the account and all the related data"
                  skeletonWitdth="5"
                  skeletonHeight="5"
                  afterDelete={() => router.back()}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
