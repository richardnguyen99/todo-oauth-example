"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";

import SkeletonCard from "./features/skeleton-card";
import AnonymousCard from "./features/anonymous-card";
import AuthenticatedCard from "./features/authenticated-card";

export default function Home(): JSX.Element {
  const { isPending, error, data } = useQuery({
    queryKey: ["@me"],
    queryFn: () =>
      fetch("http://localhost:7777/v1/api/users/@me", {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (error) return <p>An error has occurred: {error.message}</p>;

  if (isPending) return <SkeletonCard />;

  return data.statusCode === 200 ? (
    <AuthenticatedCard
      user={{
        id: data.data._id,
        username: data.data.username,
        email: data.data.email,
        profilePicture: data.data.avatar,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
        verified: true,
      }}
    />
  ) : (
    <AnonymousCard />
  );
}
