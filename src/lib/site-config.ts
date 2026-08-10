import { z } from "zod";

const siteConfigSchema = z.object({
  blogUrl: z.string().url(),
  portfolioUrl: z.string().url(),
  contactEmail: z.string().email(),
  linkedinUrl: z.string().url(),
});

export const siteConfig = siteConfigSchema.parse({
  blogUrl: process.env.NEXT_PUBLIC_BLOG_URL ?? "http://localhost:3000",
  portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://indra.dev",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@indra.dev",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/mahadindra/",
});
