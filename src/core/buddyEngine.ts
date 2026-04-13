import { detectIntent } from "./intentEngine";

export async function runBuddy(input: string) {
  const context = detectIntent(input);

  return {
    mode: context.suggestedMode,
    context,
  };
}
