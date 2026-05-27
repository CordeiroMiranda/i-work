import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { emailEmpresa, nomeEmpresa, nomeVaga, nomeCandidato } = await request.json();

  try {
    await resend.emails.send({
      from: 'i-work <onboarding@resend.dev>',
      to: emailEmpresa,
      subject: `Nova candidatura para ${nomeVaga}`,
      html: `
        <h2>Nova candidatura recebida!</h2>
        <p>Ola ${nomeEmpresa},</p>
        <p><strong>${nomeCandidato}</strong> se candidatou para a vaga <strong>${nomeVaga}</strong>.</p>
        <p>Acesse o dashboard para ver o perfil completo do candidato.</p>
        <a href="https://i-work.vercel.app/empresa">Ver candidatos</a>
      `,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}