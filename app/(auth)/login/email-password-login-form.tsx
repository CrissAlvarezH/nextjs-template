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
import { emailPasswordLogin } from "@/app/(auth)/login/actions";
import { useServerAction } from "@/hooks/rsc";

export function EmailPasswordLoginForm() {
  const {
    error,
    loading,
    execute: emailPasswordLoginAction,
  } = useServerAction(emailPasswordLogin);

  const form = useForm<EmailPasswordLoginSchemaType>({
    resolver: zodResolver(emailPasswordLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: EmailPasswordLoginSchemaType) {
    void emailPasswordLoginAction(values);
  }

  return (
    <Form {...form}>
      {error && (
        <div className="mb-2 flex flex-wrap justify-center gap-1 rounded-lg border border-red-500 p-2">
          <p className="text-sm text-red-500">{error}</p>
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

        <Button disabled={loading} type="submit" className="mt-2 w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ingresar
        </Button>
      </form>
    </Form>
  );
}
