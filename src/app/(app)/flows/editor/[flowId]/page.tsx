// /app/(app)/flows/editor/[flowId]/page.tsx

// 1. This is a Server Component again (no "use client" directive)
import FlowLoader from "./FlowLoader"; // Import the new client component

// 2. The component is async, as is standard for Server Components
export default async function FlowEditorPage({
  params,
}: {
  // The params prop is a Promise, as the warning suggested
  params: Promise<{ flowId: string }>;
}) {
  // 3. We await the params to get the flowId on the server
  const { flowId } = await params;

  // return <div className="bg-red-500 flex-1 w-full">hey there</div>;

  // 4. Its only job is to render the Client Component and pass the flowId as a prop.
  // All the complex data fetching and state logic is now delegated to FlowLoader.
  return <FlowLoader flowId={flowId} />;
}
