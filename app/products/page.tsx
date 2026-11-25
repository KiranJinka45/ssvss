"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/collections/all");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-loom-stone text-xs">
      Redirecting to Collections...
    </div>
  );
}
