export interface ApiEndpoint {
  id: string;
  category: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  responseStatus?: number;
  headers?: { key: string; value: string }[];
  product?: ("scp" | "bcd" | "common")[];
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "auth-token",
    category: "Authentication",
    name: "Create Auth Token",
    method: "POST",
    path: "/ccid/aam/v1/login",
    description: "Authenticate with the TCS platform to obtain an access token. This token is required for all subsequent API calls.",
    requestBody: JSON.stringify({ userId: "{{userId}}", password: "{{password}}" }, null, 2),
    responseBody: JSON.stringify({
      status: "success",
      message: "Login is successful",
      accessToken: "eyJhbGciOiJSUzI1NiIs...",
      refreshToken: "eyJhbGciOiJIUzUxMiIs..."
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "create-account",
    category: "Account Management",
    name: "Create Account",
    method: "POST",
    path: "/ccid/aam/v2/admin/account",
    description: "Create a new enterprise account. This is the first step after authentication to set up your organization on the TCS platform.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: JSON.stringify({
      name: "Enterprise Account",
      type: "ENTERPRISE",
      status: "ACTIVE",
      relationship: "DIRECT",
      parent_account: ["{{parentAccountId}}"],
      billing: { id: "billing-id", model: "TRANSACTION", frequency: "MONTHLY" },
      service: [{ type: "SDPR" }],
      child_account_enabled: false,
      start_date: "Fri, 4 Apr 2025 18:18:49 GMT",
      end_date: "Sat, 4 Apr 2026 18:18:49 GMT",
      application: ["CCID", "TCS"]
    }, null, 2),
    responseBody: JSON.stringify({
      id: "xi0vhua3b4",
      name: "Enterprise Account",
      type: "ENTERPRISE",
      status: "ACTIVE",
      relationship: "DIRECT",
      service: [{ type: "SDPR", id: "xi0vhua3b4" }],
      created_by: "api_user",
      created_date: "Mon, 23 Mar 2026 16:42:42 GMT"
    }, null, 2),
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "get-account",
    category: "Account Management",
    name: "Get Account",
    method: "GET",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Retrieve details of a specific account by its ID.",
    responseBody: JSON.stringify({
      id: "xeb9ekoawz",
      name: "Enterprise Account",
      type: "ENTERPRISE",
      status: "ACTIVE",
      service: [{ type: "SDPR", id: "xeb9ekoawz" }],
      contact: [{ first_name: "John", last_name: "Doe", email: "john@example.com", type: "PRIMARY" }],
      vetting: { status: "PREVETTED" }
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "attach-account-tcs",
    category: "Account TCS",
    name: "Attach Account TCS",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tcs",
    description: "Attach TCS (Trusted Call Solutions) configuration to an account. This enables the account for call branding and protection services.",
    requestBody: JSON.stringify({
      distributor: [{ name: "ATT", status: "ACTIVE" }, { name: "TMOBILE", status: "ACTIVE" }, { name: "USCC", status: "ACTIVE" }],
      lead_gen: true
    }, null, 2),
    responseBody: JSON.stringify({
      account_id: "xeb9ekoawz",
      distributor: [{ name: "ATT", status: "ACTIVE" }, { name: "TMOBILE", status: "ACTIVE" }],
      lead_gen: true
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-account-tcs",
    category: "Account TCS",
    name: "Get Account TCS",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tcs",
    description: "Retrieve the TCS configuration for an account.",
    responseBody: JSON.stringify({
      account_id: "xeb9ekoawz",
      distributor: [{ name: "ATT", status: "ACTIVE" }],
      lead_gen: true
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "attach-feature-scp",
    category: "Features",
    name: "Attach SCP Feature",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Attach a Spoofed Call Protection (SCP) feature to the account. This enables digital signing of outbound calls.",
    requestBody: JSON.stringify({
      type: "SCP",
      ocn_prefix: "0000",
      partner_name: "TRANSUNION",
      partner_service: "STIR",
      partner_status: "ACTIVE"
    }, null, 2),
    responseBody: JSON.stringify({
      id: "feat-scp-001",
      type: "SCP",
      ocn_prefix: "0000",
      partner_name: "TRANSUNION",
      partner_service: "STIR",
      partner_status: "ACTIVE",
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 201,
    product: ["scp"]
  },
  {
    id: "attach-feature-bcd",
    category: "Features",
    name: "Attach BCD Feature",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Attach a Branded Call Display (RICH-BCD) feature to the account. This enables rich branded content on outbound calls.",
    requestBody: JSON.stringify({
      type: "RICH-BCD",
      ocn_prefix: "0000",
      partner_name: "TRANSUNION",
      partner_service: "DISPLAY",
      partner_status: "ACTIVE"
    }, null, 2),
    responseBody: JSON.stringify({
      id: "feat-bcd-001",
      type: "RICH-BCD",
      ocn_prefix: "0000",
      partner_name: "TRANSUNION",
      partner_service: "DISPLAY",
      partner_status: "ACTIVE",
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "get-feature",
    category: "Features",
    name: "Get Feature",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature/{featureId}",
    description: "Retrieve details of a specific feature attached to an account.",
    responseBody: JSON.stringify({
      id: "feat-001",
      type: "SCP",
      partner_name: "TRANSUNION",
      partner_status: "ACTIVE",
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "delete-feature",
    category: "Features",
    name: "Delete Feature",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature/{featureId}",
    description: "Delete a feature from an account. Requires no active caller profiles or TN assets depending on the feature.",
    responseStatus: 204,
    product: ["common"]
  },
  {
    id: "attach-scp-caller-profile",
    category: "Caller Profile",
    name: "Attach SCP Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/callerprofile",
    description: "Create a caller profile for Spoofed Call Protection. The caller profile defines the identity and display name for outbound calls.",
    requestBody: JSON.stringify({
      display_name: "Your Company",
      feature: [{ type: "SCP" }],
      status: "ACTIVE"
    }, null, 2),
    responseBody: JSON.stringify({
      id: "cp-scp-001",
      display_name: "Your Company",
      feature: [{ type: "SCP" }],
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 201,
    product: ["scp"]
  },
  {
    id: "attach-bcd-caller-profile",
    category: "Caller Profile",
    name: "Attach BCD Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/callerprofile",
    description: "Create a caller profile for Branded Call Display. Includes rich content like logo, call reason, and business information.",
    requestBody: JSON.stringify({
      display_name: "Your Company",
      feature: [{ type: "RICH-BCD" }],
      call_reason: "Account Update",
      logo_url: "https://example.com/logo.png",
      status: "ACTIVE"
    }, null, 2),
    responseBody: JSON.stringify({
      id: "cp-bcd-001",
      display_name: "Your Company",
      feature: [{ type: "RICH-BCD" }],
      call_reason: "Account Update",
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "get-caller-profile",
    category: "Caller Profile",
    name: "Get Caller Profile",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/callerprofile/{callerProfileId}",
    description: "Retrieve a specific caller profile by ID.",
    responseBody: JSON.stringify({
      id: "cp-001",
      display_name: "Your Company",
      feature: [{ type: "SCP" }],
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-caller-profiles",
    category: "Caller Profile",
    name: "List Caller Profiles",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/callerprofile",
    description: "List all caller profiles for an account.",
    responseBody: JSON.stringify([{
      id: "cp-001",
      display_name: "Your Company",
      feature: [{ type: "SCP" }],
      status: "ACTIVE"
    }], null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "create-tn-asset",
    category: "TN Assets",
    name: "Create TN Account Asset",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tn",
    description: "Register a telephone number (TN) as an asset on the account and associate it with a caller profile. This is the final step to enable call branding or protection on specific numbers.",
    requestBody: JSON.stringify({
      tn: "+12025551234",
      caller_profile_id: "{{callerProfileId}}",
      status: "ACTIVE"
    }, null, 2),
    responseBody: JSON.stringify({
      id: "tn-001",
      tn: "+12025551234",
      caller_profile_id: "cp-001",
      status: "ACTIVE",
      created_date: "2026-03-23T16:42:42Z"
    }, null, 2),
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "get-tn-asset",
    category: "TN Assets",
    name: "Get TN Account Asset",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tn/{tnId}",
    description: "Retrieve a specific TN asset by its ID.",
    responseBody: JSON.stringify({
      id: "tn-001",
      tn: "+12025551234",
      caller_profile_id: "cp-001",
      status: "ACTIVE"
    }, null, 2),
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-tn-assets",
    category: "TN Assets",
    name: "List TN Account Assets",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tn",
    description: "List all TN assets for an account.",
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "delete-tn-asset",
    category: "TN Assets",
    name: "Delete TN Account Asset",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tn/{tnId}",
    description: "Remove a TN asset from an account.",
    responseStatus: 204,
    product: ["common"]
  }
];

export const getEndpointsForProduct = (product: "scp" | "bcd") => {
  return apiEndpoints.filter(ep => ep.product?.includes(product) || ep.product?.includes("common"));
};

export const getEndpointById = (id: string) => {
  return apiEndpoints.find(ep => ep.id === id);
};

export const getCategories = (product?: "scp" | "bcd") => {
  const eps = product ? getEndpointsForProduct(product) : apiEndpoints;
  const cats: string[] = [];
  eps.forEach(ep => {
    if (!cats.includes(ep.category)) cats.push(ep.category);
  });
  return cats;
};
