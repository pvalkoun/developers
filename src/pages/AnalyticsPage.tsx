import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";

const BASE_URL_PROD = "https://api-rst.ccid.neustar.biz/ccid/analytics/v1";
const BASE_URL_UAT = "https://api-uat-rst.ccid.neustar.biz/ccid/analytics/v1";
const LOGIN_PROD = "https://api-rst.ccid.neustar.biz/ccid/aam/v1/login";
const LOGIN_UAT = "https://api-uat-rst.ccid.neustar.biz/ccid/aam/v1/login";

const singleTnResponse = `{
  "tn": "+12025551234",
  "account_id": "acct-001",
  "services": {
    "bcd": [
      {
        "bcd_name": "My Campaign",
        "type": "rich",
        "service_providers": [
          {
            "service_provider_name": "att",
            "count": 1500,
            "answer_rate": 0.72,
            "average_duration": 185.3
          }
        ]
      }
    ],
    "scp": {
      "signed": 4200,
      "service_providers": [
        {
          "service_provider_name": "verizon",
          "deposited": 4200,
          "authenticated": 3900,
          "blocked": 12
        }
      ]
    }
  },
  "request_params": {
    "start_time": "2026-04-01T00:00:00Z",
    "end_time": "2026-04-01T23:59:59Z",
    "service": "bcd"
  }
}`;

const allTnsResponse = `{
  "items": [
    {
      "tn": "+12025551234",
      "account_id": "acct-001",
      "services": {
        "bcd": [
          {
            "bcd_name": "My Campaign",
            "type": "rich",
            "service_providers": [
              {
                "service_provider_name": "att",
                "count": 1500,
                "answer_rate": 0.72,
                "average_duration": 185.3
              }
            ]
          }
        ]
      }
    }
  ],
  "request_params": {
    "start_time": "2026-04-01T00:00:00Z",
    "end_time": "2026-04-01T23:59:59Z",
    "service": "bcd"
  }
}`;

const errorResponse = `{
  "error_code": "INVALID_TIME_RANGE",
  "message": "start_time must be 00:00:00Z and end_time must be 23:59:59Z in UTC",
  "details": {}
}`;

interface ParamRow {
  name: string;
  location: string;
  type: string;
  required: boolean;
  description: string;
}

function ParamTable({ title, params }: { title: string; params: ParamRow[] }) {
  return (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Name</th>
              <th className="text-left py-2 px-3 font-semibold">In</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Required</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-2 px-3 font-mono text-xs">{p.name}</td>
                <td className="py-2 px-3 text-xs">{p.location}</td>
                <td className="py-2 px-3">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {p.type}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {p.required ? (
                    <span className="text-xs font-semibold text-destructive">Required</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Optional</span>
                  )}
                </td>
                <td className="py-2 px-3 text-muted-foreground">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const singleTnParams: ParamRow[] = [
  { name: "account_id", location: "path", type: "string", required: true, description: "Unique account identifier." },
  { name: "tn", location: "query", type: "string", required: true, description: "Telephone number in E.164 format (e.g. +12025551234)." },
  { name: "service", location: "query", type: "string", required: true, description: 'Service type: "bcd" or "scp".' },
  { name: "start_time", location: "query", type: "date-time", required: true, description: "Start of analytics window. Must be 00:00:00Z (full UTC day start)." },
  { name: "end_time", location: "query", type: "date-time", required: true, description: "End of analytics window. Must be 23:59:59Z (full UTC day end)." },
];

const allTnsParams: ParamRow[] = [
  { name: "account_id", location: "path", type: "string", required: true, description: "Unique account identifier." },
  { name: "service", location: "query", type: "string", required: true, description: 'Service type: "bcd" or "scp".' },
  { name: "start_time", location: "query", type: "date-time", required: true, description: "Start of analytics window. Must be 00:00:00Z (full UTC day start)." },
  { name: "end_time", location: "query", type: "date-time", required: true, description: "End of analytics window. Must be 23:59:59Z (full UTC day end)." },
  { name: "X-Cursor", location: "header", type: "string", required: false, description: "Cursor token for pagination. Omit for first page." },
  { name: "X-Page-Size", location: "header", type: "integer", required: false, description: "Number of TN records per page. Default: 10,000. Max: 20,000." },
  { name: "Accept-Encoding", location: "header", type: "string", required: false, description: 'Set to "gzip" to receive compressed responses.' },
];

export default function AnalyticsPage() {
  return (
    <div className="docs-prose">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Analytics API</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          The Analytics API provides visibility into call performance metrics across your TruContact services.
          Query per-TN or account-wide analytics for Branded Call Display (BCD) and Spoofed Call Protection (SCP),
          including answer rates, call durations, signing volumes, and per-carrier breakdowns.
        </p>
      </div>

      {/* Key concepts */}
      <h2>Key Concepts</h2>
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm mb-1">Time Range Enforcement</h3>
          <p className="text-sm text-muted-foreground">
            All queries must align to full UTC day boundaries. <code>start_time</code> must end in <code>T00:00:00Z</code> and <code>end_time</code> must end in <code>T23:59:59Z</code>. Partial-day or non-UTC timestamps are rejected with HTTP 400.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm mb-1">Cursor-Based Pagination</h3>
          <p className="text-sm text-muted-foreground">
            The multi-TN endpoint returns paginated results. Use the <code>X-Next-Cursor</code> response header to fetch subsequent pages. Default page size is 10,000; maximum is 20,000.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm mb-1">Gzip Compression</h3>
          <p className="text-sm text-muted-foreground">
            The TNs (list) endpoint supports gzip-compressed responses. Include <code>Accept-Encoding: gzip</code> in your request headers.
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold text-sm mb-1">JWT Authentication</h3>
          <p className="text-sm text-muted-foreground">
            All requests require a Bearer JWT token. Obtain one via the login endpoint before calling any analytics API.
          </p>
        </div>
      </div>

      {/* Environments */}
      <h2>Base URLs</h2>
      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-semibold">Environment</th>
            <th className="text-left py-2 px-3 font-semibold">Analytics Base URL</th>
            <th className="text-left py-2 px-3 font-semibold">Login Endpoint</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Production</td>
            <td className="py-2 px-3 font-mono text-xs">{BASE_URL_PROD}</td>
            <td className="py-2 px-3 font-mono text-xs">{LOGIN_PROD}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">UAT</td>
            <td className="py-2 px-3 font-mono text-xs">{BASE_URL_UAT}</td>
            <td className="py-2 px-3 font-mono text-xs">{LOGIN_UAT}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Endpoint 1: Single TN ── */}
      <div className="border-t pt-8 mt-8">
        <div className="flex items-center gap-3 mb-2">
          <MethodBadge method="GET" />
          <h2 className="!mb-0 !mt-0 text-xl font-bold">Single TN Analytics</h2>
        </div>
        <div className="mb-4 p-3 rounded-lg bg-muted font-mono text-sm">
          <span className="font-bold mr-2">GET</span>
          /accounts/{"{account_id}"}/tn
        </div>
        <p>
          Returns analytics metrics for a single telephone number. Use the <code>service</code> parameter to select BCD or SCP metrics. For BCD, the response includes per-campaign answer rates and average call durations broken down by carrier. For SCP, it returns signing counts and authentication/block statistics per carrier.
        </p>

        <ParamTable title="Parameters" params={singleTnParams} />

        <h3 className="text-lg font-semibold mt-6 mb-2">Response — 200 OK</h3>
        <CodeBlock code={singleTnResponse} title="Response" language="json" />
      </div>

      {/* ── Endpoint 2: All TNs ── */}
      <div className="border-t pt-8 mt-8">
        <div className="flex items-center gap-3 mb-2">
          <MethodBadge method="GET" />
          <h2 className="!mb-0 !mt-0 text-xl font-bold">Paginated TN Analytics List</h2>
        </div>
        <div className="mb-4 p-3 rounded-lg bg-muted font-mono text-sm">
          <span className="font-bold mr-2">GET</span>
          /accounts/{"{account_id}"}/tns
        </div>
        <p>
          Returns a cursor-paginated list of TN analytics for an entire account. Supports gzip compression for large result sets. Pagination headers (<code>X-Next-Cursor</code>, <code>X-Total-Count</code>) are included in the response.
        </p>

        <ParamTable title="Parameters" params={allTnsParams} />

        <h3 className="text-lg font-semibold mt-6 mb-2">Response Headers</h3>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Header</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono text-xs">X-Next-Cursor</td>
              <td className="py-2 px-3 text-muted-foreground">Cursor for the next page of results. Absent on the last page.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono text-xs">X-Total-Count</td>
              <td className="py-2 px-3 text-muted-foreground">Total number of matching TN records.</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono text-xs">Content-Encoding</td>
              <td className="py-2 px-3 text-muted-foreground">Set to "gzip" when compression is applied.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold mt-6 mb-2">Response — 200 OK</h3>
        <CodeBlock code={allTnsResponse} title="Response" language="json" />
      </div>

      {/* ── Error Response ── */}
      <div className="border-t pt-8 mt-8">
        <h2>Error Response — 400 Bad Request</h2>
        <p>
          Returned when <code>start_time</code> or <code>end_time</code> violates the UTC full-day boundary requirement.
        </p>
        <CodeBlock code={errorResponse} title="Error Response" language="json" />
      </div>

      {/* ── BCD Metrics ── */}
      <div className="border-t pt-8 mt-8">
        <h2>Response Schema Reference</h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">BCD Service Metrics</h3>
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Field</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">bcd_name</td><td className="py-2 px-3 text-xs">string</td><td className="py-2 px-3 text-muted-foreground">Campaign or caller profile name</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">type</td><td className="py-2 px-3 text-xs">string</td><td className="py-2 px-3 text-muted-foreground">BCD type (e.g. "rich", "basic")</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].service_provider_name</td><td className="py-2 px-3 text-xs">string</td><td className="py-2 px-3 text-muted-foreground">Carrier name</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].count</td><td className="py-2 px-3 text-xs">integer</td><td className="py-2 px-3 text-muted-foreground">Total call count</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].answer_rate</td><td className="py-2 px-3 text-xs">number</td><td className="py-2 px-3 text-muted-foreground">Ratio of answered calls (0–1)</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].average_duration</td><td className="py-2 px-3 text-xs">number</td><td className="py-2 px-3 text-muted-foreground">Average call duration in seconds</td></tr>
          </tbody>
        </table>

        <h3 className="text-lg font-semibold mt-4 mb-2">SCP Service Metrics</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Field</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">signed</td><td className="py-2 px-3 text-xs">integer</td><td className="py-2 px-3 text-muted-foreground">Total calls signed</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].service_provider_name</td><td className="py-2 px-3 text-xs">string</td><td className="py-2 px-3 text-muted-foreground">Carrier name</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].deposited</td><td className="py-2 px-3 text-xs">integer</td><td className="py-2 px-3 text-muted-foreground">Calls deposited at the carrier</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].authenticated</td><td className="py-2 px-3 text-xs">integer</td><td className="py-2 px-3 text-muted-foreground">Calls successfully authenticated</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono text-xs">service_providers[].blocked</td><td className="py-2 px-3 text-xs">integer</td><td className="py-2 px-3 text-muted-foreground">Calls blocked by the carrier</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
