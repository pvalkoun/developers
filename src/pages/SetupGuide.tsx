import { useParams, Link } from "react-router-dom";
import { getProduct } from "@/data/productData";
import { getEndpointById } from "@/data/apiData";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SetupGuide() {
  const { productId } = useParams<{ productId: string }>();
  const product = getProduct(productId || "");

  if (!product) return <div>Product not found</div>;

  return (
    <div className="docs-prose">
      <h1>{product.name} — Setup Guide</h1>
      <p className="text-lg text-muted-foreground">
        Follow these steps to configure {product.name} from start to finish.
      </p>

      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
        <p className="text-sm mb-0">
          <strong>Prerequisites:</strong> You'll need API credentials (userId and password) provided by TransUnion during onboarding.
          All API calls require a valid access token in the <code>Authorization</code> header.
        </p>
      </div>

      {product.setupSteps.map((step) => {
        const endpoint = getEndpointById(step.apiEndpointId);
        return (
          <div key={step.step} className="mb-10 pb-8 border-b last:border-b-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                {step.step}
              </div>
              <h2 className="!mt-0 !mb-0">{step.title}</h2>
            </div>

            <p>{step.details}</p>

            {endpoint && (
              <div className="mt-4 p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <MethodBadge method={endpoint.method} />
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>

                {endpoint.requestBody && (
                  <CodeBlock code={endpoint.requestBody} title="Request Body" language="json" />
                )}

                {endpoint.responseBody && (
                  <CodeBlock code={endpoint.responseBody} title={`Response — ${endpoint.responseStatus}`} language="json" />
                )}

                <Button asChild variant="link" size="sm" className="mt-2 px-0">
                  <Link to={`/products/${productId}/api/${endpoint.id}`}>
                    View full API reference <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <div className="p-6 rounded-lg bg-muted text-center">
        <h3 className="font-semibold mb-2">🎉 Setup Complete!</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Your telephone numbers are now configured for {product.name}. Outbound calls will
          {productId === "scp" ? " be digitally signed to prevent spoofing." : " display your branded content to recipients."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline" size="sm">
            <Link to={`/products/${productId}/api/auth-token`}>Explore API Reference</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/integrations/twilio`}>View Integrations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
