import Link from "next/link";

export function Header() {
  return (
    <nav className="bg-white shadow-md max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded">
      <div className="flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center">
          <span className="text-2xl font-bold text-pastel-800">
            Gerenciador de Pedidos
          </span>
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
    </nav>
  );
}
