"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { Loader2 } from "lucide-react"
import { login } from "@/lib/api-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormClientProps {
  translations: {
    Login: string;
    username: string;
    password: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    loginButton: string;
    loggingIn: string;
    authError: string;
    footerText: string;
  };
}

export function LoginFormClient({ translations }: LoginFormClientProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await login({ username, password })

      // Store user info in localStorage (non-sensitive data only)
      localStorage.setItem("user", JSON.stringify({ username: response.data.user.username }))
      router.push("/dashboard/forms")
    } catch (err: any) {
      // Suppress Axios error from propagating to the console
      if (err.response?.status === 401) {
        const errorMessage = err.response?.data?.error || translations.authError
        setError(errorMessage)
      } else {
        console.error("Unexpected error:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.Login}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{translations.username}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={translations.usernamePlaceholder}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{translations.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={translations.passwordPlaceholder}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {translations.loggingIn}
              </>
            ) : (
              translations.loginButton
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">{translations.footerText}</p>
      </CardFooter>
    </Card>
  )
}
