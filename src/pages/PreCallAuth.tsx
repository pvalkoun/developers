import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import { Shield, Palette, AlertTriangle, Info, Key, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const PreCallAuth = () => {
  return (
    <div className="docs-prose">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Pre-Call Authentication (CCID)</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          A standards-based REST API for verifying caller identity using <strong>IETF RFC 8224</strong> and the <strong>ATIS SHAKEN</strong> framework. 
          Pre-Call Authentication is a <strong>prerequisite</strong> for both Spoofed Call Protection and Branded Call Display to function.
        </p>
      </div>

      <Alert className="mb-8 border-primary/30 bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Required for all TruContact products.</strong> Every outbound call must be authenticated through the CCID service before 
          <Link to="/products/scp" className="text-primary hover:underline mx-1">Spoofed Call Protection</Link> or 
          <Link to="/products/bcd" className="text-primary hover:underline mx-1">Branded Call Display</Link> features can take effect. 
          Without pre-call authentication, calls will not receive STIR/SHAKEN attestation and branded content will not be displayed.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Enables SCP</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Digitally signs outbound calls so carriers can verify your identity and prevent spoofing.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-accent" />
              <span className="font-medium text-sm">Enables BCD</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Authenticated calls can carry branded content — logo, name, and call reason — to the mobile display.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Table */}
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border rounded-lg">
          <tbody>
            <tr className="border-b"><td className="py-2 px-4 font-medium text-muted-foreground w-40">Standard</td><td className="py-2 px-4">IETF RFC 8224 / ATIS SHAKEN</td></tr>
            <tr className="border-b"><td className="py-2 px-4 font-medium text-muted-foreground">Protocol</td><td className="py-2 px-4">HTTPS / REST</td></tr>
            <tr className="border-b"><td className="py-2 px-4 font-medium text-muted-foreground">Format</td><td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">application/json</code></td></tr>
            <tr className="border-b"><td className="py-2 px-4 font-medium text-muted-foreground">Auth</td><td className="py-2 px-4">API Key / IP Allowlist (CIDR)</td></tr>
            <tr className="border-b"><td className="py-2 px-4 font-medium text-muted-foreground">Version</td><td className="py-2 px-4">v6.0.1</td></tr>
            <tr><td className="py-2 px-4 font-medium text-muted-foreground">Operator</td><td className="py-2 px-4">TransUnion / Tech Enabler</td></tr>
          </tbody>
        </table>
      </div>

      {/* Base URL */}
      <h2 className="text-2xl font-semibold mb-4">Base URL</h2>
      <p className="text-sm text-muted-foreground mb-3">
        All requests must be made over HTTPS. Plain HTTP is rejected. TLS 1.2 or higher is required.
      </p>
      <CodeBlock code="https://authn.ccid.neustar.biz/ccid/authn/v2" />
      <Alert className="mt-3 mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>No sandbox environment</strong> is currently available. All test calls hit production. Coordinate with the TransUnion team before running load tests.
        </AlertDescription>
      </Alert>

      {/* Authentication */}
      <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
      <p className="text-sm text-muted-foreground mb-4">
        The CCID API supports two authentication methods. Every request must satisfy at least one. 
        <strong> Credentials are issued by TransUnion.</strong> Contact the TransUnion Tech Enabler team to obtain an API key or register IP addresses. There is no self-service onboarding.
      </p>

      <div className="space-y-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</div>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4" /> API Key — Query Parameter
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Append <code className="text-xs bg-muted px-1.5 py-0.5 rounded">apiKey=YOUR_API_KEY</code> to every request URL. The key is provisioned by TransUnion and must be kept confidential.
            </p>
            <CodeBlock code="POST /identity?apiKey=YOUR_API_KEY" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</div>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" /> Remote IP Allowlist — CIDR
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Requests from pre-registered static IPs or CIDR ranges are automatically authenticated. <strong>No <code className="text-xs bg-muted px-1.5 py-0.5 rounded">apiKey</code> parameter is needed</strong> — the source IP is the credential. IPs must be registered during provisioning.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verify Caller Identity Endpoint */}
      <h2 className="text-2xl font-semibold mb-4">Verify Caller Identity</h2>
      <div className="flex items-center gap-3 mb-4">
        <MethodBadge method="POST" />
        <code className="text-sm bg-muted px-2 py-1 rounded">/identity</code>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Submits a caller identity assertion. The service validates the calling party's telephone number against the SHAKEN framework and returns <strong>200 OK</strong> with an empty body on success.
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Full endpoint: <code className="bg-muted px-1.5 py-0.5 rounded">https://authn.ccid.neustar.biz/ccid/authn/v2/identity</code>
      </p>

      {/* Query Parameters */}
      <h3 className="text-lg font-semibold mb-3">Query Parameters</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border rounded-lg">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-2 px-4 text-left font-medium">Parameter</th>
              <th className="py-2 px-4 text-left font-medium">Type</th>
              <th className="py-2 px-4 text-left font-medium">Required</th>
              <th className="py-2 px-4 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">apiKey</code></td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4"><Badge variant="outline" className="text-xs">Optional</Badge></td>
              <td className="py-2 px-4 text-muted-foreground">Your provisioned API key. Required unless the request originates from a pre-registered IP or CIDR range.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Request Headers */}
      <h3 className="text-lg font-semibold mb-3">Request Headers</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border rounded-lg">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-2 px-4 text-left font-medium">Header</th>
              <th className="py-2 px-4 text-left font-medium">Required</th>
              <th className="py-2 px-4 text-left font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">Content-Type</code></td>
              <td className="py-2 px-4"><Badge variant="destructive" className="text-xs">Required</Badge></td>
              <td className="py-2 px-4 text-muted-foreground"><code className="text-xs">application/json</code></td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">Accept</code></td>
              <td className="py-2 px-4"><Badge variant="destructive" className="text-xs">Required</Badge></td>
              <td className="py-2 px-4 text-muted-foreground"><code className="text-xs">application/json</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Request Body */}
      <h3 className="text-lg font-semibold mb-3">Request Body</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border rounded-lg">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-2 px-4 text-left font-medium">Field</th>
              <th className="py-2 px-4 text-left font-medium">Type</th>
              <th className="py-2 px-4 text-left font-medium">Required</th>
              <th className="py-2 px-4 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">from</code></td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4"><Badge variant="destructive" className="text-xs">Required</Badge></td>
              <td className="py-2 px-4 text-muted-foreground">Calling party's telephone number in TEL URI format (RFC 3966). Example: <code className="text-xs">tel:+12232146979</code></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">to</code></td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4"><Badge variant="destructive" className="text-xs">Required</Badge></td>
              <td className="py-2 px-4 text-muted-foreground">Called party's telephone number in TEL URI format. Example: <code className="text-xs">tel:+12482989788</code></td>
            </tr>
            <tr>
              <td className="py-2 px-4"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">origid</code></td>
              <td className="py-2 px-4">string</td>
              <td className="py-2 px-4"><Badge variant="outline" className="text-xs">Optional</Badge></td>
              <td className="py-2 px-4 text-muted-foreground">Unique origination identifier for call tracing and audit logging.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* cURL Example */}
      <h3 className="text-lg font-semibold mb-3">Example Request</h3>
      <CodeBlock code={`curl --location \\
  'https://authn.ccid.neustar.biz/ccid/authn/v2/identity?apiKey=YOUR_API_KEY' \\
  --header 'Content-Type: application/json' \\
  --header 'Accept: application/json' \\
  --data '{
    "from":   "tel:+12232146979",
    "to":     "tel:+12482989788",
    "origid": "usefulenterpriseuniquenumber"
  }'`} />

      {/* Responses */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Responses</h2>

      <h3 className="text-lg font-semibold mb-3">
        <Badge className="mr-2 bg-green-600 text-white">200</Badge> OK
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Identity assertion accepted. The response body is intentionally empty — a 200 status alone confirms the assertion was accepted.
      </p>
      <CodeBlock code={`# HTTP/1.1 200 OK
# Content-Length: 0
# Body: (empty)`} />

      <h3 className="text-lg font-semibold mt-6 mb-3">
        <Badge className="mr-2 bg-yellow-600 text-white">403</Badge> Forbidden
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Returned when a required request body field is missing.
      </p>
      <CodeBlock code={`{
  "error_id":         "RequestFromHeaderRequired",
  "http_status_code": 403,
  "reason":           "From header value required",
  "timestamp":        "Thu, 2 Apr 2026 13:04:03 GMT"
}`} />
      <CodeBlock code={`{
  "error_id":         "RequestToHeaderRequired",
  "http_status_code": 403,
  "reason":           "To header value required",
  "timestamp":        "Thu, 2 Apr 2026 13:04:03 GMT"
}`} />

      <h3 className="text-lg font-semibold mt-6 mb-3">
        <Badge className="mr-2 bg-red-600 text-white">400</Badge> Bad Request
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Returned when API key authentication fails or is missing.
      </p>
      <CodeBlock code={`{
  "error_id":         "ApiKeyRequired",
  "http_status_code": 400,
  "reason":           "API key is required",
  "timestamp":        "Thu, 2 Apr 2026 13:04:03 GMT"
}`} />
      <CodeBlock code={`{
  "error_id":         "ApiKeyInvalid",
  "http_status_code": 400,
  "reason":           "API key is invalid",
  "timestamp":        "Thu, 2 Apr 2026 13:04:03 GMT"
}`} />

      {/* Error Reference */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Error Reference</h2>
      <p className="text-sm text-muted-foreground mb-4">
        All error responses share a consistent JSON structure: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{`{ "error_id", "http_status_code", "reason", "timestamp" }`}</code>
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border rounded-lg">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-2 px-4 text-left font-medium">Error ID</th>
              <th className="py-2 px-4 text-left font-medium">HTTP</th>
              <th className="py-2 px-4 text-left font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">ApiKeyRequired</code></td><td className="py-2 px-4">400</td><td className="py-2 px-4 text-muted-foreground">API key is required</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">ApiKeyInvalid</code></td><td className="py-2 px-4">400</td><td className="py-2 px-4 text-muted-foreground">API key is invalid</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">RequestFromHeaderRequired</code></td><td className="py-2 px-4">403</td><td className="py-2 px-4 text-muted-foreground">From header value required</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">RequestToHeaderRequired</code></td><td className="py-2 px-4">403</td><td className="py-2 px-4 text-muted-foreground">To header value required</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">MediaTypeException</code></td><td className="py-2 px-4">400</td><td className="py-2 px-4 text-muted-foreground">Content-Type is invalid or not supported</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">MessageParseException</code></td><td className="py-2 px-4">400</td><td className="py-2 px-4 text-muted-foreground">Error in parsing the request</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">InvalidParameterException</code></td><td className="py-2 px-4">400</td><td className="py-2 px-4 text-muted-foreground">Parameter is missing or invalid</td></tr>
            <tr className="border-b"><td className="py-2 px-4"><code className="text-xs">CustomerNotFound</code></td><td className="py-2 px-4">400</td><td className="py-2 px-4 text-muted-foreground">Customer not found</td></tr>
            <tr><td className="py-2 px-4"><code className="text-xs">InternalServerError</code></td><td className="py-2 px-4">500</td><td className="py-2 px-4 text-muted-foreground">Internal server error</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreCallAuth;
