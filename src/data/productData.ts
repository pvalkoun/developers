export interface Product {
  id: "scp" | "bcd" | "pca" | "cno";
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  benefits: string[];
  setupSteps: SetupStep[];
  isExternal?: boolean;
  externalPath?: string;
}

export interface SetupStep {
  step: number;
  title: string;
  description: string;
  apiEndpointId: string;
  details: string;
}

export const products: Product[] = [
  {
    id: "pca",
    name: "Call Authentication",
    fullName: "TruContact Call Authentication (CCID)",
    tagline: "Verify caller identity in real-time using STIR/SHAKEN before every call",
    description: "Call Authentication (PCA) is a standards-based REST API for verifying caller identity using IETF RFC 8224 and the ATIS SHAKEN framework. It is a prerequisite for both Spoofed Call Protection and Branded Call Display — every outbound call must be authenticated through the CCID service before any TruContact features can take effect.",
    benefits: [
      "Required prerequisite for SCP and BCD to function",
      "Real-time caller identity verification using STIR/SHAKEN",
      "Enables full attestation (A-level) for outbound calls",
      "Supports API Key and IP Allowlist authentication",
      "Standards-compliant with IETF RFC 8224 and ATIS SHAKEN"
    ],
    isExternal: true,
    externalPath: "/pre-call-auth",
    setupSteps: []
  },
  {
    id: "cno",
    name: "Spam Tag Mitigation (CNO)",
    fullName: "TruContact Spam Tag Mitigation",
    tagline: "Prevent your legitimate calls from being mislabeled as spam or fraud",
    description: "Spam Tag Mitigation, powered by Calling Name Optimization (CNO), ensures your legitimate outbound calls are not incorrectly flagged as spam, scam, or fraud by carrier analytics engines. By registering and validating your calling numbers, you protect your call delivery rates and maintain your organization's reputation across all major carrier networks.",
    benefits: [
      "Prevent legitimate calls from being labeled as spam",
      "Improve call delivery and answer rates",
      "Protect your organization's calling reputation",
      "Real-time monitoring of spam tag status across carriers",
      "Automated remediation for mislabeled numbers"
    ],
    setupSteps: [
      {
        step: 1,
        title: "Authenticate",
        description: "Obtain an access token to authorize API calls.",
        apiEndpointId: "auth-token",
        details: "Use your credentials to authenticate with the TCS platform. The returned access token must be included in the Authorization header of all subsequent requests."
      },
      {
        step: 2,
        title: "Create Account",
        description: "Set up your enterprise account on the TCS platform.",
        apiEndpointId: "create-account",
        details: "Create an enterprise account with SDPR service enabled. This establishes your organization's identity on the platform."
      },
      {
        step: 3,
        title: "Attach TCS Configuration",
        description: "Enable TCS services and configure carrier distributors.",
        apiEndpointId: "attach-account-tcs",
        details: "Attach TCS configuration to your account, specifying the lead generation source and which carrier distributors should be enabled for spam tag mitigation."
      },
      {
        step: 4,
        title: "Attach Features",
        description: "Enable the Spam Tag Mitigation feature on your account.",
        apiEndpointId: "attach-feature",
        details: "Attach the CNO feature with per-carrier partner enablement (att, tmobile, verizon). This activates spam tag monitoring and remediation for your numbers."
      },
      {
        step: 5,
        title: "Create Caller Profile",
        description: "Define your organization's calling identity.",
        apiEndpointId: "attach-scp-caller-profile",
        details: "Create a caller profile with CNO service configuration. Each carrier partner status will be set to TU-Review-Requested for initial validation."
      },
      {
        step: 6,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers for spam tag monitoring.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) as an asset and link it to your caller profile. Use full_ownership: true for numbers you own directly, or full_ownership: false for BYOC numbers."
      }
    ]
  },
  {
    id: "bcd",
    name: "Branded Call Display",
    fullName: "TruContact Branded Call Display",
    tagline: "Improve customer engagement by adding rich branded content to the mobile call display",
    description: "Branded Call Display (BCD) enhances outbound calls with rich visual content displayed on the recipient's mobile device. This includes your company logo, business name, call reason, and other contextual information that helps recipients identify and trust your calls, dramatically improving answer rates.",
    benefits: [
      "Up to 56% improvement in call answer rates",
      "Display company logo and brand on recipient's phone",
      "Show call reason to increase trust and engagement",
      "Up to 32% increase in incremental income",
      "Differentiate from spam and unknown callers"
    ],
    setupSteps: [
      {
        step: 1,
        title: "Authenticate",
        description: "Obtain an access token to authorize API calls.",
        apiEndpointId: "auth-token",
        details: "Use your credentials to authenticate with the TCS platform. The returned access token must be included in the Authorization header of all subsequent requests."
      },
      {
        step: 2,
        title: "Create Account",
        description: "Set up your enterprise account on the TCS platform.",
        apiEndpointId: "create-account",
        details: "Create an enterprise account with SDPR service enabled. This establishes your organization's identity on the platform."
      },
      {
        step: 3,
        title: "Attach TCS Configuration",
        description: "Enable TCS services and configure carrier distributors.",
        apiEndpointId: "attach-account-tcs",
        details: "Attach TCS configuration to your account, specifying the lead generation source and which carrier distributors should display your branded content."
      },
      {
        step: 4,
        title: "Attach Features",
        description: "Enable the Branded Call Display feature on your account.",
        apiEndpointId: "attach-feature",
        details: "Attach features including RICH-BCD with per-carrier partner enablement. You can also attach AUTH-BCD and NAME-BCD in the same request for different branding tiers."
      },
      {
        step: 5,
        title: "Create Image Profile",
        description: "Upload your company logo for display on recipient devices.",
        apiEndpointId: "create-image-profile",
        details: "Submit your public image URL to create an image profile. TransUnion will process and host the image internally. The returned image_profile_id is required when creating a Rich BCD caller profile."
      },
      {
        step: 6,
        title: "Create Caller Profile",
        description: "Define your brand's visual identity for outbound calls.",
        apiEndpointId: "attach-bcd-caller-profile",
        details: "Create a caller profile with your branded_caller_name, call_reason, and the image_profile_id from the previous step for logo display. The RICH-BCD service is configured with per-carrier partner statuses."
      },
      {
        step: 7,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers for branded display.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) and link it to your branded caller profile. Use full_ownership: true for numbers you own directly, or full_ownership: false for BYOC numbers managed through third-party carriers like Twilio or Genesys."
      }
    ]
  },
  {
    id: "scp",
    name: "Spoofed Call Protection",
    fullName: "TruContact Spoofed Call Protection",
    tagline: "Digitally sign outbound calls to prevent fraudsters from spoofing your numbers",
    description: "Spoofed Call Protection (SCP) uses STIR/SHAKEN technology to digitally sign your outbound calls, proving to carriers and call recipients that the call genuinely originates from your organization. This prevents bad actors from spoofing your phone numbers to conduct fraud, protecting both your brand reputation and your customers.",
    benefits: [
      "Prevent fraudsters from spoofing your phone numbers",
      "Protect your brand reputation and customer trust",
      "Meet STIR/SHAKEN regulatory compliance requirements",
      "Reduce illegal robocalls made using your numbers",
      "Improve call answer rates with authenticated calls"
    ],
    setupSteps: [
      {
        step: 1,
        title: "Authenticate",
        description: "Obtain an access token to authorize API calls.",
        apiEndpointId: "auth-token",
        details: "Use your credentials to authenticate with the TCS platform. The returned access token must be included in the Authorization header of all subsequent requests."
      },
      {
        step: 2,
        title: "Create Account",
        description: "Set up your enterprise account on the TCS platform.",
        apiEndpointId: "create-account",
        details: "Create an enterprise account with SDPR service enabled. This establishes your organization's identity on the platform."
      },
      {
        step: 3,
        title: "Attach TCS Configuration",
        description: "Enable TCS services and configure carrier distributors.",
        apiEndpointId: "attach-account-tcs",
        details: "Attach TCS configuration to your account, specifying the lead generation source and which carrier distributors (AT&T, T-Mobile, Verizon) should be enabled."
      },
      {
        step: 4,
        title: "Attach Features",
        description: "Enable the Spoofed Call Protection feature on your account.",
        apiEndpointId: "attach-feature",
        details: "Attach features including SPOOF-CALL-PROTECTION with per-carrier partner enablement (att, tmobile, verizon). Multiple features can be attached in a single request."
      },
      {
        step: 5,
        title: "Create Caller Profile",
        description: "Define how your organization appears on outbound calls.",
        apiEndpointId: "attach-scp-caller-profile",
        details: "Create a caller profile with CCID-ORIG and SPOOF-CALL-PROTECTION service configuration. Each carrier partner status will be set to TU-Review-Requested."
      },
      {
        step: 6,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers to be protected.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) as an asset and link it to your caller profile. Use full_ownership: true for numbers you own directly, or full_ownership: false for BYOC numbers managed through third-party carriers like Twilio or Genesys."
      }
    ]
  }
];

export const getProduct = (id: string) => products.find(p => p.id === id);
