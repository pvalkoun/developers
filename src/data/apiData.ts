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
  // ── Authentication ──
  {
    id: "auth-token",
    category: "Authentication",
    name: "Create Auth Token",
    method: "POST",
    path: "/ccid/aam/v1/login",
    description: "Authenticate with the TCS platform to obtain an access token. This token is required in the Authorization header of all subsequent API calls.",
    requestBody: `{
  "userId": "{{adminUserId}}",
  "password": "{{password}}"
}`,
    responseBody: `{
  "status": "success",
  "message": "Login is successful",
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIs...",
  "refreshToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCIs..."
}`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── Account Management ──
  {
    id: "create-account",
    category: "Account Management",
    name: "Create Account",
    method: "POST",
    path: "/ccid/aam/v2/admin/account",
    description: "Create a new enterprise account. This is the first step after authentication to set up your organization on the TCS platform.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "name": "user_sample enterprise_1",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TEwilldefine",
    "model": "OTHER",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "SDPR"
    }
  ],
  "child_account_enabled": false,
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ]
}`,
    responseBody: `{
  "id": "xi0vhua3b4",
  "name": "user_sample enterprise1",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TEwilldefine",
    "model": "OTHER",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "SDPR",
      "id": "xi0vhua3b4"
    }
  ],
  "child_account_enabled": false,
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Mon, 23 Mar 2026 16:42:42 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Mon, 23 Mar 2026 16:42:42 GMT"
}`,
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "get-account",
    category: "Account Management",
    name: "Get Account",
    method: "GET",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Retrieve details of a specific account by its ID, including contacts, address, vetting status, and service configuration.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "xeb9ekoawz",
  "name": "user_sample enterprise",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TUwilldefine",
    "model": "TRANSACTION",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "STIAS",
      "id": "571578"
    },
    {
      "type": "SDPR",
      "id": "xeb9ekoawz"
    }
  ],
  "child_account_enabled": false,
  "domain": "user.com",
  "comment": "example for tech enabler setup",
  "contact": [
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "acme@acme.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    },
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@007.com",
      "phone": "+1.2232146979",
      "type": "PRIMARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 18 Feb 2026 21:06:14 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Wed, 18 Feb 2026 21:06:14 GMT",
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "update-account",
    category: "Account Management",
    name: "Update Account",
    method: "POST",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Update an existing account's details including contacts, address, billing configuration, vetting information, and more.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "id": "xvm465a2g8",
  "name": "user_enterprise_7",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "xgvaf00cx3"
  ],
  "billing": {
    "id": "user_enterprise_7",
    "model": "TRANSACTION",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "SDPR",
      "id": "xvm465a2g8"
    }
  ],
  "child_account_enabled": true,
  "domain": "user_enterprise_7",
  "comment": "example for tech enabler setup for 7th account",
  "contact": [
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "valkoun.user@gmail.com",
      "phone": "+1.2232146979",
      "type": "PRIMARY"
    },
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "acme@acme.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
}`,
    responseBody: `{
  "id": "xeb9ekoawz",
  "name": "user_sample enterprise",
  "type": "ENTERPRISE",
  "status": "ACTIVE",
  "relationship": "DIRECT",
  "parent_account": [
    "x0vo1z7q11"
  ],
  "billing": {
    "id": "TUwilldefine",
    "model": "TRANSACTION",
    "frequency": "MONTHLY"
  },
  "service": [
    {
      "type": "STIAS",
      "id": "571578"
    },
    {
      "type": "SDPR",
      "id": "xeb9ekoawz"
    }
  ],
  "child_account_enabled": false,
  "domain": "user.com",
  "comment": "example for tech enabler setup",
  "contact": [
    {
      "first_name": "charlie",
      "last_name": "bond",
      "email": "acme@acme.com",
      "phone": "+1.1134567890",
      "type": "SECONDARY"
    },
    {
      "first_name": "james",
      "last_name": "bond",
      "email": "james.bond@007.com",
      "phone": "+1.2232146979",
      "type": "PRIMARY"
    }
  ],
  "address": {
    "street": "123 Main st",
    "city": "Sterling",
    "postal_code": "20123",
    "state_or_province": "VA",
    "country_code": "US"
  },
  "start_date": "Fri, 4 Apr 2025 18:18:49 GMT",
  "end_date": "Sat, 4 Apr 2026 18:18:49 GMT",
  "application": [
    "CCID",
    "TCS"
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 18 Feb 2026 21:06:14 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Wed, 18 Feb 2026 21:43:12 GMT",
  "ein": "123456789",
  "duns": "923456789",
  "name_alias": [
    "name alias2",
    "name alias1"
  ],
  "vetting": {
    "status": "PREVETTED",
    "status_timestamp": "Fri, 4 Apr 2025 18:18:49 GMT"
  }
}`,
    responseStatus: 206,
    product: ["common"]
  },
  {
    id: "delete-account",
    category: "Account Management",
    name: "Delete Account",
    method: "DELETE",
    path: "/ccid/aam/v2/admin/account/{accountId}",
    description: "Delete an account. All associated features, caller profiles, and TN assets must be removed before an account can be deleted.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseStatus: 200,
    product: ["common"]
  },

  // ── Account TCS ──
  {
    id: "attach-account-tcs",
    category: "Account TCS",
    name: "Attach Account TCS",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tcs",
    description: "Attach TCS (Trusted Call Solutions) configuration to an account. This enables the account for call branding and protection services by specifying the lead generation source and carrier distributors.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "lead_generation": "TransUnion",
  "distributor": [
    "AT&T"
  ]
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-account-tcs",
    category: "Account TCS",
    name: "Get Account TCS",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/tcs",
    description: "Retrieve the TCS configuration for an account, including lead generation source and active distributors.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "lead_generation": "AT&T",
  "distributor": [
    "AT&T"
  ],
  "account_id": "x59tj8rtv1"
}`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── Features ──
  {
    id: "attach-feature",
    category: "Features",
    name: "Attach Features",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Attach features to an account. Multiple feature types (AUTH-ONLY, RICH-BCD, AUTH-BCD, NAME-BCD, SPOOF-CALL-PROTECTION) and their carrier partner configurations can be set in a single request.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION"
  ],
  "service": [
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested"
        }
      ]
    }
  ]
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-feature",
    category: "Features",
    name: "Get Features",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Retrieve all features attached to an account, including per-carrier partner enablement statuses.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "account_id": "x59tj8rtv1",
  "feature": [
    "AUTH-ONLY",
    "RICH-BCD",
    "AUTH-BCD",
    "NAME-BCD",
    "SPOOF-CALL-PROTECTION"
  ],
  "service": [
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "AUTH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Fri, 20 Feb 2026 20:31:49 GMT",
  "updated_by": "user",
  "updated_date": "Wed, 25 Feb 2026 21:47:19 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-partner-feature",
    category: "Features",
    name: "Get Partner Feature Status",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature/service/{serviceName}/partner/{partnerName}",
    description: "Check the enablement status of a specific carrier partner for a given feature service.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "name": "att",
  "status": "Enable-Completed"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "delete-feature",
    category: "Features",
    name: "Delete Features",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/feature",
    description: "Delete all features from an account. All caller profiles and TN assets must be removed first.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{}`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── Image Profile ──
  {
    id: "create-image-profile",
    category: "Image Profile",
    name: "Create Image Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile",
    description: "Upload an image profile for use with Branded Call Display. Submit a public image URL and receive an internal TransUnion image URL and profile ID that can be referenced in caller profiles.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "public_image_url": "https://example.com/logo.png",
  "partner": [
    {
      "name": "att",
      "status": "TU-Review-Requested"
    },
    {
      "name": "tmobile",
      "status": "TU-Review-Requested"
    },
    {
      "name": "verizon",
      "status": "TU-Review-Requested"
    }
  ]
}`,
    responseBody: `{
  "id": "699f620c6ccc0121aeb7eef4",
  "account_id": "x59tj8rtv1",
  "image_url": "https://tcs.transunion.com/images/699f620c6ccc0121aeb7eef4.png",
  "public_image_url": "https://example.com/logo.png",
  "partner": [
    {
      "name": "att",
      "status": "TU-Review-Requested"
    },
    {
      "name": "tmobile",
      "status": "TU-Review-Requested"
    },
    {
      "name": "verizon",
      "status": "TU-Review-Requested"
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 20:15:08 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "get-image-profile",
    category: "Image Profile",
    name: "Get Image Profile",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile/{imageProfileId}",
    description: "Retrieve an image profile by ID, including the internal TransUnion image URL and partner statuses.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "699f620c6ccc0121aeb7eef4",
  "account_id": "x59tj8rtv1",
  "image_url": "https://tcs.transunion.com/images/699f620c6ccc0121aeb7eef4.png",
  "public_image_url": "https://example.com/logo.png",
  "partner": [
    {
      "name": "att",
      "status": "Enable-Completed"
    },
    {
      "name": "tmobile",
      "status": "Enable-Completed"
    },
    {
      "name": "verizon",
      "status": "Enable-Completed"
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 20:15:08 GMT"
}`,
    responseStatus: 200,
    product: ["bcd"]
  },
  {
    id: "delete-image-profile",
    category: "Image Profile",
    name: "Delete Image Profile",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/image-profile/{imageProfileId}",
    description: "Delete an image profile from an account. The image profile must not be referenced by any active caller profiles.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{}`,
    responseStatus: 200,
    product: ["bcd"]
  },

  // ── Caller Profile ──
  {
    id: "attach-scp-caller-profile",
    category: "Caller Profile",
    name: "Attach SCP Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "Create a caller profile for Spoofed Call Protection. The profile defines the CCID-ORIG and SPOOF-CALL-PROTECTION service configuration with per-carrier partner statuses.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "account_id": "x59tj8rtv1",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "SPOOF-CALL-PROTECTION",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 201,
    product: ["scp"]
  },
  {
    id: "attach-bcd-caller-profile",
    category: "Caller Profile",
    name: "Attach Rich BCD Caller Profile",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "Create a caller profile for Rich Branded Call Display. Includes branded caller name, call reason, and image profile for logo display on the recipient's device.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "branded_caller_name": "Your Company Name",
  "call_reason": "Account Update",
  "image_profile_id": "{{imageId}}",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ]
}`,
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_BCD_Rich_20260225-212320",
  "account_id": "x59tj8rtv1",
  "branded_caller_name": "Your Company Name",
  "call_reason": "Account Update",
  "image_profile_id": "699f620c6ccc0121aeb7eef4",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "TU-Review-Requested"
        },
        {
          "name": "tmobile",
          "status": "TU-Review-Requested"
        },
        {
          "name": "verizon",
          "status": "TU-Review-Requested"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 201,
    product: ["bcd"]
  },
  {
    id: "get-caller-profile",
    category: "Caller Profile",
    name: "Get Caller Profile",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile/{profileId}",
    description: "Retrieve a specific caller profile by ID, including its service configuration and partner statuses.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "699f684820a7a57a0a67c03a",
  "name": "Your Company Name_BCD_Rich_20260225-212320",
  "account_id": "x59tj8rtv1",
  "branded_caller_name": "Your Company Name",
  "call_reason": "Account Update",
  "image_profile_id": "699f620c6ccc0121aeb7eef4",
  "service": [
    {
      "name": "CCID-ORIG",
      "partner": []
    },
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed"
        },
        {
          "name": "verizon",
          "status": "Enable-Completed"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-caller-profiles",
    category: "Caller Profile",
    name: "List Caller Profiles",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/caller-profile",
    description: "List all caller profiles for an account.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `[
  {
    "id": "699f684820a7a57a0a67c03a",
    "name": "Your Company Name_BCD_Rich_20260225-212320",
    "account_id": "x59tj8rtv1",
    "branded_caller_name": "Your Company Name",
    "call_reason": "Account Update",
    "image_profile_id": "699f620c6ccc0121aeb7eef4",
    "service": [
      {
        "name": "CCID-ORIG",
        "partner": []
      },
      {
        "name": "RICH-BCD",
        "partner": [
          {
            "name": "att",
            "status": "Enable-Completed"
          }
        ]
      }
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Wed, 25 Feb 2026 21:23:20 GMT"
  }
]`,
    responseStatus: 200,
    product: ["common"]
  },

  // ── TN Assets ──
  {
    id: "create-tn-asset",
    category: "TN Assets",
    name: "Create TN Account Asset",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset",
    description: "Register a telephone number (TN) as an asset on the account and associate it with a caller profile. Use full_ownership: true when you own the number directly (carrier-vetted). This is the final step to enable call branding or protection on specific numbers.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "full_ownership": true,
  "tn": {
    "orig": {
      "start": "+1.5715550123"
    }
  },
  "caller_profile_id": "{{profileId}}",
  "label": [
    "test$label1",
    "test$label8"
  ]
}`,
    responseBody: `{
  "id": "69aa0525232c112395eb458e",
  "state": "ACTIVE",
  "account_id": "x59tj8rtv1",
  "vetter": "CARRIER",
  "priority": 0,
  "full_ownership": true,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555855555",
      "count": 1
    }
  },
  "vetting": {
    "request_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 5 Mar 2026 22:35:17 GMT"
}`,
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "create-tn-asset-byoc",
    category: "TN Assets",
    name: "Create TN Account Asset (BYOC)",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset",
    description: "Register a telephone number as a Bring Your Own Carrier (BYOC) asset. Use full_ownership: false when the number is managed through a third-party carrier or CPaaS platform (e.g., Twilio, Genesys). BYOC numbers go through an additional vetting process.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "full_ownership": false,
  "tn": {
    "orig": {
      "start": "+1.5555855555"
    }
  },
  "caller_profile_id": "{{profileId}}",
  "label": [
    "test$label1",
    "test$label8"
  ]
}`,
    responseBody: `{
  "id": "69aa0462232c112395eb455a",
  "state": "VETTING",
  "account_id": "x59tj8rtv1",
  "vetter": "NEUSTAR",
  "priority": 0,
  "full_ownership": false,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555655555",
      "count": 1
    }
  },
  "vetting": {
    "request_timestamp": "Thu, 5 Mar 2026 22:32:02 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 5 Mar 2026 22:32:02 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 5 Mar 2026 22:32:02 GMT"
}`,
    responseStatus: 201,
    product: ["common"]
  },
  {
    id: "update-tn-asset",
    category: "TN Assets",
    name: "Update TN Account Asset",
    method: "POST",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset/{tnAssetId}",
    description: "Update an existing TN asset, for example to change ownership type, labels, or reassign to a different caller profile.",
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Accept", value: "application/json" }],
    requestBody: `{
  "full_ownership": false,
  "tn": {
    "orig": {
      "start": "+1.5555855555"
    }
  },
  "caller_profile_id": "{{profileId}}",
  "label": [
    "test$label1",
    "test$label8"
  ]
}`,
    responseBody: `{
  "id": "69aa0525232c112395eb458e",
  "state": "ACTIVE",
  "account_id": "x59tj8rtv1",
  "vetter": "NEUSTAR",
  "priority": 0,
  "full_ownership": true,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555855555",
      "count": 1
    }
  },
  "label": [
    "reallyimportantnumber",
    "customercare"
  ],
  "vetting": {
    "request_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 5 Mar 2026 22:35:17 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Requested",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 5 Mar 2026 22:35:17 GMT",
  "updated_by": "user_v4_api_prod",
  "updated_date": "Thu, 5 Mar 2026 22:39:25 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "get-tn-asset",
    category: "TN Assets",
    name: "Get TN Account Asset",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset/{assetId}",
    description: "Retrieve a specific TN asset by its ID, including vetting status, partner enablement data, and caller profile association.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{
  "id": "69a088f66ccc0121aeb816d2",
  "state": "ACTIVE",
  "account_id": "x59tj8rtv1",
  "vetter": "CARRIER",
  "priority": 0,
  "full_ownership": false,
  "owner_type": "enterprise",
  "parent_account_id": "x0vo1z7q11",
  "super_account_id": "x0vo1z7q11",
  "tn": {
    "orig": {
      "start": "+1.5555555555",
      "count": 1
    }
  },
  "vetting": {
    "request_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT",
    "status": "VETTING_DEFERRED",
    "status_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT"
  },
  "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
  "caller_profile_id": "699f684820a7a57a0a67c03a",
  "tagging_status": {},
  "partner_data": [
    {
      "name": "RICH-BCD",
      "partner": [
        {
          "name": "att",
          "status": "Enable-Completed",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "verizon",
          "status": "Enable-Processing",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        },
        {
          "name": "tmobile",
          "status": "Enable-Completed",
          "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
        }
      ]
    }
  ],
  "created_by": "user_v4_api_prod",
  "created_date": "Thu, 26 Feb 2026 17:55:02 GMT",
  "updated_by": "PartnerAdmin",
  "updated_date": "Thu, 26 Feb 2026 17:55:05 GMT"
}`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "list-tn-assets",
    category: "TN Assets",
    name: "List TN Account Assets",
    method: "GET",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset",
    description: "List all TN assets for an account, including their states, vetting statuses, and partner data.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `[
  {
    "id": "69a088f66ccc0121aeb816d2",
    "state": "VETTING",
    "type": "tcstn",
    "version": "v4",
    "account_id": "x59tj8rtv1",
    "account_name": "user_sample enterprise1",
    "vetter": "NEUSTAR",
    "priority": 0,
    "full_ownership": false,
    "owner_type": "enterprise",
    "parent_account_id": "x0vo1z7q11",
    "super_account_id": "x0vo1z7q11",
    "tn": {
      "orig": {
        "start": "+1.5555555555",
        "count": 1
      }
    },
    "vetting": {
      "request_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT",
      "status": "VETTING_DEFERRED",
      "status_timestamp": "Thu, 26 Feb 2026 17:55:02 GMT"
    },
    "caller_profile": "Your Company Name_BCD_Rich_20260225-212320",
    "caller_profile_id": "699f684820a7a57a0a67c03a",
    "tagging_status": {},
    "partner_data": [
      {
        "name": "RICH-BCD",
        "partner": [
          {
            "name": "att",
            "status": "Enable-Completed",
            "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
          },
          {
            "name": "verizon",
            "status": "Enable-Processing",
            "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
          },
          {
            "name": "tmobile",
            "status": "Enable-Completed",
            "caller_profile": "Your Company Name_BCD_Rich_20260225-212320"
          }
        ]
      }
    ],
    "created_by": "user_v4_api_prod",
    "created_date": "Thu, 26 Feb 2026 17:55:02 GMT",
    "updated_by": "PartnerAdmin",
    "updated_date": "Thu, 26 Feb 2026 17:55:05 GMT"
  }
]`,
    responseStatus: 200,
    product: ["common"]
  },
  {
    id: "delete-tn-asset",
    category: "TN Assets",
    name: "Delete TN Account Asset",
    method: "DELETE",
    path: "/ccid/sdpr/v4/admin/account/{accountId}/orig/tcs/asset/{tnAssetId}",
    description: "Remove a TN asset from an account. The TN will no longer be associated with any caller profile or service.",
    headers: [{ key: "Accept", value: "application/json" }],
    responseBody: `{}`,
    responseStatus: 200,
    product: ["common"]
  }
];

export const getEndpointsForProduct = (product: "scp" | "bcd" | "cno") => {
  return apiEndpoints.filter(ep => ep.product?.includes(product as "scp" | "bcd") || ep.product?.includes("common"));
};

export const getEndpointById = (id: string) => {
  return apiEndpoints.find(ep => ep.id === id);
};

export const getCategories = (product?: "scp" | "bcd" | "cno") => {
  const eps = product ? getEndpointsForProduct(product) : apiEndpoints;
  const cats: string[] = [];
  eps.forEach(ep => {
    if (!cats.includes(ep.category)) cats.push(ep.category);
  });
  return cats;
};
