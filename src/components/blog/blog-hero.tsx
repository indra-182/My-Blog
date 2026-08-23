import dictionary from "@/i18n/messages/id.json";

export function BlogHero() {
  return (
    <section className="blog-hero" aria-labelledby="blog-hero-title">
      <div className="shell">
        <div className="blog-hero-copy animate-cue-rise">
          <h1 id="blog-hero-title">{dictionary.blog.title}</h1>
          <div className="cue-label">{dictionary.blog.eyebrow}</div>
          <p>{dictionary.blog.description}</p>
        </div>
      </div>
    </section>
  );
}
