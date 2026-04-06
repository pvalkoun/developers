import { useParams, Link } from "react-router-dom";
import { getProduct } from "@/data/productData";
import { getIntegrationsForProduct } from "@/data/integrationData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, BookOpen, Code2, Plug } from "lucide-react";

export default function ProductOverview() {
  const { productId } = useParams<{ productId: string }>();
  const product = getProduct(productId || "");
  const integrations = getIntegrationsForProduct(productId || "");

  if (!product) return <div>Product not found</div>;

  return (
    <div className="docs-prose">
      <h1>{product.fullName}</h1>
      <p className="text-lg text-muted-foreground">{product.tagline}</p>

      <p>{product.description}</p>

      <h2>Key Benefits</h2>
      <ul className="space-y-2">
        {product.benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h2>Getting Started</h2>
      <div className="grid gap-4 md:grid-cols-3 not-prose">
        <Card className="hover:shadow-md transition-shadow flex flex-col">
          <CardContent className="p-5 flex flex-col flex-1">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Setup Guide</h3>
            <p className="text-sm text-muted-foreground mb-3">Step-by-step configuration from start to finish</p>
            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link to={`/products/${productId}/guide`}>
                View Guide <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow flex flex-col">
          <CardContent className="p-5 flex flex-col flex-1">
            <Code2 className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">API Reference</h3>
            <p className="text-sm text-muted-foreground mb-3">Explore all endpoints with request/response examples</p>
            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link to={`/products/${productId}/api/auth-token`}>
                View APIs <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow flex flex-col">
          <CardContent className="p-5 flex flex-col flex-1">
            <Plug className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Integrations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {integrations.map(i => i.platform).join(", ")} guides
            </p>
            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link to={`/integrations/${integrations[0]?.id || "twilio"}`}>
                View Integrations <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2>Configuration Flow</h2>
      <div className="space-y-3">
        {product.setupSteps.map((step) => (
          <div key={step.step} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
              {step.step}
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-0.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-0">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
