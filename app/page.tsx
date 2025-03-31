"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";
import { Car, Clock, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedText } from "@/components/ui/animated-text";
import { PageTransition } from "@/components/ui/page-transition";
import Header from "@/components/header";

// Define the post type
interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
  excerpt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const postsRef = ref(database, "posts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postsArray = Object.entries(data).map(([id, post]) => ({
          id,
          ...(post as Omit<Post, "id">),
        }));
        setPosts(postsArray);
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Get user initials for avatar fallback

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-fundo bg-cover bg-center bg-no-repeat">
        <Header />

        <section className="w-full relative bg-[url('/teste3.jpg')] bg-cover bg-center bg-no-repeat backdrop-filter backdrop-blur-sm  md:py-32 lg:py-56">
          <div className="absolute inset-0 bg-black/70"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="max-w-2xl">
              <AnimatedText
                text="Descubra o Mundo dos  Automóveis."
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="max-w-[600px] text-white/80 md:text-xl mt-4"
              >
                Seu destino definitivo para avaliações de carros, notícias da
                indústria e insights automotivos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <AnimatedButton
                  asChild
                  className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Link href="#latest-posts">Ver Artigos Recentes</Link>
                </AnimatedButton>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section id="latest-posts" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="space-y-2">
                <AnimatedText
                  text="Artigos Recentes"
                  className="text-3xl font-bold tracking-tighter md:text-4xl text-primary flex"
                  as="h2"
                />

                <p className="max-w-[600px] text-muted-foreground">
                  Explore nosso conteúdo automotivo mais recente.
                </p>
              </div>
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
            <Separator className="my-8" />

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <Car className="h-8 w-8 text-primary" />
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum post encontrado.
                </p>
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <AnimatedCard
                    key={post.id}
                    delay={index}
                    className="overflow-hidden  h-full border-none shadow-none relative"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={
                          post.imageUrl ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform hover:scale-[1.02] duration-300"
                      />
                      <div className="flex items-center gap-2 absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className="bg-orange-600 text-white text-base px-4 mb-2 rounded-md"
                        >
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground  pt-2">
                      <Clock className="mr-1 h-3 w-3" />
                      {post.date}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-primary">
                        {post.title}
                        <span className="text-orange-600 text-2xl">.</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground ">
                        {post.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="  ">
                      <AnimatedButton
                        variant="ghost"
                        asChild
                        className="bg-orange-500 text-white hover:bg-orange-600 "
                      >
                        <Link href={`/articles/${post.id}`}>Ler Mais</Link>
                      </AnimatedButton>
                    </CardFooter>
                  </AnimatedCard>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="w-full border-t bg-muted py-6 md:py-12 mt-auto">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary">Blog de Carros</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-right">
                © {new Date().getFullYear()} Blog de Carros. Todos os direitos
                reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
