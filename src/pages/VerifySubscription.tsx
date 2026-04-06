import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifySubscription() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("changelog-verify", {
          body: null,
          headers: {},
        });

        // Use fetch directly since we need query params
        const projectId = import.meta.env.VITE_SUPABASE_URL?.replace("https://", "").split(".")[0];
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/changelog-verify?token=${token}`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        const result = await res.json();

        if (res.ok) {
          if (result.message === "Email already verified") {
            setStatus("already");
            setMessage("Your email is already verified. You're all set!");
          } else {
            setStatus("success");
            setMessage(result.message || "Email verified! You'll now receive changelog updates.");
          }
        } else {
          setStatus("error");
          setMessage(result.error || "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="docs-prose">
      <h1>Email Verification</h1>
      <div className="not-prose mt-8 max-w-md">
        <Card>
          <CardContent className="p-8 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Verifying your email...</p>
              </>
            )}
            {(status === "success" || status === "already") && (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {status === "success" ? "Verified!" : "Already Verified"}
                </h3>
                <p className="text-sm text-muted-foreground">{message}</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Verification Failed</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
