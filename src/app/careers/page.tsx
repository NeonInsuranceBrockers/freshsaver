import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-primary">Join Our Team</h1>
        <p className="text-xl text-muted-foreground">
          Help us build the future of sustainable kitchen management.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-foreground">Senior Full Stack Engineer</h3>
            <p className="text-muted-foreground">Remote • Engineering</p>
          </div>
          <Button asChild>
            <Link href="/contact">Apply Now</Link>
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-foreground">AI Research Scientist</h3>
            <p className="text-muted-foreground">Remote • Research</p>
          </div>
          <Button asChild>
            <Link href="/contact">Apply Now</Link>
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center shadow-sm">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-foreground">Product Designer</h3>
            <p className="text-muted-foreground">Remote • Design</p>
          </div>
          <Button asChild>
            <Link href="/contact">Apply Now</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Don&apos;t see a role that fits? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> anyway!
        </p>
      </div>
    </div>
  );
}
