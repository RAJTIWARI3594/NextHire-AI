import React from "react";
import { StudentSidebar } from "@/components/student/student-sidebar";
import { StudentHeader } from "@/components/student/student-header";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Responsive Collapsible Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <StudentHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
