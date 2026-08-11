import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <main className="page-main">
      <div className="shell not-found">
        <div>
          <div className="eyebrow">404</div>
          <h1>Tulisan tidak ditemukan</h1>
          <p>Tulisan ini mungkin masih berupa draft atau belum tersedia.</p>
          <Link href="/">Kembali ke Blog</Link>
        </div>
      </div>
    </main>
  );
}
