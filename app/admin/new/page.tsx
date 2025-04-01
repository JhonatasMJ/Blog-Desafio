"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ref, push, set } from "firebase/database"
import { database } from "@/lib/firebase"
import AdminCheck from "@/components/admin-check"
import { ArrowLeft, Car, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!title || !content || !category) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    try {
      // Create a new post reference
      const newPostRef = push(ref(database, "posts"))
      const postId = newPostRef.key

      // Use a URL fornecida ou uma imagem de placeholder
      const finalImageUrl = imageUrl || "/placeholder.svg?height=400&width=800"

      // Create post data
      const postData = {
        title,
        content,
        category,
        imageUrl: finalImageUrl,
        date: new Date().toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
      }

      // Save post to database
      await set(newPostRef, postData)

      // Redirect to the post
      router.push(`/articles/${postId}`)
    } catch (error: any) {
      console.error("Error creating post:", error)
      setError(error.message || "Falha ao criar post")
      setIsLoading(false)
    }
  }

  return (
    <AdminCheck>
      <Header/>
      <div className="flex min-h-screen flex-col bg-white max-w-7xl mx-auto">
        {/* Header */}

        {/* Back Button */}
        <div className="container mt-8">
          <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/admin" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Administração
            </Link>
          </Button>
        </div>

        {/* New Post Form */}
        <div className="container py-8 p max-w-3xl mx-au ">
          <Card className="border border-slate-200 shadow-sm p-6 justify-center">
            <CardHeader>
              <CardTitle className="text-primary">Criar Novo Post</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do post"
                    required
                    className="border-slate-200 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="ex: Avaliações, Notícias, Tecnologia"
                    required
                    className="border-slate-200 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escreva o conteúdo do seu post aqui..."
                    className="min-h-[300px] border-slate-200 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="border-slate-200 focus:border-primary"
                  />
                  <p className="text-xs text-slate-500">
                    Digite a URL de uma imagem na web, ou deixe em branco para usar uma imagem padrão
                  </p>

                  {imageUrl && (
                    <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Pré-visualização"
                        className="h-full w-full object-cover"
                        onError={() =>
                          setError("URL de imagem inválida. Por favor, verifique a URL e tente novamente.")
                        }
                      />
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  disabled={isLoading}
                  className="transition-all hover:bg-slate-100"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="transition-all">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Post"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

        <Footer/>
     
    </AdminCheck>
  )
}

