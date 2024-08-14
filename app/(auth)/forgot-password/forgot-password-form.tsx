"use client";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { emailPasswordLoginSchema } from "@/app/(auth)/login/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/app/(auth)/forgot-password/validations";
import { forgotPassword } from "@/app/(auth)/forgot-password/actions";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordSchemaType) {
    setLoading(true);
    setError("");
    forgotPassword(values.email)
      .then((res) => {
        if (res && res.error) setError(res.error);
        else setSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        setError("Ocurrió un inconveniente, vuelve a intentar mas tarde");
      })
      .finally(() => setLoading(false));
  }

  if (success) {
    return (
      <div>
        <p className="text-center text-lg font-bold">Revisa tu correo</p>
        <p className="pt-2 text-center">
          Te envíamos un email para que puedas restablecer contraseña
        </p>
      </div>
    );
  }
  return (
    <>
      <p className="pb-4 text-center text-lg font-bold">Restaurar contraseña</p>
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
                  <Input placeholder="Correo electronico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit" className="mt-2 w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Restaurar contraseña
          </Button>
        </form>
      </Form>
    </>
  );
}
