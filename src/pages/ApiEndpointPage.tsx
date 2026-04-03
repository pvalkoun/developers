import { useParams } from "react-router-dom";
import { getEndpointById } from "@/data/apiData";
import { endpointFieldDocs } from "@/data/apiFieldDocs";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import type { FieldDoc } from "@/data/apiFieldDocs";

function FieldTable({ title, fields }: { title: string; fields: FieldDoc[] }) {
  return (
    <>
      <h2>{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Field</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Required</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
              <th className="text-left py-2 px-3 font-semibold">Constraints</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-2 px-3 font-mono text-xs">{f.path}</td>
                <td className="py-2 px-3">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {f.type}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {f.required ? (
                    <span className="text-xs font-semibold text-destructive">Required</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Optional</span>
                  )}
                </td>
                <td className="py-2 px-3 text-muted-foreground">{f.description}</td>
                <td className="py-2 px-3 text-xs text-muted-foreground">{f.constraints || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ApiEndpointPage() {
  const { endpointId } = useParams<{ endpointId: string }>();
  const endpoint = getEndpointById(endpointId || "");
  const fieldDocs = endpointFieldDocs[endpointId || ""];

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

      {fieldDocs?.pathParams && fieldDocs.pathParams.length > 0 && (
        <FieldTable title="Path Parameters" fields={fieldDocs.pathParams} />
      )}

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

      {fieldDocs?.requestFields && fieldDocs.requestFields.length > 0 && (
        <FieldTable title="Request Fields" fields={fieldDocs.requestFields} />
      )}

      {endpoint.requestBody && (
        <>
          <h2>Request Body Example</h2>
          <CodeBlock code={endpoint.requestBody} title="JSON" language="json" />
        </>
      )}

      {fieldDocs?.responseFields && fieldDocs.responseFields.length > 0 && (
        <FieldTable title="Response Fields" fields={fieldDocs.responseFields} />
      )}

      {endpoint.responseBody && (
        <>
          <h2>Response Example</h2>
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
