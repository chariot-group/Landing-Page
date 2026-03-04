"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldGroup } from "./ui/field";
import React from "react";
import { Input } from "@/components/ui/input";
import { Loader, Send } from "lucide-react";

const NEWSLETTER_WEBHOOK_ENV = process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL;
const HAS_NEWSLETTER_WEBHOOK_ENV = Boolean(NEWSLETTER_WEBHOOK_ENV);

export default function CheckoutDisabledNotice() {
  const t = useTranslations();
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [newsletterFeedback, setNewsletterFeedback] = useState<string | null>(
    null,
  );

  const formSchema = z.object({
    email: z
      .email({ message: t("packs.newsletterInvalidEmail") })
      .min(1, { message: t("packs.newsletterInvalidEmail") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleNewsletterSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      form.trigger(undefined, { shouldFocus: true });

      setIsSubmittingNewsletter(true);
      setNewsletterFeedback(null);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        throw new Error("Newsletter submit failed");
      }

      setNewsletterFeedback(t("packs.newsletterSuccess"));
      form.reset();
    } catch (error) {
      setNewsletterFeedback(t("packs.newsletterError"));
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  return (
    <div className="absolute -inset-3 md:-inset-6 z-20 bg-black/80 rounded-[24px] flex items-center justify-center p-4">
      <Card className="max-w-6xl mx-2 text-black bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold md:text-lg text-sm">
              {t("packs.prelaunchTitle")}
            </p>
            <p className="md:text-sm text-xs text-foreground">
              {t("packs.prelaunchDescription")}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {HAS_NEWSLETTER_WEBHOOK_ENV && (
              <form
                id="form-newsletter"
                onSubmit={form.handleSubmit(handleNewsletterSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        orientation={"vertical"}
                      >
                        <Input
                          type="email"
                          {...field}
                          placeholder={t("packs.newsletterPlaceholder")}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            )}
            <Field orientation="horizontal">
              <Button
                type="submit"
                form="form-newsletter"
                className="md:text-sm text-xs"
                disabled={isSubmittingNewsletter}
              >
                {isSubmittingNewsletter ? (
                  <React.Fragment>
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    {t("packs.newsletterSubmitting")}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Send className="w-4 h-4 mr-2" />{" "}
                    {t("packs.newsletterSubmit")}
                  </React.Fragment>
                )}
              </Button>
            </Field>
          </div>

          {!HAS_NEWSLETTER_WEBHOOK_ENV && (
            <div className="md:text-sm text-xs text-foreground">
              {t("packs.prelaunchInfoOnly")}
            </div>
          )}

          {newsletterFeedback && (
            <div className="md:text-sm text-xs text-foreground">
              {newsletterFeedback}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
