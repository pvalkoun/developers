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

// Image imports for Amazon Connect integration (real screenshots from PDF)
import amazonConnectContactFlow from "@/assets/amazon-connect/amazon-connect-contact-flow.png";
import amazonConnectLambdaConfig from "@/assets/amazon-connect/amazon-connect-lambda-config.png";
import amazonConnectCloudwatchLogs from "@/assets/amazon-connect/amazon-connect-cloudwatch-logs.png";

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
  },
  {
    id: "plivo",
    name: "Plivo Integration",
    platform: "Plivo",
    description: "Integrate TransUnion pre-call authentication with Plivo using PHLO visual workflows to validate destination numbers via the CCID API before initiating outbound calls.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "This guide explains how to integrate Plivo PHLO with the TransUnion CCID API to perform pre-call authentication before initiating a call. The flow validates the destination number using the CCID endpoint, then initiates the call and plays a notification message upon connection."
      },
      {
        title: "Use Case",
        content: "- Validate the destination number using TransUnion CCID before placing a call\n- Automate the flow: **Start → CCID Authentication → Initiate Call → Play Notification**\n- Ensure outbound calls are authenticated and branded to improve answer rates"
      },
      {
        title: "Prerequisites",
        content: "Before you begin, ensure you have:\n\n- A **Plivo account** with PHLO builder access\n- **TransUnion CCID API credentials** (API key and endpoint)\n- **Authorized From and To numbers** in Plivo\n- Completed the TCS account setup (Account, TCS, Feature, Caller Profile, and TN Asset)"
      },
      {
        title: "Step 1 — Create a New PHLO",
        content: "1. Log in to the **Plivo Console**\n2. Navigate to **PHLO** → **Create New**\n3. Add a **Start** node and enable **API Request** or **Incoming Call** as the trigger\n4. The PHLO builder canvas will open with your Start node ready for configuration"
      },
      {
        title: "Step 2 — Configure CCID HTTP Request",
        content: "1. Drag an **HTTP Request** node into the canvas\n2. Name it: `Pre Call Authentication with CCID`\n3. Configure the following settings:\n   - **Method**: `POST`\n   - **Endpoint**: `https://authn.ccid.neustar.biz/ccid/authn/v2/identity`\n4. Under **Params**:\n   - `apiKey` = `<your_api_key>`\n5. Under **Body** (JSON):",
        code: `{
  "from": "tel:+1{{Start.http.params.from}}",
  "to": "tel:+1{{Start.http.params.to}}"
}`,
        language: "json"
      },
      {
        title: "Step 3 — Add Initiate Call Node",
        content: "1. Add an **Initiate Call** node after the HTTP Request\n2. Configure:\n   - **From**: `{{Start.http.params.from}}`\n   - **To**: `{{Start.http.params.to}}`\n3. Optional settings:\n   - **Ring timeout**: 30 seconds\n   - Enable **voicemail detection** if needed"
      },
      {
        title: "Step 4 — Add Play Notification Node",
        content: "1. Add a **Play Audio / Speak** node\n2. Configure with your notification message\n3. Example message: `\"You have received new orders from customer. Please log in to the dashboard.\"`"
      },
      {
        title: "Step 5 — Connect Nodes",
        content: "Connect the nodes in the following order:\n\n**Start** → **CCID HTTP Request (Success)** → **Initiate Call** → **Play Notification**\n\nHandle the CCID **Failed** path with fallback logic if needed (e.g., skip authentication and proceed with the call, or log an error).",
        images: [
          { src: plivoFlowNodes, alt: "Plivo PHLO — Connected flow nodes", caption: "The complete PHLO flow with all nodes connected" }
        ]
      },
      {
        title: "Step 6 — Test & Validate",
        content: "1. Use **Fetch Response** in the HTTP node to confirm the CCID endpoint returns the expected JSON\n2. Trigger the PHLO via API Request with `from` and `to` parameters\n3. Verify:\n   - The HTTP request returns a `200` status\n   - The call initiates successfully\n   - The notification message plays correctly"
      },
      {
        title: "Troubleshooting",
        content: "| Issue | Cause | Solution |\n|-------|-------|----------|\n| 401/403 errors | Invalid or missing API key | Verify the `apiKey` parameter and endpoint URL |\n| 4xx errors | Incorrect phone number format | Ensure numbers use `tel:+E.164` format |\n| Call not connecting | Plivo number permissions | Verify Plivo number permissions and caller ID validation |\n| HTTP timeout | Network connectivity | Check network access to `authn.ccid.neustar.biz` |\n| No notification played | Node connection issue | Verify all nodes are properly connected in the flow |"
      },
      {
        title: "Best Practices",
        content: "- **Error Handling**: Always configure a fallback path for HTTP request failures\n- **Logging**: Use Plivo's PHLO logs to monitor authentication requests\n- **Number Format**: Ensure phone numbers are in E.164 format with country code\n- **API Key Security**: Store the API key securely and rotate regularly\n- **Testing**: Test with a small set of numbers before full deployment"
      }
    ]
  },
  {
    id: "amazon-connect",
    name: "Amazon Connect Integration",
    platform: "Amazon Connect",
    description: "Integrate TransUnion CCID call verification with Amazon Connect using AWS Lambda and Secrets Manager for secure, automated pre-call authentication of outbound calls.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "This guide describes the steps for enterprises to implement the Call Verification feature using Amazon Connect. The integration uses AWS Lambda to make REST API calls to TransUnion's Authentication Service (AS) and AWS Secrets Manager for secure credential storage."
      },
      {
        title: "Architecture",
        content: "The integration involves the following components:\n\n- **Amazon Connect Contact Flow** — Orchestrates the call workflow and invokes the Lambda function\n- **AWS Lambda** — Executes the CCID API call with caller/callee information\n- **AWS Secrets Manager** — Securely stores the CCID API key and endpoint URL\n- **TransUnion CCID API** — Authenticates the outbound call\n\n**Call Flow:**\n1. Amazon Connect initiates outbound call\n2. Contact flow invokes Lambda function\n3. Lambda retrieves credentials from Secrets Manager\n4. Lambda calls TransUnion CCID API with `from` and `to` numbers\n5. CCID API deposits authentication token\n6. Call proceeds with verified status"
      },
      {
        title: "Prerequisites",
        content: "The following AWS services familiarity is required:\n\n- **Amazon Connect** — Contact center service\n- **AWS Lambda** — Serverless compute\n- **AWS Identity and Access Management (IAM)** — Permissions management\n- **Amazon CloudWatch** — Logging and monitoring\n- **AWS Secrets Manager** — Secure credential storage\n\nYou will also need:\n- A TransUnion CCID API key and endpoint URL\n- An Amazon Connect instance with outbound calling configured\n- Completed TCS account setup (Account, TCS, Feature, Caller Profile, and TN Asset)"
      },
      {
        title: "Step 1 — Get Source Code",
        content: "TransUnion provides reference source code written in **Node.js** to integrate with the CCID Authentication Service.\n\n**Contents:**\n- `index.js` — The main Lambda handler that:\n  - Invokes the REST API to communicate with TransUnion backend services\n  - Collects required parameters from Amazon Connect contact data\n  - Forms the authentication request and issues the REST API call\n  - Handles REST API responses and error scenarios\n  - Logs all important execution steps to CloudWatch\n\nPlease contact the TransUnion Trusted Call Solutions engagement team for the source code."
      },
      {
        title: "Step 2 — Setup AWS Secrets Manager",
        content: "Create a secret in AWS Secrets Manager to securely store the CCID API credentials.\n\n1. Open the **AWS Secrets Manager** console\n2. Click **Store a new secret**\n3. Select **Other type of secret**\n4. Add the following key-value pairs:\n\n| Key | Description | Value (Example) |\n|-----|-------------|----------------|\n| `neustarURL` | TransUnion AS REST API Endpoint | `https://ccid-aws-authn.neustarlab.biz/ccid/authn/v2/identity` |\n| `neustarAPIKey` | API key for client authentication | `4dcafb32537d91c90737f7d840c` |\n\n**Note:** The URL and API key shown are examples. Contact TransUnion Support for your actual production credentials.",
        images: [
          { src: amazonConnectSecretsManager, alt: "AWS Secrets Manager — Secret configuration with CCID keys", caption: "Configuring the AWS Secrets Manager with the CCID API endpoint and key" }
        ]
      },
      {
        title: "Step 3 — Create Lambda Function",
        content: "1. **Create an IAM Role** for Lambda & Secrets Manager:\n   - Go to **IAM Console** → **Roles** → **Create Role**\n   - Select **AWS Service** → **Lambda**\n   - Attach the following policies:\n     - `AWSLambdaBasicExecutionRole` — For Lambda execution and CloudWatch logging\n     - `secretsmanager:GetSecretValue` — For Secrets Manager access\n\n2. **Create the Lambda Function**:\n   - Go to **Lambda Console** → **Create Function**\n   - Upload the integration code provided by TransUnion\n   - Select the IAM role created in step 1\n   - Note the **ARN** displayed (e.g., `arn:aws:lambda:us-east-1:9041431XXXX:function:CALLOUT`)\n\n3. **Create Environment Variable**:\n   - Add an environment variable called `neustarSecret`\n   - Set the value to the secret name created in Step 2\n\nThe Lambda function will use the following contact data parameters:\n\n| Parameter | Description | Example |\n|-----------|-------------|--------|\n| `event.Details.ContactData.CustomerEndpoint.Address` | Called Party | `+12028232026` |\n| `event.Details.ContactData.SystemEndpoint.Address` | Calling Party | `+18134356550` |",
        images: [
          { src: amazonConnectLambdaEnv, alt: "AWS Lambda — Environment variable configuration", caption: "Setting the neustarSecret environment variable in the Lambda function" }
        ]
      },
      {
        title: "Step 4 — Setup Connect Contact Flow",
        content: "Configure the Amazon Connect Contact Flow to invoke the Lambda function before placing outbound calls.\n\n1. Open your **Amazon Connect** instance\n2. Go to **Contact Flows** and create or edit your outbound call flow\n3. Add an **Invoke AWS Lambda function** block\n4. Configure the Lambda block:\n   - **Select a Function**: Set to the Lambda function ARN created in Step 3\n   - Configure **Success** and **Error** paths based on your application needs\n5. Add **Play Prompt** blocks for success and error scenarios\n6. Connect the blocks in order:\n\n**Start** → **Set Logging** → **Invoke Lambda** → **Success: Play Prompt** → **End Flow**\n\n↳ **Error: Play Error Prompt** → **End Flow**",
        images: [
          { src: amazonConnectContactFlow, alt: "Amazon Connect — Contact Flow with Lambda invocation", caption: "Sample Amazon Connect Contact Flow showing the Lambda function integration" }
        ]
      },
      {
        title: "Step 5 — Test the Flow",
        content: "Once all configuration is complete, test the end-to-end call flow.\n\n1. Make an outbound call from Amazon Connect\n2. Verify the call connects successfully\n3. Contact TransUnion support to confirm Call Sign requests are reaching the AS micro service\n4. Check **CloudWatch Logs** for the Lambda function execution\n\n**Step 1 — Verify REST API Call Log:**\nCheck that request parameters are correctly populated:",
        code: `// CloudWatch Log — REST API Call
{
  "from": "tel:+18134356550",
  "to": "tel:+12028232026"
}`,
        language: "json",
        images: [
          { src: amazonConnectTestLogs, alt: "Amazon Connect — CloudWatch test logs showing successful API calls", caption: "CloudWatch logs showing successful REST API calls and responses" }
        ]
      },
      {
        title: "Verifying API Response",
        content: "**Step 2 — Check HTTPS Options:**\nVerify the host, port, and path parameters are correct in the log output.\n\n**Step 3 — Validate Response:**\nThe REST API response should include an `identity` field containing the STIR/SHAKEN attestation token. This token is automatically deposited in the call session registry.\n\nIf you encounter issues:\n- Verify configuration parameters in Secrets Manager\n- Check CloudWatch logs for error details\n- Ensure Lambda has proper IAM permissions\n- Verify network connectivity to the CCID endpoint"
      },
      {
        title: "Troubleshooting",
        content: "| Issue | Cause | Solution |\n|-------|-------|----------|\n| Lambda timeout | Network connectivity or slow API response | Increase Lambda timeout; verify VPC/NAT gateway config |\n| Secrets Manager access denied | Missing IAM permissions | Add `secretsmanager:GetSecretValue` to Lambda role |\n| 401 Unauthorized | Invalid API key | Verify API key in Secrets Manager; contact TransUnion |\n| Contact flow errors | Incorrect Lambda ARN | Verify the function ARN in the Invoke Lambda block |\n| No authentication token | Request format error | Check `from`/`to` format matches `tel:+E.164` |"
      },
      {
        title: "Best Practices",
        content: "- **Security**: Always use AWS Secrets Manager for API credentials — never hardcode keys\n- **Monitoring**: Set up CloudWatch alarms for Lambda errors and high latency\n- **Error Handling**: Configure fallback paths in the Contact Flow for API failures\n- **Testing**: Test with a small set of numbers before deploying to production\n- **Logging**: Keep CloudWatch logging enabled for troubleshooting\n- **IAM**: Follow the principle of least privilege for Lambda execution roles"
      }
    ]
  },
  {
    id: "nice-incontact",
    name: "NICE inContact Integration",
    platform: "NICE inContact",
    description: "Integrate TransUnion CCID pre-call authentication with NICE inContact (CXone) using Studio scripts to authenticate outbound calls via the CCID REST API.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "This guide describes how to integrate NICE inContact (CXone) with TransUnion's CCID Authentication Service using a Studio script. The integration uses a SNIPPET action to make a REST API call to the CCID endpoint before each outbound call, authenticating the caller ID and reducing spam flagging."
      },
      {
        title: "Architecture",
        content: "The integration uses three NICE inContact Studio actions:\n\n1. **BEGIN** — Entry point that receives the call parameters (e.g., `SIP__200OK`)\n2. **SNIPPET** — Contains the integration logic that formats phone numbers, creates the API request, and handles the response\n3. **RETURN** — Completes the script execution\n\n**Flow:** BEGIN → SNIPPET (Integration) → RETURN"
      },
      {
        title: "Prerequisites",
        content: "Before you begin, ensure you have:\n\n- **NICE inContact (CXone) account** with Studio access\n- **TransUnion CCID API credentials** (API key and endpoint URL)\n- **Authorized phone numbers** configured in your NICE inContact tenant\n- Completed the TCS account setup (Account, TCS, Feature, Caller Profile, and TN Asset)\n\n**Required NICE inContact Permissions:**\n- Studio > Scripts > Create, Edit\n- Studio > Scripts > Debug/Trace"
      },
      {
        title: "Step 1 — Create a New Studio Script",
        content: "1. Open **NICE inContact Studio**\n2. Create a new script or open an existing outbound call script\n3. Add three actions in sequence:\n   - **BEGIN** action (entry point)\n   - **SNIPPET** action (integration logic)\n   - **RETURN** action (exit point)\n4. Connect the actions: BEGIN → SNIPPET → RETURN"
      },
      {
        title: "Step 2 — Configure the BEGIN Action",
        content: "1. Double-click the **BEGIN** action\n2. Set the **Caption**: `Integration_TransUnion_PROD`\n3. Configure the **Parameters** to accept the SIP response parameter:\n   - Parameter: `SIP__200OK`\n4. Connect the **Default** output to the SNIPPET action"
      },
      {
        title: "Step 3 — Configure the SNIPPET Action",
        content: "This is the core of the integration. The SNIPPET action formats phone numbers, creates a REST API proxy, and calls the CCID endpoint.\n\n1. Double-click the **SNIPPET** action\n2. Set the **Caption**: `Integration`\n3. Paste the following code into the snippet editor:",
        code: `//Format To/From Vars
global:customfrom=" <tel:1{Global:CallerID}>"
global:customto=" <tel:1{global:contacttoaddress}>"

//Define Endpoint
hostname="https://authn.ccid.neustar.biz/ccid/authn/v2/identity"

//Define Auth API Key
apikey="<YOUR_API_KEY>"

//Reset Webservice Error
ASSIGN webServiceError=0

//Create Proxy
TUAuthProxy=GetRESTProxy()
TUAuthProxy.ContentType="application/json"
TUbaseURI="{hostname}?apiKey={apikey}"

//Create Body
DYNAMIC TUauthbody
TUauthbody.from="{global:customfrom}"
TUauthbody.to="{global:customto}"
ASSIGN TUauthbodyasJSON="{TUauthbody.asJSON()}"

//Make API Call
AuthRes=TUAuthProxy.MakeRestRequest(TUbaseURI, TUauthbodyasJSON, 0, "POST")

IF TUAuthProxy.StatusCode != 200
{
  TUAuthError="{TUAuthProxy.StatusDescription}"
  webServiceError=1
  
  //Create Var for failed auth calls
  global:SpoofPass="FALSE"
  global:SpoofPass.savetodb(1)
}
ELSE
{
  global:SpoofPass="TRUE"
}`,
        language: "javascript"
      },
      {
        title: "Step 4 — Configure the RETURN Action",
        content: "1. Double-click the **RETURN** action\n2. No additional configuration is needed — this action simply ends the script\n3. The SNIPPET action's default output should connect to the RETURN action"
      },
      {
        title: "Code Walkthrough",
        content: "**1. Format Phone Numbers:**\nThe script formats the caller and callee numbers into `tel:` URI format using NICE inContact global variables:\n- `Global:CallerID` — The outbound caller ID\n- `global:contacttoaddress` — The destination phone number\n\n**2. Create REST Proxy:**\nThe `GetRESTProxy()` function creates an HTTP client with `application/json` content type.\n\n**3. Build Request Body:**\nA dynamic JSON body is constructed with `from` and `to` fields in `tel:` format.\n\n**4. Make API Call:**\n`MakeRestRequest` sends a POST request to the CCID endpoint with the API key as a query parameter.\n\n**5. Handle Response:**\n- **Success (200)**: Sets `global:SpoofPass` to `TRUE`\n- **Failure**: Sets `global:SpoofPass` to `FALSE` and saves to the database for reporting"
      },
      {
        title: "Step 5 — Test the Script",
        content: "1. Open **Studio** → **Debug/Trace** mode\n2. Execute the script with test phone numbers\n3. Verify:\n   - The REST API call returns status `200`\n   - `global:SpoofPass` is set to `TRUE` on success\n   - Phone numbers are correctly formatted with `tel:` prefix\n4. Check the **NICE inContact logs** for any errors\n5. Contact TransUnion to confirm authentication requests are being received"
      },
      {
        title: "Step 6 — Deploy to Production",
        content: "1. Save the script with a production-ready name (e.g., `Integration_TransUnion_PROD`)\n2. Assign the script to your outbound campaign or skill\n3. Configure the script to execute as a **pre-call** action\n4. Monitor the first batch of calls to ensure authentication is working correctly"
      },
      {
        title: "Using SpoofPass Variable",
        content: "The `global:SpoofPass` variable can be used downstream in your call flow:\n\n- **Reporting**: Track authentication success/failure rates using `savetodb(1)`\n- **Conditional Logic**: Route calls differently based on authentication result\n- **Analytics**: Correlate authentication status with call outcomes\n\n| Value | Meaning | Action |\n|-------|---------|--------|\n| `TRUE` | Authentication successful | Call proceeds normally |\n| `FALSE` | Authentication failed | Log error; proceed with fallback logic |"
      },
      {
        title: "Troubleshooting",
        content: "| Issue | Cause | Solution |\n|-------|-------|----------|\n| `webServiceError=1` | API call failed | Check `TUAuthError` variable for status description |\n| Incorrect phone format | Global variables not populated | Verify `Global:CallerID` and `global:contacttoaddress` are set |\n| 401/403 errors | Invalid API key | Verify the `apikey` variable value; contact TransUnion |\n| Timeout errors | Network connectivity | Ensure NICE inContact can reach `authn.ccid.neustar.biz` |\n| Script not executing | Not assigned to campaign | Assign the script to the outbound skill or campaign |"
      },
      {
        title: "Best Practices",
        content: "- **API Key Security**: Store the API key securely; consider using NICE inContact's secure variable storage\n- **Error Handling**: Always check `webServiceError` and handle failures gracefully\n- **Monitoring**: Use `savetodb()` to track authentication metrics\n- **Testing**: Test in a staging environment before deploying to production\n- **Phone Format**: Ensure all phone numbers include the country code prefix\n- **Logging**: Enable script tracing during initial deployment for debugging"
      }
    ]
  },
  {
    id: "ringcentral",
    name: "RingCentral Integration",
    platform: "RingCentral",
    description: "Integrate RingCentral with TransUnion's CCID using the SDK to automatically deposit STIR/SHAKEN attestation tokens for outbound calls via WebSocket real-time notifications.",
    products: ["scp", "bcd"],
    sections: [
      {
        title: "Overview",
        content: "This guide provides complete instructions for integrating RingCentral with TransUnion's CCID (Caller ID) tool using the SDK provided by the TransUnion CCID support team. This integration automatically deposits STIR/SHAKEN attestation tokens for your outbound calls, ensuring they are properly authenticated and branded — reducing the risk of being marked as spam."
      },
      {
        title: "What This Integration Does",
        content: "When you make an outbound call from RingCentral, the SDK automatically:\n\n1. **Receives real-time notification** via WebSocket (50–100ms latency)\n2. **Requests STIR/SHAKEN attestation token** from TransUnion's CCID API\n3. **Deposits the token** before the carrier receives your call\n4. **Verifies delivery** (optional monitoring)\n\n**Result:** Your calls display as \"Verified\" on recipient phones and show Branded Caller Data (name, logo, call reason) if configured — improving answer rates and reducing spam flagging."
      },
      {
        title: "Performance Metrics",
        content: "| Metric | Value | Status |\n|--------|-------|--------|\n| **Total Latency** | 100–150ms | EXCELLENT |\n| **Success Rate** | >99% | HIGH |\n| **Uptime** | >99.9% | RELIABLE |"
      },
      {
        title: "Prerequisites",
        content: "Before starting, ensure you have the following:\n\n| Requirement | Description | How to Obtain |\n|-------------|-------------|---------------|\n| **RingCentral Account** | Active account with outbound calling | Your existing RingCentral subscription |\n| **RingCentral Developer Account** | Access to create apps and generate JWT tokens | Sign up at developers.ringcentral.com |\n| **CCID Product API Key** | Authentication key for TransUnion's CCID API | Contact your TransUnion representative |\n| **AWS EC2 Instance** | t3.small or larger (~$18/month) | AWS Console or CLI |\n| **Node.js 18+** | Runtime environment | Installed on your EC2 instance |"
      },
      {
        title: "Step 1 — Obtain RingCentral Configurations",
        content: "**1.1 Create JWT Token:**\n1. Navigate to the RingCentral Developer Portal\n2. Hover over the top-right corner user profile\n3. Click **Credentials** → **Create JWT**\n4. Set app scope and expiration date\n\n**1.2 Create a New Application:**\n1. Go to the Developer Portal → **Console** → **Register App**\n2. Configure:\n\n| Field | Value |\n|-------|-------|\n| **App Type** | REST API App |\n| **Authentication** | JWT (JSON Web Token) |\n| **App Name** | CCID STIR/SHAKEN Integration |\n| **Description** | Integration with TransUnion CCID for STIR/SHAKEN attestation |"
      },
      {
        title: "Step 1.1 — Configure Permissions",
        content: "Enable the following permissions (application scopes) under the **Security** section of the App configuration page:\n\n- **ReadCallLog** — Read call history and details\n- **ReadAccounts** — Read account information\n- **VoIP Calling** — Access telephony features and events\n- **Webhook Subscriptions** — Manage webhook subscriptions\n- **WebSocket** — Establish WebSocket connection\n- **WebSocket Subscription** — Create subscription on telephony events\n- **Call Control** — Manipulate calls in progress\n\n**1.5 Retrieve Credentials:**\nAfter creating the app, note from the Credentials section:\n- `Client ID`\n- `Client Secret`\n- `JWT Token` (click \"Download Credentials JSON\" to reveal)\n\n**Security Note:** Keep these credentials secure! Never commit them to version control or share them publicly."
      },
      {
        title: "Step 2 — Setup Infrastructure",
        content: "**2.1 Launch AWS EC2 Instance:**\n\n- Instance Type: `t3.small` (or larger)\n- Operating System: Amazon Linux 2 or Ubuntu 20.04+\n- Storage: 20GB EBS volume\n- Region: Same region as CCID API for lowest latency",
        code: `# Launch EC2 Instance
aws ec2 run-instances \\
  --image-id ami-0c55b159cbfafe1f0 \\
  --instance-type t3.small \\
  --key-name your-key-pair \\
  --security-group-ids sg-xxxxxxxxx \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=RingCentral-STIRSHAKEN}]'`,
        language: "bash"
      },
      {
        title: "Step 2.1 — Configure Security & Install Node.js",
        content: "**Configure Security Group:**\n\n| Port | Protocol | Source | Purpose |\n|------|----------|--------|---------|\n| 22 | TCP | Your IP only | SSH access |\n| 443 | TCP | 0.0.0.0/0 | HTTPS (optional, for web UI) |\n\n**Connect and Install Node.js:**",
        code: `# Connect to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip-address

# Update system
sudo yum update -y

# Install Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version  # Should output v20.x or higher
npm --version`,
        language: "bash"
      },
      {
        title: "Step 3 — Install the SDK",
        content: "Contact TransUnion to receive the SDK package. You'll receive either GitHub repository access or a direct download link.\n\n**Install on EC2:**",
        code: `# Create installation directory
cd /opt
sudo mkdir ringcentral-stirshaken
sudo chown -R $USER:$USER ringcentral-stirshaken
cd ringcentral-stirshaken

# Option A: Clone from GitHub (if you have access)
git clone https://github.com/transunion/ringcentral-stirshaken-sdk.git
cd ringcentral-stirshaken-sdk

# Option B: Download and extract archive
wget <download_link_provided_by_transunion>
tar -xzf ringcentral-stirshaken-sdk.tar.gz
cd ringcentral-stirshaken-sdk

# Install dependencies
npm install --production`,
        language: "bash"
      },
      {
        title: "Step 4 — Configure the SDK",
        content: "Create the configuration file with your credentials:",
        code: `{
  "ringcentral": {
    "clientId": "<YOUR_RINGCENTRAL_CLIENT_ID>",
    "clientSecret": "<YOUR_RINGCENTRAL_CLIENT_SECRET>",
    "jwt": "<YOUR_RINGCENTRAL_JWT_TOKEN>",
    "server": "https://platform.ringcentral.com",
    "phoneNumber": "<YOUR_RINGCENTRAL_PHONE_NUMBER>"
  },
  "stirshaken": {
    "apiKey": "<YOUR_CCID_API_KEY_FROM_TRANSUNION>",
    "apiUrl": "https://authn.ccid.neustar.biz/stir/v1/signing"
  },
  "monitoring": {
    "enabled": false
  },
  "application": {
    "port": 3000,
    "logLevel": "info",
    "enableWebUI": false,
    "dataDirectory": "./data"
  },
  "performance": {
    "connectionPoolSize": 10,
    "keepAliveTimeout": 60000,
    "retryAttempts": 3,
    "retryBackoffMs": 1000,
    "maxRetryBackoffMs": 10000
  }
}`,
        language: "json"
      },
      {
        title: "Configuration Reference",
        content: "| Section | Parameter | Description | Required |\n|---------|-----------|-------------|----------|\n| **ringcentral** | `clientId` | RingCentral app client ID | Yes |\n| | `clientSecret` | RingCentral app client secret | Yes |\n| | `jwt` | RingCentral JWT token | Yes |\n| | `server` | RingCentral API server URL | Yes |\n| | `phoneNumber` | Your RingCentral phone number (E.164) | Yes |\n| **stirshaken** | `apiKey` | TransUnion CCID API key | Yes |\n| | `apiUrl` | CCID STIR/SHAKEN API endpoint | Yes |\n| **monitoring** | `enabled` | Enable Elasticsearch monitoring | Optional |\n| **application** | `port` | Application port (default: 3000) | Optional |\n| | `logLevel` | Logging level (debug, info, warn, error) | Optional |"
      },
      {
        title: "Step 5 — Validate Configuration",
        content: "Before deploying, validate your configuration and test connections:",
        code: `# Validate configuration
npm run validate-config
# Expected: ✔ Configuration is valid!

# Test connections
npm run test-connection
# Expected: ✔ RingCentral connection successful
#           ✔ CCID API connection successful

# Test latency
npm run test-latency
# Expected: ✔ WebSocket latency: 75ms
#           ✔ STIR/SHAKEN API latency: 52ms
#           ✔ Total end-to-end latency: 127ms`,
        language: "bash"
      },
      {
        title: "Step 6 — Deploy the SDK",
        content: "Set up the SDK to run as a system service with automatic restart:",
        code: `# Create systemd service file
sudo tee /etc/systemd/system/ringcentral-stirshaken.service > /dev/null <<EOF
[Unit]
Description=RingCentral STIR/SHAKEN Integration SDK
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/ringcentral-stirshaken/ringcentral-stirshaken-sdk
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/ringcentral-stirshaken.log
StandardError=append:/var/log/ringcentral-stirshaken.log

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable ringcentral-stirshaken
sudo systemctl start ringcentral-stirshaken

# Verify deployment
sudo systemctl status ringcentral-stirshaken`,
        language: "bash"
      },
      {
        title: "Step 7 — Test the Integration",
        content: "1. Make an outbound call from your RingCentral account\n2. Monitor logs in real-time: `tail -f /var/log/ringcentral-stirshaken.log`\n3. Verify the STIR/SHAKEN token is deposited\n\n**Expected Log Output:**",
        code: `🕔 Outbound call detected
{"sessionId":"s-abc123...","from":"+14434718305","to":"+17084131327","status":"Setup","latency":"75ms"}
✔ STIR/SHAKEN token signed
{"origNumber":"4434718305","destNumber":"7084131327","statusCode":200,"responseTime":"52ms"}
✔ STIR/SHAKEN token signed successfully
{"sessionId":"s-abc123...","totalLatency":"127ms"}`,
        language: "text"
      },
      {
        title: "Verify on Recipient Phone",
        content: "The recipient should see:\n\n- ✔ \"Verified\" badge or checkmark\n- ✔ Your business name (if BCD is configured)\n- ✔ No spam warning"
      },
      {
        title: "Management Commands",
        content: "**Service Management:**\n\n| Command | Description |\n|---------|-------------|\n| `sudo systemctl start ringcentral-stirshaken` | Start the service |\n| `sudo systemctl stop ringcentral-stirshaken` | Stop the service |\n| `sudo systemctl restart ringcentral-stirshaken` | Restart the service |\n| `sudo systemctl status ringcentral-stirshaken` | Check service status |\n| `sudo systemctl enable ringcentral-stirshaken` | Enable auto-start on boot |\n\n**Monitoring & Logs:**\n\n| Command | Description |\n|---------|-------------|\n| `tail -f /var/log/ringcentral-stirshaken.log` | View real-time logs |\n| `tail -n 100 /var/log/ringcentral-stirshaken.log` | View last 100 log lines |\n| `sudo journalctl -u ringcentral-stirshaken -n 50` | View systemd journal logs |\n| `npm run test-latency` | Measure current latency |"
      },
      {
        title: "Troubleshooting",
        content: "| Issue | Possible Cause | Solution |\n|-------|----------------|----------|\n| **Service won't start** | Invalid configuration | Run `npm run validate-config` and fix errors |\n| **Authentication failed** | Incorrect RingCentral credentials | Verify JWT token hasn't expired; regenerate if needed |\n| **No notifications received** | WebSocket subscription issue | Check logs for WebSocket errors; restart service |\n| **High latency (>200ms)** | Network or instance performance | Deploy in same region as CCID API; upgrade to t3.medium |\n| **CCID API errors** | Invalid API key or quota exceeded | Verify API key with TransUnion; check usage limits |\n| **Need more logs** | Log level too restrictive | Update `config.json` application.logLevel to \"debug\" |"
      },
      {
        title: "Security Best Practices",
        content: "**Credential Management:**\n- ✔ Never commit `config/config.json` to version control\n- ✔ Use environment variables for sensitive data in production\n- ✔ Rotate credentials regularly (every 90 days recommended)\n- ✔ Restrict file permissions: `chmod 600 config/config.json`\n- ✔ Use AWS Secrets Manager for enterprise deployments\n\n**Network Security:**\n- ✔ Restrict SSH access to specific IP addresses\n- ✔ Use VPC for additional network isolation\n- ✔ Enable CloudWatch for monitoring and alerts\n- ✔ Keep software updated: `sudo yum update -y`"
      },
      {
        title: "Architecture Overview",
        content: "**Technology Stack:**\n\n| Component | Technology | Purpose |\n|-----------|------------|--------|\n| **Runtime** | Node.js 18+ | Application execution |\n| **Real-time Messaging** | WebSocket | Low-latency call notifications |\n| **HTTP Client** | Undici (connection pooling) | Optimized API calls |\n| **Logging** | Winston | Structured logging |\n| **Validation** | AJV (JSON Schema) | Configuration validation |\n| **Process Management** | Systemd | Auto-restart and monitoring |\n\n**Latency Breakdown:**\n\n| Stage | Typical Latency | Optimization |\n|-------|-----------------|-------------|\n| WebSocket notification | 50–100ms | Already optimized |\n| CCID API call | 40–80ms | Connection pooling, keep-alive |\n| Processing overhead | 10–20ms | Efficient code, minimal processing |\n| **Total** | **100–150ms** | **EXCELLENT** |"
      },
      {
        title: "Support & Resources",
        content: "| Type | Contact |\n|------|--------|\n| **Technical Support** | PDLTCSProductOps@transunion.com |\n| **API Key Requests** | Your TransUnion account manager |\n| **General Inquiries** | PDLTCSProductOps@transunion.com |\n\n**Success Checklist:**\n- ✔ SDK service is running: `sudo systemctl status ringcentral-stirshaken` shows \"active (running)\"\n- ✔ Logs show successful initialization with no errors\n- ✔ Test calls trigger STIR/SHAKEN token deposits in logs\n- ✔ Total latency is under 200ms\n- ✔ Recipient phones display \"Verified\" badge\n- ✔ Success rate is above 99%\n- ✔ Service auto-restarts after reboot"
      }
    ]
  }
];

export const getIntegration = (id: string) => integrations.find(i => i.id === id);
export const getIntegrationsForProduct = (productId: string) => integrations.filter(i => i.products.includes(productId as "scp" | "bcd"));
