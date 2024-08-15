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

export function UserDataForm({ user }: { user: DatabaseUserAttributes }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [onEditMode, setOnEditMode] = useState(false);

  const form = useForm<UserDataFormSchemaType>({
    resolver: zodResolver(userDataFormSchema),
    defaultValues: {
      full_name: user.name,
      email: user.email,
      phone: user.phone || "",
    },
  });

  async function onSubmit(values: UserDataFormSchemaType) {
    setLoading(true);
    setError("");
    changeData(user.id, values.full_name, values.phone)
      .then((res) => {
        if (res && res.error) setError(res.error);
        else setOnEditMode(false);
      })
      .catch((err) => {
        console.log("error", err);
        // todo sentry here
        setError("error al crear el usuario, intente de nuevo");
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Form {...form}>
        {error && (
          <div className="mb-2 flex flex-wrap gap-1 rounded-lg border border-red-500 p-2">
            <p className="text-sm text-red-500">{error}</p>
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
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
}
