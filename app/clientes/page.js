"use client";

import "../styles/clientes.css";
import { useEffect, useState } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [carregando, setCarregando] = useState(true); // Para evitar reordenamento no carregamento

  useEffect(() => {
    fetch("http://localhost:3001/clientes")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setClientes(data);
        setCarregando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCarregando(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cliente = { nome, email, status };

    try {
      let res;
      if (editandoId) {
        res = await fetch(`http://localhost:3001/clientes/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente),
        });
      } else {
        res = await fetch("http://localhost:3001/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente),
        });
      }

      if (!res.ok) {
        throw new Error("Erro ao salvar cliente");
      }

      const data = await res.json();

      if (editandoId) {
        setClientes(clientes.map((c) => (c.id === editandoId ? data : c)));
      } else {
        setClientes([...clientes, data]);
      }

      setNome("");
      setEmail("");
      setStatus(true);
      setEditandoId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (cliente) => {
    setEditandoId(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setStatus(cliente.status);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      const res = await fetch(`http://localhost:3001/clientes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir cliente");
      }

      setClientes(clientes.filter((cliente) => cliente.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Cadastro de Clientes</h1>
        <form onSubmit={handleSubmit}>
          <input className="input-standard"
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input className="input-standard"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>
            <input className="checkbox"
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
            />
            Ativo
          </label>
          <button type="submit">{editandoId ? "Salvar Alterações" : "Adicionar Cliente"}</button>
          {editandoId && <button className="cancel" onClick={() => setEditandoId(null)}>Cancelar</button>}
        </form>
      </div>

      <div className="clientes-lista">
        <h1>Lista de Clientes</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {carregando ? (
          <p>Carregando clientes...</p>
        ) : clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          <ul>
            {clientes.map((cliente) => (
              <li key={cliente.id}>
                {cliente.nome} - {cliente.email} - {cliente.status ? "Ativo" : "Inativo"}
                <button onClick={() => handleEdit(cliente)}>Editar</button>
                <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
