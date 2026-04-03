import { useParams } from "react-router-dom";
import { getEndpointById } from "@/data/apiData";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";

export default function ApiEndpointPage() {
  const { endpointId } = useParams<{ endpointId: string }>();
  const endpoint = getEndpointById(endpointId || "");

  if (!endpoint) return <div className="docs-prose"><h1>Endpoint not found</h1></div>;

  return (
    <div className="docs-prose">
      <div className="flex items-center gap-3 mb-2">
        <MethodBadge method={endpoint.method} />
        <h1 className="!mb-0 !mt-0">{endpoint.name}</h1>
      </div>

      <div className="mb-6 p-3 rounded-lg bg-muted font-mono text-sm">
        <span className="font-bold mr-2">{endpoint.method}</span>
        {endpoint.path}
      </div>

      <p>{endpoint.description}</p>

      {endpoint.headers && endpoint.headers.length > 0 && (
        <>
          <h2>Headers</h2>
          <table>
            <thead>
              <tr>
                <th>Header</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Authorization</code></td>
                <td><code>Bearer {'{{accessToken}}'}</code></td>
              </tr>
              {endpoint.headers.map((h, i) => (
                <tr key={i}>
                  <td><code>{h.key}</code></td>
                  <td><code>{h.value}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {endpoint.requestBody && (
        <>
          <h2>Request Body</h2>
          <CodeBlock code={endpoint.requestBody} title="JSON" language="json" />
        </>
      )}

      {endpoint.responseBody && (
        <>
          <h2>Response</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
              {endpoint.responseStatus}
            </span>
            <span className="text-sm text-muted-foreground">
              {endpoint.responseStatus === 200 ? "OK" : endpoint.responseStatus === 201 ? "Created" : endpoint.responseStatus === 204 ? "No Content" : "Success"}
            </span>
          </div>
          <CodeBlock code={endpoint.responseBody} title="Response" language="json" />
        </>
      )}

      {endpoint.responseStatus === 204 && !endpoint.responseBody && (
        <>
          <h2>Response</h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
              204
            </span>
            <span className="text-sm text-muted-foreground">No Content — the resource was successfully deleted.</span>
          </div>
        </>
      )}
    </div>
  );
}
