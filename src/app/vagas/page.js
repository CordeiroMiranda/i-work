"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function calcularFit(perfil, vaga) {
  if (!perfil || !vaga) return 0;
  const textoVaga = (vaga.titulo + " " + vaga.descricao + " " + vaga.tipo).toLowerCase();
  let pontos = 0;
  let total = 0;
  if (perfil.habilidades) {
    const habilidades = perfil.habilidades.toLowerCase().split(/[,e\n]+/).map(h => h.trim()).filter(h => h.length > 1);
    habilidades.forEach(h => {
      if (h.length > 2) {
        total += 10;
        if (textoVaga.includes(h)) pontos += 10;
      }
    });
  }
  if (total === 0) return 0;
  return Math.min(Math.round((pontos / total) * 100), 100);
}

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(null);
  const [jaCandidata, setJaCandidata] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroBusca, setFiltroBusca] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("busca") || "";
    }
    return "";
  });
  const [perfil, setPerfil] = useState(null);
  const [candidatandoTodas, setCandidatandoTodas] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const { data: vagasData } = await supabase
        .from("vagas")
        .select("*, candidaturas(count)")
        .order("created_at", { ascending: false });

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: candidaturasData } = await supabase
          .from("candidaturas")
          .select("vaga_id")
          .eq("user_id", user.id);
        setJaCandidata((candidaturasData || []).map((c) => c.vaga_id));

        const { data: perfilData } = await supabase
          .from("perfis")
          .select("*")
          .eq("id", user.id)
          .single();

        if (perfilData) {
          setPerfil(perfilData);
          const vagasComFit = (vagasData || []).map(v => ({
            ...v,
            fit: calcularFit(perfilData, v)
          })).sort((a, b) => b.fit - a.fit);
          setVagas(vagasComFit);
        } else {
          setVagas(vagasData || []);
        }
      } else {
        setVagas(vagasData || []);
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

  async function handleCandidatarRecomendadas() {
    setCandidatandoTodas(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const recomendadas = vagas.filter(v => v.fit >= 50 && !jaCandidata.includes(v.id));
    for (const vaga of recomendadas) {
      await supabase.from("candidaturas").insert({ user_id: user.id, vaga_id: vaga.id });
    }
    setJaCandidata(prev => [...prev, ...recomendadas.map(v => v.id)]);
    setCandidatandoTodas(false);
  }

  const vagasFiltradas = vagas.filter((vaga) => {
    const matchTipo = filtroTipo === "Todos" || vaga.tipo === filtroTipo;
    const matchBusca = vaga.titulo.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      vaga.empresa.toLowerCase().includes(filtroBusca.toLowerCase());
    return matchTipo && matchBusca;
  });

  const temRecomendadas = vagasFiltradas.some(v => v.fit >= 50 && !jaCandidata.includes(v.id));

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Vagas disponíveis</h1>
          {perfil && temRecomendadas && (
            <button
              onClick={handleCandidatarRecomendadas}
              disabled={candidatandoTodas}
              className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              {candidatandoTodas ? "Enviando..." : "Candidatar-se as recomendadas"}
            </button>
          )}
        </div>

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
            <option>Estagio</option>
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
            <div key={vaga.id} className={`bg-white rounded-xl shadow-sm p-6 border transition ${vaga.fit >= 50 ? "border-green-300 hover:border-green-400" : "hover:border-blue-400"}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`/vagas/${vaga.id}`} className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">{vaga.titulo}</a>
                    {vaga.fit >= 50 && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        {vaga.fit}% compativel
                      </span>
                    )}
                  </div>
                  <p className="text-blue-600 font-medium">{vaga.empresa}</p>
                  <p className="text-gray-500 text-sm mt-1">{vaga.local} - {vaga.tipo} - {vaga.candidaturas[0]?.count || 0} candidato(s)</p>
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
                  {candidatando === vaga.id ? "Enviando..." : jaCandidata.includes(vaga.id) ? "Candidatado" : "Candidatar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}