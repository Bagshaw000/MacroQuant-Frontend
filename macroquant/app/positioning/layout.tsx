"use client";

import Header from "@/component/header";

export default function PositioningLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="px-5 py-5 font-mono">{children}</div>
    </div>
  );
}
