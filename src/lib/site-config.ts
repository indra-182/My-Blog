import { z } from "zod";

const siteConfigSchema = z.object({
  blogUrl: z.string().url(),
  portfolioUrl: z.string().url(),
  contactEmail: z.string().email(),
  linkedinUrl: z.string().url(),
});

export const siteConfig = siteConfigSchema.parse({
  blogUrl: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog-indra.vercel.app/",
  portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://portfolio-mahadi-indra.vercel.app/",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "mahadiindra2@gmail.com",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/mahadindra/",
});
