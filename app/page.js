"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./styles/home.css";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Bem-vindo ao Sistema</h1>
      <div className="button-group">
        <Link href="/clientes">
          <button>Ver Clientes</button>
        </Link>
        <Link href="/ativos">
          <button>Ver Ativos</button>
        </Link>
      </div>
    </div>
  );
}
