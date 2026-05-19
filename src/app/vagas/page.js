"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Vagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(null);
  const [jaCandidata, setJaCandidata] = useState([]);

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
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("candidaturas").insert({
      user_id: user.id,
      vaga_id: vagaId,
    });

    if (!error) {
      setJaCandidata((prev) => [...prev, vagaId]);
    }

    setCandidatando(null);
  }

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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Vagas disponíveis</h1>

        {loading && <p className="text-gray-500">Carregando vagas...</p>}

        {!loading && vagas.length === 0 && (
          <p className="text-gray-500">Nenhuma vaga disponível no momento.</p>
        )}

        <div className="flex flex-col gap-4">
          {vagas.map((vaga) => (
            <div key={vaga.id} className="bg-white rounded-xl shadow-sm p-6 border hover:border-blue-400 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{vaga.titulo}</h2>
                  <p className="text-blue-600 font-medium">{vaga.empresa}</p>
                  <p className="text-gray-500 text-sm mt-1">{vaga.local} · {vaga.tipo}</p>
                  <p className="text-gray-600 mt-3">{vaga.descricao}</p>
                </div>
                <button
                  onClick={() => handleCandidatar(vaga.id)}
                  disabled={candidatando === vaga.id || jaCandidata.includes(vaga.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
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