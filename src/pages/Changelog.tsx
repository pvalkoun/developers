import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
  links?: { label: string; to: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    date: "2026-04-06",
    title: "Analytics API Documentation",
    description:
      "Added Analytics API reference under a new Resources section with full authentication flow, corrected endpoint paths (/ccid/analytics/v1/admin/account/{accountId}/tn and /tns), per-TN and account-wide call performance metrics for BCD and SCP services, cursor-based pagination, and detailed response schema references.",
    tags: ["Analytics", "Updated", "API"],
    links: [
      { label: "Analytics API", to: "/resources/analytics" },
    ],
  },
  {
    date: "2026-04-06",
    title: "Image Profile API for Branded Call Display",
    description:
      "Added new Image Profile endpoints (POST, GET, DELETE) to the BCD configuration flow. Image profiles allow you to upload a public image URL and receive an internal TransUnion-hosted image URL. The returned image_profile_id is used when creating Rich BCD caller profiles to display your company logo on recipient devices.",
    tags: ["BCD", "New Feature", "API"],
    links: [
      { label: "Create Image Profile", to: "/products/bcd/api/create-image-profile" },
      { label: "BCD Setup Guide", to: "/products/bcd/guide" },
    ],
  },
];

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "gmx.com", "live.com", "msn.com", "me.com", "fastmail.com",
  "tutanota.com",
];

export default function Changelog() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validateWorkEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    const domain = email.toLowerCase().split("@")[1];
    if (FREE_EMAIL_DOMAINS.includes(domain)) return "Please use a work email address (not Gmail, Yahoo, etc.)";
    return null;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (name.trim().length < 2) {
      setErrorMsg("Name must be at least 2 characters");
      return;
    }

    const emailError = validateWorkEmail(email);
    if (emailError) {
      setErrorMsg(emailError);
      return;
    }

    setStatus("loading");

    try {
      const { data, error } = await supabase.functions.invoke("changelog-subscribe", {
        body: { name: name.trim(), email: email.trim().toLowerCase() },
      });

      if (error) {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
        return;
      }

      if (data?.error) {
        setStatus("error");
        setErrorMsg(data.error);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="docs-prose">
      <h1>Changelog</h1>
      <p className="text-lg text-muted-foreground">
        Recent updates and additions to the TruContact Solutions API platform.
      </p>

      {/* Subscription Form */}
      <div className="not-prose mt-6 mb-10">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-base font-semibold">Subscribe to Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when we publish new API changes, features, and updates. Work email required.
                </p>
              </div>
            </div>

            {status === "success" ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Check your email!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">We've sent a verification link to {email}. Please verify to start receiving updates.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label htmlFor="sub-name" className="sr-only">Name</Label>
                  <Input
                    id="sub-name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="sub-email" className="sr-only">Work Email</Label>
                  <Input
                    id="sub-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>
                <Button type="submit" disabled={status === "loading"} className="shrink-0">
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 mt-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 not-prose">
        {changelog.map((entry, i) => (
          <Card key={i} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-muted-foreground">{entry.date}</span>
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
              {entry.links && (
                <div className="flex gap-3 flex-wrap">
                  {entry.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
