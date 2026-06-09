import { cn } from "@/lib/utils";

/** Mock visual de un ticket cuando no hay imagen real subida. */
export function ReceiptPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full w-full flex-col gap-2.5 p-5", className)}>
      <div className="mx-auto mb-2 size-8 rounded-full bg-on-surface/10" />
      <div className="h-2 w-2/3 rounded bg-on-surface/15" />
      <div className="h-2 w-full rounded bg-on-surface/10" />
      <div className="h-2 w-5/6 rounded bg-on-surface/10" />
      <div className="h-2 w-3/4 rounded bg-on-surface/10" />
      <div className="my-2 h-px w-full bg-on-surface/10" />
      <div className="h-2 w-1/2 rounded bg-on-surface/10" />
      <div className="h-2 w-2/3 rounded bg-on-surface/10" />
      <div className="mt-auto flex items-center justify-between">
        <div className="h-2.5 w-1/3 rounded bg-on-surface/15" />
        <div className="h-4 w-1/3 rounded bg-primary/40" />
      </div>
    </div>
  );
}
