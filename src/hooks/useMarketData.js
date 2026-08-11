"use client";

import useSWR from "swr";
import api from "@/services/api";

const fetcher = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export default function useMarketData(endpoint) {
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
