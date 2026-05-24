import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAccessToken } from "@/lib/auth-token";
import { getErrorMessage } from "@/lib/error";
import { useLoginMutation } from "@/hooks/useLoginMutation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (getAccessToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation({
    onSuccess: async () => {
      await navigate({ to: "/" });
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    form.clearErrors("root");

    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      form.setError("root", {
        message: getErrorMessage(error, "Unable to sign in. Check your username and password."),
      });
    }
  };

  const handleCapsLockState = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(event.getModifierState("CapsLock"));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,oklch(0.97_0.01_320),transparent_34%),linear-gradient(180deg,oklch(1_0_0),oklch(0.98_0.004_320))] px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <section className="order-2 space-y-4 px-1 lg:order-1 lg:space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-sm">
            Sugar Checker
          </p>
          <div className="space-y-3 lg:space-y-4">
            <h1 className="max-w-xl font-heading text-3xl leading-none text-foreground sm:text-5xl lg:text-6xl">
              Sign in to review sugar readings and keep daily checks moving.
            </h1>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 lg:text-lg">
              Sugar Checker helps track results, verify entries, and keep the monitoring flow
              consistent across the app.
            </p>
          </div>
        </section>

        <section className="order-1 border border-border bg-background/95 p-5 shadow-[0_24px_80px_-36px_oklch(0.24_0.03_320/.35)] backdrop-blur sm:p-7 lg:order-2 lg:p-8">
          <div className="mb-6 space-y-2 sm:mb-8">
            <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Login</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Enter your Sugar Checker account to continue.
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-4 sm:space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          autoComplete="username"
                          className="h-11 rounded-none border-border bg-card pl-11 text-sm sm:h-12"
                          placeholder="admin"
                          {...field}
                        />
                      </div>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          autoComplete="current-password"
                          className="h-11 rounded-none border-border bg-card pr-12 pl-11 text-sm sm:h-12"
                          name={field.name}
                          onBlur={() => {
                            setIsCapsLockOn(false);
                            field.onBlur();
                          }}
                          onChange={field.onChange}
                          onKeyDown={handleCapsLockState}
                          onKeyUp={handleCapsLockState}
                          placeholder="123"
                          ref={field.ref}
                          type={isPasswordVisible ? "text" : "password"}
                          value={field.value}
                        />
                        <button
                          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                          className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                          onClick={() => setIsPasswordVisible((current) => !current)}
                          type="button"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {isCapsLockOn ? (
                      <p className="text-xs font-medium text-amber-700 sm:text-sm">
                        Caps Lock is on.
                      </p>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root?.message ? (
                <div className="border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              ) : null}

              <Button
                className="h-11 w-full text-sm font-semibold sm:h-12"
                disabled={loginMutation.isPending}
                size="lg"
                type="submit"
              >
                {loginMutation.isPending ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-xs leading-5 text-muted-foreground sm:hidden">
            Your session starts after a successful sign-in.
          </p>
        </section>
      </div>
    </main>
  );
}
