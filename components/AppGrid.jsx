"use client";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import ImageSlider from "./ImageSlider";
import { getData } from "@/lib/getData";
import { useRouter } from "next/navigation";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
export function AppGrid() {

  // Fetch initial data on mount and on pagination change
  const [items, setItems] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Handle route navigation
  const handleRouteNavigation = (route) => {
    router.push(route);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dbItems = await getData("items");
        setItems(dbItems["data"]);
      } catch (error) {
        console.error("Error fetching Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(items);
  return (
    
    <section id="designs">
      <BentoGrid className="max-w-4xl mx-auto py-10 md:py-20 z-10">
        {items.map(({ id, title, notes, imageUrls }) => (
          <BentoGridItem
            className="cursor-pointer"
            key={id}
            handleClick={() => handleRouteNavigation(`/dashboard/items/${id}`)}
            title={title}
            description={notes}
            header={
              imageUrls && imageUrls !== "" && imageUrls.length > 0 ? (
                <ImageSlider imageUrls={imageUrls} />
              ) : (
                <Skeleton />
              )
            }
          />
        ))}
      </BentoGrid>
    </section>
  );
}
