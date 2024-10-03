"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserLoginSchema } from "@/lib/validators";
import CustomFormField from "@/components/globals/custom-formfield";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/constants";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { loginUser } from "@/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserLoginSchema>) => {
    setIsLoading(true);
    await loginUser(values)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("Redirecting to dashboard...");
          router.push("/");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-screen">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/images/bg.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover brightness-[0.6]"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center py-12"
        >
          <div className="mx-auto grid gap-3">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your information below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <CustomFormField
                control={form.control}
                name="username"
                disabled={isLoading}
                fieldType={FormFieldType.INPUT}
                label="Username"
                isRequired
                placeholder="Username"
              />
              <div className="grid gap-2">
                <CustomFormField
                  control={form.control}
                  name="password"
                  disabled={isLoading}
                  type={"password"}
                  fieldType={FormFieldType.INPUT}
                  label="Password"
                  isRequired
                  placeholder="Password"
                />
              </div>
              <Link
                className="text-right text-sm text-muted-foreground font-[500] hover:underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && (
                  <Loader2 className="animate-spin mr-2" size="20" />
                )}
                Login
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
