"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

export function EmailPasswordLoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<EmailPasswordLoginSchemaType>({
    resolver: zodResolver(emailPasswordLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: EmailPasswordLoginSchemaType) {
    setLoading(true);
    emailPasswordLogin(values)
      .then((res) => {
        if (res && res.error) setError(res.error);
      })
      .catch((err) => {
        console.log("error", err.error);
        // TODO Sentry here
        setError("Error al acceder con el usuario, intente mas tarde");
      })
      .finally(() => setLoading(false));
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
