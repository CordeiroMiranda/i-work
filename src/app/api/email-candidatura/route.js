import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { emailEmpresa, nomeEmpresa, nomeVaga, nomeCandidato } = await request.json()

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: emailEmpresa,
      subject: `Nova candidatura para: ${nomeVaga}`,
      html: `
        <h2>Nova candidatura recebida!</h2>
        <p>Olá, <strong>${nomeEmpresa}</strong>!</p>
        <p>O candidato <strong>${nomeCandidato}</strong> se candidatou à vaga <strong>${nomeVaga}</strong>.</p>
        <p>Acesse o dashboard para ver o currículo completo.</p>
      `,
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ ok: false }, { status: 500 })
  }
}