import { defaultRootDirectory } from "@/content/post-repository";
import { validateContentDirectory } from "@/content/validate-content";

const root = defaultRootDirectory();

async function main() {
  const issues = await validateContentDirectory(root);
  if (issues.length > 0) {
    console.error(
      issues.map((issue) => `${issue.filePath}: ${issue.message}`).join("\n"),
    );
    process.exitCode = 1;
  } else {
    console.log("All content validated.");
  }
}

void main();
