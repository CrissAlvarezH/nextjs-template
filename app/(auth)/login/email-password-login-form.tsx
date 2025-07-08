"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  emailPasswordLoginSchema,
  EmailPasswordLoginSchemaType,
} from "@/app/(auth)/login/validations";
import { emailPasswordLoginAction } from "@/app/(auth)/login/actions";
import { useAction } from "next-safe-action/hooks";

export function EmailPasswordLoginForm({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const {
    execute: emailPasswordLogin,
    isPending,
    hasErrored,
    result,
  } = useAction(emailPasswordLoginAction);

  const form = useForm<EmailPasswordLoginSchemaType>({
    resolver: zodResolver(emailPasswordLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: EmailPasswordLoginSchemaType) {
    void emailPasswordLogin({ ...values, callbackUrl });
  }

  return (
    <Form {...form}>
      {hasErrored && (
        <div className="mb-2 flex flex-wrap justify-center gap-1 rounded-lg border border-red-500 p-2">
          <p className="text-sm text-red-500">{result.serverError}</p>
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="mt-2 w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ingresar
        </Button>
      </form>
    </Form>
  );
}
