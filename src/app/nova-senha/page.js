"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NovaSenha() {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSalvar() {
    setErro("");

    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      setErro("Erro ao atualizar senha. Tente novamente.");
    } else {
      setSucesso(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Nova senha
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Digite sua nova senha
        </p>

        {sucesso ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center">
            <p className="text-green-700 font-semibold">Senha atualizada com sucesso!</p>
            <a href="/login" className="text-blue-600 hover:underline mt-4 block">Fazer login</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <button
              onClick={handleSalvar}
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}