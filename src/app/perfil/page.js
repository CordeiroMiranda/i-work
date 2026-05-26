"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [formacao, setFormacao] = useState("");
  const [habilidades, setHabilidades] = useState("");
  const [experiencias, setExperiencias] = useState("");
  const [curriculoUrl, setCurriculoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUser(user);

      const { data: perfil } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", user.id)
        .single();

      if (perfil) {
        setNome(perfil.nome || "");
        setTelefone(perfil.telefone || "");
        setLinkedin(perfil.linkedin || "");
        setFormacao(perfil.formacao || "");
        setHabilidades(perfil.habilidades || "");
        setExperiencias(perfil.experiencias || "");
        setCurriculoUrl(perfil.curriculo_url || "");
      }

      setLoading(false);
    }
    carregarPerfil();
  }, []);

  async function handleUploadCurriculo(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Por favor envie apenas arquivos PDF!");
      return;
    }

    setUploadando(true);

    const fileName = `${user.id}/curriculo.pdf`;

    const { error } = await supabase.storage
      .from("curriculos")
      .upload(fileName, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage
        .from("curriculos")
        .getPublicUrl(fileName);

      const url = data.publicUrl;
      setCurriculoUrl(url);

      await supabase.from("perfis").upsert({
        id: user.id,
        curriculo_url: url,
      });
    }

    setUploadando(false);
  }

  async function handleSalvar() {
    setSalvando(true);
    setSucesso(false);

    await supabase.auth.updateUser({ data: { nome } });

    await supabase.from("perfis").upsert({
      id: user.id,
      nome,
      email: user.email,
      telefone,
      linkedin,
      formacao,
      habilidades,
      experiencias,
    });

    setSucesso(true);
    setSalvando(false);
  }

  if (loading) return <p className="text-center mt-20 text-gray-500">Carregando...</p>;

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-white text-2xl font-bold">i-work</a>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-white hover:underline">Minhas candidaturas</a>
          <a href="/vagas" className="text-white hover:underline">Ver vagas</a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu perfil</h1>

        <div className="bg-white rounded-2xl shadow-sm p-8 border flex flex-col gap-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {nome ? nome[0].toUpperCase() : user?.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{nome || "Sem nome"}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <hr />

          <h2 className="font-bold text-gray-700">Dados pessoais</h2>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nome completo</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500" placeholder="Seu nome completo" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail</label>
            <input type="email" value={user?.email} disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
            <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500" placeholder="(11) 99999-9999" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">LinkedIn</label>
            <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500" placeholder="linkedin.com/in/seuperfil" />
          </div>

          <hr />

          <h2 className="font-bold text-gray-700">Currículo</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition">
            <p className="text-gray-500 mb-3">📄 Envie seu currículo em PDF</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUploadCurriculo}
              className="hidden"
              id="upload-curriculo"
            />
            <label htmlFor="upload-curriculo" className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition text-sm font-semibold">
              {uploadando ? "Enviando..." : "Escolher PDF"}
            </label>
            {curriculoUrl && (
              <p className="text-green-600 text-sm mt-3">
                ✓ Currículo enviado!{" "}
                <a href={curriculoUrl} target="_blank" className="underline">Ver PDF</a>
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Formação acadêmica</label>
            <textarea value={formacao} onChange={(e) => setFormacao(e.target.value)} rows={3}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
              placeholder="Ex: Engenharia da Computação — Universidade XYZ (2023 - atual)" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Habilidades</label>
            <textarea value={habilidades} onChange={(e) => setHabilidades(e.target.value)} rows={3}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
              placeholder="Ex: JavaScript, React, Next.js, Python..." />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Experiências</label>
            <textarea value={experiencias} onChange={(e) => setExperiencias(e.target.value)} rows={4}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none"
              placeholder="Ex: Estagiário de TI — Empresa XYZ (Jan/2024 - Jun/2024)" />
          </div>

          {sucesso && <p className="text-green-600 text-sm font-medium">✓ Perfil atualizado com sucesso!</p>}

          <button onClick={handleSalvar} disabled={salvando}
            className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </main>
  );
}