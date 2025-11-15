// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...
"use client";
// import { ProgressProvider } from "@bprogress/next/app";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { AppProgressProvider  } from "@bprogress/next";
// AppProgressProvider

// import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider>
      {children}
      {/* <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: true }}
        shallowRouting
      /> */}
    </ProgressProvider>
  );
};

export default Providers;
