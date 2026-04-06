import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Palette, ArrowRight, BookOpen, Code2, Phone, Tag } from "lucide-react";

const Index = () => {
  return (
    <div className="docs-prose">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">TruContact Trusted Call Solutions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Transform the call experience to improve engagement, ensure legitimate calls get through,
          and protect customers against fraud.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Choose a Product</h2>
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-primary/30 flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Pre-Call Authentication</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Verify caller identity in real-time using STIR/SHAKEN. Required prerequisite for all TruContact products.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="space-y-2 mb-4">
              <Feature icon={BookOpen} text="CCID API documentation" />
              <Feature icon={Code2} text="Identity verification endpoint" />
            </div>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/pre-call-auth">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-accent/30 flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <Tag className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Spam Tag Mitigation (CNO)</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Prevent your legitimate calls from being mislabeled as spam or fraud by carrier analytics engines.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="space-y-2 mb-4">
              <Feature icon={BookOpen} text="Step-by-step setup guide" />
              <Feature icon={Code2} text="Full API reference" />
            </div>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/products/cno">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-accent/30 flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Branded Call Display</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Improve customer engagement by adding rich branded content — logo, name, and call reason — to the mobile call display.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="space-y-2 mb-4">
              <Feature icon={BookOpen} text="Step-by-step setup guide" />
              <Feature icon={Code2} text="Full API reference" />
            </div>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/products/bcd">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-primary/30 flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Spoofed Call Protection</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Digitally sign outbound calls to prevent fraudsters from spoofing your numbers to protect your customers and your brand.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="space-y-2 mb-4">
              <Feature icon={BookOpen} text="Step-by-step setup guide" />
              <Feature icon={Code2} text="Full API reference" />
            </div>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Link to="/products/scp">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <QuickLink to="/pre-call-auth" title="Pre-Call Authentication" description="Required prerequisite for SCP and BCD to function" />
        <QuickLink to="/products/scp/guide" title="SCP Setup Guide" description="Configure spoofed call protection end-to-end" />
        <QuickLink to="/products/bcd/guide" title="BCD Setup Guide" description="Set up branded call display for your numbers" />
      </div>
    </div>
  );
};

function Feature({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{text}</span>
    </div>
  );
}

function QuickLink({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link to={to} className="block p-4 rounded-lg border hover:border-primary/30 hover:bg-muted/50 transition-colors">
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  );
}

export default Index;
