export default function Loading() {
  return (
    <main
      id="main-content"
      className="page-main min-h-screen"
      tabIndex={-1}
      aria-busy="true"
      aria-label="Menyiapkan tulisan"
    >
      <div className="shell blog-hero relative isolate overflow-hidden pt-[clamp(4.5rem,10vw,8rem)] pb-[clamp(7rem,14vw,12rem)]">
        <div className="loading-block max-w-[120px]" />
        <div className="loading-block mt-6 h-[92px] max-w-[620px]" />
        <div className="loading-block mt-[22px] max-w-[520px]" />
      </div>
      <div className="shell pt-[clamp(4rem,8vw,7rem)]">
        <div className="loading-block" />
        <div className="loading-block mt-6" />
      </div>
    </main>
  );
}
