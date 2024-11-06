import { Flex, Spinner } from "@radix-ui/themes";
import React from "react";

export default function LoadingSpinner() {
  return (
    <Flex align="center" justify="center">
      <Spinner size="3" className="text-black dark:text-white" />
    </Flex>
  );
}
