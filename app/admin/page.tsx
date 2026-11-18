import React from "react";
import { AdminConsole } from "@/components/admin/AdminConsole";

export const metadata = {
  title: "Admin Console | SSVSS Silk Looms",
  description:
    "Founder and artisan admin portal for saree management, inventory status, media uploads, and catalog publishing.",
};

export default function AdminPage() {
  return <AdminConsole />;
}
