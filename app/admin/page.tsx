"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ref, onValue, remove } from "firebase/database"
import { database } from "@/lib/firebase"
import AdminCheck from "@/components/admin-check"
import { ArrowLeft, Car, Edit, Plus, Trash } from "lucide-react"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { PageTransition } from "@/components/ui/page-transition"

interface Post {
  id: string
  title: string
  category: string
  date: string
  imageUrl: string
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  useEffect(() => {
    const postsRef = ref(database, "posts")

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const postsArray = Object.entries(data).map(([id, post]) => ({
          id,
          ...(post as Omit<Post, "id">),
        }))
        setPosts(postsArray)
      } else {
        setPosts([])
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      const postRef = ref(database, `posts/${postToDelete}`)
      await remove(postRef)
      setPostToDelete(null)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  return (
    <AdminCheck>
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-white">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Car className="h-6 w-6" />
                <span>Blog de Carros</span>
              </Link>
              <AnimatedButton
                asChild
                variant="outline"
                size="sm"
                className="transition-all hover:bg-primary hover:text-white"
              >
                <Link href="/admin/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Post
                </Link>
              </AnimatedButton>
            </div>
          </header>

          {/* Back Button */}
          <div className="container mt-8">
            <AnimatedButton
              variant="ghost"
              size="sm"
              asChild
              className="text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a Página Inicial
              </Link>
            </AnimatedButton>
          </div>

          {/* Admin Dashboard */}
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tighter text-primary">Gerenciar Posts</h1>
            <p className="text-slate-600">Crie, edite e exclua posts do blog</p>

            <Separator className="my-6" />

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <Car className="h-8 w-8 text-primary" />
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-slate-600 mb-4">Nenhum post encontrado.</p>
                <AnimatedButton asChild className="transition-all">
                  <Link href="/admin/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Crie Seu Primeiro Post
                  </Link>
                </AnimatedButton>
              </div>
            ) : (
              <div className="grid gap-6">
                {posts.map((post, index) => (
                  <AnimatedCard key={post.id} delay={index} className="border border-slate-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-48 overflow-hidden">
                        <img
                          src={post.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform hover:scale-[1.02] duration-300"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                              {post.category}
                            </Badge>
                            <span className="text-sm text-slate-500">{post.date}</span>
                          </div>
                          <CardTitle className="text-primary">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <Link href={`/articles/${post.id}`} className="text-sm text-primary hover:underline">
                            Ver Post
                          </Link>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            asChild
                            className="transition-all hover:bg-primary/10 hover:text-primary"
                          >
                            <Link href={`/admin/edit/${post.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </AnimatedButton>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <AnimatedButton variant="destructive" size="sm" onClick={() => setPostToDelete(post.id)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Excluir
                              </AnimatedButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá permanentemente o post.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeletePost}>Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="w-full border-t bg-slate-50 py-6 md:py-12 mt-auto">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-6 w-6 text-primary" />
                  <span className="font-bold text-primary">Blog de Carros</span>
                </div>
                <p className="text-sm text-slate-500 text-center md:text-right">
                  © {new Date().getFullYear()} Blog de Carros. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </PageTransition>
    </AdminCheck>
  )
}

