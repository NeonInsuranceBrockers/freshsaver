import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="flex flex-col items-center text-center max-w-lg mx-auto">
        <AlertTriangle
          size={64}
          className="text-accent"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mt-6 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-text-secondary mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center group">
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
}