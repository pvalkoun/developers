import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PreCallAuth = () => {
  return (
    <div className="docs-prose">
      <div className="flex items-center gap-3 mb-2">
        <MethodBadge method="POST" />
        <h1 className="!mb-0 !mt-0">Call Authentication (CCID)</h1>
      </div>

      <div className="mb-6 p-3 rounded-lg bg-muted font-mono text-sm">
        <span className="font-bold mr-2">POST</span>
        /ccid/authn/v2/identity
      </div>

      <p>
        A standards-based REST API for verifying caller identity using <strong>IETF RFC 8224</strong> and the <strong>ATIS SHAKEN</strong> framework. 
        Pre-Call Authentication is a <strong>prerequisite</strong> for both Spoofed Call Protection and Branded Call Display to function.
      </p>

      <div className="flex items-start gap-3 p-4 mb-6 rounded-lg border border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent-foreground mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm mb-2 !mt-0">Required for all TruContact products</p>
          <p className="text-sm !mb-0">
            Every outbound call must be authenticated through the CCID service before{" "}
            <Link to="/products/scp" className="text-primary hover:underline">Spoofed Call Protection</Link> or{" "}
            <Link to="/products/bcd" className="text-primary hover:underline">Branded Call Display</Link> features can take effect. 
            Without pre-call authentication, calls will not receive STIR/SHAKEN attestation and branded content will not be displayed.
          </p>
        </div>
      </div>

      <h2>Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Property</th>
              <th className="text-left py-2 px-3 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">Standard</td><td className="py-2 px-3 text-muted-foreground">IETF RFC 8224 / ATIS SHAKEN</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">Protocol</td><td className="py-2 px-3 text-muted-foreground">HTTPS / REST</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">Format</td><td className="py-2 px-3 text-muted-foreground"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">application/json</span></td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">Auth</td><td className="py-2 px-3 text-muted-foreground">API Key / IP Allowlist (CIDR)</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">Version</td><td className="py-2 px-3 text-muted-foreground">v6.0.1</td></tr>
            <tr className="border-b last:border-b-0"><td className="py-2 px-3 font-mono text-xs">Operator</td><td className="py-2 px-3 text-muted-foreground">TransUnion / Tech Enabler</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Base URL</h2>
      <p>All requests must be made over HTTPS. Plain HTTP is rejected. TLS 1.2 or higher is required.</p>
      <CodeBlock code="https://authn.ccid.neustar.biz/ccid/authn/v2" />

      <div className="flex items-start gap-3 p-4 my-4 rounded-lg border border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent-foreground mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm mb-1 !mt-0">No sandbox environment</p>
          <p className="text-sm text-muted-foreground !mb-0">
            All test calls hit production. Coordinate with the TransUnion team before running load tests.
          </p>
        </div>
      </div>

      <h2>Authentication</h2>
      <p>
        The CCID API supports two authentication methods. Every request must satisfy at least one. 
        Credentials are issued by TransUnion — contact the Tech Enabler team to obtain an API key or register IP addresses. There is no self-service onboarding.
      </p>

      <h3>1. API Key — Query Parameter</h3>
      <p>
        Append <code>apiKey=YOUR_API_KEY</code> to every request URL. The key is provisioned by TransUnion and must be kept confidential.
      </p>
      <CodeBlock code="POST /identity?apiKey=YOUR_API_KEY" />

      <h3>2. Remote IP Allowlist — CIDR</h3>
      <p>
        Requests from pre-registered static IPs or CIDR ranges are automatically authenticated. No <code>apiKey</code> parameter is needed — the source IP is the credential. IPs must be registered during provisioning.
      </p>

      <h2>Query Parameters</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Field</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Required</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b last:border-b-0">
              <td className="py-2 px-3 font-mono text-xs">apiKey</td>
              <td className="py-2 px-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">string</span></td>
              <td className="py-2 px-3"><span className="text-xs text-muted-foreground">Optional</span></td>
              <td className="py-2 px-3 text-muted-foreground">Your provisioned API key. Required unless the request originates from a pre-registered IP or CIDR range.</td>
            </tr>
          </tbody>
        </table>
      </div>

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
            <td><code>Content-Type</code></td>
            <td><code>application/json</code></td>
          </tr>
          <tr>
            <td><code>Accept</code></td>
            <td><code>application/json</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Request Fields</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Field</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Required</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono text-xs">from</td>
              <td className="py-2 px-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">string</span></td>
              <td className="py-2 px-3"><span className="text-xs font-semibold text-destructive">Required</span></td>
              <td className="py-2 px-3 text-muted-foreground">Calling party's telephone number in TEL URI format (RFC 3966). Example: <code>tel:+12232146979</code></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono text-xs">to</td>
              <td className="py-2 px-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">string</span></td>
              <td className="py-2 px-3"><span className="text-xs font-semibold text-destructive">Required</span></td>
              <td className="py-2 px-3 text-muted-foreground">Called party's telephone number in TEL URI format. Example: <code>tel:+12482989788</code></td>
            </tr>
            <tr className="border-b last:border-b-0">
              <td className="py-2 px-3 font-mono text-xs">origid</td>
              <td className="py-2 px-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">string</span></td>
              <td className="py-2 px-3"><span className="text-xs text-muted-foreground">Optional</span></td>
              <td className="py-2 px-3 text-muted-foreground">Unique origination identifier for call tracing and audit logging.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Request Body Example</h2>
      <CodeBlock code={`curl --location \\
  'https://authn.ccid.neustar.biz/ccid/authn/v2/identity?apiKey=YOUR_API_KEY' \\
  --header 'Content-Type: application/json' \\
  --header 'Accept: application/json' \\
  --data '{
    "from":   "tel:+12232146979",
    "to":     "tel:+12482989788",
    "origid": "usefulenterpriseuniquenumber"
  }'`} title="cURL" />

      <h2>Response Example</h2>
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
          200
        </span>
        <span className="text-sm text-muted-foreground">OK</span>
      </div>
      <p>
        Identity assertion accepted. The response body is intentionally empty — a 200 status alone confirms the assertion was accepted.
      </p>
      <CodeBlock code={`# HTTP/1.1 200 OK
# Content-Length: 0
# Body: (empty)`} />

      <h2>Error Response</h2>
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
          403
        </span>
        <span className="text-sm text-muted-foreground">Forbidden</span>
      </div>
      <p>Returned when a required request body field is missing.</p>
      <CodeBlock code={`{
  "error_id":         "RequestFromHeaderRequired",
  "http_status_code": 403,
  "reason":           "From header value required",
  "timestamp":        "Thu, 2 Apr 2026 13:04:03 GMT"
}`} title="Error Response" language="json" />

      <div className="flex items-center gap-2 mb-2 mt-6">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
          400
        </span>
        <span className="text-sm text-muted-foreground">Bad Request</span>
      </div>
      <p>Returned when API key authentication fails or is missing.</p>
      <CodeBlock code={`{
  "error_id":         "ApiKeyRequired",
  "http_status_code": 400,
  "reason":           "API key is required",
  "timestamp":        "Thu, 2 Apr 2026 13:04:03 GMT"
}`} title="Error Response" language="json" />

      <h2>Error Reference</h2>
      <p>
        All error responses share a consistent JSON structure: <code>{`{ "error_id", "http_status_code", "reason", "timestamp" }`}</code>
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Error ID</th>
              <th className="text-left py-2 px-3 font-semibold">HTTP</th>
              <th className="text-left py-2 px-3 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">ApiKeyRequired</td><td className="py-2 px-3 text-muted-foreground">400</td><td className="py-2 px-3 text-muted-foreground">API key is required</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">ApiKeyInvalid</td><td className="py-2 px-3 text-muted-foreground">400</td><td className="py-2 px-3 text-muted-foreground">API key is invalid</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">RequestFromHeaderRequired</td><td className="py-2 px-3 text-muted-foreground">403</td><td className="py-2 px-3 text-muted-foreground">From header value required</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">RequestToHeaderRequired</td><td className="py-2 px-3 text-muted-foreground">403</td><td className="py-2 px-3 text-muted-foreground">To header value required</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">MediaTypeException</td><td className="py-2 px-3 text-muted-foreground">400</td><td className="py-2 px-3 text-muted-foreground">Content-Type is invalid or not supported</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">MessageParseException</td><td className="py-2 px-3 text-muted-foreground">400</td><td className="py-2 px-3 text-muted-foreground">Error in parsing the request</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">InvalidParameterException</td><td className="py-2 px-3 text-muted-foreground">400</td><td className="py-2 px-3 text-muted-foreground">Parameter is missing or invalid</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">CustomerNotFound</td><td className="py-2 px-3 text-muted-foreground">400</td><td className="py-2 px-3 text-muted-foreground">Customer not found</td></tr>
            <tr className="border-b last:border-b-0"><td className="py-2 px-3 font-mono text-xs">InternalServerError</td><td className="py-2 px-3 text-muted-foreground">500</td><td className="py-2 px-3 text-muted-foreground">Internal server error</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreCallAuth;