import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "json", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border my-4">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}
      {!title && (
        <div className="absolute right-2 top-2 z-10">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      )}
      <div className="code-block group relative">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-[hsl(210_14%_83%)]">{code}</code>
        </pre>
        {!title && (
          <div className="absolute right-2 top-2">
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 text-[hsl(210_14%_73%)] hover:text-[hsl(210_14%_93%)] bg-[hsl(220_13%_24%)] hover:bg-[hsl(220_13%_28%)]">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
