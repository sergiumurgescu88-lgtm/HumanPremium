import type { BuddyContext, BuddyMode, IntentType } from "../types/buddy";

export function detectIntent(input: string): BuddyContext {
  const text = input.toLowerCase();

  let detectedIntent: IntentType = "question";
  let suggestedMode: BuddyMode = "chat";
  let confidence = 0.75;
  let tags: string[] = [];

  if (
    text.includes("code") ||
    text.includes("react") ||
    text.includes("typescript") ||
    text.includes("bug") ||
    text.includes("api")
  ) {
    detectedIntent = "coding";
    suggestedMode = "coding";
    confidence = 0.95;
    tags.push("dev", "software");
  } else if (
    text.includes("marketing") ||
    text.includes("ads") ||
    text.includes("seo") ||
    text.includes("sales")
  ) {
    detectedIntent = "marketing";
    suggestedMode = "marketing";
    confidence = 0.93;
    tags.push("growth", "sales");
  } else if (
    text.includes("business") ||
    text.includes("crm") ||
    text.includes("saas") ||
    text.includes("automation")
  ) {
    detectedIntent = "business";
    suggestedMode = "business_os";
    confidence = 0.92;
    tags.push("business", "automation");
  } else if (
    text.includes("side hustle") ||
    text.includes("income") ||
    text.includes("money") ||
    text.includes("startup")
  ) {
    detectedIntent = "side_hustle";
    suggestedMode = "side_hustle";
    confidence = 0.90;
    tags.push("money", "startup");
  }

  return {
    input,
    detectedIntent,
    suggestedMode,
    confidence,
    tags,
  };
}
