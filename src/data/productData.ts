export interface Product {
  id: "scp" | "bcd";
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  benefits: string[];
  setupSteps: SetupStep[];
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
        details: "Attach TCS configuration to your account, specifying which carrier distributors (AT&T, T-Mobile, USCC) should be enabled."
      },
      {
        step: 4,
        title: "Attach SCP Feature",
        description: "Enable the Spoofed Call Protection feature on your account.",
        apiEndpointId: "attach-feature-scp",
        details: "Attach the SCP feature type with STIR partner service. This enables STIR/SHAKEN digital signing for your calls."
      },
      {
        step: 5,
        title: "Create Caller Profile",
        description: "Define how your organization appears on outbound calls.",
        apiEndpointId: "attach-scp-caller-profile",
        details: "Create a caller profile with your organization's display name. This profile is associated with the SCP feature."
      },
      {
        step: 6,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers to be protected.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) as an asset and link it to your caller profile. Once active, outbound calls from these numbers will be digitally signed."
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
        details: "Attach TCS configuration to your account, specifying which carrier distributors should display your branded content."
      },
      {
        step: 4,
        title: "Attach BCD Feature",
        description: "Enable the Branded Call Display feature on your account.",
        apiEndpointId: "attach-feature-bcd",
        details: "Attach the RICH-BCD feature type with DISPLAY partner service. This enables rich branded content on your outbound calls."
      },
      {
        step: 5,
        title: "Create Caller Profile",
        description: "Define your brand's visual identity for outbound calls.",
        apiEndpointId: "attach-bcd-caller-profile",
        details: "Create a caller profile with your organization's display name, logo, and call reason. This rich content will be shown on the recipient's device."
      },
      {
        step: 6,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers for branded display.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) and link it to your branded caller profile. Calls from these numbers will display your branded content."
      }
    ]
  }
];

export const getProduct = (id: string) => products.find(p => p.id === id);
