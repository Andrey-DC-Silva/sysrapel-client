import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Projetos.css';
import { FaProjectDiagram, FaPlus, FaTrash, FaEdit, FaSave, FaInfo } from 'react-icons/fa';

const initialForm = {
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
  const [form, setForm] = useState(initialForm);
  const [editandoId, setEditandoId] = useState(null);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/projetos'),
      api.get('/pesquisadores/ativos')
    ])
      .then(([proj, pesq]) => {
        setLista(proj.data || []);
        setPesquisadores(pesq.data || []);
      })
      .catch(err => {
        console.error(err);
        setLista([]);
        setPesquisadores([]);
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const limpar = () => {
    setForm(initialForm);
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

      const req = editandoId
        ? api.put(`/projetos/${editandoId}`, payload)
        : api.post('/projetos', payload);

      await req;

      limpar();

      const res = await api.get('/projetos');
      setLista(res.data || []);

    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/projetos/${id}`);
      setLista(lista.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const editar = (p) => {
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

  const info = (p) => {
    setSelecionado(p);
  };

  return (
    <div className="proj-page">
      <Navbar />

      <div className="proj-container">

        <h2 className="proj-title">
          <FaProjectDiagram /> Projetos
        </h2>

        <div className="proj-card">

          <input className="input" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
          <textarea className="input" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
          <input className="input" type="date" name="data_inicio" value={form.data_inicio} onChange={handleChange} />
          <input className="input" type="date" name="data_fim" value={form.data_fim} onChange={handleChange} />

          <select className="input" name="status" value={form.status} onChange={handleChange}>
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

            {pesquisadores.map(p => (
              <option key={p.id} value={p.id}>
               ID: {p.id} - {p.nome}
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
          {lista.map(p => (
            <div key={p.id} className="proj-item">

              <div>
                <b>{p.nome}</b>
                <p>{p.status}</p>
                <small>
                  Responsável: {p.pesquisador_nome || 'Nenhum'}
                </small>
              </div>

              <div className="actions">

                <button className="btn-icon info" onClick={() => info(p)}>
                  <FaInfo />
                </button>

                <button className="btn-icon edit" onClick={() => editar(p)}>
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

      {selecionado && (
        <div className="modal-overlay" onClick={() => setSelecionado(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Projeto</h3>

            <p><b>ID:</b> {selecionado.id}</p>
            <p><b>Nome:</b> {selecionado.nome}</p>
            <p><b>Descrição:</b> {selecionado.descricao}</p>
            <p><b>Status:</b> {selecionado.status}</p>
            <p><b>Início:</b> {selecionado.data_inicio}</p>
            <p><b>Fim:</b> {selecionado.data_fim}</p>
            <p><b>Responsável:</b> {selecionado.pesquisador_nome || 'Nenhum'}</p>

            <button className="btn-primary" onClick={() => setSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}