import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-light dark:bg-dark text-dark dark:text-light flex flex-col items-center justify-center p-8 font-sans">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in text-primary-500">
        Testando Tailwind CSS no Next.js
      </h1>
      <p className="text-gray mb-6 max-w-xl text-center">
        Se você está vendo esta página estilizada, significa que o Tailwind está
        configurado corretamente!
      </p>
      <button className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
        Botão estilizado
      </button>
      <div className="mt-10 w-40 h-40 bg-green rounded-xl animate-slide-in-left" />
    </main>
  );
}
