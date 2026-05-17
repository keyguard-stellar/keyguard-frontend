import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Keyguard App
        </h1>

        <p className="text-muted-foreground">
          Next.js 14 + Tailwind CSS v4 + shadcn/ui
        </p>

        <Button>
          shadcn Button Works
        </Button>
      </div>
    </main>
  );
}