"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ref, get, update } from "firebase/database"
import { ArrowLeft, Car, Loader2 } from "lucide-react"
import { database } from "@/lib/firebase"
import AdminCheck from "@/components/admin-check"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Footer from "@/components/footer"
import Header from "@/components/header"

interface Post {
  title: string
  content: string
  category: string
  imageUrl: string
  date: string
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = ref(database, `posts/${params.id}`)
        const snapshot = await get(postRef)

        if (snapshot.exists()) {
          const post = snapshot.val() as Post
          setTitle(post.title)
          setContent(post.content)
          setCategory(post.category)
          setImageUrl(post.imageUrl)
        } else {
          setError("Post não encontrado")
          router.push("/admin")
        }
      } catch (error: any) {
        console.error("Error fetching post:", error)
        setError(error.message || "Falha ao buscar post")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id, router])

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSaving(true)

    if (!title || !content || !category) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsSaving(false)
      return
    }

    try {

      const postData = {
        title,
        content,
        category,
        imageUrl,
        excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
      }


      const postRef = ref(database, `posts/${params.id}`)
      await update(postRef, postData)

 
      router.push(`/articles/${params.id}`)
    } catch (error: any) {
      console.error("Error updating post:", error)
      setError(error.message || "Falha ao atualizar post")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p>Carregando post...</p>
      </div>
    )
  }

  return (
    <AdminCheck>
      <div className="flex min-h-screen flex-col bg-white">
        
    <Header />

       
        <div className="container mt-8 max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary/10 hover:text-primary">
            <Link href="/admin" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Administração
            </Link>
          </Button>
        </div>

        <div className="container py-8 max-w-7xl mx-auto">
          <Card className="border border-slate-200 shadow-sm p-6">
            <CardHeader>
              <CardTitle className="text-primary">Editar Post</CardTitle>
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

              <CardFooter className="flex justify-between py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  disabled={isSaving}
                  className="transition-all hover:bg-slate-100"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving} className="transition-all">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

      </div>
                  <Footer />
    </AdminCheck>
  )
}

