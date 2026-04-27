"use client"

import { useEffect, useState } from "react"
import { createAuthClient } from "better-auth/react"
import { Apple, Globe, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from "@/lib/components/icons"

const authClient = createAuthClient()

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<{ [key: string]: boolean }>({})
  const [providerAvailability, setProviderAvailability] = useState({
    google: false,
    apple: false,
  })

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers")
        if (!response.ok) {
          setProviderAvailability((prev) => ({ ...prev, google: false, apple: false }))
          return
        }
        const data = await response.json()
        setProviderAvailability((prev) => ({
          ...prev,
          google: Boolean(data.google),
          apple: Boolean(data.apple),
        }))
      } catch {
        setProviderAvailability((prev) => ({ ...prev, google: false, apple: false }))
      }
    }

    fetchProviders()
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors['email'] = "Email is required"
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors['email'] = "Invalid email address"
    } else if (formData.email.length > 254) {
      newErrors['email'] = "Email is too long"
    }

    if (!formData.password) {
      newErrors['password'] = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      })

      // Redirect to dashboard after successful login
      router.push("/dashboard")
    } catch (error: unknown) {
      let errorMessage = "Login failed. Please try again."
      
      // Provide more specific error messages based on the error
      if (error instanceof Error) {
        if (error.message.includes('credentials') || error.message.includes('password')) {
          errorMessage = "Invalid email or password. Please check your credentials."
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (error.message.includes('rate') || error.message.includes('too many')) {
          errorMessage = "Too many login attempts. Please wait a moment and try again."
        } else {
          errorMessage = `Login failed: ${error.message}`
        }
      }
      
      setErrors({
        submit: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    setIsOAuthLoading((prev) => ({ ...prev, [provider]: true }))
    setErrors({})

    // Set timeout to reset loading state if redirect doesn't occur
    const timeoutId = setTimeout(() => {
      setIsOAuthLoading((prev) => ({ ...prev, [provider]: false }))
      setErrors({
        submit: `${provider} login timed out. Please try again.`
      })
    }, 30000)

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
      clearTimeout(timeoutId)
    } catch {
      clearTimeout(timeoutId)
      const errorMessage = `${provider} login failed. Please try again.`
      setErrors({
        submit: errorMessage
      })
    } finally {
      setIsOAuthLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors['submit'] && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
                <p className="font-medium">{errors['submit']}</p>
              </div>
            )}

            {(providerAvailability.google || providerAvailability.apple) && (
              <div className="space-y-3">
                {providerAvailability.google && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isOAuthLoading['google'] || isLoading || !providerAvailability.google}
                    className="w-full"
                    aria-busy={isOAuthLoading['google']}
                    aria-live="polite"
                  >
                    {isOAuthLoading['google'] ? (
                      <>
                        <Icon size="sm" decorative>
                          <Loader2 className="animate-spin" aria-hidden="true" />
                        </Icon>
                        <span className="sr-only">Loading Google sign in</span>
                      </>
                    ) : (
                      <>
                        <Icon size="sm" color="foreground" decorative>
                          <Globe aria-hidden="true" />
                        </Icon>
                        Sign in with Google
                      </>
                    )}
                  </Button>
                )}

                {providerAvailability.apple && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthLogin("apple")}
                    disabled={isOAuthLoading['apple'] || isLoading || !providerAvailability.apple}
                    className="w-full bg-foreground text-background hover:bg-secondary border-foreground"
                    aria-busy={isOAuthLoading['apple']}
                    aria-live="polite"
                  >
                    {isOAuthLoading['apple'] ? (
                      <>
                        <Icon size="sm" decorative>
                          <Loader2 className="animate-spin" aria-hidden="true" />
                        </Icon>
                        <span className="sr-only">Loading Apple sign in</span>
                      </>
                    ) : (
                      <>
                        <Icon size="sm" color="foreground" decorative>
                          <Apple aria-hidden="true" />
                        </Icon>
                        Sign in with Apple
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-surface text-muted">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailPasswordLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={errors['email'] ? "true" : "false"}
                  aria-describedby={errors['email'] ? "email-error" : undefined}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors['email'] && (
                  <p id="email-error" className="text-sm text-red-600" role="alert">
                    {errors['email']}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  aria-invalid={errors['password'] ? "true" : "false"}
                  aria-describedby={errors['password'] ? "password-error" : undefined}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors['password'] && (
                  <p id="password-error" className="text-sm text-red-600" role="alert">
                    {errors['password']}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || Object.values(isOAuthLoading).some(Boolean)}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-muted text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-primary hover:text-secondary transition-colors"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
