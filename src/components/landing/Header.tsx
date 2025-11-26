// components/landing/Header.tsx
import Link from "next/link";
import React from "react";
import { Zap, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { HeaderClient } from "./HeaderClient";

/**
 * Header Component for the Landing Page.
 * Server Component that checks auth and passes to client component.
 */
export const Header: React.FC = async () => {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return <HeaderClient isSignedIn={isSignedIn} />;
};
