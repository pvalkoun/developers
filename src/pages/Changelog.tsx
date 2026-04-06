import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

export default function Changelog() {
  return (
    <div className="docs-prose">
      <h1>Changelog</h1>
      <p className="text-lg text-muted-foreground">
        Recent updates and additions to the TruContact Solutions API platform.
      </p>

      <div className="space-y-6 not-prose mt-8">
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
