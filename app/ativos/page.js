"use client";

import "../styles/ativos.css";
import { useEffect, useState } from "react";

export default function Ativos() {
  const [ativos, setAtivos] = useState({});
  const [clientes, setClientes] = useState([]);
  const [novoAtivo, setNovoAtivo] = useState({ nome: "", valor: "", clienteId: "" });
  const [ativosPreDefinidos] = useState([
    { nome: "Ação XYZ", valor: 100.50 },
    { nome: "Fundo ABC", valor: 250.75 },
    { nome: "Bitcoin", valor: 50000.00 },
    { nome: "Tesouro Direto", valor: 1200.30 }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const clientesRes = await fetch("http://127.0.0.1:3001/clientes");
      const clientesData = await clientesRes.json();
      setClientes(clientesData);

      const ativosRes = await fetch("http://127.0.0.1:3001/ativos");
      const ativosData = await ativosRes.json();

      const agrupados = ativosData.reduce((acc, ativo) => {
        const clienteNome = ativo.cliente?.nome || "Desconhecido";
        if (!acc[clienteNome]) acc[clienteNome] = [];
        acc[clienteNome].push(ativo);
        return acc;
      }, {});

      setAtivos(agrupados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const adicionarAtivo = async () => {
    if (!novoAtivo.nome || !novoAtivo.valor || !novoAtivo.clienteId) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:3001/ativos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoAtivo.nome,
          valor: parseFloat(novoAtivo.valor),
          clienteId: parseInt(novoAtivo.clienteId),
        }),
      });

      if (response.ok) {
        alert("Ativo adicionado com sucesso!");
        setNovoAtivo({ nome: "", valor: "", clienteId: "" });
        setLoading(true);
        await fetchData();
      } else {
        alert("Erro ao adicionar ativo");
      }
    } catch (error) {
      console.error("Erro ao adicionar ativo:", error);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados.</p>;

  return (
    <div className="container">
      {/* Formulário de cadastro à esquerda */}
      <div className="form-container">
        <h1>Cadastro de Ativos</h1>
        <label>Cliente:</label>
        <select
          value={novoAtivo.clienteId}
          onChange={(e) => setNovoAtivo({ ...novoAtivo, clienteId: e.target.value })}
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <label>Ativo:</label>
        <select
          onChange={(e) => {
            const ativoSelecionado = ativosPreDefinidos.find((a) => a.nome === e.target.value);
            if (ativoSelecionado) {
              setNovoAtivo({ ...novoAtivo, nome: ativoSelecionado.nome, valor: ativoSelecionado.valor });
            }
          }}
        >
          <option value="">Escolha um ativo pré-definido</option>
          {ativosPreDefinidos.map((ativo, index) => (
            <option key={index} value={ativo.nome}>
              {ativo.nome} - R$ {ativo.valor.toFixed(2)}
            </option>
          ))}
        </select>

        <label>Nome do Ativo (Personalizado):</label>
        <input
          type="text"
          value={novoAtivo.nome}
          onChange={(e) => setNovoAtivo({ ...novoAtivo, nome: e.target.value })}
          placeholder="Digite o nome do ativo"
        />

        <label>Valor do Ativo:</label>
        <input
          type="number"
          value={novoAtivo.valor}
          onChange={(e) => setNovoAtivo({ ...novoAtivo, valor: parseFloat(e.target.value) })}
          placeholder="Digite o valor do ativo"
        />

        <button onClick={adicionarAtivo}>Adicionar Ativo</button>
      </div>

      {/* Lista de ativos à direita */}
      <div className="ativos-lista">
        <h1>Lista de Ativos</h1>
        {Object.keys(ativos).length === 0 ? (
          <p>Nenhum ativo encontrado.</p>
        ) : (
          Object.entries(ativos).map(([cliente, ativos]) => (
            <div key={cliente}>
              <h2>{cliente}</h2>
              <ul>
                {ativos.map((ativo) => (
                  <li key={ativo.id}>
                    <strong>{ativo.nome}</strong> - R$ {ativo.valor.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
