"use client";
import AppCard from "@/components/dashboard/AppCard";
import AppIcon from "@/components/dashboard/AppIcon";
import { DateRangePicker } from "@/components/dashboard/data-table/DateRangePicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateDbTotals } from "@/lib/calculateDbTotals";
import { checkDate } from "@/lib/checkDate";
import { convertNumber } from "@/lib/convertNumber";
import { convertToHumanReadable } from "@/lib/convertToHumanReadable";
import { generateInitials } from "@/lib/generateInitials";
import { getData } from "@/lib/getData";
import { truncateText } from "@/lib/truncateText";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const {data: session, status} = useSession();
  const router = useRouter();

const redirect = (url) => {
  router.push(url);
}
  if (status === "authenticated" && session.user.role === "CUSTOMER") {
    return redirect("/dashboard/profile");
  }
  const [customers, setCustomers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [expensePerPage, setExpensePerPage] = useState(4);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // Calculate indices for displaying items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);



  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle Date Change
  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Handle route navigation
  const handleRouteNavigation = (route) => {
    router.push(route);
  };

  // Fetch initial data on mount and on pagination change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Combine all requests into an array of promises
        const [customersData, expensesData, salesData, itemsData] =
          await Promise.all([
            getData("customers", dateRange, currentPage, itemsPerPage),
            getData("expenses", dateRange, currentExpensePage, expensePerPage),
            getData("sales", dateRange),
            getData("items", dateRange),
          ]);

        // Update state with fetched data
        setCustomers(customersData["data"]);
        setExpenses(expensesData["data"]);
        setSales(salesData["data"]);
        setItems(itemsData["data"]);
      } catch (error) {
        console.error("Error fetching Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const formatedDateRange = (dateRange) => {
    const formated = { from: null, to: null };
    if (dateRange) {
      if (
        dateRange.from !== NaN &&
        dateRange.from !== null &&
        dateRange.from !== undefined
      ) {
        formated.from = convertToHumanReadable(dateRange.from, false);
      }
      if (
        dateRange.to !== NaN &&
        dateRange.to !== null &&
        dateRange.to !== undefined
      ) {
        formated.to = convertToHumanReadable(dateRange.to, false);
      }
    }

    return formated;
  };

  const formatedDates = formatedDateRange(dateRange);

  // Totals:
  const customersRevenue = calculateDbTotals(customers, "total");
  const salesRevenue = calculateDbTotals(sales, "price");
  const totalExpenses = calculateDbTotals(expenses, "amount");
  const totalItems = convertNumber(items.length);

  return (
    <>
      <div className="relative w-full my-6">
        <div className="absolute top-0 right-0 w-full flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-sm md:text-base text-indigo-500">
            {formatedDates.from && formatedDates.to
              ? `${formatedDates.from} - ${formatedDates.to}`
              : "Select A date Range"}
          </h1>
          <DateRangePicker onDateChange={handleDateChange} />
        </div>
      </div>

      <div className="my-3"> </div>

      <div className="myGrid">
        {customers.map((customer) => {
          const { isToday, isTomorrow } = checkDate(customer.collection_date);

          return (
            (isToday || isTomorrow) && (
              <div key={customer.id}>
                {isToday ? (
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="flicker-effect hover:bg-muted-foreground cursor-pointer p-2 bg-foreground text-background border border-red-500 rounded-md flex flex-row items-center gap-2 flex-wrap"
                  >
                    <div className="flex flex-row items-center flex-wrap gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={customer.user.image} />
                        <AvatarFallback className="text-xl">
                          {generateInitials(customer.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-bold">{customer.user.name}</p>
                    </div>
                    <p className="text-sm">Is due today!</p>
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="glitch-effect hover:bg-muted cursor-pointer p-2 w-full border border-yellow-500 rounded-md flex flex-row items-center gap-2 flex-wrap"
                  >
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
                  </Link>
                )}
              </div>
            )
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 my-8">
        <AppCard
          cardTitle="Customers Revenue"
          cardContent={
            loading ? (
              <Skeleton className="w-full h-8 bg-muted" />
            ) : (
              `₦${customersRevenue}`
            )
          }
          cardIcon="BadgeDollarSign"
          cardSubtitle={
            formatedDates.from && formatedDates.to
              ? `${formatedDates.from} - ${formatedDates.to}`
              : ""
          }
          cardLink="/dashboard/customers"
        />
        <AppCard
          cardTitle="Sales Revenue"
          cardContent={
            loading ? (
              <Skeleton className="w-full h-8 bg-muted" />
            ) : (
              `₦${salesRevenue}`
            )
          }
          cardIcon="ShoppingCart"
          cardSubtitle={
            formatedDates.from && formatedDates.to
              ? `${formatedDates.from} - ${formatedDates.to}`
              : ""
          }
          cardLink="/dashboard/sales"
        />
        <AppCard
          cardTitle="Total Items"
          cardContent={
            loading ? (
              <Skeleton className="w-full h-8 bg-muted" />
            ) : (
              `${totalItems}`
            )
          }
          cardIcon="Boxes"
          cardSubtitle={
            formatedDates.from && formatedDates.to
              ? `${formatedDates.from} - ${formatedDates.to}`
              : ""
          }
          cardLink="/dashboard/items"
        />
        <AppCard
          cardTitle="Total Expenses"
          cardContent={
            loading ? (
              <Skeleton className="w-full h-8 bg-muted" />
            ) : (
              `₦${totalExpenses}`
            )
          }
          cardIcon="HandCoins"
          cardSubtitle={
            formatedDates.from && formatedDates.to
              ? `${formatedDates.from} - ${formatedDates.to}`
              : ""
          }
          cardLink="/dashboard/expenses"
          contentStyles={
            calculateDbTotals(expenses, "total") >=
              calculateDbTotals(customers, "amount") &&
            "text-red-500 flicker-effect"
          }
        />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 md:my-4 w-full">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="grid gap-2">
              <CardTitle>Customers</CardTitle>
              <CardDescription> Most recent Customers</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/customers">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="flex w-full flex-row items-center justify-between flex-wrap">
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              {loading ? (
                <div className="flex w-full flex-row items-center justify-between flex-wrap my-3">
                  <div className="flex flex-col gap-3 justify-center">
                    <Skeleton className="w-20 h-4 bg-muted" />
                    <Skeleton className="w-20 h-4 bg-muted" />
                    <Skeleton className="w-20 h-4 bg-muted" />
                    <Skeleton className="w-20 h-4 bg-muted" />
                  </div>

                  <div className="flex flex-col gap-3 justify-center">
                    <Skeleton className="w-14 h-4 bg-muted" />
                    <Skeleton className="w-14 h-4 bg-muted" />
                    <Skeleton className="w-14 h-4 bg-muted" />
                    <Skeleton className="w-14 h-4 bg-muted" />
                  </div>
                </div>
              ) : !customers ? (
                <div className="w-full mx-auto flex justify-center items-center">
                  <p className="text-indigo-500 text-sm">No Customers</p>
                </div>
              ) : (
                <TableBody className="w-full">
                  {currentItems.map((customer) => (
                    <TableRow
                      onClick={() =>
                        handleRouteNavigation(
                          `/dashboard/customers/${customer.id}`
                        )
                      }
                      key={customer.id}
                      className="flex flex-row justify-between flex-wrap cursor-pointer"
                    >
                      <TableCell>
                        <div className="font-medium">{customer.user.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {customer.user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₦{customer.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </CardContent>
          <div className="flex items-center gap-4 mx-2 py-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <AppIcon
                icon="ChevronLeft"
                className={`w-8 h-8 p-2 shadow-lg text-background bg-foreground rounded-md ${
                  currentPage === 1
                    ? "bg-muted-foreground cursor-not-allowed"
                    : "bg-foreground cursor-pointer hover:bg-muted-foreground"
                }`}
              />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(customers.length / itemsPerPage)
              }
            >
              <AppIcon
                icon="ChevronRight"
                className={`w-8 h-8 p-2 shadow-lg text-background bg-foreground rounded-md ${
                  currentPage === Math.ceil(customers.length / itemsPerPage)
                    ? "bg-muted-foreground cursor-not-allowed"
                    : "bg-foreground cursor-pointer hover:bg-muted-foreground"
                }`}
              />
            </button>

            <p>Page {currentPage}</p>
          </div>
        </Card>

        {/* Recent Expenses */}
        <Card className="h-max">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Most recent Expenses</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            {loading ? (
              <div className="flex w-full flex-row items-center justify-between flex-wrap my-3">
                <div className="flex flex-col gap-3 justify-center">
                  <Skeleton className="w-20 h-4 bg-muted" />
                  <Skeleton className="w-20 h-4 bg-muted" />
                  <Skeleton className="w-20 h-4 bg-muted" />
                  <Skeleton className="w-20 h-4 bg-muted" />
                </div>

                <div className="flex flex-col gap-3 justify-center">
                  <Skeleton className="w-14 h-4 bg-muted" />
                  <Skeleton className="w-14 h-4 bg-muted" />
                  <Skeleton className="w-14 h-4 bg-muted" />
                  <Skeleton className="w-14 h-4 bg-muted" />
                </div>
              </div>
            ) : !expenses ? (
              <div className="w-full mx-auto flex justify-center items-center">
                <p className="text-indigo-500 text-sm">No expenses</p>
              </div>
            ) : (
              expenses.map((expense) => (
                <Link
                  key={expense.id}
                  href={`/dashboard/expenses/${expense.id}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4 hover:border border-indigo-500 rounded-md p-2 transition-all ease-in-out">
                    <div className="flex flex-row gap-2 flex-wrap items-center">
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {expense.added_by}
                        </p>
                        <p className="text-sm hidden md:block text-muted-foreground">
                          {truncateText(expense.title, 18)}
                        </p>
                      </div>
                    </div>

                    <div className="ml-auto text-destructive text-sm font-bold">
                      -₦{expense.amount}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
          <div className="flex items-center gap-4 mx-2 py-2">
            <button
              onClick={() => handlePageChange(currentExpensePage - 1)}
              disabled={currentExpensePage === 1}
            >
              <AppIcon
                icon="ChevronLeft"
                className={`w-8 h-8 p-2 shadow-lg text-background bg-foreground rounded-md ${
                  currentExpensePage === 1
                    ? "bg-muted-foreground cursor-not-allowed"
                    : "bg-foreground cursor-pointer hover:bg-muted-foreground"
                }`}
              />
            </button>
            <button
              onClick={() => handlePageChange(currentExpensePage + 1)}
              disabled={
                currentExpensePage ===
                Math.ceil(expenses.length / expensePerPage)
              }
            >
              <AppIcon
                icon="ChevronRight"
                className={`w-8 h-8 p-2 shadow-lg text-background bg-foreground rounded-md ${
                  currentExpensePage ===
                  Math.ceil(expenses.length / expensePerPage)
                    ? "bg-muted-foreground cursor-not-allowed"
                    : "bg-foreground cursor-pointer hover:bg-muted-foreground"
                }`}
              />
            </button>
            <p>Page{currentExpensePage}</p>
          </div>
        </Card>
      </div>
    </>
  );
}
