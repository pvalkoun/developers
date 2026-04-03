import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

function highlightJson(code: string): React.ReactNode[] {
  // Postman-style JSON syntax highlighting
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      // Match JSON key (quoted string followed by colon)
      const keyMatch = remaining.match(/^(\s*)"([^"]+)"(\s*:\s*)/);
      if (keyMatch) {
        parts.push(<span key={key++}>{keyMatch[1]}</span>);
        parts.push(<span key={key++} className="code-key">"{keyMatch[2]}"</span>);
        parts.push(<span key={key++}>{keyMatch[3]}</span>);
        remaining = remaining.slice(keyMatch[0].length);
        continue;
      }

      // Match string value
      const strMatch = remaining.match(/^"([^"]*)"/);
      if (strMatch) {
        parts.push(<span key={key++} className="code-string">"{strMatch[1]}"</span>);
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Match number
      const numMatch = remaining.match(/^(-?\d+\.?\d*)/);
      if (numMatch) {
        parts.push(<span key={key++} className="code-number">{numMatch[1]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Match boolean/null
      const boolMatch = remaining.match(/^(true|false|null)/);
      if (boolMatch) {
        parts.push(<span key={key++} className="code-boolean">{boolMatch[1]}</span>);
        remaining = remaining.slice(boolMatch[0].length);
        continue;
      }

      // Everything else (brackets, commas, whitespace)
      parts.push(<span key={key++} className="code-punctuation">{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }

    return (
      <span key={i}>
        {parts}
        {i < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

export function CodeBlock({ code, language = "json", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = useMemo(() => {
    if (language === "json") return highlightJson(code);
    return [code];
  }, [code, language]);

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
      <div className="code-block group relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code>{highlighted}</code>
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
