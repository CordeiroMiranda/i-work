"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function EmpresaDashboard() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [loadingCandidatos, setLoadingCandidatos] = useState(false);

  useEffect(() => {
    async function carregarVagas() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const { data } = await supabase
        .from("vagas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setVagas(data || []);
      setLoading(false);
    }
    carregarVagas();
  }, []);

  async function verCandidatos(vaga) {
    setVagaSelecionada(vaga);
    setLoadingCandidatos(true);

    const { data } = await supabase
      .from("candidaturas")
      .select("*, perfis(nome, email)")
      .eq("vaga_id", vaga.id)
      .order("created_at", { ascending: false });

    setCandidatos(data || []);
    setLoadingCandidatos(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-white text-2xl font-bold">i-work</a>
        <div className="flex gap-4">
          <a href="/publicar-vaga" className="text-white hover:underline">Publicar vaga</a>
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }} className="text-white hover:underline">Sair</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard da empresa</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lista de vagas */}
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">Suas vagas</h2>
            {loading && <p className="text-gray-500">Carregando...</p>}
            {!loading && vagas.length === 0 && (
              <div className="bg-white rounded-xl p-6 border text-center">
                <p className="text-gray-500 mb-4">Você ainda não publicou nenhuma vaga.</p>
                <a href="/publicar-vaga" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Publicar vaga
                </a>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {vagas.map((vaga) => (
                <div
                  key={vaga.id}
                  onClick={() => verCandidatos(vaga)}
                  className={`bg-white rounded-xl p-5 border cursor-pointer transition hover:border-blue-400 ${vagaSelecionada?.id === vaga.id ? "border-blue-500 shadow-md" : ""}`}
                >
                  <h3 className="font-bold text-gray-800">{vaga.titulo}</h3>
                  <p className="text-gray-500 text-sm">{vaga.local} · {vaga.tipo}</p>
                  <p className="text-blue-600 text-sm mt-1">Ver candidatos →</p>
                </div>
              ))}
            </div>
          </div>

          {/* Candidatos */}
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              {vagaSelecionada ? `Candidatos — ${vagaSelecionada.titulo}` : "Selecione uma vaga"}
            </h2>
            {!vagaSelecionada && (
              <div className="bg-white rounded-xl p-6 border text-center text-gray-400">
                Clique em uma vaga para ver os candidatos
              </div>
            )}
            {loadingCandidatos && <p className="text-gray-500">Carregando candidatos...</p>}
            {vagaSelecionada && !loadingCandidatos && candidatos.length === 0 && (
              <div className="bg-white rounded-xl p-6 border text-center text-gray-500">
                Nenhum candidato ainda.
              </div>
            )}
            <div className="flex flex-col gap-3">
             {candidatos.map((c) => (
              <div key={c.id} className="bg-white rounded-xl p-5 border">
                <p className="text-gray-800 font-bold">{c.perfis?.nome || "Sem nome"}</p>
                <p className="text-blue-600 text-sm">{c.perfis?.email}</p>
                <p className="text-gray-400 text-xs mt-1">Candidatou-se em {new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
             </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}