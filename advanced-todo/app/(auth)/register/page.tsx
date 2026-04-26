"use client"

import { useEffect, useRef, useState } from "react"
import { createAuthClient } from "better-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const authClient = createAuthClient()

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const REDIRECT_DELAY_MS = 2000 // Configurable redirect delay

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name) {
      newErrors['name'] = "Name is required"
    }

    if (!formData.email) {
      newErrors['email'] = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors['email'] = "Invalid email address"
    } else if (formData.email.length > 254) {
      newErrors['email'] = "Email is too long"
    }

    if (!formData.password) {
      newErrors['password'] = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors['password'] = "Password must be at least 8 characters"
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors['password'] = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors['password'] = "Password must contain at least one lowercase letter"
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors['password'] = "Password must contain at least one number"
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors['password'] = "Password must contain at least one special character"
    }

    if (!formData.confirmPassword) {
      newErrors['confirmPassword'] = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors['confirmPassword'] = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSuccessMessage("")

    try {
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      })

      setSuccessMessage("Registration successful! You can now log in.")
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
      redirectTimeoutRef.current = setTimeout(() => {
        router.push("/login")
      }, REDIRECT_DELAY_MS)
    } catch {
      const errorMessage = "Registration failed. Please try again."
      setErrors({
        submit: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600 p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted">Join AdvancedToDo today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg" role="alert">
                <p className="font-medium">{successMessage}</p>
              </div>
            )}

            {errors['submit'] && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg" role="alert">
                <p className="font-medium">{errors['submit']}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={errors['name'] ? "true" : "false"}
                  aria-describedby={errors['name'] ? "name-error" : undefined}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors['name'] && (
                  <p id="name-error" className="text-sm text-red-600" role="alert">
                    {errors['name']}
                  </p>
                )}
              </div>

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
                  autoComplete="new-password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  aria-invalid={errors['confirmPassword'] ? "true" : "false"}
                  aria-describedby={errors['confirmPassword'] ? "confirm-password-error" : undefined}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {errors['confirmPassword'] && (
                  <p id="confirm-password-error" className="text-sm text-red-600" role="alert">
                    {errors['confirmPassword']}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-muted text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:text-secondary transition-colors"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
