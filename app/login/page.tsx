"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Car, Eye, EyeOff } from 'lucide-react'
import { z } from "zod"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageTransition } from "@/components/ui/page-transition"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, user } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // If user is already logged in, redirect to home
  if (user) {
    router.push("/")
    return null
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError("")
    setIsLoading(true)

    try {
      await signIn(data.email, data.password)
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Falha ao entrar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Form Side */}
        <div className="flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="flex items-center gap-2 mb-8">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Blog de Carros</span>
            </div>
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Entrar na sua conta</h1>
              <p className="mt-2 text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@admin.com" 
                          type="email" 
                          {...field} 
                          className="border-slate-200 focus:border-primary"
                        />
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
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                            className="border-slate-200 focus:border-primary pr-10"
                            placeholder="fatec#Baitz123"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Esconder senha" : "Mostrar senha"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex items-center justify-between mt-2">
                        <FormMessage />
                            
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

      
        <div className="hidden bg-primary md:block md:w-1/2">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <img
              src="/teste2.jpg"
              alt="Carro esportivo"
              className="h-full w-full object-cover"
            />
            
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
