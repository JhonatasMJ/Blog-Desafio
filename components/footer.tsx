"use client"

import { Car } from "lucide-react"


export default function Footer() {

  return (
    <footer className="w-full border-t bg-slate-50 py-6 md:py-12 mt-auto">
    <div className="container px-4 md:px-6 max-w-7xl mx-auto">
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
  )
}