import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gerenciamento de Pedidos",
  description: "SaaS para gerenciamento de pedidos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-pastel-100">
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-2xl font-bold text-pastel-600">PedidosPro</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/pedidos"
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/pedidos/novo"
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out"
                    >
                      Novo Pedido
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  )
}



import './globals.css'