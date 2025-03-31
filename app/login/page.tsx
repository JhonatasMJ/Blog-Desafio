"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Car } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AnimatedButton } from "@/components/ui/animated-button"
import { PageTransition } from "@/components/ui/page-transition"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, user } = useAuth()
  const router = useRouter()

  // If user is already logged in, redirect to home
  if (user) {
    router.push("/")
    return null
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Falha ao entrar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signUp(email, password)
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Falha ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-8 text-primary">
          <Car className="h-8 w-8" />
          <span>Blog de Carros</span>
        </Link>

        <div className="w-full max-w-md">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-primary">Entrar</CardTitle>
                  <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-slate-200 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-slate-200 focus:border-primary"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <AnimatedButton type="submit" className="w-full transition-all" disabled={isLoading}>
                      {isLoading ? "Entrando..." : "Entrar"}
                    </AnimatedButton>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-slate-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-primary">Criar uma Conta</CardTitle>
                  <CardDescription>Digite seus dados para criar uma nova conta</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-slate-200 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-slate-200 focus:border-primary"
                      />
                      <p className="text-xs text-slate-500">A senha deve ter pelo menos 6 caracteres</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <AnimatedButton type="submit" className="w-full transition-all" disabled={isLoading}>
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </AnimatedButton>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4">
          <Button variant="link" asChild className="text-primary">
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}

