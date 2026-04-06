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

// Image imports for Genesys integration
import genesysAddIntegration from "@/assets/genesys/genesys-add-integration.jpg";
import genesysNameIntegration from "@/assets/genesys/genesys-name-integration.jpg";
import genesysIntegrationList from "@/assets/genesys/genesys-integration-list.jpg";
import genesysSelectIntegration from "@/assets/genesys/genesys-select-integration.jpg";
import genesysHipaaSetting from "@/assets/genesys/genesys-hipaa-setting.jpg";
import genesysOutputContract from "@/assets/genesys/genesys-output-contract.jpg";
import genesysConfiguration from "@/assets/genesys/genesys-configuration.jpg";
import genesysTestResults from "@/assets/genesys/genesys-test-results.jpg";
import genesysCallRule from "@/assets/genesys/genesys-call-rule.jpg";
import genesysRuleConfig from "@/assets/genesys/genesys-rule-config.jpg";
import genesysCampaignRuleset from "@/assets/genesys/genesys-campaign-ruleset.jpg";
import genesysDataActionPerf from "@/assets/genesys/genesys-data-action-perf.jpg";
import genesysCampaignPerf from "@/assets/genesys/genesys-campaign-perf.jpg";

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
    description: "Integrate TransUnion Certified Caller ID (CCID) Authentication with Genesys Cloud CX using Web Services Data Actions for real-time pre-call authentication of outbound calls.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "This document provides step-by-step instructions for integrating Genesys Cloud CX with TransUnion's Certified Caller ID (CCID) Authentication Service. This integration enables real-time caller ID authentication for outbound calls, helping to improve call answer rates and establish caller legitimacy."
      },
      {
        title: "Integration Benefits",
        content: "- **Real-time caller ID authentication** — Authenticates outbound calls to improve answer rates and reduce spam blocking\n- **Prerequisite for SCP/BCD services** — Required foundation to enable TransUnion's Secure Call Platform (SCP) and Branded Call Display (BCD)\n- **Branded caller display** — Display your company name, logo, and call reason on recipient devices (requires BCD activation)\n- **Enhanced caller trust** — Verified calls build recipient confidence and legitimacy\n- **Improved contact rates** — Authenticated calls are more likely to be answered\n- **Seamless integration** — Works automatically with Genesys Cloud CX outbound campaigns\n- **STIR/SHAKEN compliance** — Helps meet regulatory requirements for call authentication"
      },
      {
        title: "Prerequisites: SCP/BCD Services",
        content: "This Genesys Cloud CX integration is a prerequisite for enabling TransUnion's **Secure Call Platform (SCP)** and **Branded Call Display (BCD)** services. Before you can utilize TransUnion's full suite of caller authentication and branding services, you must:\n\n1. Complete this BYOC (Bring Your Own Carrier) integration by following the steps in this guide\n2. Contact TransUnion to enable SCP and/or BCD services for your organization\n3. Provide TransUnion with your integration details including your Genesys Cloud organization ID and configured phone numbers\n\n**What are SCP and BCD?**\n- **Secure Call Platform (SCP)**: Advanced call authentication and verification services that work in conjunction with this integration\n- **Branded Call Display (BCD)**: Display your company name, logo, and call reason on recipient devices for enhanced brand recognition and trust"
      },
      {
        title: "Genesys Prerequisites",
        content: "Before beginning the integration, ensure you have:\n\n- **Genesys Cloud CX Admin Access** — Required permissions to create integrations and data actions\n- **TransUnion API Key** — Provided by TransUnion as part of the onboarding process\n- **Valid Phone Numbers** — Outbound phone numbers configured in Genesys Cloud CX\n- **Network Access** — Ensure your Genesys Cloud environment can reach `https://authn.ccid.neustar.biz`\n\n**Required Genesys Cloud Permissions:**\n- Integrations > Integration > Add, Edit, View\n- Integrations > Action > Add, Edit, View"
      },
      {
        title: "Step 1 — Create Integration",
        content: "This step creates the Web Services Data Actions integration that will connect to TransUnion's CCID API.\n\n1. Log in to your Genesys Cloud CX organization\n2. Go to **Admin** → **Integrations**\n3. Click **Add Integration** (+) icon\n4. In the search box, type: `Web Services Data Actions`\n5. Select **Web Services Data Actions** from the results\n6. Click **Install** to proceed",
        images: [
          { src: genesysAddIntegration, alt: "Genesys Cloud — Add Integration search for Web Services Data Actions", caption: "Search for 'Web Services Data Actions' in the Add Integration dialog" }
        ]
      },
      {
        title: "Step 1.1 — Configure Integration Details",
        content: "1. Set **Integration Name**: `TU AS Integration` (or your preferred name)\n2. Set **Description** (Optional): `TransUnion Certified Caller ID Authentication Service`\n3. Click **Save**\n4. The integration should now appear in your integrations list with status **Active**",
        images: [
          { src: genesysNameIntegration, alt: "Genesys Cloud — Integration Name configuration", caption: "Naming the integration 'TU AS Integration'" },
          { src: genesysIntegrationList, alt: "Genesys Cloud — Integration list showing Active status", caption: "The integration list showing TU AS Integration with Active status" }
        ]
      },
      {
        title: "Step 2 — Create Action",
        content: "This step creates a new data action within the integration to call the TransUnion CCID API.\n\n1. Go to **Admin** → **Integrations** → **Actions**\n2. Click **Add Action** (+) icon\n3. From the Integration dropdown, select the integration created in Step 1 (e.g., `TU AS Integration`)\n4. Set **Action Name**: `Authenticate Caller ID`\n5. Click **Add**",
        images: [
          { src: genesysSelectIntegration, alt: "Genesys Cloud — Select Integration for Action dialog", caption: "Selecting 'TU AS Integration' when creating a new action" }
        ]
      },
      {
        title: "Step 2.1 — Enable HIPAA/Secure Data",
        content: "1. On the Action **Summary** page, check the box for **HIPAA/Secure Data**\n2. This ensures secure handling of sensitive information and prevents logging of sensitive data",
        images: [
          { src: genesysHipaaSetting, alt: "Genesys Cloud — HIPAA/Secure Data checkbox", caption: "Enable HIPAA/Secure Data on the Authenticate Caller ID action" }
        ]
      },
      {
        title: "Step 3 — Configure Contracts",
        content: "Click **Setup** to begin configuration. Contracts define the input and output data structures for the action.\n\n**A. Input Contract**\n1. In the Input Contract section, click **JSON** edit mode\n2. Paste the following schema:",
        code: `{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fromNumber": {
      "type": "string",
      "description": "Caller ID number (without country code)",
      "default": "<outgoing phone number>"
    },
    "toNumber": {
      "type": "string",
      "description": "Destination phone number (without country code)"
    }
  }
}`,
        language: "json"
      },
      {
        title: "Step 3.1 — Output Contract",
        content: "1. In the Output Contract section, click **JSON** edit mode\n2. Paste the following schema:\n3. Click **Save** or **Apply**\n\n**Output Parameters:**\n- `status`: Indicates whether the API call was successful\n- `additionalProperties: true`: Allows capturing additional response fields from the API",
        code: `{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "status": {
      "type": "string",
      "description": "API call status"
    }
  }
}`,
        language: "json",
        images: [
          { src: genesysOutputContract, alt: "Genesys Cloud — Output Contract JSON schema", caption: "The Output Contract configuration in JSON edit mode" }
        ]
      },
      {
        title: "Step 3.2 — Configuration",
        content: "Configure the HTTP request details to call the TransUnion CCID API.\n\n1. **HTTP Method**: Select `POST`\n2. **Request URL Template**: `https://authn.ccid.neustar.biz/ccid/authn/v2/identity?apiKey=<APIKEY>`\n   - Replace `<APIKEY>` with the actual API key provided by TransUnion\n3. **Execution Timeout**: Set to `60` seconds\n4. **Request Body Template**:",
        code: `{"from":"tel:+1\${input.fromNumber}","to":"tel:+1\${input.toNumber}"}`,
        language: "json",
        images: [
          { src: genesysConfiguration, alt: "Genesys Cloud — Request URL, body template and response configuration", caption: "The full Configuration tab showing URL, headers, body template, and response mapping" }
        ]
      },
      {
        title: "Step 3.3 — Response Configuration",
        content: "Configure how the action processes the API response.\n\nIn the **Response** section, enter:",
        code: `{
  "translationMap": {},
  "translationMapDefaults": {},
  "successTemplate": "{\"status\": \"success\"}"
}`,
        language: "json"
      },
      {
        title: "Step 3.4 — Run Test",
        content: "Test the data action to ensure it's configured correctly.\n\n1. Click on the **Test** tab\n2. Enter test input values:\n   - `fromNumber`: A valid 10-digit phone number (e.g., `7033886651`)\n   - `toNumber`: A valid 10-digit phone number (e.g., `5035166763`)\n3. Click **Run Test**\n4. Verify results:\n   - Success Response: `{\"status\": \"success\"}`\n   - HTTP Status Code: `200 OK` or `201 Created`\n5. Once testing is successful, click **Publish** to make the action available for use in call flows",
        images: [
          { src: genesysTestResults, alt: "Genesys Cloud — Successful action test results", caption: "Successful test results showing 'Action successfully run' with status SUCCESS" }
        ]
      },
      {
        title: "Test Checklist",
        content: "- ☐ Integration is **Active**\n- ☐ Action is **Published**\n- ☐ Test execution returns success status\n- ☐ API key is valid and correctly configured\n- ☐ Phone numbers are in correct format (10 digits, no country code)\n\n| Field | Sample Value | Notes |\n|-------|-------------|-------|\n| fromNumber | 7033886651 | 10-digit format, no +1 |\n| toNumber | 5035166763 | 10-digit format, no +1 |"
      },
      {
        title: "Step 4 — Create Call Rule",
        content: "Call Rules allow you to execute data actions automatically as part of your outbound campaign workflow.\n\n1. Go to **Admin** → **Outbound** → **Rule Management**\n2. Click **Create New Rule** or **Add Rule** (+) icon\n3. Set **Rule Name**: `TU CCID Authentication Rule`\n4. Configure the rule with **Pre-Call** category",
        images: [
          { src: genesysCallRule, alt: "Genesys Cloud — Call Rule Set creation", caption: "Creating a new Call Rule Set with the Pre-Call rule" }
        ]
      },
      {
        title: "Step 4.1 — Configure Call Rule Action",
        content: "1. Within the rule, set **Category**: `Pre-Call` — this ensures authentication happens before the call is placed\n2. Configure **Condition**:\n   - Column: `phoneNumber`\n   - Operator: `is Greater Than`\n   - Value: `0`\n   - This ensures the rule runs for all valid phone numbers\n3. Set **Action Type**: `Data Action`\n4. Select **Integration**: `TU AS Integration`\n5. Select **Action**: `Authenticate Caller ID`\n6. Map **toNumber** to the contact's phone number field\n7. Click **Save**",
        images: [
          { src: genesysRuleConfig, alt: "Genesys Cloud — Call Rule condition and action configuration", caption: "Configuring the Pre-Call rule with condition, data action, and parameter mapping" }
        ]
      },
      {
        title: "Step 5 — Add Rule to Campaign",
        content: "Attach the rule to your outbound voice campaign.\n\n1. Go to **Admin** → **Outbound** → **Campaign Management**\n2. Select **Voice Campaigns** and locate your campaign\n3. Click **Edit** to open the campaign settings\n4. In the **Call Rule Sets** section, click **Add Rule Set**\n5. Select `TU CCID Authentication Rule`\n6. Click **Save** to apply",
        images: [
          { src: genesysCampaignRuleset, alt: "Genesys Cloud — Campaign configuration with Call Rule Sets", caption: "Adding the TU CCID Authentication Rule to the campaign's Call Rule Sets" }
        ]
      },
      {
        title: "How It Works",
        content: "Once configured, here's what happens for each outbound call:\n\n1. Campaign selects next contact from contact list\n2. Pre-call rule executes (TU CCID Authentication Rule)\n3. Data action calls TransUnion API with `fromNumber` and `toNumber`\n4. TransUnion API authenticates the call\n5. Authentication token deposited in call session registry\n6. Outbound call is placed\n7. Receiving carrier verifies call using the token\n8. Call displays as verified/authenticated to recipient\n\n**Token Management:**\n- The TransUnion API deposits an authentication token in the call session registry\n- When the call is received, the carrier verifies the token to confirm legitimacy\n- No additional configuration required — token management is handled automatically"
      },
      {
        title: "Reporting & Monitoring",
        content: "Monitor CCID authentication activity in Genesys Cloud CX:\n\n1. Go to **Performance** → **Workspace**\n2. Search for **Data Action Performance**\n3. Set the date range to your campaign period\n4. View total data action attempts and execution metrics\n5. Click on **Authenticate Caller ID** to see success rate, failure rate, and average execution time\n\n**Pro Tip:** Compare the data action attempt count with your campaign call attempts to ensure authentication is running for all outbound calls.",
        images: [
          { src: genesysDataActionPerf, alt: "Genesys Cloud — Data Action Performance report", caption: "Data Action Performance report showing executions, average duration, and error rates" },
          { src: genesysCampaignPerf, alt: "Genesys Cloud — Campaign Performance report", caption: "Campaign Performance report showing dials, contacts, and abandon rates for comparison" }
        ]
      },
      {
        title: "Troubleshooting",
        content: "**Common Issues:**\n\n| Issue | Cause | Solution |\n|-------|-------|----------|\n| 401 Unauthorized | Invalid or missing API key | Verify the API key in the Request URL Template; contact TransUnion to verify validity |\n| 400 Bad Request | Incorrect request body format | Verify phone numbers are 10 digits; check Request Body Template matches exactly |\n| Timeout errors | Network connectivity or API unavailability | Verify network access to the CCID endpoint; increase timeout to 60s |\n| Action not in Architect | Action not published | Return to action configuration and click Publish |\n| Invalid phone format | Numbers include country code or special characters | Use 10-digit numbers only — remove +1, dashes, parentheses |\n| Rule not executing | Rule not assigned or condition not met | Verify rule is in campaign's Call Rule Sets; check condition and status |"
      },
      {
        title: "Best Practices",
        content: "**Security:**\n- ✓ Always enable HIPAA/Secure Data in production\n- ✓ Protect API keys — do not share or expose in logs\n- ✓ Regularly rotate API keys per TransUnion's recommendations\n\n**Performance:**\n- ✓ Set appropriate timeout values (60 seconds recommended)\n- ✓ Implement error handling in call flows\n- ✓ Monitor data action execution times and success rates\n\n**Campaign Configuration:**\n- ✓ Test rules with a small contact list before full deployment\n- ✓ Monitor campaign performance after enabling CCID authentication\n- ✓ Use pre-call rules to ensure authentication happens before dialing\n- ✓ Verify contact list phone numbers are in correct format (10 digits)\n- ✓ Review campaign analytics to measure impact on answer rates"
      }
    ]
  }
];

export const getIntegration = (id: string) => integrations.find(i => i.id === id);
export const getIntegrationsForProduct = (productId: string) => integrations.filter(i => i.products.includes(productId as "scp" | "bcd"));
