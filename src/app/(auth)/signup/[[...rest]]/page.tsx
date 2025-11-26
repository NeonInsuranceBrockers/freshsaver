// // app/(auth)/signup/page.tsx
// import React from "react";
// import Link from "next/link";
// import { Zap } from "lucide-react";
// import { SignupForm } from "@/components/auth/SignupForm.client";

// export const metadata = {
//   title: "Sign Up | FreshSaver AI",
//   description:
//     "Create an account to start automating your kitchen and reducing food waste.",
// };

// export default function SignupPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
//       <div className="w-full max-w-lg">
//         {/* Branding */}
//         <div className="text-center mb-8">
//           <Link
//             href="/"
//             className="inline-flex items-center space-x-2 text-3xl font-bold text-blue-600 dark:text-blue-400"
//           >
//             <Zap className="w-8 h-8" />
//             <span>FreshSaver AI</span>
//           </Link>
//         </div>

//         {/* Signup Form (Client Component) */}
//         <SignupForm />
//       </div>
//     </div>
//   );
// }

// app/(auth)/signup/[[...rest]]/page.tsx
import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { SignUp } from "@clerk/nextjs"; // 1. Import Clerk Component

export const metadata = {
  title: "Sign Up | FreshSaver AI",
  description:
    "Create an account to start automating your kitchen and reducing food waste.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-3xl font-bold text-blue-600 dark:text-blue-400"
          >
            <Zap className="w-8 h-8" />
            <span>FreshSaver AI</span>
          </Link>
        </div>

        {/* 2. Replace Custom Form with Clerk SignUp */}
        <SignUp routing="path" path="/signup" signInUrl="/login" />
      </div>
    </div>
  );
}
