"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { use } from "react";

export default function DetalheVaga({ params }) {
  const { id } = use(params);
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(false);
  const [jaCandidata, setJaCandidata] = useState(false);

  useEffect(() => {
    async function carregarVaga() {
      const { data } = await supabase
        .from("vagas")
        .select("*")
        .eq("id", id)
        .single();

      setVaga(data);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: candidatura } = await supabase
          .from("candidaturas")
          .select("id")
          .eq("user_id", user.id)
          .eq("vaga_id", id)
          .single();
        setJaCandidata(!!candidatura);
      }

      setLoading(false);
    }
    carregarVaga();
  }, [id]);

  async function handleCandidatar(vagaId) {
    setCandidatando(vagaId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { error } = await supabase.from("candidaturas").insert({ user_id: user.id, vaga_id: vagaId });

    if (!error) {
      setJaCandidata((prev) => [...prev, vagaId]);

      const vaga = vagas.find((v) => v.id === vagaId);

      const { data: perfilEmpresa } = await supabase
        .from("perfis")
        .select("email, nome")
        .eq("id", vaga.user_id)
        .single();

      const { data: perfilCandidato } = await supabase
        .from("perfis")
        .select("nome")
        .eq("id", user.id)
        .single();

      await fetch("/api/email-candidatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailEmpresa: perfilEmpresa?.email,
          nomeEmpresa: perfilEmpresa?.nome,
          nomeVaga: vaga.titulo,
          nomeCandidato: perfilCandidato?.nome,
        }),
      });
    }

    setCandidatando(null);
  }

  if (loading) return <p className="text-center mt-20 text-gray-500">Carregando...</p>;
  if (!vaga) return <p className="text-center mt-20 text-gray-500">Vaga não encontrada.</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-white text-2xl font-bold">i-work</a>
        <a href="/vagas" className="text-white hover:underline">← Voltar para vagas</a>
      </nav>

      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 border">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{vaga.titulo}</h1>
              <p className="text-blue-600 text-xl font-medium mt-1">{vaga.empresa}</p>
            </div>
            <span className="bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full text-sm">
              {vaga.tipo}
            </span>
          </div>

          <div className="flex gap-4 text-gray-500 text-sm mb-6">
            <span>📍 {vaga.local}</span>
          </div>

          <hr className="mb-6" />

          <h2 className="font-bold text-gray-700 mb-3">Descrição da vaga</h2>
          <p className="text-gray-600 leading-relaxed">{vaga.descricao}</p>

          <div className="mt-8">
            <button
              onClick={handleCandidatar}
              disabled={candidatando || jaCandidata}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                jaCandidata
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } disabled:opacity-70`}
            >
              {jaCandidata ? "✓ Candidatura enviada" : candidatando ? "Enviando..." : "Candidatar-se a esta vaga"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}