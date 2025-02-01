"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AppIcon from "@/components/dashboard/AppIcon";
import InfoModal from "@/components/dashboard/InfoModal";
import { generateInitials } from "@/lib/generateInitials";
import { getData } from "@/lib/getData";
import { truncateText } from "@/lib/truncateText";
import { Roles } from "@/lib/Roles";
import { CircleHelp } from "lucide-react";

const roles = Roles;
const ITEMS_PER_PAGE = 10;

export default function UsersCard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const users = await getData("users");
        setUsers(users || []);
        setFilteredUsers(users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const sessionUser = session?.user;

  const handleRoleUpdate = async (userId, newRole) => {
    if (!sessionUser) {
      toast.error("Session not found. Please log in.");
      return;
    }

    const sessionRole = sessionUser.role;
    const sessionUserId = sessionUser.id;

    const userToUpdate = users.find((user) => user.id === userId);
    if (!userToUpdate) {
      toast.error("User not found.");
      return;
    }

    const userToUpdateRole = userToUpdate.role;

    if (!["DEVELOPER", "OWNER"].includes(sessionRole)) {
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
      ["OWNER", "DEVELOPER", "ADMIN"].includes(userToUpdateRole)
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

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`Updated ${updatedUser.name} to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role.");
    } finally {
      setUpdatingUserId(null);
    }
  };
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginationButtons = () => {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <AppIcon icon="ChevronLeft" className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <AppIcon icon="ChevronRight" className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between flex-wrap gap-3 w-full">
            <p>Invite your team members to collaborate.</p>
            <div className="flex items-center gap-2 mr-3">
              <p className="font-bold text-right mr-auto">Roles</p>
              <InfoModal
                triggerText={
                  <CircleHelp className="w-4 h-4 text-foreground cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 font-bold" />
                }
                messageTitle="Changing roles?"
                messageText="This action can only be performed by a Developer, Owner, or Admin, other users are not allowed to change roles"
              />
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          {paginationButtons()}
        </div>
        {isLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 justify-between flex-wrap space-x-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10  rounded-full hidden md:block" />
                  <div className="flex-1">
                    <Skeleton className="h-3 md:h-4 w-24 md:w-44 mb-2" />
                    <Skeleton className="hidden md:block h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-7 rounded-full w-16 md:w-20" />
              </div>
            ))}
          </>
        ) : (
          paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between flex-wrap gap-4 space-x-4"
            >
              <Link
                href={`/dashboard/users/${user.id}`}
                className="hover:shadow-xl dark:hover:shadow-slate-600  rounded-md"
              >
                <div className="flex items-center space-x-0 md:space-x-4">
                  <div className="hidden md:block">
                    <Avatar>
                      <AvatarImage src={user.image} className="object-cover" />
                      <AvatarFallback>
                        {generateInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    {sessionUser.id === user.id ? (
                      <p className="text-sm font-medium leading-none dark:text-indigo-600 text-orange-400 dark:hover:text-orange-600 hover:text-indigo-500 transition-colors ease-in-out">
                        YOU (See your profile)
                      </p>
                    ) : (
                      <>
                        <p className="text-sm font-medium leading-none block md:hidden text-indigo-600 dark:text-orange-600 hover:text-orange-600 dark:hover:text-indigo-500 transition-colors ease-in-out">
                          {truncateText(user.name, 20)}
                        </p>
                        <p className="text-sm font-medium leading-none hidden md:block text-indigo-600 dark:text-orange-600 hover:text-orange-600 dark:hover:text-indigo-500 transition-colors ease-in-out">
                          {user.name}
                        </p>
                      </>
                    )}
                    <p className="hidden md:block text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Link>
              {["DEVELOPER", "OWNER", "ADMIN"].includes(sessionUser?.role) ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="ml-auto px-2 py-1 rounded-full md:px-4 md:py-3 text-xs lowercase"
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
                  <Badge variant="outline">{user.role}</Badge>
                </p>
              )}
            </div>
          ))
        )}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          {paginationButtons()}
        </div>
      </CardContent>
    </Card>
  );
}
