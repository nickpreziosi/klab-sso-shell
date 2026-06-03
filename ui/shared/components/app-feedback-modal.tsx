"use client";

import * as React from "react";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FloatingLabelInput,
  Label,
} from "@k-lab/components";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { shellFooterText } from "@/lib/app-shell-footer-copy";

const RATING_MAX = 5;
const RATING_VALUES = [1, 2, 3, 4, 5] as const;
const MOCK_SUBMIT_MS = 900;

export function AppFeedbackModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [rating, setRating] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const ratingLevelLabels = [
    shellFooterText("feedbackRatingLevel1"),
    shellFooterText("feedbackRatingLevel2"),
    shellFooterText("feedbackRatingLevel3"),
    shellFooterText("feedbackRatingLevel4"),
    shellFooterText("feedbackRatingLevel5"),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || submitting) return;
    setSubmitting(true);
    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, MOCK_SUBMIT_MS);
      });
      toast.success(shellFooterText("feedbackSuccessToast"));
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogOpenChange = (next: boolean) => {
    if (!next && submitting) return;
    onOpenChange(next);
  };

  const ratingNum = rating ? Number.parseInt(rating, 10) : null;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md !px-4 sm:!px-6 ">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute end-4 top-4 h-10 w-10"
          disabled={submitting}
          onClick={() => onOpenChange(false)}
          aria-label={shellFooterText("feedbackCancel")}
        >
          <X className="h-4 w-4" />
        </Button>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1 text-start">
            <DialogTitle>{shellFooterText("feedbackModalTitle")}</DialogTitle>
            <DialogDescription>{shellFooterText("feedbackModalDescription")}</DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium leading-none">
                {shellFooterText("feedbackRatingLabel")}
              </Label>
              <div
                className="flex flex-wrap items-center justify-center gap-2"
                role="radiogroup"
                aria-label={shellFooterText("feedbackRatingGroupAria")}
              >
                {RATING_VALUES.map((n) => {
                  const value = String(n);
                  const selected = ratingNum != null && n <= ratingNum;
                  const levelLabel = ratingLevelLabels[n - 1] ?? "";
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={levelLabel}
                      disabled={submitting}
                      className="rounded-app-radius p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
                      onClick={() => setRating(value)}
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 shrink-0 transition-colors sm:h-9 sm:w-9",
                          selected
                            ? "fill-accent-brand text-accent-brand stroke-accent-brand"
                            : "fill-transparent text-muted-foreground stroke-current",
                        )}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </button>
                  );
                })}
              </div>
              {ratingNum != null && Number.isFinite(ratingNum) ? (
                <p className="text-center text-xs text-muted-foreground">
                  {shellFooterText("feedbackRatingSummary", { score: ratingNum, max: RATING_MAX })}
                </p>
              ) : null}
            </div>

            <FloatingLabelInput
              id="app-feedback-comment"
              type="textarea"
              label={shellFooterText("feedbackCommentLabel")}
              placeholder={shellFooterText("feedbackCommentPlaceholder")}
              className="min-h-[120px]"
              value={comment}
              disabled={submitting}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              {shellFooterText("feedbackCancel")}
            </Button>
            <Button
              type="submit"
              disabled={!rating || submitting}
              loading={submitting}
              variant="accent-brand"
            >
              {submitting ? shellFooterText("feedbackSubmitting") : shellFooterText("feedbackSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
