import Link from "next/link";

export default function ArticleNotFound() {
  return <main className="page-main"><div className="shell not-found"><div><div className="eyebrow">404</div><h1>Post not found</h1><p>This article may still be a draft or is not available in this language.</p><Link href="/id">Back to Blog</Link></div></div></main>;
}
