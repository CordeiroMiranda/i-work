"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  async function handleRecuperar() {
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://i-work.vercel.app/nova-senha",
    });

    if (error) {
      setErro("Erro ao enviar e-mail. Verifique o endereço e tente novamente.");
    } else {
      setSucesso(true);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
          Recuperar senha
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Digite seu e-mail e enviaremos um link para redefinir sua senha
        </p>

        {sucesso ? (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center">
            <p className="text-green-700 font-semibold">E-mail enviado com sucesso!</p>
            <p className="text-green-600 text-sm mt-2">Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
            <a href="/login" className="text-blue-600 hover:underline mt-4 block">Voltar para o login</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <button
              onClick={handleRecuperar}
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>

            <a href="/login" className="text-center text-blue-600 hover:underline text-sm">
              Voltar para o login
            </a>
          </div>
        )}
      </div>
    </main>
  );
}