import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Projetos.css';
import {
  FaProjectDiagram,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave
} from 'react-icons/fa';

function extrairArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.projetos)) return data.projetos;
  if (Array.isArray(data?.pesquisadores)) return data.pesquisadores;
  return [];
}

const estadoInicial = {
  nome: '',
  descricao: '',
  data_inicio: '',
  data_fim: '',
  status: 'ATIVO',
  pesquisador_responsavel_id: ''
};

export default function Projetos() {
  const [lista, setLista] = useState([]);
  const [pesquisadores, setPesquisadores] = useState([]);
  const [form, setForm] = useState(estadoInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarProjetos = async () => {
    try {
      const res = await api.get('/projetos');
      console.log('PROJETOS:', res.data);
      setLista(extrairArray(res.data));
    } catch (err) {
      console.error('Erro projetos:', err);
      setLista([]);
    }
  };

  const carregarPesquisadores = async () => {
    try {
      const res = await api.get('/pesquisadores');
      console.log('PESQUISADORES:', res.data);
      setPesquisadores(extrairArray(res.data));
    } catch (err) {
      console.error('Erro pesquisadores:', err);
      setPesquisadores([]);
    }
  };

  useEffect(() => {
    carregarProjetos();
    carregarPesquisadores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpar = () => {
    setForm(estadoInicial);
    setEditandoId(null);
  };

  const salvar = async () => {
    try {
      const payload = {
        ...form,
        pesquisador_responsavel_id: form.pesquisador_responsavel_id
          ? Number(form.pesquisador_responsavel_id)
          : null
      };

      if (editandoId) {
        await api.put(`/projetos/${editandoId}`, payload);
      } else {
        await api.post('/projetos', payload);
      }

      limpar();
      carregarProjetos();

    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/projetos/${id}`);
      carregarProjetos();
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const iniciarEdicao = (p) => {
    setForm({
      nome: p.nome || '',
      descricao: p.descricao || '',
      data_inicio: p.data_inicio || '',
      data_fim: p.data_fim || '',
      status: p.status || 'ATIVO',
      pesquisador_responsavel_id: p.pesquisador_responsavel_id || ''
    });

    setEditandoId(p.id);
  };

  return (
    <div className="proj-page">
      <Navbar />

      <div className="proj-container">

        <h2 className="proj-title">
          <FaProjectDiagram /> Projetos
        </h2>

        <div className="proj-card">

          <input
            className="input"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
          />

          <textarea
            className="input"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <input
            className="input"
            type="date"
            name="data_inicio"
            value={form.data_inicio}
            onChange={handleChange}
          />

          <input
            className="input"
            type="date"
            name="data_fim"
            value={form.data_fim}
            onChange={handleChange}
          />

          <select
            className="input"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="ATIVO">Ativo</option>
            <option value="PAUSADO">Pausado</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>

          <select
            className="input"
            name="pesquisador_responsavel_id"
            value={form.pesquisador_responsavel_id}
            onChange={handleChange}
          >
            <option value="">-- Nenhum responsável --</option>

            {(Array.isArray(pesquisadores) ? pesquisadores : []).map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.area_atuacao})
              </option>
            ))}
          </select>

          <button className="btn-primary" onClick={salvar}>
            {editandoId ? <FaSave /> : <FaPlus />}
            {editandoId ? ' Salvar' : ' Criar'}
          </button>

          {editandoId && (
            <button className="btn-secondary" onClick={limpar}>
              Cancelar
            </button>
          )}

        </div>

        <div className="proj-list">
          {(Array.isArray(lista) ? lista : []).map(p => (
            <div key={p.id} className="proj-item">

              <div>
                <b>{p.nome}</b>
                <p>{p.status}</p>
                <small>
                  Responsável: {p.pesquisador_nome || 'Nenhum'}
                </small>
              </div>

              <div className="actions">
                <button className="btn-icon edit" onClick={() => iniciarEdicao(p)}>
                  <FaEdit />
                </button>

                <button className="btn-icon delete" onClick={() => deletar(p.id)}>
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}