export function calcularFit(perfil, vaga) {
  if (!perfil || !vaga) return 0;

  const textoVaga = `${vaga.titulo} ${vaga.descricao} ${vaga.tipo}`.toLowerCase();
  
  let pontos = 0;
  let total = 0;

  if (perfil.habilidades) {
    const habilidades = perfil.habilidades.toLowerCase().split(/[,\n]+/).map(h => h.trim());
    habilidades.forEach(habilidade => {
      if (habilidade.length > 2) {
        total += 10;
        if (textoVaga.includes(habilidade)) {
          pontos += 10;
        }
      }
    });
  }

  if (perfil.formacao) {
    const formacao = perfil.formacao.toLowerCase();
    const palavrasVaga = textoVaga.split(" ");
    palavrasVaga.forEach(palavra => {
      if (palavra.length > 4 && formacao.includes(palavra)) {
        pontos += 5;
        total += 5;
      }
    });
  }

  if (perfil.experiencias) {
    const experiencias = perfil.experiencias.toLowerCase();
    const palavrasVaga = textoVaga.split(" ");
    palavrasVaga.forEach(palavra => {
      if (palavra.length > 4 && experiencias.includes(palavra)) {
        pontos += 3;
        total += 3;
      }
    });
  }

  if (total === 0) return 0;
  return Math.min(Math.round((pontos / total) * 100), 100);
}

export function ordenarVagasPorFit(vagas, perfil) {
  return [...vagas]
    .map(vaga => ({
      ...vaga,
      fit: calcularFit(perfil, vaga)
    }))
    .sort((a, b) => b.fit - a.fit);
}