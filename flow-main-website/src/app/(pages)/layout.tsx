"use client";

import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";
import AllContextProviders from "@/contexts/providers/AllContextProviders";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AllContextProviders>
      <div className="bg-transparent min-h-screen w-full flex flex-col items-center justify-between">
        <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-md w-full">
          <PageHeader />
        </div>

        <div className="p-0 px-4 flex-1 w-full">{children}</div>
        <div className="w-full mt-20">
          <PageFooter />
        </div>
      </div>
    </AllContextProviders>
  );
}
