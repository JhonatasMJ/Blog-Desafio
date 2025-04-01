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
import Header from "@/components/header"
import Footer from "@/components/footer"


export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(6)

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

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <AdminCheck>
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-white">
          <Header />

          <div className="container mt-8 mx-auto max-w-7xl">
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

          <div className="container py-8 max-w-7xl px-4 md:px-6 mx-auto ">
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
                {currentPosts.map((post, index) => (
                  <AnimatedCard key={post.id} delay={index} className="border border-slate-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-48 overflow-hidden flex-shrink-0">
                        <img
                          src={post.imageUrl || "/placeholder.svg?height=200&width=200" || "/placeholder.svg"}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform hover:scale-[1.02] duration-300"
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-4 ">
                        <span className="text-sm text-slate-500">{post.date}</span>
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2 py-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                              {post.category}py-4
                            </Badge>
                          </div>
                          <CardTitle className="text-primary">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 mt-2">
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

            {posts.length > postsPerPage && (
              <div className="flex justify-center mt-6 gap-2">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </AnimatedButton>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
                    <AnimatedButton
                      key={index}
                      variant={currentPage === index + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(index + 1)}
                      className="w-8 h-8 p-0"
                    >
                      {index + 1}
                    </AnimatedButton>
                  ))}
                </div>

                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(posts.length / postsPerPage)))}
                  disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                >
                  Próxima
                </AnimatedButton>
              </div>
            )}
          </div>

          <Footer />
        </div>
      </PageTransition>
    </AdminCheck>
  )
}

