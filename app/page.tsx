"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import { Car, Clock, Filter, Plus, ChevronLeft, ChevronRight, PenSquare } from "lucide-react"
import { motion } from "framer-motion"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedText } from "@/components/ui/animated-text"
import { PageTransition } from "@/components/ui/page-transition"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  category: string
  date: string
  excerpt: string
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { user, signOut, isAdmin } = useAuth()


  const postsPerPage = 9
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const postsRef = ref(database, "posts")

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const postsArray = Object.entries(data).map(([id, post]) => ({
          id,
          ...(post as Omit<Post, "id">),
        }))

        
        const uniqueCategories = Array.from(new Set(postsArray.map((post) => post.category)))
        setCategories(uniqueCategories)

        setPosts(postsArray)
        setFilteredPosts(postsArray)
        setTotalPages(Math.ceil(postsArray.length / postsPerPage))
      } else {
        setPosts([])
        setFilteredPosts([])
        setCategories([])
        setTotalPages(1)
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])


  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts)
      setTotalPages(Math.ceil(posts.length / postsPerPage))
    } else {
      const filtered = posts.filter((post) => post.category === selectedCategory)
      setFilteredPosts(filtered)
      setTotalPages(Math.ceil(filtered.length / postsPerPage))
    }
    setCurrentPage(1) 
  }, [selectedCategory, posts])

 
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

 
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-fundo bg-cover bg-center bg-no-repeat">
        <div className="w-full mx-auto flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto">
            <Header />
          </div>

          <section className="w-full relative bg-[url('/teste3.jpg')] bg-cover bg-center bg-no-repeat backdrop-filter backdrop-blur-sm md:py-32 lg:py-56">
            <div className="absolute inset-0 bg-black/70"></div>

            <div className="max-w-7xl px-4 md:px-6 mx-auto relative z-10">
              <div className="max-w-2xl">
                <AnimatedText
                  text="Descubra o Mundo dos Automóveis."
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="max-w-[600px] text-white/80 md:text-xl mt-4"
                >
                  Seu destino definitivo para avaliações de carros, notícias da indústria e insights automotivos.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <AnimatedButton asChild className="mt-6 bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="#latest-posts">Ver Artigos Recentes</Link>
                  </AnimatedButton>
                </motion.div>
              </div>
            </div>
          </section>


          <section id="latest-posts" className="w-full py-12 md:py-24">
            <div className="max-w-7xl px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <AnimatedText
                    text="Artigos Recentes"
                    className="text-3xl font-bold tracking-tighter md:text-4xl text-primary flex"
                    as="h2"
                  />

                  <p className="max-w-[600px] text-muted-foreground">Explore nosso conteúdo automotivo mais recente.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            
                  <div className="flex items-center gap-2">
                   
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas categorias</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isAdmin && (
                    <AnimatedButton
                      asChild
                      variant="outline"
                      className="transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                         <Link href="/admin/new" className="cursor-pointer flex w-full items-center">
                    <PenSquare className="mr-2 h-4 w-4" />
                    <span>Criar Post</span>
                  </Link>
                    </AnimatedButton>
                    
                  )}
                  {isAdmin && (
                    <AnimatedButton
                      asChild
                      variant="outline"
                      className="transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link href="/admin">Gerenciar Posts</Link>
                    </AnimatedButton>
                    
                  )}
                </div>
              </div>
              <Separator className="my-8" />

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin">
                    <Car className="h-8 w-8 text-primary" />
                  </div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground mb-4">Nenhum post encontrado.</p>
                  {isAdmin && (
                    <AnimatedButton asChild className="transition-all">
                      <Link href="/admin/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Crie Seu Primeiro Post
                      </Link>
                    </AnimatedButton>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
                    {currentPosts.map((post, index) => (
                      <AnimatedCard
                        key={post.id}
                        delay={index}
                        className="overflow-hidden h-full  shadow-none relative "
                      >
                        <div className="aspect-video w-full overflow-hidden  ">
                          <img
                            src={post.imageUrl || "/placeholder.svg?height=200&width=300" || "/placeholder.svg"}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform hover:scale-[1.02] duration-300"
                          />
                          <div className="flex items-center gap-2 absolute top-4 left-4   ">
                            <Badge
                              variant="secondary"
                              className="bg-orange-600 text-white text-base px-4 mb-2 rounded-md"
                            >
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground p-4 ">
                          <Clock className="mr-1 h-3 w-3" />
                          {post.date}
                        </div>
                        <CardHeader className="p-3">
                          <CardTitle className="line-clamp-2 text-primary ">
                            {post.title}
                            <span className="text-orange-600 text-2xl">.</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <p className="line-clamp-2 text-muted-foreground ">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter className="p-3">
                          <AnimatedButton
                            variant="ghost"
                            asChild
                            className="bg-orange-500 text-white hover:bg-orange-600 mt-6"
                          >
                            <Link href={`/articles/${post.id}`}>Ler Mais</Link>
                          </AnimatedButton>
                        </CardFooter>
                      </AnimatedCard>
                    ))}
                  </div>

                
                  <div className="flex justify-center items-center mt-8 gap-2 ">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.max(1, totalPages) }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`h-8 w-8 rounded-md flex items-center justify-center ${
                            currentPage === i + 1
                              ? "bg-orange-500 text-white"
                              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                      aria-label="Próxima página"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
          <section className="w-full relative bg-[url('/teste.jpg')] bg-cover bg-center bg-no-repeat backdrop-filter backdrop-blur-sm text-center py-20">
            <div className="absolute inset-0 bg-black/70"></div>

            <div className="grid justify-center px-4 md:px-6 mx-auto relative z-10">
              <div className="max-w-2xl">
                <AnimatedText
                  text="As melhores noticías você encontra aqui."
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="max-w-[600px] text-white/80 md:text-xl mt-4"
                >
                 Seu portal de notícias de carros, com as melhores notícias do Brasil e do mundo.
                </motion.p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </PageTransition>
  )
}

