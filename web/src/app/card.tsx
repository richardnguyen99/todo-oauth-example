"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";

import SkeletonCard from "./features/skeleton-card";
import AnonymousCard from "./features/anonymous-card";

export default function Home(): JSX.Element {
  const { isPending, error, data } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("http://localhost:7777/v1/api/users/@me"),
  });

  if (error) return <p>An error has occurred: {error.message}</p>;

  if (isPending) return <SkeletonCard />;

  return data.status === 200 ? <p>Card</p> : <AnonymousCard />;
}
