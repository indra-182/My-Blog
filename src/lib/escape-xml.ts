const ESCAPE_MAP: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

/** Escapes characters that are special inside XML/HTML text and attributes. */
export function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) => ESCAPE_MAP[character] ?? character,
  );
}
