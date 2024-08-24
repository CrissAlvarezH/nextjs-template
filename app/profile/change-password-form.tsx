"use client";
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
import { DatabaseUserAttributes } from "@/lib/auth";
import {
  changePasswordFormSchema,
  ChangePasswordFormSchemaType,
} from "@/app/profile/validations";
import { changePasswordAction } from "@/app/profile/actions";
import { useServerAction } from "zsa-react";

export function ChangePasswordForm({ user }: { user: DatabaseUserAttributes }) {
  const {
    error,
    isPending,
    isSuccess,
    execute: changePassword,
  } = useServerAction(changePasswordAction);

  const form = useForm<ChangePasswordFormSchemaType>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirmation_password: "",
    },
  });

  function onSubmit(values: ChangePasswordFormSchemaType) {
    void changePassword({
      userId: user.id,
      currentPassword: values.current_password,
      newPassword: values.new_password,
    });
  }

  return (
    <>
      <Form {...form}>
        {isSuccess && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-500 px-2 py-1">
            <p className="text-sm text-green-700">
              Contraseña cambiada exitosamente
            </p>
            <Button
              size="sm"
              className="rounded-full bg-green-500 hover:bg-green-600"
              onClick={() => location.reload()}
            >
              Aceptar
            </Button>
          </div>
        )}
        {error && (
          <div className="mb-2 flex flex-wrap gap-1 rounded-lg border border-red-500 p-2">
            <p className="text-sm text-red-500">{error.error}</p>
          </div>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña actual</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese su contraseña"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña nueva</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Minimo 6 caracteres"
                    type="password"
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
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="Confirmar" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="sm"
            variant="ghost"
            type="submit"
            className="self-end text-blue-600"
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </form>
      </Form>
    </>
  );
}
