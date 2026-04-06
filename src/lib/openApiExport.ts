import { apiEndpoints } from "@/data/apiData";
import { endpointFieldDocs, type FieldDoc } from "@/data/apiFieldDocs";

function fieldToSchemaProperty(field: FieldDoc): [string, Record<string, unknown>] {
  const prop: Record<string, unknown> = { description: field.description };
  
  const cleanPath = field.path.replace(/\[\]/g, "").replace(/\.\*/g, "");
  
  if (field.type === "Array") {
    prop.type = "array";
    prop.items = { type: "string" };
  } else if (field.type === "Object" || field.type === "Map") {
    prop.type = "object";
  } else if (field.type === "Boolean") {
    prop.type = "boolean";
  } else if (field.type === "Integer") {
    prop.type = "integer";
  } else if (field.type === "DateTime") {
    prop.type = "string";
    prop.format = "date-time";
  } else {
    prop.type = "string";
  }
  
  if (field.constraints) {
    prop["x-constraints"] = field.constraints;
  }
  
  return [cleanPath, prop];
}

function fieldsToSchema(fields: FieldDoc[]): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  
  for (const field of fields) {
    if (field.path === "[]") continue;
    if (field.path.startsWith("[].")) continue;
    
    // Only use top-level or simple nested paths
    const cleanPath = field.path.replace(/\[\]/g, "").replace(/\.\*/g, "");
    if (cleanPath.includes("[].")) continue; // skip deeply nested for simplicity
    
    const [key, prop] = fieldToSchemaProperty(field);
    properties[key] = prop;
    if (field.required) required.push(key);
  }
  
  const schema: Record<string, unknown> = { type: "object", properties };
  if (required.length > 0) schema.required = required;
  return schema;
}

export function generateOpenApiSpec(): Record<string, unknown> {
  const paths: Record<string, Record<string, unknown>> = {};
  
  for (const ep of apiEndpoints) {
    const openApiPath = ep.path.replace(/{([^}]+)}/g, "{$1}");
    
    if (!paths[openApiPath]) paths[openApiPath] = {};
    
    const method = ep.method.toLowerCase();
    const operation: Record<string, unknown> = {
      summary: ep.name,
      description: ep.description,
      operationId: ep.id,
      tags: [ep.category],
      security: [{ BearerAuth: [] }],
    };
    
    const fieldDoc = endpointFieldDocs[ep.id];
    
    // Path parameters
    const paramMatches = ep.path.match(/{([^}]+)}/g);
    if (paramMatches) {
      const parameters: Record<string, unknown>[] = paramMatches.map(p => {
        const name = p.replace(/[{}]/g, "");
        const paramDoc = fieldDoc?.pathParams?.find(f => f.path === name);
        return {
          name,
          in: "path",
          required: true,
          description: paramDoc?.description || `The ${name} parameter`,
          schema: { type: "string" },
        };
      });
      operation.parameters = parameters;
    }
    
    // Request body
    if (ep.requestBody && (ep.method === "POST" || ep.method === "PUT")) {
      const requestSchema = fieldDoc?.requestFields 
        ? fieldsToSchema(fieldDoc.requestFields)
        : { type: "object" };
        
      operation.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: requestSchema,
            example: JSON.parse(ep.requestBody.replace(/\{\{[^}]+\}\}/g, '"placeholder"')),
          },
        },
      };
    }
    
    // Responses
    const responses: Record<string, unknown> = {};
    const statusCode = String(ep.responseStatus || 200);
    const statusDesc = ep.responseStatus === 200 ? "OK" 
      : ep.responseStatus === 201 ? "Created" 
      : ep.responseStatus === 204 ? "No Content"
      : ep.responseStatus === 206 ? "Partial Content" 
      : "Success";
    
    if (ep.responseBody) {
      const responseSchema = fieldDoc?.responseFields 
        ? fieldsToSchema(fieldDoc.responseFields)
        : { type: "object" };
      
      let example: unknown;
      try {
        example = JSON.parse(ep.responseBody);
      } catch {
        example = undefined;
      }
      
      responses[statusCode] = {
        description: statusDesc,
        content: {
          "application/json": {
            schema: responseSchema,
            ...(example ? { example } : {}),
          },
        },
      };
    } else {
      responses[statusCode] = { description: statusDesc };
    }
    
    responses["401"] = { description: "Unauthorized — invalid or expired access token" };
    responses["404"] = { description: "Not Found — resource does not exist" };
    
    operation.responses = responses;
    paths[openApiPath][method] = operation;
  }
  
  return {
    openapi: "3.0.3",
    info: {
      title: "TransUnion Trusted Call Solutions (TCS) API",
      version: "4.0.0",
      description: "API for managing Spoofed Call Protection (SCP) and Branded Call Display (BCD) services through the TransUnion TCS platform. Includes account management, feature configuration, caller profiles, and telephone number asset provisioning.",
      contact: {
        name: "TransUnion Customer Support",
        email: "calleridsupport@transunion.com",
        url: "https://www.transunion.com",
      },
    },
    servers: [
      {
        url: "https://sdpr.ccid.neustar.biz",
        description: "Production",
      },
      {
        url: "https://sdpr-uat.ccid.neustar.biz",
        description: "UAT / Sandbox",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Obtain a JWT access token via the /ccid/aam/v1/login endpoint",
        },
      },
    },
    paths,
  };
}

export function downloadOpenApiSpec() {
  const spec = generateOpenApiSpec();
  const json = JSON.stringify(spec, null, 2);
  
  // Use data URI approach which works in sandboxed iframes
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(json);
  const a = document.createElement("a");
  a.href = dataUri;
  a.download = "tcs-openapi-spec.json";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
}
