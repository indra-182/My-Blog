import type { Dictionary } from "@/i18n/dictionaries";

export function BlogHero({ dictionary }: { dictionary: Dictionary }) {
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
