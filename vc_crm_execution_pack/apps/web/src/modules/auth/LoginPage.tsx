import { ArrowRight, ShieldCheck } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function LoginPage(): JSX.Element {
  return (
    <main className="grid min-h-screen bg-vc-bg p-4 lg:grid-cols-[minmax(0,1fr)_440px] lg:p-0">
      <section className="hidden min-h-screen flex-col justify-between bg-vc-navy p-8 text-white lg:flex">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-vc-light">
            Virtual Coders CRM
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight">
            Sales, delivery, vendors, and finance in one operating view.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-vc-light">
            Secure tenant-aware workspace foundation with role-based navigation, audit-ready
            controls, and responsive layouts.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Pipeline", "Delivery", "Finance"].map((label) => (
            <div key={label} className="rounded-card border border-white/20 bg-white/10 p-4">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-1 text-xs text-vc-light">Ready shell</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-vc-blue">
                  Sign in
                </p>
                <h2 className="mt-1 text-2xl font-bold text-vc-navy">Welcome back</h2>
              </div>
              <Badge variant="success">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Secure
              </Badge>
            </div>
            <form className="grid gap-4">
              <label className="grid gap-1 text-sm font-medium text-foreground">
                Email
                <Input
                  type="email"
                  placeholder="tenant.admin@virtualcoders.local"
                  autoComplete="email"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-foreground">
                Password
                <Input type="password" placeholder="Password123!" autoComplete="current-password" />
              </label>
              <Button type="button" className="mt-2 w-full">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-5 rounded-card border border-border bg-muted p-3 text-sm leading-6 text-muted-foreground">
              Login UI only. Auth wiring will connect to the typed API client in a later frontend
              integration batch.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
