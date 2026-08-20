import dictionary from "@/i18n/messages/id.json";

export function BlogHero() {
  return (
    <section className="blog-hero">
      <div className="shell">
        <div className="eyebrow">{dictionary.blog.eyebrow}</div>
        <h1>{dictionary.blog.title}</h1>
        <p>{dictionary.blog.description}</p>
      </div>
    </section>
  );
}
