"use client";
import { useForm } from "react-hook-form";
import {
  SignupSchemaType,
  signupSchema,
} from "@/app/(auth)/signup/validations";
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
import { signupAction } from "@/app/(auth)/signup/actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

const defaultValues = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  confirmation_password: "",
};

export function SignupForm() {
  const {
    execute: signup,
    isPending,
    hasSucceeded,
    hasErrored,
    result,
  } = useAction(signupAction);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: SignupSchemaType) {
    void signup(values);
  }

  if (hasSucceeded) {
    return (
      <div>
        <p className="text-center text-lg font-bold">
          Genial, ya solo falta un paso
        </p>
        <p className="pt-2 text-center">
          Te envíamos un email para que puedas validar tu cuenta
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="pb-4 text-center text-lg font-bold">Registrarme</p>
      <Form {...form}>
        {hasErrored && (
          <div className="mb-2 flex flex-wrap gap-1 rounded-lg border border-red-500 p-2">
            <p className="text-sm text-red-500">{result.serverError}</p>
          </div>
        )}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero de celular</FormLabel>
                <FormControl>
                  <Input placeholder="Telefono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electronico</FormLabel>
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
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Minimo 6 digitos"
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
                  <Input
                    type="password"
                    placeholder="Digite de nuevo la contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit" className="mt-3 w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrarme
          </Button>
        </form>
      </Form>
    </>
  );
}
