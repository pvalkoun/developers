export interface FieldDoc {
  path: string;
  type: string;
  required: boolean;
  description: string;
  constraints?: string;
}

export interface EndpointFieldDocs {
  requestFields?: FieldDoc[];
  responseFields?: FieldDoc[];
  pathParams?: FieldDoc[];
}

export const endpointFieldDocs: Record<string, EndpointFieldDocs> = {
  "auth-token": {
    requestFields: [
      { path: "userId", type: "String", required: true, description: "The admin user ID provided during onboarding", constraints: "Must be a valid provisioned user" },
      { path: "password", type: "String", required: true, description: "The password associated with the admin user", constraints: "Must match the provisioned credentials" },
    ],
    responseFields: [
      { path: "status", type: "String", required: true, description: "Result of the login attempt", constraints: "\"success\" or \"failure\"" },
      { path: "message", type: "String", required: true, description: "Human-readable result message" },
      { path: "accessToken", type: "String", required: true, description: "JWT access token for authenticating subsequent API calls", constraints: "Bearer token, include in Authorization header" },
      { path: "refreshToken", type: "String", required: true, description: "JWT refresh token for obtaining new access tokens without re-authenticating" },
    ],
  },

  "create-account": {
    requestFields: [
      { path: "name", type: "String", required: true, description: "The display name for the enterprise account", constraints: "Length between 1 and 128" },
      { path: "type", type: "String", required: true, description: "The type of account", constraints: "Must be one of: ENTERPRISE, COMPANY, SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "The initial status of the account", constraints: "Must be one of: ACTIVE, INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "The relationship type to TransUnion", constraints: "Must be one of: DIRECT, INDIRECT" },
      { path: "parent_account[]", type: "Array", required: true, description: "List of parent account IDs this account belongs to", constraints: "Must reference valid existing account IDs" },
      { path: "billing.id", type: "String", required: true, description: "Billing identifier for the account", constraints: "Assigned by TransUnion or customer-defined" },
      { path: "billing.model", type: "String", required: true, description: "The billing model", constraints: "Must be one of: TRANSACTION, SUBSCRIPTION, OTHER" },
      { path: "billing.frequency", type: "String", required: true, description: "How often billing occurs", constraints: "Must be one of: MONTHLY, QUARTERLY, ANNUALLY" },
      { path: "service[].type", type: "String", required: true, description: "The service type to provision", constraints: "Must be: SDPR (for TCS services)" },
      { path: "child_account_enabled", type: "Boolean", required: false, description: "Whether child accounts can be created under this account", constraints: "Default: false" },
      { path: "start_date", type: "DateTime", required: true, description: "The contract start date", constraints: "RFC 1123 format" },
      { path: "end_date", type: "DateTime", required: true, description: "The contract end date", constraints: "RFC 1123 format, must be after start_date" },
      { path: "application[]", type: "Array", required: true, description: "Applications this account is provisioned for", constraints: "Valid values: CCID, TCS" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique identifier assigned to the account", constraints: "Length between 4 and 10" },
      { path: "name", type: "String", required: true, description: "The display name for the enterprise account" },
      { path: "type", type: "String", required: true, description: "The type of account" },
      { path: "status", type: "String", required: true, description: "Current status of the account" },
      { path: "relationship", type: "String", required: true, description: "The relationship type to TransUnion" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration object" },
      { path: "service[]", type: "Array", required: true, description: "List of provisioned services, each with type and assigned id" },
      { path: "service[].id", type: "String", required: true, description: "Service ID assigned by the system" },
      { path: "child_account_enabled", type: "Boolean", required: true, description: "Whether child accounts are enabled" },
      { path: "start_date", type: "DateTime", required: true, description: "Contract start date" },
      { path: "end_date", type: "DateTime", required: true, description: "Contract end date" },
      { path: "application[]", type: "Array", required: true, description: "Provisioned applications" },
      { path: "created_by", type: "String", required: true, description: "User ID that created the object", constraints: "Length between 1 and 64" },
      { path: "created_date", type: "DateTime", required: true, description: "Timestamp when the object was created", constraints: "RFC 1123 format" },
      { path: "updated_by", type: "String", required: true, description: "User ID that last updated the object" },
      { path: "updated_date", type: "DateTime", required: true, description: "Timestamp of the last update" },
    ],
  },

  "get-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account to retrieve", constraints: "Length between 4 and 10" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique account identifier", constraints: "Length between 4 and 10" },
      { path: "name", type: "String", required: true, description: "Account display name" },
      { path: "type", type: "String", required: true, description: "Account type", constraints: "ENTERPRISE, COMPANY, or SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "Current account status", constraints: "ACTIVE or INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "Relationship type to TransUnion" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration with id, model, and frequency" },
      { path: "service[]", type: "Array", required: true, description: "List of provisioned services (STIAS, SDPR, etc.)" },
      { path: "child_account_enabled", type: "Boolean", required: true, description: "Whether child accounts are enabled" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account" },
      { path: "comment", type: "String", required: false, description: "Free-text comment about the account" },
      { path: "contact[]", type: "Array", required: false, description: "List of contacts with first_name, last_name, email, phone, type" },
      { path: "contact[].type", type: "String", required: true, description: "Contact type", constraints: "PRIMARY or SECONDARY" },
      { path: "address", type: "Object", required: false, description: "Physical address with street, city, postal_code, state_or_province, country_code" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", constraints: "9 digits" },
      { path: "duns", type: "String", required: false, description: "Dun & Bradstreet DUNS number", constraints: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names or DBAs for the account" },
      { path: "vetting.status", type: "String", required: false, description: "Account vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, or VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "When the vetting status was last updated", constraints: "RFC 1123 format" },
      { path: "created_by", type: "String", required: true, description: "User ID that created the account" },
      { path: "created_date", type: "DateTime", required: true, description: "Account creation timestamp" },
      { path: "updated_by", type: "String", required: true, description: "User ID that last updated the account" },
      { path: "updated_date", type: "DateTime", required: true, description: "Last update timestamp" },
    ],
  },

  "update-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account to update", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "id", type: "String", required: true, description: "The account ID (must match the path parameter)" },
      { path: "name", type: "String", required: true, description: "Updated account display name" },
      { path: "type", type: "String", required: true, description: "Account type", constraints: "ENTERPRISE, COMPANY, or SUBSCRIBER" },
      { path: "status", type: "String", required: true, description: "Account status", constraints: "ACTIVE or INACTIVE" },
      { path: "relationship", type: "String", required: true, description: "Relationship type", constraints: "DIRECT or INDIRECT" },
      { path: "parent_account[]", type: "Array", required: true, description: "Parent account IDs" },
      { path: "billing", type: "Object", required: true, description: "Billing configuration object with id, model, frequency" },
      { path: "service[]", type: "Array", required: true, description: "Services provisioned for this account" },
      { path: "child_account_enabled", type: "Boolean", required: false, description: "Enable or disable child accounts" },
      { path: "domain", type: "String", required: false, description: "Domain associated with the account" },
      { path: "comment", type: "String", required: false, description: "Free-text comment" },
      { path: "contact[]", type: "Array", required: false, description: "Contact list with first_name, last_name, email, phone, type" },
      { path: "address", type: "Object", required: false, description: "Physical address object" },
      { path: "ein", type: "String", required: false, description: "Employer Identification Number", constraints: "9 digits" },
      { path: "duns", type: "String", required: false, description: "DUNS number", constraints: "9 digits" },
      { path: "name_alias[]", type: "Array", required: false, description: "Alternative names for the account" },
      { path: "vetting.status", type: "String", required: false, description: "Vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: false, description: "Vetting status timestamp", constraints: "RFC 1123 format" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Account identifier" },
      { path: "name", type: "String", required: true, description: "Updated account name" },
      { path: "created_by", type: "String", required: true, description: "Original creator" },
      { path: "created_date", type: "DateTime", required: true, description: "Original creation date" },
      { path: "updated_by", type: "String", required: true, description: "User who performed the update" },
      { path: "updated_date", type: "DateTime", required: true, description: "Timestamp of this update" },
    ],
  },

  "delete-account": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account to delete", constraints: "All features, caller profiles, and TN assets must be removed first" },
    ],
  },

  "attach-account-tcs": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "lead_generation", type: "String", required: true, description: "Entity that sold the service to the end customer", constraints: "Valid values for US: AT&T, TransUnion, TNS, First Orion. For CA: Bell Canada, TransUnion" },
      { path: "distributor[]", type: "Array", required: false, description: "List of distributors predefined per country", constraints: "Valid values for US: [AT&T]. For CA: [Bell Canada]" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The unique identifier assigned by AAM", constraints: "Length between 4 and 10" },
      { path: "lead_generation", type: "String", required: true, description: "Lead generation entity" },
      { path: "distributor[]", type: "Array", required: false, description: "Active distributors for this account" },
    ],
  },

  "get-account-tcs": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The unique identifier assigned by AAM", constraints: "Length between 4 and 10" },
      { path: "lead_generation", type: "String", required: true, description: "Lead generation entity", constraints: "Valid: AT&T, TransUnion, TNS, First Orion" },
      { path: "distributor[]", type: "Array", required: false, description: "List of active distributors", constraints: "Valid for US: [AT&T]" },
    ],
  },

  "attach-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "feature[]", type: "Array", required: true, description: "List of feature types to enable on the account", constraints: "Valid values include: AUTH-ONLY, RICH-BCD, AUTH-BCD, NAME-BCD, SPOOF-CALL-PROTECTION, CNO, DNO, SCP, and others" },
      { path: "service[]", type: "Array", required: false, description: "List of service objects defining carrier partner configurations for each feature" },
      { path: "service[].name", type: "String", required: true, description: "The service/feature name to configure partners for", constraints: "Must match a valid feature name (e.g., SPOOF-CALL-PROTECTION, RICH-BCD, AUTH-BCD)" },
      { path: "service[].partner[]", type: "Array", required: true, description: "List of carrier partner configuration objects" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "Must be one of: att, verizon, tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Requested enablement status for the partner", constraints: "Use Enable-Requested to begin activation. Valid values: Enable-Requested, Disable-Requested, Suspend-Requested, Resume-Requested" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The account identifier" },
      { path: "feature[]", type: "Array", required: true, description: "List of attached features" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner status after processing", constraints: "Transitions through: Enable-Requested → Enable-Processing → Enable-Completed (or Enable-Failed)" },
      { path: "workflow_status", type: "String", required: false, description: "Overall workflow status for suspend/resume operations", constraints: "Values: Suspend-Completed, Suspend-Initiated, Suspend-Eligible, Resume-Completed, Resume-Initiated, Resume-Eligible" },
      { path: "created_by", type: "String", required: true, description: "User who created the feature attachment" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "get-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    responseFields: [
      { path: "account_id", type: "String", required: true, description: "The account identifier" },
      { path: "feature[]", type: "Array", required: true, description: "List of attached feature types" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "service[].name", type: "String", required: true, description: "Feature/service name" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner status list" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Partner name", constraints: "att, verizon, or tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Current partner enablement status", constraints: "Full lifecycle: Enable-Requested → Enable-Processing → Enable-Completed/Failed → Disable-Requested → ..." },
      { path: "workflow_status", type: "String", required: false, description: "Suspend/resume workflow status" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
      { path: "updated_by", type: "String", required: false, description: "Last updater user ID" },
      { path: "updated_date", type: "DateTime", required: false, description: "Last update timestamp" },
    ],
  },

  "get-partner-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "serviceName", type: "String", required: true, description: "Feature/service name to query", constraints: "e.g., SPOOF-CALL-PROTECTION, RICH-BCD" },
      { path: "partnerName", type: "String", required: true, description: "Carrier partner name", constraints: "att, verizon, or tmobile" },
    ],
    responseFields: [
      { path: "name", type: "String", required: true, description: "The carrier partner name" },
      { path: "status", type: "String", required: true, description: "Current enablement status for this partner/service combination", constraints: "Enable-Completed, Enable-Processing, Enable-Requested, Disable-Completed, etc." },
    ],
  },

  "delete-feature": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "All caller profiles and TN assets must be removed first. Partner statuses must not be in *-Requested or *-Processing states." },
    ],
  },

  "attach-scp-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "service[]", type: "Array", required: true, description: "List of service objects for the caller profile" },
      { path: "service[].name", type: "String", required: true, description: "Service name", constraints: "For SCP: include CCID-ORIG and SPOOF-CALL-PROTECTION" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner configurations" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att, verizon, or tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Initial review status", constraints: "Use TU-Review-Requested to submit for TransUnion review" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique caller profile ID assigned by the system", constraints: "24-character hex string" },
      { path: "account_id", type: "String", required: true, description: "The account this profile belongs to" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration echoed back with partner statuses" },
      { path: "created_by", type: "String", required: true, description: "User who created the profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp", constraints: "RFC 1123 format" },
    ],
  },

  "attach-bcd-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "branded_caller_name", type: "String", required: true, description: "The business name to display on recipient devices", constraints: "Length between 1 and 32" },
      { path: "call_reason", type: "String", required: true, description: "The reason/category for the call shown on display", constraints: "Length between 1 and 128" },
      { path: "image_profile_id", type: "String", required: false, description: "ID of a previously uploaded image profile for logo display", constraints: "Must reference a valid image profile on the account" },
      { path: "service[]", type: "Array", required: true, description: "Service objects for BCD configuration" },
      { path: "service[].name", type: "String", required: true, description: "Service name", constraints: "For Rich BCD: include CCID-ORIG and RICH-BCD" },
      { path: "service[].partner[]", type: "Array", required: true, description: "Carrier partner configurations" },
      { path: "service[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att, verizon, or tmobile" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Initial review status", constraints: "Use TU-Review-Requested to submit for TransUnion review" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique caller profile ID", constraints: "24-character hex string" },
      { path: "name", type: "String", required: true, description: "System-generated profile name combining branded name, type, and timestamp" },
      { path: "account_id", type: "String", required: true, description: "The account this profile belongs to" },
      { path: "branded_caller_name", type: "String", required: true, description: "The branded business name" },
      { path: "call_reason", type: "String", required: true, description: "Call reason/category" },
      { path: "image_profile_id", type: "String", required: false, description: "Associated image profile ID" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with partner statuses" },
      { path: "created_by", type: "String", required: true, description: "User who created the profile" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "get-caller-profile": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "profileId", type: "String", required: true, description: "Unique caller profile ID", constraints: "24-character hex string" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Caller profile ID" },
      { path: "name", type: "String", required: true, description: "System-generated profile name" },
      { path: "account_id", type: "String", required: true, description: "Account the profile belongs to" },
      { path: "branded_caller_name", type: "String", required: false, description: "Branded name (BCD profiles only)" },
      { path: "call_reason", type: "String", required: false, description: "Call reason (BCD profiles only)" },
      { path: "image_profile_id", type: "String", required: false, description: "Image profile ID (Rich BCD only)" },
      { path: "service[]", type: "Array", required: true, description: "Service configuration with current partner statuses" },
      { path: "service[].partner[].status", type: "String", required: true, description: "Partner enablement status", constraints: "Enable-Completed indicates fully activated" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "list-caller-profiles": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    responseFields: [
      { path: "[]", type: "Array", required: true, description: "Array of caller profile objects, each containing id, name, account_id, service config, and timestamps" },
    ],
  },

  "create-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account", constraints: "Length between 4 and 10" },
    ],
    requestFields: [
      { path: "full_ownership", type: "Boolean", required: true, description: "Whether the TN is fully owned by the customer (carrier-vetted)", constraints: "true = owned directly; false = BYOC (third-party carrier)" },
      { path: "tn.orig.start", type: "String", required: true, description: "Telephone number in E.164 format", constraints: "Format: +[0-9]{1,3}.[0-9]{1,14}" },
      { path: "caller_profile_id", type: "String", required: true, description: "ID of the caller profile to associate with this TN", constraints: "Must reference a valid caller profile on the account" },
      { path: "label[]", type: "Array", required: false, description: "User-defined labels to categorize/track telephone numbers", constraints: "Up to 5 labels, each 1-60 characters. Use $ as separator for structured labels" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique TN asset identifier", constraints: "24-character hex string" },
      { path: "state", type: "String", required: true, description: "Current state of the asset", constraints: "ACTIVE, INACTIVE, VETTING, VETTING_DEFERRED, HOLD, DELETE, NONE, UNKNOWN" },
      { path: "account_id", type: "String", required: true, description: "Account this TN belongs to" },
      { path: "vetter", type: "String", required: true, description: "Entity performing vetting", constraints: "CARRIER (for full_ownership=true) or NEUSTAR (for BYOC)" },
      { path: "priority", type: "Integer", required: true, description: "Priority value for asset selection", constraints: "Lower number = higher priority. Default: 0" },
      { path: "full_ownership", type: "Boolean", required: true, description: "Ownership flag as submitted" },
      { path: "owner_type", type: "String", required: true, description: "Type of TN owner", constraints: "carrier, enterprise, or subscriber" },
      { path: "parent_account_id", type: "String", required: true, description: "Parent account ID" },
      { path: "super_account_id", type: "String", required: true, description: "Top-level account ID in the hierarchy" },
      { path: "tn.orig.start", type: "String", required: true, description: "The telephone number" },
      { path: "tn.orig.count", type: "Integer", required: true, description: "Number of TNs in range", constraints: "Always 1 (ranges not supported)" },
      { path: "vetting.request_timestamp", type: "DateTime", required: true, description: "When the vetting request was submitted", constraints: "RFC 1123 format" },
      { path: "vetting.status", type: "String", required: true, description: "Vetting status", constraints: "PREVETTED, VETTING_SUBMITTED, or VETTING_DEFERRED" },
      { path: "vetting.status_timestamp", type: "DateTime", required: true, description: "When vetting status last changed" },
      { path: "caller_profile", type: "String", required: true, description: "Name of the associated caller profile" },
      { path: "caller_profile_id", type: "String", required: true, description: "ID of the associated caller profile" },
      { path: "tagging_status", type: "Object", required: false, description: "Tagging status per partner", constraints: "Partner names (att, verizon, tmobile) mapped to status: TG (Tagged), AP (Appeal Pending), AG (Appeal Granted), AD (Appeal Declined), CIP (Customer Input Pending)" },
      { path: "partner_data[]", type: "Array", required: true, description: "Per-feature partner enablement data" },
      { path: "partner_data[].name", type: "String", required: true, description: "Feature name", constraints: "e.g., RICH-BCD, SPOOF-CALL-PROTECTION" },
      { path: "partner_data[].partner[]", type: "Array", required: true, description: "Partner statuses for this feature" },
      { path: "partner_data[].partner[].name", type: "String", required: true, description: "Carrier partner name", constraints: "att, verizon, or tmobile" },
      { path: "partner_data[].partner[].status", type: "String", required: true, description: "Partner activation status", constraints: "Enable-Requested → Enable-Processing → Enable-Completed" },
      { path: "partner_data[].partner[].caller_profile", type: "String", required: true, description: "Caller profile name used by this partner" },
      { path: "created_by", type: "String", required: true, description: "User who created the asset" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "create-tn-asset-byoc": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    requestFields: [
      { path: "full_ownership", type: "Boolean", required: true, description: "Must be false for BYOC assets", constraints: "false — indicates the TN is managed via a third-party carrier/CPaaS (e.g., Twilio, Genesys)" },
      { path: "tn.orig.start", type: "String", required: true, description: "Telephone number in E.164 format", constraints: "Format: +[0-9]{1,3}.[0-9]{1,14}" },
      { path: "caller_profile_id", type: "String", required: true, description: "ID of the caller profile to associate" },
      { path: "label[]", type: "Array", required: false, description: "User-defined labels", constraints: "Up to 5 labels, each 1-60 characters" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "Unique TN asset identifier" },
      { path: "state", type: "String", required: true, description: "Asset state — typically VETTING for BYOC numbers", constraints: "BYOC numbers enter VETTING state (vs ACTIVE for full ownership)" },
      { path: "vetter", type: "String", required: true, description: "Vetting entity — NEUSTAR for BYOC assets", constraints: "NEUSTAR (third-party vetting required for BYOC)" },
      { path: "full_ownership", type: "Boolean", required: true, description: "false for BYOC" },
      { path: "vetting.status", type: "String", required: true, description: "BYOC vetting status", constraints: "VETTING_DEFERRED → VETTING_SUBMITTED → PREVETTED" },
      { path: "partner_data[]", type: "Array", required: true, description: "Per-feature partner data (same structure as full ownership)" },
      { path: "created_by", type: "String", required: true, description: "Creator user ID" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
    ],
  },

  "update-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "tnAssetId", type: "String", required: true, description: "Unique TN asset ID to update", constraints: "24-character hex string" },
    ],
    requestFields: [
      { path: "full_ownership", type: "Boolean", required: false, description: "Update ownership flag" },
      { path: "tn.orig.start", type: "String", required: false, description: "Telephone number (cannot be changed for existing assets)" },
      { path: "caller_profile_id", type: "String", required: false, description: "New caller profile ID to reassign the TN" },
      { path: "label[]", type: "Array", required: false, description: "Updated labels", constraints: "Up to 5 labels, each 1-60 characters" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "TN asset ID" },
      { path: "state", type: "String", required: true, description: "Current asset state" },
      { path: "label[]", type: "Array", required: false, description: "Updated label values" },
      { path: "caller_profile_id", type: "String", required: true, description: "Updated caller profile association" },
      { path: "updated_by", type: "String", required: true, description: "User who performed the update" },
      { path: "updated_date", type: "DateTime", required: true, description: "Update timestamp" },
    ],
  },

  "get-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "assetId", type: "String", required: true, description: "Unique TN asset ID", constraints: "24-character hex string" },
    ],
    responseFields: [
      { path: "id", type: "String", required: true, description: "TN asset identifier" },
      { path: "state", type: "String", required: true, description: "Current asset state", constraints: "ACTIVE, VETTING, INACTIVE, etc." },
      { path: "account_id", type: "String", required: true, description: "Owning account" },
      { path: "vetter", type: "String", required: true, description: "Vetting entity" },
      { path: "full_ownership", type: "Boolean", required: true, description: "Ownership flag" },
      { path: "tn.orig.start", type: "String", required: true, description: "Telephone number" },
      { path: "tn.orig.count", type: "Integer", required: true, description: "Always 1" },
      { path: "vetting", type: "Object", required: true, description: "Vetting status object with request_timestamp, status, status_timestamp" },
      { path: "caller_profile", type: "String", required: true, description: "Associated caller profile name" },
      { path: "caller_profile_id", type: "String", required: true, description: "Associated caller profile ID" },
      { path: "tagging_status", type: "Object", required: false, description: "Per-partner tagging status" },
      { path: "partner_data[]", type: "Array", required: true, description: "Per-feature partner enablement data with statuses" },
      { path: "created_by", type: "String", required: true, description: "Creator" },
      { path: "created_date", type: "DateTime", required: true, description: "Creation timestamp" },
      { path: "updated_by", type: "String", required: false, description: "Last updater" },
      { path: "updated_date", type: "DateTime", required: false, description: "Last update timestamp" },
    ],
  },

  "list-tn-assets": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
    ],
    responseFields: [
      { path: "[]", type: "Array", required: true, description: "Array of TN asset objects with full details including state, vetting, partner_data, and timestamps" },
      { path: "[].type", type: "String", required: true, description: "Asset type identifier", constraints: "tcstn" },
      { path: "[].version", type: "String", required: true, description: "API version of the asset", constraints: "v4" },
      { path: "[].account_name", type: "String", required: true, description: "Name of the account that owns the TN" },
    ],
  },

  "delete-tn-asset": {
    pathParams: [
      { path: "accountId", type: "String", required: true, description: "Unique identifier of the account" },
      { path: "tnAssetId", type: "String", required: true, description: "Unique TN asset ID to delete", constraints: "The TN will be deactivated and removed from all partner networks" },
    ],
  },
};
