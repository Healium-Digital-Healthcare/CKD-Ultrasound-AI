"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Mail, CheckCircle, Key } from "lucide-react"
import { useRouter } from "next/navigation"

// ✅ Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // ✅ React Hook Form
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const handleForgotPassword = async (values: ForgotPasswordValues) => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    
    try {
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/auth/update-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Back to Home */}
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Button>

      {success ? (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="relative z-10 text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              Password reset instructions have been sent
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg mb-6">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Reset email sent successfully
                </p>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to&nbsp;
                  <strong>{form.getValues("email")}</strong>. Please check your
                  inbox and follow the instructions.
                </p>
              </div>
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            </div>
            <CardDescription className="text-base">
              Enter your email address and we&apos;ll send you a secure link
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* ✅ ShadCN Form + RHF + Zod */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleForgotPassword)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          className="focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
