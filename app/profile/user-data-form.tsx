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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DatabaseUserAttributes } from "@/lib/auth";
import {
  userDataFormSchema,
  UserDataFormSchemaType,
} from "@/app/profile/validations";
import { changeData } from "@/app/profile/actions";
import { useServerAction } from "zsa-react";

export function UserDataForm({ user }: { user: DatabaseUserAttributes }) {
  const {
    error,
    isPending,
    execute: changeDataAction,
  } = useServerAction(changeData, { onSuccess: () => setOnEditMode(false) });
  const [onEditMode, setOnEditMode] = useState(false);

  const form = useForm<UserDataFormSchemaType>({
    resolver: zodResolver(userDataFormSchema),
    defaultValues: {
      full_name: user.name,
      phone: user.phone || "",
    },
  });

  function onSubmit(values: UserDataFormSchemaType) {
    void changeDataAction({
      userId: user.id,
      ...values,
    });
  }

  return (
    <>
      <Form {...form}>
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
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input
                    disabled={!onEditMode}
                    placeholder="Nombre completo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* This email field it's just to show, not for editing, emails cannot be changed */}
          <FormItem>
            <FormLabel>Correo electronico</FormLabel>
            <FormControl>
              <Input disabled={true} value={user.email} placeholder="Email" />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero de celular</FormLabel>
                <FormControl>
                  <Input
                    disabled={!onEditMode}
                    placeholder="Telefono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!onEditMode ? (
            <Button
              variant="ghost"
              size="sm"
              className="self-end"
              onClick={() => setOnEditMode(true)}
            >
              Editar
            </Button>
          ) : (
            <div className="flex gap-2 self-end">
              <Button
                size="sm"
                variant="ghost"
                className="self-end text-gray-500"
                onClick={() => setOnEditMode(false)}
              >
                Cancelar
              </Button>
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
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
