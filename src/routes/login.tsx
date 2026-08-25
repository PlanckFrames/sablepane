import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const providers = [...GROK_PROVIDERS].sort((a, b) => (a.idp === "twitter" ? -1 : 1));
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 py-10 text-fg">
      <div className="w-full max-w-sm">
        <Link to="/" className="text-xs uppercase tracking-wide text-muted">
          ← Sablepane
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Optional. Chart with AI does not need this — paste an OpenAI, Anthropic, Gemini, or xAI key on that tab. Sign-in
          only saves a Sablepane identity.
        </p>
        {authEnabled ? (
          <div className="mt-5 space-y-2">
            {providers.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-11 w-full rounded-md border border-border bg-panel px-4 text-sm font-medium hover:bg-raised"
              >
                Continue with {p.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted">Sign-in is disabled.</p>
        )}
        <p className="mt-4 text-[11px] leading-relaxed text-subtle">
          X and Google are identity only. They do not unlock Claude, ChatGPT, or Gemini — those use keys from each
          provider’s console.
        </p>
      </div>
    </main>
  );
}
