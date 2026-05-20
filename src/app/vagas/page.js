"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(null);
  const [jaCandidata, setJaCandidata] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroBusca, setFiltroBusca] = useState("");

  useEffect(() => {
    async function carregarDados() {
      const { data: vagasData } = await supabase
        .from("vagas")
        .select("*")
        .order("created_at", { ascending: false });
      setVagas(vagasData || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: candidaturasData } = await supabase
          .from("candidaturas")
          .select("vaga_id")
          .eq("user_id", user.id);
        setJaCandidata((candidaturasData || []).map((c) => c.vaga_id));
      }

      setLoading(false);
    }
    carregarDados();
  }, []);

  async function handleCandidatar(vagaId) {
    setCandidatando(vagaId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const { error } = await supabase.from("candidaturas").insert({ user_id: user.id, vaga_id: vagaId });
    if (!error) setJaCandidata((prev) => [...prev, vagaId]);
    setCandidatando(null);
  }

  const vagasFiltradas = vagas.filter((vaga) => {
    const matchTipo = filtroTipo === "Todos" || vaga.tipo === filtroTipo;
    const matchBusca = vaga.titulo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      vaga.empresa.toLowerCase().includes(filtroBusca.toLowerCase());
    return matchTipo && matchBusca;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-white text-2xl font-bold">i-work</a>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-white hover:underline">Minhas candidaturas</a>
          <a href="/publicar-vaga" className="text-white hover:underline">Publicar vaga</a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Vagas disponíveis</h1>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Buscar por cargo ou empresa..."
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
          />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white text-gray-700"
          >
            <option>Todos</option>
            <option>Estágio</option>
            <option>Emprego</option>
            <option>Trainee</option>
            <option>Jovem Aprendiz</option>
          </select>
        </div>

        {loading && <p className="text-gray-500">Carregando vagas...</p>}

        {!loading && vagasFiltradas.length === 0 && (
          <p className="text-gray-500">Nenhuma vaga encontrada.</p>
        )}

        <div className="flex flex-col gap-4">
          {vagasFiltradas.map((vaga) => (
            <div key={vaga.id} className="bg-white rounded-xl shadow-sm p-6 border hover:border-blue-400 transition">
              <div className="flex justify-between items-start">
                <div>
                  <a href={`/vagas/${vaga.id}`} className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">{vaga.titulo}</a>
                  <p className="text-blue-600 font-medium">{vaga.empresa}</p>
                  <p className="text-gray-500 text-sm mt-1">{vaga.local} · {vaga.tipo}</p>
                  <p className="text-gray-600 mt-3">{vaga.descricao}</p>
                </div>
                <button
                  onClick={() => handleCandidatar(vaga.id)}
                  disabled={candidatando === vaga.id || jaCandidata.includes(vaga.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ml-4 ${
                    jaCandidata.includes(vaga.id)
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-70`}
                >
                  {candidatando === vaga.id ? "Enviando..." : jaCandidata.includes(vaga.id) ? "Candidatado ✓" : "Candidatar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}