// calculateDbTotals.js
import { formatMoney } from "./formatMoney";

export function calculateDbTotals(dataArray, key) {
  // Initialize a variable to store the sum of all totals
  let totalSum = 0;

  // Iterate over each object in the array
  for (const item of dataArray) {
    // Ensure the key exists and is a number before adding it to the totalSum
    if (item[key] && !isNaN(item[key])) {
      totalSum += item[key];
    }
  }

  // Return the formatted sum of all totals
  return formatMoney(totalSum);
}

// const cardDetails = [
//     {
//       title: "Total Revenue",
//       content: "₦35,200",
//       subTitle: "In the last 25 days",
//       icon: "DollarSign",
//     },
//     {
//       title: "New Customers",
//       content: "+300",
//       subTitle: "This Month",
//       icon: "Users2",
//     },
//     {
//       title: "Sales",
//       content: "+2,200",
//       subTitle: "Today",
//       icon: "CreditCard",
//     },
//     {
//       title: "New Items",
//       content: "+700",
//       subTitle: "In the last 25 days",
//       icon: "Box",
//       link: "/dashboard/items",
//     },
//   ];

// const recentExpenses = [
//     {
//       avatarUrl: "https://avatars.githubusercontent.com/u/86200802?v=4",
//       name: "Mustapha Ibrahim",
//       email: "mustaphaIbrahim37@gmail.com",
//       amount: "3,800",
//     },
//     {
//       avatarUrl: "",
//       name: "Ahmad Ibrahim",
//       email: "ahmadFullaty@gmail.com",
//       amount: "800",
//     },
//     {
//       avatarUrl: "",
//       name: "Khalifah Ibrahim",
//       email: "khalifahIbrahimFullaty@gmail.com",
//       amount: "3,200",
//     },
//     {
//       avatarUrl: "",
//       name: "Ismail Fullaty",
//       email: "ismailIbrahimFullaty@gmail.com",
//       amount: "200",
//     },
//   ];

// const recentSales = [
//     {
//       name: "Mustapha Ibrahim",
//       email: "mustapha@gmail.com",
//       type: "Sale",
//       status: "Closed",
//       amount: "23,000",
//       date: "23-03-2024",
//     },
//     {
//       name: "Ahmad Ibrahim",
//       email: "ahmadFullaty@gmail.com",
//       type: "Customer",
//       status: "Pending",
//       amount: "3,000",
//       date: "13-05-2023",
//     },
//     {
//       name: "Ismail Fullaty",
//       email: "ismailIbrahimFullaty@gmail.com",
//       type: "Sale",
//       status: "Pending",
//       amount: "2,000",
//       date: "03-03-2024",
//     },
//     {
//       name: "Arshad Fullaty",
//       email: "arshad@gmail.com",
//       type: "Customer",
//       status: "Closed",
//       amount: "1,000",
//       date: "02-01-2024",
//     },
//     {
//       name: "Khalifah Ibrahim",
//       email: "khalifahIbrahimFullaty@gmail.com",
//       type: "Sale",
//       status: "Pending",
//       amount: "8,200",
//       date: "06-07-2024",
//     },
//   ];
