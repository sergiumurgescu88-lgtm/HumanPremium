import { BuddyContext, BuddyMode, IntentType } from "../types/buddy";

export function detectIntent(input: string): BuddyContext {
  const text = input.toLowerCase();

  let detectedIntent: IntentType = "question";
  let suggestedMode: BuddyMode = "chat";

  if (
    text.includes("code") ||
    text.includes("react") ||
    text.includes("typescript") ||
    text.includes("api")
  ) {
    detectedIntent = "coding";
    suggestedMode = "coding";
  }

  if (
    text.includes("marketing") ||
    text.includes("seo") ||
    text.includes("campaign")
  ) {
    detectedIntent = "marketing";
    suggestedMode = "marketing";
  }

  if (
    text.includes("business") ||
    text.includes("money") ||
    text.includes("saas")
  ) {
    detectedIntent = "side_hustle";
    suggestedMode = "side_hustle";
  }

  return {
    input,
    detectedIntent,
    suggestedMode,
    confidence: 0.92,
    tags: [],
  };
}
