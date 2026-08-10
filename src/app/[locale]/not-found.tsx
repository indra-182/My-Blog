import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main">
      <div className="shell not-found">
        <div>
          <div className="eyebrow">404</div>
          <h1>Page not found</h1>
          <p>The page you requested does not exist or is not published yet.</p>
          <Link href="/id">Back to Blog</Link>
        </div>
      </div>
    </main>
  );
}
