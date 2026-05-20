"use client";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <span className="text-white text-2xl font-bold">i-work</span>
        <div className="flex gap-4">
          <a href="/login" className="text-white hover:underline">Entrar</a>
        <a href="/cadastro" className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50">Cadastrar </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-blue-600 text-white text-center py-24 px-4">
        <h1 className="text-5xl font-bold mb-4">
          Encontre seu estágio ou emprego ideal
        </h1>
        <p className="text-xl mb-8 text-blue-100">
          Conectamos estudantes e profissionais às melhores oportunidades
        </p>
        <div className="flex justify-center gap-4 max-w-xl mx-auto">
          <input
            type="text"
            id="busca-home"
            placeholder="Cargo, área ou empresa..."
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 outline-none placeholder-gray-400"
            onKeyDown={(e) => { if (e.key === "Enter") window.location.href = `/vagas?busca=${e.target.value}`; }}
          />
          <button
            onClick={() => { const v = document.getElementById("busca-home").value; window.location.href = `/vagas?busca=${v}`; }}
            className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Buscar
          </button>
        </div>
      </section>

      {/* Cards de categorias */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Explore por categoria
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Tecnologia", "Administração", "Marketing", "Engenharia", "Saúde", "Direito", "Design", "Educação"].map((area) => (
            <div
              key={area}
              className="border rounded-xl p-4 text-center hover:border-blue-500 hover:text-blue-600 cursor-pointer transition"
            >
              {area}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}