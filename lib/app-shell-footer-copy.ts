/**
 * Static copy for the app shell footer.
 * Locale for external k-lab.ai links follows `document.documentElement.lang`.
 */

export type ShellFooterCopyKey = keyof typeof SHELL_FOOTER_COPY;

const SHELL_FOOTER_COPY = {
  copyright: "© {year} K Lab AI Holdings Inc. All rights reserved.",
  website: "k-lab.ai",
  legal: "Legal",
  feedback: "Feedback",
  support: "Support",
  utilityLinksNavLabel: "Website, legal, feedback, and support",
  socialNavLabel: "K-Lab on social media",
  socialLinkedIn: "K-Lab on LinkedIn",
  socialX: "K-Lab on X",
  socialInstagram: "K-Lab on Instagram",
  socialTiktok: "K-Lab on TikTok",
  socialYoutube: "K-Lab on YouTube",
  feedbackModalTitle: "Send feedback",
  feedbackModalDescription: "Rate your experience and share any comments.",
  feedbackRatingLabel: "How would you rate your experience?",
  feedbackRatingGroupAria: "Experience rating from 1 to 5",
  feedbackRatingSummary: "{score} of {max}",
  feedbackRatingLevel1: "Very dissatisfied",
  feedbackRatingLevel2: "Dissatisfied",
  feedbackRatingLevel3: "Neutral",
  feedbackRatingLevel4: "Satisfied",
  feedbackRatingLevel5: "Very satisfied",
  feedbackCommentLabel: "Comments",
  feedbackCommentPlaceholder: "Tell us what worked well or what we could improve.",
  feedbackSubmit: "Submit feedback",
  feedbackSubmitting: "Submitting",
  feedbackCancel: "Cancel",
  feedbackSuccessToast: "Thanks — your feedback was submitted.",
} as const;

export function shellFooterText(
  key: ShellFooterCopyKey,
  params?: Record<string, string | number>,
): string {
  let s: string = SHELL_FOOTER_COPY[key];
  if (!params) return s;
  for (const [k, v] of Object.entries(params)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
