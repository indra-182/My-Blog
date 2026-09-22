import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { postRepository } from "@/content/post-repository";

export const alt = "Pratinjau artikel INDRA.DEV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await postRepository.getPostBySlug(slug);
  if (!post) notFound();

  const title = post.socialTitle ?? post.title;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#07161D",
        color: "#EDF1F2",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ color: "#83A2FF", fontSize: 28, fontWeight: 700 }}>
        INDRA.DEV / ARTIKEL
      </div>
      <div
        style={{
          maxWidth: 1056,
          fontSize: title.length > 70 ? 52 : 66,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: "-0.04em",
          overflowWrap: "break-word",
        }}
      >
        {title}
      </div>
      <div style={{ color: "#B8C6CB", fontSize: 25 }}>
        {post.topics.join(" · ")}
      </div>
    </div>,
    size,
  );
}
