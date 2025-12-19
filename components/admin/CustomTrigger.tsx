"use client";
import { List } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="p-2 bg-teal-100 rounded-lg ml-3 z-50 fixed top-0">
      <List
        onClick={toggleSidebar}
        className="cursor-pointer w-5 h-5 text-teal-700"
      />
    </div>
  );
}
