// // app/(auth)/login/page.tsx
// import React from "react";
// import Link from "next/link";
// import { Zap } from "lucide-react";
// import { LoginForm } from "@/components/auth/LoginForm.client";

// export const metadata = {
//   title: "Login | FreshSaver AI",
//   description: "Log in to your FreshSaver AI automated kitchen command center.",
// };

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
//       <div className="w-full max-w-md">
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

//         {/* Login Form (Client Component) */}
//         <LoginForm />
//       </div>
//     </div>
//   );
// }

// app/(auth)/login[[...]]/page.tsx
import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { SignIn } from "@clerk/nextjs"; // 1. Import Clerk Component

export const metadata = {
  title: "Login | FreshSaver AI",
  description: "Log in to your FreshSaver AI automated kitchen command center.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md flex flex-col items-center">
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

        {/* 2. Replace Custom Form with Clerk SignIn */}
        <SignIn routing="path" path="/login" signUpUrl="/signup" />
      </div>
    </div>
  );
}
