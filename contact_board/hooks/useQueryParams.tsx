"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get a query parameter
  const getParam = useCallback(
    (key: string): string => {
      return searchParams.get(key) || "";
    },
    [searchParams]
  );

  // Set a single query parameter
  const setParam = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      router.push(`?${newParams.toString()}`);
    },
    [searchParams, router]
  );

  // Set multiple query parameters at once
  const setParams = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
      router.push(`?${newParams.toString()}`);
    },
    [searchParams, router]
  );

  return { getParam, setParam, setParams, searchParams };
};
