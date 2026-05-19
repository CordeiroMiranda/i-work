import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "i-work | Encontre estágios e empregos",
  description: "Plataforma de vagas de estágio e emprego para estudantes e profissionais",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="bg-gray-800 text-gray-400 py-8 px-8 mt-auto">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-white font-bold text-xl">i-work</span>
              <p className="text-sm mt-1">Conectando talentos às melhores oportunidades</p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/vagas" className="hover:text-white transition">Vagas</a>
              <a href="/cadastro" className="hover:text-white transition">Cadastrar</a>
              <a href="/login" className="hover:text-white transition">Entrar</a>
            </div>
            <p className="text-sm">© 2026 i-work. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}