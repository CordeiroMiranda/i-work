export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Página não encontrada</h2>
        <p className="text-gray-500 mt-2 mb-8">A página que você procura não existe ou foi removida.</p>
        <a href="/" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Voltar para o início
        </a>
      </div>
    </main>
  );
}