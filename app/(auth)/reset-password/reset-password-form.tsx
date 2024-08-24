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
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/app/(auth)/reset-password/validations";
import { resetPasswordAction } from "@/app/(auth)/reset-password/actions";
import { useServerAction } from "zsa-react";

export function ResetPasswordForm({
  userId,
  code,
}: {
  userId: number;
  code: string;
}) {
  const {
    error,
    isPending,
    isSuccess,
    execute: resetPassword,
  } = useServerAction(resetPasswordAction);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmation_password: "" },
  });

  function onSubmit(values: ResetPasswordSchemaType) {
    void resetPassword({
      userId,
      newPassword: values.password,
      confirmationCode: code,
    });
  }

  if (isSuccess) {
    return (
      <div>
        <p className="text-center text-lg font-bold">
          Contraseña restaurada exitosamente
        </p>
        <p className="pt-2 text-center">
          Puedes ingresar con tu nueva contraseña
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
            <p className="text-sm text-red-500">{error.error}</p>
          </div>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmation_password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirmar contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="mt-2 w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Restaurar contraseña
          </Button>
        </form>
      </Form>
    </>
  );
}
