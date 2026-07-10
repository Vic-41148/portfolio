import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-8xl font-display font-normal text-text-muted">404</span>
      <h1 className="mt-4 text-2xl font-display font-normal">
        Page not found
      </h1>
      <p className="mt-2 text-text-secondary max-w-md">
        This page doesn&apos;t exist — or it&apos;s hiding somewhere in the latent space.
      </p>
      <div className="mt-2 text-2xl">
        <span className="inline-block animate-pulse">¯\_(ツ)_/¯</span>
      </div>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-base font-medium transition-all hover:brightness-110 active:scale-[0.98]"
      >
        Go home
      </Link>
    </div>
  );
}
