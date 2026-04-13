export type BuddyMode =
  | "chat"
  | "coding"
  | "marketing"
  | "side_hustle"
  | "business_os";

export type IntentType =
  | "question"
  | "business"
  | "coding"
  | "marketing"
  | "automation"
  | "job_transform"
  | "side_hustle";

export interface BuddyContext {
  input: string;
  detectedIntent: IntentType;
  suggestedMode: BuddyMode;
  confidence: number;
  tags: string[];
}
