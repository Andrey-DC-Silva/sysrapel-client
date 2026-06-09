import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Usuarios.css';
import { FaTrash } from 'react-icons/fa';

export default function Usuarios() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = () => {
    api.get('/usuarios')
      .then((res) => setLista(res.data || []))
      .catch((err) => {
        console.error(err);
        setLista([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const alterarRole = async (id, role) => {
    try {
      await api.put(`/usuarios/${id}`, { role });
      carregar();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erro ao alterar perfil');
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Deseja excluir este usuário?')) return;

    try {
      await api.delete(`/usuarios/${id}`);
      carregar();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erro ao excluir usuário');
    }
  };

  return (
    <div className="usuarios-page">
      <Navbar />

      <div className="usuarios-container">
        <h1 className="usuarios-title">Gerenciar Usuários</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="usuarios-lista">
            {lista.map((u) => (
              <div key={u.id} className="usuario-card">
                <div>
                  <strong>{u.nome}</strong>
                  <p>{u.email}</p>
                  <p>CPF: {u.cpf}</p>
                </div>

                <div className="usuario-acoes">
                  <select
                    value={u.role}
                    onChange={(e) => alterarRole(u.id, e.target.value)}
                  >
                    <option value="PESQUISADOR">Pesquisador</option>
                    <option value="ADMIN">Admin</option>
                  </select>

                  <button
                    className="btn-excluir"
                    onClick={() => excluir(u.id)}
                    title="Excluir usuário"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
