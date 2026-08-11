import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main">
      <div className="shell not-found">
        <div>
          <div className="eyebrow">404</div>
          <h1>Halaman tidak ditemukan</h1>
          <p>Halaman yang kamu minta tidak ada atau belum dipublikasikan.</p>
          <Link href="/">Kembali ke Blog</Link>
        </div>
      </div>
    </main>
  );
}
