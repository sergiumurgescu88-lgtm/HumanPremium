import { detectIntent } from "./intentEngine";

const professionPlaybooks: Record<string, string> = {
  accountant:
    "Folosește OCR API + Stripe + invoice automation. Poți vinde servicii la €299/lună.",
  contabil:
    "Folosește OCR documente + facturare automată + Stripe. Business recomandat: contabilitate AI pentru IMM-uri.",
  realtor:
    "Folosește Google Maps API + CRM + WhatsApp automation. Pachet recomandat €499/lună.",
  marketer:
    "Folosește OpenAI + SEO APIs + social scheduling. Agency model €500–€2000/client.",
  developer:
    "Folosește GitHub API + OpenAI + deployment automation. SaaS tools sau dev agency.",
  translator:
    "Folosește OpenAI + DeepL API + voice transcription pentru servicii premium."
};

export async function runBuddy(input: string) {
  const context = detectIntent(input);
  const text = input.toLowerCase();

  let guidance =
    "Combină 2-3 API-uri gratuite și lansează un MVP SaaS la $9/lună.";

  for (const key of Object.keys(professionPlaybooks)) {
    if (text.includes(key)) {
      guidance = professionPlaybooks[key];
      break;
    }
  }

  return {
    mode: context.suggestedMode,
    context,
    guidance
  };
}
