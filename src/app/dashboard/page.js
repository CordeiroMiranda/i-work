"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("candidaturas")
        .select("*, vagas(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setCandidaturas(data || []);
      setLoading(false);
    }

    carregarDados();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-white text-2xl font-bold">i-work</a>
        <a href="/vagas" className="text-white hover:underline">Ver vagas</a>
      </nav>

      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas candidaturas</h1>
        {user && <p className="text-gray-500 mb-8">{user.email}</p>}

        {loading && <p className="text-gray-500">Carregando...</p>}

        {!loading && candidaturas.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border">
            <p className="text-gray-500 mb-4">Você ainda não se candidatou a nenhuma vaga.</p>
            <a href="/vagas" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Ver vagas disponíveis
            </a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {candidaturas.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-bold text-gray-800">{c.vagas?.titulo}</h2>
              <p className="text-blue-600 font-medium">{c.vagas?.empresa}</p>
              <p className="text-gray-500 text-sm mt-1">{c.vagas?.local} · {c.vagas?.tipo}</p>
              <p className="text-green-600 text-sm mt-3 font-medium">✓ Candidatura enviada</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}