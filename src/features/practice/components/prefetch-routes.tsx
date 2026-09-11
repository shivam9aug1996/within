"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "../lib/routes";

export function PrefetchRoutes() {
  const router = useRouter();
  useEffect(() => {
    for (const href of APP_ROUTES) router.prefetch(href);
  }, [router]);
  return null;
}
