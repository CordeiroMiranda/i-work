"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Cadastro() {
  const [tipo, setTipo] = useState("candidato");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleCadastro() {
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome, tipo },
      },
    });

    if (error) {
      setErro(error.message);
    } else {
      window.location.href = "/login";
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Criar conta no i-work
        </h1>
        <p className="text-center text-gray-500 mb-6">Escolha o tipo de conta</p>

        <div className="flex rounded-lg border overflow-hidden mb-6">
          <button
            onClick={() => setTipo("candidato")}
            className={`flex-1 py-2 font-semibold ${tipo === "candidato" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Candidato
          </button>
          <button
            onClick={() => setTipo("empresa")}
            className={`flex-1 py-2 font-semibold ${tipo === "empresa" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Empresa
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <button
            onClick={handleCadastro}
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Já tem conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </main>
  );
}