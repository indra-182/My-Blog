export default function Loading() {
  return (
    <main
      id="main-content"
      className="page-main"
      aria-busy="true"
      aria-label="Memuat tulisan"
    >
      <div className="shell blog-hero">
        <div className="loading-block" style={{ maxWidth: 120 }} />
        <div
          className="loading-block"
          style={{ maxWidth: 620, height: 92, marginTop: 24 }}
        />
        <div
          className="loading-block"
          style={{ maxWidth: 520, marginTop: 22 }}
        />
      </div>
      <div className="shell browser">
        <div className="loading-block" />
        <div className="loading-block" style={{ marginTop: 24 }} />
      </div>
    </main>
  );
}
