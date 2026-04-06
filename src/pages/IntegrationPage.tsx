import { useParams } from "react-router-dom";
import { getIntegration } from "@/data/integrationData";
import { CodeBlock } from "@/components/CodeBlock";

export default function IntegrationPage() {
  const { integrationId } = useParams<{ integrationId: string }>();
  const integration = getIntegration(integrationId || "");

  if (!integration) return <div className="docs-prose"><h1>Integration not found</h1></div>;

  return (
    <div className="docs-prose">
      <h1>{integration.name}</h1>
      <p className="text-lg text-muted-foreground">{integration.description}</p>

      {integration.sections.map((section, i) => (
        <div key={i}>
          <h2>{section.title}</h2>
          {section.content.split("\n").map((line, j) => {
            if (line.startsWith("- ")) {
              return <li key={j} className="ml-4">{formatInlineMarkdown(line.slice(2))}</li>;
            }
            if (line.startsWith("| ") || line.startsWith("|---")) {
              return null; // tables handled separately
            }
            if (line.trim() === "") return null;
            return <p key={j}>{formatInlineMarkdown(line)}</p>;
          })}

          {/* Render tables */}
          {section.content.includes("|") && renderTable(section.content)}

          {section.code && (
            <CodeBlock code={section.code} language={section.language || "text"} title={section.language?.toUpperCase() || "Code"} />
          )}

          {/* Render images */}
          {section.images && section.images.length > 0 && (
            <div className="my-6 space-y-4">
              {section.images.map((image, imgIdx) => (
                <figure key={imgIdx} className="rounded-lg border border-border overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full"
                    loading="lazy"
                  />
                  {image.caption && (
                    <figcaption className="px-4 py-2 text-sm text-muted-foreground bg-muted/50 border-t border-border">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderTable(content: string) {
  const lines = content.split("\n").filter(l => l.startsWith("|"));
  if (lines.length < 2) return null;

  const parseRow = (line: string) => line.split("|").filter(c => c.trim()).map(c => c.trim());
  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);

  return (
    <table>
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
