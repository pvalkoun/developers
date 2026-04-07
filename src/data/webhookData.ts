export interface WebhookEndpoint {
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
}

export interface WebhookFieldDoc {
  path: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
}

export interface WebhookEndpointFieldDocs {
  requestFields?: WebhookFieldDoc[];
  responseFields?: WebhookFieldDoc[];
  pathParams?: WebhookFieldDoc[];
}

export const webhookEndpoints: WebhookEndpoint[] = [
  // ── Account Setup ──
  {
    id: "wb-enable-account",
    category: "Account Setup",
    name: "Enable Webhook Service",
    method: "PUT",
    path: "/ccid/aam/v1/admin/company/{{accountId}}",
    description: "Enable the Webhook (WB) service on an existing AAM account. This is a prerequisite before registering any webhook endpoints. The account must already exist in AAM — use this endpoint to add webhook capability to it.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "enableWB": true
}`,
    responseBody: `{
  "accountId": "acc_12345",
  "message": "Account updated"
}`,
    responseStatus: 200,
  },

  // ── Webhook Management ──
  {
    id: "wb-register",
    category: "Webhook Management",
    name: "Register Webhook",
    method: "POST",
    path: "/ccid/aam/v2/admin/account/{{accountId}}/webhook",
    description: "Register a new webhook endpoint for the specified account. The webhook configuration defines the callback URL, authentication credentials, retry behavior, notification email contacts, and the services and event scopes to subscribe to.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "webhook_name": "Webhook Notifications",
  "description": "Receive real-time status updates for BCD assets",
  "state": "ACTIVE",
  "max_retry": 5,
  "email": [
    "ops-team@example.com"
  ],
  "auth_type": "auth",
  "credentials": {
    "username": "admin",
    "password": "password",
    "login_url": "https://demo.myapp.com/login"
  },
  "services": [
    {
      "name": "sdpr",
      "entities": [
        {
          "type": "account",
          "data": {
            "webhook_url": "https://demo.myapp.com/account",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "partner_status",
                "trigger_on": ["*"]
              }
            ]
          }
        },
        {
          "type": "tcsasset",
          "data": {
            "webhook_url": "https://demo.myapp.com/asset",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "tagging_status",
                "trigger_on": ["AG"]
              }
            ],
            "features": ["NAME-BCD"]
          }
        },
        {
          "type": "callerprofile",
          "data": {
            "webhook_url": "https://demo.myapp.com/cp",
            "event_types": [
              {
                "event_type": "partner_status",
                "trigger_on": ["Enable-Completed"]
              }
            ],
            "features": ["NAME-BCD"]
          }
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "69c239466c81b511de9cb409",
  "webhook_name": "Webhook Notifications",
  "description": "Receive real-time status updates for BCD assets",
  "state": "ACTIVE",
  "max_retry": 5,
  "auth_type": "auth",
  "services": [ ... ]
}`,
    responseStatus: 200,
  },
  {
    id: "wb-update",
    category: "Webhook Management",
    name: "Update Webhook",
    method: "POST",
    path: "/ccid/aam/v2/admin/account/{{accountId}}/webhook",
    description: "Update an existing webhook configuration. Submit the full updated payload including any new scopes, event types, URLs, or authentication changes. Changes take effect immediately on the delivery engine.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    requestBody: `{
  "webhook_name": "Webhook Notifications",
  "description": "Updated webhook with callerprofile scope",
  "state": "ACTIVE",
  "max_retry": 5,
  "email": [
    "ops-team@example.com"
  ],
  "auth_type": "auth",
  "credentials": {
    "username": "admin",
    "password": "password",
    "login_url": "https://demo.myapp.com/login"
  },
  "services": [
    {
      "name": "sdpr",
      "entities": [
        {
          "type": "account",
          "data": {
            "webhook_url": "https://demo.myapp.com/account",
            "event_types": [
              {
                "event_type": "vetting_status",
                "trigger_on": ["VETTING_SUCCESSFUL"]
              },
              {
                "event_type": "partner_status",
                "trigger_on": ["*"]
              }
            ]
          }
        },
        {
          "type": "callerprofile",
          "data": {
            "webhook_url": "https://demo.myapp.com/cp",
            "event_types": [
              {
                "event_type": "partner_status",
                "trigger_on": ["Enable-Completed"]
              }
            ],
            "features": ["NAME-BCD"]
          }
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "69c239466c81b511de9cb409",
  "message": "Updated"
}`,
    responseStatus: 200,
  },

  // ── Lifecycle ──
  {
    id: "wb-pause",
    category: "Lifecycle",
    name: "Pause Webhook",
    method: "PUT",
    path: "/ccid/aam/v2/admin/account/{{accountId}}/webhook/pause",
    description: "Temporarily pause all webhook deliveries for the specified account. While paused, no event notifications will be sent to the registered endpoint. Use the Resume endpoint to reactivate deliveries.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "state": "PAUSED"
}`,
    responseStatus: 200,
  },
  {
    id: "wb-resume",
    category: "Lifecycle",
    name: "Resume Webhook",
    method: "PUT",
    path: "/ccid/aam/v2/admin/account/{{accountId}}/webhook/resume",
    description: "Resume webhook deliveries after a pause. The webhook state returns to ACTIVE and event notifications will resume immediately for all configured scopes and event types.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "state": "ACTIVE"
}`,
    responseStatus: 200,
  },
  {
    id: "wb-delete",
    category: "Lifecycle",
    name: "Delete Webhook",
    method: "DELETE",
    path: "/ccid/aam/v2/admin/account/{{accountId}}/webhook",
    description: "Permanently delete the webhook configuration for the specified account. This removes the entire webhook object including all registered scopes, event filters, and delivery history. This action cannot be undone.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "message": "Deleted",
  "status": 200
}`,
    responseStatus: 200,
  },

  // ── Delivery Logs ──
  {
    id: "wb-logs",
    category: "Delivery Logs",
    name: "Get Delivery Logs",
    method: "GET",
    path: "/ccid/aam/v2/admin/account/{{accountId}}/webhook/logs",
    description: "Retrieve the delivery log history for the webhook registered on this account. Logs include timestamps, payloads sent, HTTP response codes from your endpoint, retry attempt counts, and delivery status. Use these logs for debugging integration issues and monitoring delivery health.",
    headers: [
      { key: "Content-Type", value: "application/json" },
    ],
    responseBody: `{
  "logs": [
    {
      "timestamp": "2026-03-02T14:45:10Z",
      "event_type": "partner_status",
      "entity_type": "account",
      "payload": { "current_status": "Enable Completed" },
      "response_code": 200,
      "retry_count": 0,
      "status": "delivered"
    },
    {
      "timestamp": "2026-03-02T14:55:12Z",
      "event_type": "vetting_status",
      "entity_type": "TN",
      "payload": { "current_status": "Vetting-successful" },
      "response_code": 500,
      "retry_count": 3,
      "status": "failed"
    }
  ]
}`,
    responseStatus: 200,
  },
];

export const webhookFieldDocs: Record<string, WebhookEndpointFieldDocs> = {
  "wb-enable-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The unique account identifier from AAM", constraints: "Must be a valid, existing AAM account ID" },
    ],
    requestFields: [
      { path: "enableWB", type: "Boolean", required: true, description: "Set to true to enable the Webhook microservice for this account", constraints: "true | false" },
    ],
    responseFields: [
      { path: "accountId", type: "String", required: true, description: "The account ID that was updated" },
      { path: "message", type: "String", required: true, description: "Confirmation message" },
    ],
  },
  "wb-register": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID (from AAM) to register the webhook under", constraints: "Account must have WB service enabled" },
    ],
    requestFields: [
      { path: "webhook_name", type: "String", required: true, description: "A human-readable name for this webhook configuration" },
      { path: "description", type: "String", required: false, description: "Optional description of the webhook purpose" },
      { path: "state", type: "String", required: true, description: "Initial state of the webhook", constraints: "ACTIVE | PAUSED" },
      { path: "max_retry", type: "Integer", required: true, description: "Maximum number of retry attempts for failed deliveries", constraints: "Recommended: 3-5" },
      { path: "email", type: "Array", required: false, description: "Email addresses or PDLs to notify after max retries are exhausted" },
      { path: "auth_type", type: "String", required: true, description: "Authentication method for your callback endpoint", constraints: "auth | token | none" },
      { path: "credentials.username", type: "String", required: false, description: "Username for Basic Auth (required if auth_type is 'auth')" },
      { path: "credentials.password", type: "String", required: false, description: "Password for Basic Auth (required if auth_type is 'auth')" },
      { path: "credentials.login_url", type: "String", required: false, description: "Login URL for token-based auth (required if auth_type is 'auth')" },
      { path: "services[].name", type: "String", required: true, description: "Service name to subscribe to", constraints: "e.g., sdpr" },
      { path: "services[].entities[].type", type: "String", required: true, description: "The entity scope level", constraints: "account | tcsasset | callerprofile" },
      { path: "services[].entities[].data.webhook_url", type: "String", required: true, description: "Your HTTPS callback URL for this scope", constraints: "Must be a valid HTTPS URL" },
      { path: "services[].entities[].data.event_types[].event_type", type: "String", required: true, description: "The event category to subscribe to", constraints: "vetting_status | partner_status | tagging_status" },
      { path: "services[].entities[].data.event_types[].trigger_on", type: "Array", required: true, description: "Specific status values to trigger on, or ['*'] for all", constraints: "See Event Reference for valid values" },
      { path: "services[].entities[].data.features", type: "Array", required: false, description: "Feature filter for notifications", constraints: "e.g., NAME-BCD, RICH-BCD, SPOOF-CALL-PROTECTION" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique webhook identifier assigned by the system" },
      { path: "webhook_name", type: "String", required: true, description: "The registered webhook name" },
      { path: "state", type: "String", required: true, description: "Current state of the webhook", constraints: "ACTIVE | PAUSED" },
    ],
  },
  "wb-update": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID for the webhook to update" },
    ],
    requestFields: [
      { path: "(same as Register)", type: "—", required: false, description: "Submit the full updated payload with modified values. All fields from the Register endpoint apply.", constraints: "Changes take effect immediately" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "The webhook ID that was updated" },
      { path: "message", type: "String", required: true, description: "Confirmation message" },
    ],
  },
  "wb-pause": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID whose webhook should be paused" },
    ],
    responseFields: [
      { path: "state", type: "String", required: true, description: "Updated webhook state", constraints: "PAUSED" },
    ],
  },
  "wb-resume": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID whose webhook should be resumed" },
    ],
    responseFields: [
      { path: "state", type: "String", required: true, description: "Updated webhook state", constraints: "ACTIVE" },
    ],
  },
  "wb-delete": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID whose webhook should be deleted" },
    ],
    responseFields: [
      { path: "message", type: "String", required: true, description: "Confirmation message" },
      { path: "status", type: "Integer", required: true, description: "HTTP status code", constraints: "200" },
    ],
  },
  "wb-logs": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "The account ID to retrieve delivery logs for" },
    ],
    responseFields: [
      { path: "logs[].timestamp", type: "DateTime", required: true, description: "ISO 8601 timestamp of the delivery attempt" },
      { path: "logs[].event_type", type: "String", required: true, description: "The event type that triggered this delivery" },
      { path: "logs[].entity_type", type: "String", required: true, description: "The entity scope (account, TN, or Caller Profile)" },
      { path: "logs[].payload", type: "Object", required: true, description: "The event payload that was delivered" },
      { path: "logs[].response_code", type: "Integer", required: true, description: "HTTP status code returned by your endpoint" },
      { path: "logs[].retry_count", type: "Integer", required: true, description: "Number of delivery retry attempts" },
      { path: "logs[].status", type: "String", required: true, description: "Final delivery status", constraints: "delivered | failed | retrying" },
    ],
  },
};

export const webhookCategories = ["Account Setup", "Webhook Management", "Lifecycle", "Delivery Logs"];

export const getWebhookEndpoint = (id: string) => webhookEndpoints.find(e => e.id === id);

export const getWebhookEndpointsByCategory = (category: string) =>
  webhookEndpoints.filter(e => e.category === category);

// ── Sample Event Payloads ──
export const sampleEventPayloads = {
  account: `{
  "id": "Event_Account_01",
  "type": "Status changes",
  "event_create_date": "2026-03-02T14:45:10Z",
  "entity": {
    "type": "account",
    "account_id": "acc_12345"
  },
  "data": {
    "previous_status": "Enable Processing",
    "current_status": "Enable Completed"
  },
  "retryPolicy": {
    "attempt": 1,
    "waittime_in_seconds": 30
  }
}`,
  callerProfile: `{
  "id": "evt_01CPUPDATE123",
  "type": "Caller Profile status",
  "event_create_date": "2026-03-02T14:55:12Z",
  "entity": {
    "type": "Caller Profile",
    "id": "cp_9988",
    "accountId": "acc_12345"
  },
  "data": {
    "previous_status": "Suspend-Requested",
    "current_status": "Suspend-Processing"
  },
  "retryPolicy": {
    "attempt": 1,
    "waittime_in_seconds": 30
  }
}`,
  tn: `{
  "id": "Event-002",
  "type": "Status Changes",
  "event_create_date": "2026-03-02T14:30:22Z",
  "entity": {
    "type": "TN",
    "tn": "+919876543210",
    "accountId": "acc_12345",
    "callerProfileId": "cp_9988"
  },
  "data": {
    "previous_status": "Vetting-failed",
    "current_status": "Vetting-requested"
  }
}`,
};
