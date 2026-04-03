export interface Integration {
  id: string;
  name: string;
  platform: string;
  description: string;
  products: ("scp" | "bcd")[];
  sections: IntegrationSection[];
}

export interface IntegrationSection {
  title: string;
  content: string;
  code?: string;
  language?: string;
}

export const integrations: Integration[] = [
  {
    id: "twilio",
    name: "Twilio Integration",
    platform: "Twilio",
    description: "Integrate TransUnion pre-call authentication with Twilio to digitally sign outbound calls using a Twilio Function that triggers on call initiation.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "This guide walks you through creating a Twilio Function that triggers on the initiated call status and posts to the TransUnion CCID endpoint. The function receives Twilio StatusCallback for CallStatus=initiated and sends a POST to the CCID authentication endpoint."
      },
      {
        title: "What You'll Build",
        content: "A Twilio Function that:\n- Receives Twilio StatusCallback for `CallStatus=initiated`\n- Sends a POST to the CCID authentication endpoint\n- Prefixes phone numbers with `tel:`\n- Includes `from`, `to`, and `Origid` (AccountSid) in the JSON body\n- The `/Calls` API configuration that triggers this function on call initiation"
      },
      {
        title: "Prerequisites",
        content: "Before you begin, ensure you have:\n- A Twilio account with access to Functions & Assets (Runtime v2+)\n- A TransUnion API key (stored as a Twilio environment variable)\n- Completed the TCS account setup (Account, TCS, Feature, Caller Profile, and TN Asset)"
      },
      {
        title: "Step 1 — Create a Twilio Function",
        content: "1. Go to **Twilio Console** → **Functions & Assets** → **Services**\n2. Click **Create Service** → name your service\n3. Click **Create Function** → choose **Blank**\n4. Name it: `pre-call-init-callback`"
      },
      {
        title: "Step 2 — Add the Function Code",
        content: "Paste the following code into your Twilio Function. This function intercepts the call initiation event and sends the caller information to the CCID endpoint for authentication.",
        code: `exports.handler = async function (context, event, callback) {
  const fetch = require("node-fetch");

  const from = event.From;
  const to = event.To;
  const callStatus = event.CallStatus;
  const accountSid = event.AccountSid;

  console.log(\`StatusCallback received: \${callStatus}, From: \${from}, To: \${to}\`);

  if (callStatus !== "initiated") {
    return callback(null, "<Response/>");
  }

  const apiKey = context.NEUSTAR_API_KEY;
  const url = \`https://authn.ccid.neustar.biz/ccid/authn/v2/identity?apiKey=\${apiKey}\`;

  const body = {
    from: \`tel:\${from}\`,
    to: \`tel:\${to}\`,
    Origid: accountSid,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log("CCID Response:", JSON.stringify(result));
  } catch (err) {
    console.error("CCID call failed:", err);
  }

  return callback(null, "<Response/>");
};`,
        language: "javascript"
      },
      {
        title: "Step 3 — Configure Environment Variables",
        content: "1. In your Twilio Service, go to **Settings** → **Environment Variables**\n2. Add a new variable:\n   - Key: `NEUSTAR_API_KEY`\n   - Value: Your TransUnion API key\n3. Click **Save**"
      },
      {
        title: "Step 4 — Wire Up the /Calls API",
        content: "When making outbound calls via the Twilio `/Calls` API, include the StatusCallback URL pointing to your function:\n\n```\nStatusCallback=https://<your-service>.twil.io/pre-call-init-callback\nStatusCallbackEvent=initiated\n```"
      },
      {
        title: "Testing",
        content: "1. Make a test call through Twilio\n2. Check Twilio Function logs for the StatusCallback event\n3. Verify the CCID response in the logs\n4. Confirm the call displays authenticated/branded content on the recipient's device"
      }
    ]
  },
  {
    id: "genesys",
    name: "Genesys Cloud CX Integration",
    platform: "Genesys Cloud CX",
    description: "Integrate TransUnion Certified Caller ID Authentication with Genesys Cloud CX using Web Services Data Actions for pre-call authentication.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "TransUnion Certified Caller ID (CCID) is a pre-call authentication service that verifies outbound calls before they reach the carrier network. When integrated with Genesys Cloud CX, it automatically authenticates each outbound call to ensure it is identified as legitimate."
      },
      {
        title: "Integration Benefits",
        content: "- **Automated Authentication**: Every outbound call is authenticated in real-time\n- **Carrier Trust**: Calls receive verified status across carrier networks\n- **Seamless Integration**: Works with existing Genesys Cloud CX call flows\n- **Campaign Support**: Compatible with outbound campaigns and dialers"
      },
      {
        title: "Prerequisites",
        content: "**Important**: Before setting up the Genesys integration, you must have completed the TCS provisioning process:\n\n1. Created an Account with TCS\n2. Attached Account TCS configuration\n3. Attached the appropriate Feature (SCP or BCD)\n4. Created Caller Profiles\n5. Registered TN Assets\n\n**Genesys Cloud Permissions Required:**\n- Integrations > Integration > Add, Edit, View\n- Integrations > Action > Add, Edit, Execute"
      },
      {
        title: "Step 1 — Create Integration",
        content: "1. Navigate to **Admin** → **Integrations** in Genesys Cloud\n2. Click **+ Add Integration**\n3. Search for **Web Services Data Actions**\n4. Name it: `TransUnion CCID Authentication`\n5. Click **Save**"
      },
      {
        title: "Step 2 — Create Action",
        content: "1. Go to **Admin** → **Integrations** → **Actions**\n2. Click **+ Add Action**\n3. Select your `TransUnion CCID Authentication` integration\n4. Name it: `Authenticate Outbound Call`\n5. Configure the action with the CCID API endpoint"
      },
      {
        title: "Step 3 — Configure the Action",
        content: "Set up the request configuration:\n- **Request URL**: `https://authn.ccid.neustar.biz/ccid/authn/v2/identity?apiKey={{apiKey}}`\n- **Method**: POST\n- **Headers**: `Content-Type: application/json`\n\nRequest body template:",
        code: `{
  "from": "tel:{{fromNumber}}",
  "to": "tel:{{toNumber}}",
  "Origid": "{{accountId}}"
}`,
        language: "json"
      },
      {
        title: "Step 4 — Create Call Rule for Campaigns",
        content: "1. Navigate to **Admin** → **Outbound** → **Call Rules**\n2. Create a new rule triggered on call initiation\n3. Add the `Authenticate Outbound Call` action\n4. Map the From and To number variables\n5. Save and apply the rule to your outbound campaigns"
      },
      {
        title: "Troubleshooting",
        content: "**Common Issues:**\n\n| Issue | Solution |\n|-------|----------|\n| 401 Unauthorized | Verify API key is correct and not expired |\n| Timeout errors | Check network connectivity to CCID endpoint |\n| Calls not authenticated | Ensure TN assets are registered and active |\n| Action not triggering | Verify call rule is attached to campaign |"
      }
    ]
  }
];

export const getIntegration = (id: string) => integrations.find(i => i.id === id);
export const getIntegrationsForProduct = (productId: string) => integrations.filter(i => i.products.includes(productId as "scp" | "bcd"));
