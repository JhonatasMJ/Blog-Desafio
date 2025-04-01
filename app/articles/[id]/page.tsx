"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ref, get } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Calendar, Car, Edit, LogIn, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AnimatedButton } from "@/components/ui/animated-button"
import { PageTransition } from "@/components/ui/page-transition"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  category: string
  date: string
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, signOut, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = ref(database, `posts/${params.id}`)
        const snapshot = await get(postRef)

        if (snapshot.exists()) {
          setPost({
            id: params.id,
            ...snapshot.val(),
          })
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen max-w-7xl bg-white">
        <div className="animate-spin">
          <Car className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p>Artigo não encontrado</p>
      </div>
    )
  }

  return (
    <PageTransition>
 
      <Header/>
      <div className="flex min-h-screen flex-col max-w-7xl mx-auto">

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

        {/* Article Header */}
        <div className="container mt-8 max-w-4xl">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            {post.category}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">{post.title}</h1>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-slate-500" />
              <span className="text-slate-500">{post.date}</span>
            </div>

            {isAdmin && (
              <AnimatedButton
                variant="outline"
                size="sm"
                asChild
                className="transition-all hover:bg-primary hover:text-white"
              >
                <Link href={`/admin/edit/${post.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Post
                </Link>
              </AnimatedButton>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <div className="container mt-8 max-w-4xl">
          <div className="aspect-video w-full overflow-hidden rounded-lg shadow-md">
            <img
              src={post.imageUrl || "/placeholder.svg?height=400&width=800"}
              alt={post.title}
              className="h-full w-full object-cover transition-transform hover:scale-[1.01] duration-300"
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="container mt-8 max-w-3xl">
          <div className="prose prose-lg max-w-none text-slate-700">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

       <Footer/>
      </div>
       
    </PageTransition>
  )
}

