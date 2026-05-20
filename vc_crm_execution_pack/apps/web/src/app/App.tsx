export function App(): JSX.Element {
  return (
    <main className="app-shell">
      <section className="app-panel" aria-labelledby="app-title">
        <p className="eyebrow">Virtual Coders CRM</p>
        <h1 id="app-title">Foundation Ready</h1>
        <p>
          Phase 0 scaffold is in place. Product modules, auth, RBAC, tenant isolation, and database
          work intentionally start in later batches.
        </p>
      </section>
    </main>
  );
}
