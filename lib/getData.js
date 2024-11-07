export async function getData(endpoint, dateRange, page, limit) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Construct query parameters
    const queryParams = new URLSearchParams();

    if (dateRange && dateRange.from && dateRange.to) {
      const startDate = dateRange.from.toISOString();
      const endDate = dateRange.to.toISOString();

      queryParams.append("startDate", startDate);
      queryParams.append("endDate", endDate);
    }

    // Pagination parameters
    if (page) {
      queryParams.append("page", page);
    } else {
      page = null;
    }

    if (limit) {
      queryParams.append("limit", limit);
    } else {
      limit = null;
    }

    const response = await fetch(
      `${baseUrl}/api/${endpoint}?${queryParams.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching data."); // Generic error
  }
}
