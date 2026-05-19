"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PublicarVaga() {
  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [local, setLocal] = useState("");
  const [tipo, setTipo] = useState("Estágio");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function handlePublicar() {
    setLoading(true);
    setErro("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("vagas").insert({
      titulo,
      empresa,
      local,
      tipo,
      descricao,
      user_id: user.id,
    });

    if (error) {
      setErro("Erro ao publicar vaga. Tente novamente.");
    } else {
      setSucesso(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-white text-2xl font-bold">i-work</a>
        <a href="/vagas" className="text-white hover:underline">Ver vagas</a>
      </nav>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Publicar vaga</h1>

        {sucesso ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center">
            <p className="text-green-700 font-semibold text-lg">Vaga publicada com sucesso!</p>
            <a href="/vagas" className="text-blue-600 hover:underline mt-2 block">Ver todas as vagas</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm p-6">
            <input
              type="text"
              placeholder="Título da vaga"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Nome da empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Local (ex: São Paulo, SP)"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-gray-700"
            >
              <option>Estágio</option>
              <option>Emprego</option>
              <option>Trainee</option>
              <option>Jovem Aprendiz</option>
            </select>
            <textarea
              placeholder="Descrição da vaga"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
            />

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <button
              onClick={handlePublicar}
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar vaga"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}