"use client";

import {
  DefaultValues,
  FieldValues,
  Path,
  Resolver,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  formType: "SIGN_IN" | "SIGN_UP";
  onSubmit: (
    data: T
  ) => Promise<{ success: boolean; data?: T; error?: string }>;
}

export const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(
      schema as unknown as z.ZodType<T>
    ) as unknown as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitErrorHandler<T> = async () => {};

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        
        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
          {form.formState.isSubmitting ? "Submitting..." : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p className="paragraph-regular text-center text-dark400_light700">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary-500 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="paragraph-regular text-center text-dark400_light700">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary-500 hover:underline"
            >
              Sign In
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};
