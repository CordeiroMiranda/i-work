"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin() {
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha incorretos");
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const tipo = user?.user_metadata?.tipo;
      if (tipo === "empresa") {
        window.location.href = "/empresa";
      } else {
        window.location.href = "/vagas";
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Entrar no i-work
        </h1>
        <p className="text-center text-gray-500 mb-6">Acesse sua conta</p>

        <div className="flex flex-col gap-4">
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
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Não tem conta?{" "}
          <a href="/cadastro" className="text-blue-600 hover:underline">
            Cadastrar
          </a>
          <a href="/recuperar-senha" className="text-blue-600 hover:underline block text-center mt-2">
            Esqueci minha senha
          </a>
        </p>
      </div>
    </main>
  );
}