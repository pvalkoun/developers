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
  images?: { src: string; alt: string; caption?: string }[];
}

// Image imports for Twilio integration
import twilioCreateService from "@/assets/twilio/twilio-create-service.jpg";
import twilioCreateFunction from "@/assets/twilio/twilio-create-function.jpg";
import twilioFunctionEditor from "@/assets/twilio/twilio-function-editor.jpg";
import twilioFunctionCode from "@/assets/twilio/twilio-function-code.jpg";
import twilioEnvVariables from "@/assets/twilio/twilio-env-variables.jpg";
import twilioSecuritySettings from "@/assets/twilio/twilio-security-settings.jpg";
import twilioDeploy from "@/assets/twilio/twilio-deploy.jpg";
import twilioCopyUrl from "@/assets/twilio/twilio-copy-url.jpg";

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
        content: "This guide walks you through creating a Twilio Function that triggers on the `initiated` call status and posts to the TransUnion CCID endpoint. It includes code, wiring steps for the `/Calls` API, and test/debug tips."
      },
      {
        title: "What You'll Build",
        content: "- A Twilio Function that:\n- Receives Twilio `StatusCallback` for `CallStatus=initiated`\n- Sends a POST to `https://authn.ccid.neustar.biz/ccid/authn/v2/identity?apiKey=<from env>`\n- Prefixes phone numbers with `tel:`\n- Includes `from`, `to`, and `Origid` (`AccountSid`) in the JSON body\n- The `/Calls` API configuration that triggers this function on call initiation"
      },
      {
        title: "Prerequisites",
        content: "Before you begin, ensure you have:\n- A Twilio account with access to **Functions & Assets** (Runtime v2+)\n- A TransUnion API key (you'll store it as a Twilio environment variable)\n- Completed the TCS account setup (Account, TCS, Feature, Caller Profile, and TN Asset)"
      },
      {
        title: "Step 1 — Create a Twilio Service",
        content: "1. Go to **Twilio Console** → **Functions & Assets** → **Services**\n2. Click **Create Service** → name your service (e.g. `TUprecallauth`)\n3. The URL-friendly unique name will form the first part of your Serverless domain and cannot be updated\n4. Click **Next** to create the service",
        images: [
          { src: twilioCreateService, alt: "Twilio Console — Name your Service dialog", caption: "Creating a new Twilio Service with the 'Name your Service' dialog" }
        ]
      },
      {
        title: "Step 2 — Create a Function",
        content: "1. Inside your service, click the **Add +** button\n2. Select **Add Function**\n3. Name it: `/pre-call-init-callback-neustar`\n4. A blank function editor will appear",
        images: [
          { src: twilioCreateFunction, alt: "Twilio Console — Functions and Assets overview", caption: "The Functions and Assets overview with 'Create your function' prompt" },
          { src: twilioFunctionEditor, alt: "Twilio Console — Blank function editor", caption: "The newly created blank function editor ready for code" }
        ]
      },
      {
        title: "Step 3 — Paste the Function Code",
        content: "Paste the following code into your Twilio Function editor. This function intercepts the call initiation event and sends the caller information to the CCID endpoint for authentication.",
        code: `// Filename: pre-call-init-callback-neustar.js

exports.handler = async function (context, event, callback) {
  // Safely pull the Neustar API key from environment
  const neustarApiKey = context.neustarApiKey;

  if (!neustarApiKey) {
    console.error('Missing environment variable: neustarApiKey');
    const res = new Twilio.Response();
    res.setStatusCode(500);
    res.setBody({ ok: false, error: 'Missing neustarApiKey env var' });
    return callback(null, res);
  }

  // Log minimal info for debugging (avoid logging secrets)
  console.log('StatusCallback event fields (redacted):', {
    CallStatus: event.CallStatus,
    Caller: event.Caller || event.From,
    Called: event.Called || event.To,
  });

  // Prefer Caller/Called; fallback to From/To
  const callerRaw = event.Caller || event.From || '';
  const calledRaw = event.Called || event.To || '';
  const callStatus = (event.CallStatus || '').toLowerCase();

  // Only act on initiated
  if (callStatus !== 'initiated') {
    const res = new Twilio.Response();
    res.setStatusCode(204); // no-op for other events
    return callback(null, res);
  }

  // Prefix numbers with "tel:" (leave as-is if already prefixed)
  const withTel = (num) =>
    typeof num === 'string' && num.startsWith('tel:') ? num : \`tel:\${num}\`;

  const payload = {
    from: withTel(callerRaw),
    to: withTel(calledRaw),
  };

  // Build target URL with apiKey from env
  const baseUrl = 'https://authn.ccid.neustar.biz/ccid/authn/v2/identity';
  const url = \`\${baseUrl}?apiKey=\${encodeURIComponent(neustarApiKey)}\`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers Neustar requires here (e.g., Accept)
      },
      body: JSON.stringify(payload),
    });

    console.log('Neustar response status:', resp.status);

    const ok = new Twilio.Response();
    ok.setStatusCode(200);
    ok.setBody({ success: true });
    return callback(null, ok);
  } catch (err) {
    console.error('Error calling Neustar CCID endpoint:', err);
    const errorRes = new Twilio.Response();
    errorRes.setStatusCode(502);
    errorRes.setBody({ ok: false, error: 'Failed to reach Neustar CCID endpoint' });
    return callback(null, errorRes);
  }
};`,
        language: "javascript",
        images: [
          { src: twilioFunctionCode, alt: "Twilio Console — Function code pasted in editor", caption: "The completed function code in the Twilio editor" }
        ]
      },
      {
        title: "Step 4 — Add Environment Variable",
        content: "1. In the Function sidebar, open **Settings & More** → **Environment Variables**\n2. Add a new variable:\n   - Key: `neustarApiKey`\n   - Value: Your TransUnion API key\n3. Click **Add** then **Save**",
        images: [
          { src: twilioEnvVariables, alt: "Twilio Console — Environment Variables configuration", caption: "Adding the neustarApiKey environment variable in Twilio" }
        ]
      },
      {
        title: "Step 5 — Secure the Function",
        content: "1. Click the lock icon next to your function name to open **Visibility** settings\n2. Select **Protected** — this requires a valid Twilio Signature header in the request to be accessed\n3. Consider restricting execution to your IPs if fronted by a gateway",
        images: [
          { src: twilioSecuritySettings, alt: "Twilio Console — Function visibility and security settings", caption: "Setting the function visibility to 'Protected' for security" }
        ]
      },
      {
        title: "Step 6 — Deploy the Function",
        content: "1. Click **Deploy All** to publish your changes\n2. Wait for the build to complete — you'll see log messages confirming:\n   - `Starting build...`\n   - `Build completed`\n   - `Deployed to environment: <your-domain>.twil.io`",
        images: [
          { src: twilioDeploy, alt: "Twilio Console — Deploying the function", caption: "Deploying the function — the logs show a successful build and deployment" }
        ]
      },
      {
        title: "Step 7 — Copy the Function URL",
        content: "After deployment, click **Copy URL** to get the function's public URL:\n\n`https://your-domain-1234.twil.io/pre-call-init-callback-neustar`\n\nYou'll need this URL in the next step to configure the `/Calls` API.",
        images: [
          { src: twilioCopyUrl, alt: "Twilio Console — Copy URL after deployment", caption: "Copy the deployed function URL to use as StatusCallback" }
        ]
      },
      {
        title: "Step 8 — Use the /Calls API with StatusCallback",
        content: "When placing a call via the Twilio `/Calls` API, set the function URL as `StatusCallback` and request the `initiated` event.",
        code: `curl -X POST \\
  "https://api.twilio.com/2010-04-01/Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Calls.json" \\
  --data-urlencode "To=+15551234567" \\
  --data-urlencode "From=+15557654321" \\
  --data-urlencode "Url=https://handler.twilio.com/twiml/YourTwiMLBinOrAppUrl" \\
  --data-urlencode "StatusCallback=https://your-domain-1234.twil.io/pre-call-init-callback-neustar" \\
  --data-urlencode "StatusCallbackEvent=initiated" \\
  -u "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx:your_auth_token"`,
        language: "bash"
      },
      {
        title: "What Happens",
        content: "- Twilio initiates the call and posts a `StatusCallback` webhook with `CallStatus=initiated`\n- Your Function posts JSON to the CCID endpoint:\n\n```json\n{\n  \"from\": \"tel:+15557654321\",\n  \"to\": \"tel:+15551234567\"\n}\n```"
      },
      {
        title: "Step 9 — Test & Troubleshoot",
        content: "1. Trigger a test call via the curl above (or a helper library)\n2. View Function logs: **Console** → **Functions** → **Logs**\n3. Validate CCID response: Check logs for `Neustar response status`\n4. Common checks:\n- Environment var `neustarApiKey` set and deployed?\n- `StatusCallbackEvent` includes `initiated`?\n- Function URL reachable (no auth blockers)?"
      },
      {
        title: "Helper Library Snippets (Optional)",
        content: "**Node.js (twilio)**",
        code: `const client = require('twilio')(accountSid, authToken);

await client.calls.create({
  to: '+15551234567',
  from: '+15557654321',
  url: 'https://handler.twilio.com/twiml/YourTwiMLBinOrAppUrl',
  statusCallback: 'https://your-domain-1234.twil.io/pre-call-init-callback-neustar',
  statusCallbackEvent: ['initiated'],
});`,
        language: "javascript"
      },
      {
        title: "Python Example",
        content: "**Python (twilio)**",
        code: `from twilio.rest import Client
client = Client(account_sid, auth_token)

client.calls.create(
    to='+15551234567',
    from_='+15557654321',
    url='https://handler.twilio.com/twiml/YourTwiMLBinOrAppUrl',
    status_callback='https://your-domain-1234.twil.io/pre-call-init-callback-neustar',
    status_callback_event=['initiated']
)`,
        language: "python"
      },
      {
        title: "Optional Enhancements",
        content: "- Add more fields: `CallSid`, `Direction`, `Timestamp` to the payload\n- Add retry/backoff if the CCID endpoint times out\n- Redact PII in logs for production hygiene"
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
