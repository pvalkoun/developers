import { cn } from "@/lib/utils";

const methodStyles: Record<string, string> = {
  GET: "method-get",
  POST: "method-post",
  PUT: "method-put",
  DELETE: "method-delete",
};

export function MethodBadge({ method }: { method: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase", methodStyles[method] || "bg-muted text-muted-foreground")}>
      {method}
    </span>
  );
}
