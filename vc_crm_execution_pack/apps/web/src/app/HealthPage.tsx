export function HealthPage(): JSX.Element {
  return (
    <main className="grid min-h-screen place-items-center bg-vc-bg p-4">
      <section
        className="w-full max-w-xl rounded-lg border border-border bg-card p-6 shadow-sm"
        aria-labelledby="health-title"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-vc-blue">
          Virtual Coders CRM
        </p>
        <h1 id="health-title" className="text-2xl font-bold text-vc-navy">
          Web health: ok
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The frontend application is running.
        </p>
      </section>
    </main>
  );
}
