"use client";

import { SWRConfig } from "swr";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        // Globally configures fetcher so you don't declare it in hooks
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
        revalidateOnFocus: true, // Auto-refresh data when user switches tabs back to your site
      }}
    >
      {children}
    </SWRConfig>
  );
}
