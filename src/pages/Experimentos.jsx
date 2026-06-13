import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { FaFlask, FaPlus, FaTrash, FaEdit, FaInfo } from 'react-icons/fa';
import './Experimentos.css';

const initialForm = {
  nome: '',
  descricao: '',
  data: '',
  status: 'PLANEJADO',
  pesquisador_id: ''
};

export default function Experimentos() {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selecionado, setSelecionado] = useState(null);
  const [pesquisadores, setPesquisadores] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/experimentos'),
      api.get('/pesquisadores/ativos')
    ])
      .then(([exp, pesq]) => {
        setLista(exp.data || []);
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
    setEditando(null);
  };

  const salvar = async () => {
    if (!form.nome) return;

    try {
      const payload = {
        ...form,
        pesquisador_id: form.pesquisador_id
          ? Number(form.pesquisador_id)
          : null
      };

      const req = editando
        ? api.put(`/experimentos/${editando}`, payload)
        : api.post('/experimentos', payload);

      await req;

      limpar();

      const res = await api.get('/experimentos');
      setLista(res.data || []);

    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  const editar = (exp) => {
    setForm({
      nome: exp.nome || '',
      descricao: exp.descricao || '',
      data: exp.data || '',
      status: exp.status || 'PLANEJADO',
      pesquisador_id: exp.pesquisador_id || ''
    });
    setEditando(exp.id);
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/experimentos/${id}`);
      setLista(lista.filter(e => e.id !== id));
    } catch (err) {
      console.error('Erro ao deletar:', err);
    }
  };

  const info = (exp) => {
    setSelecionado(exp);
  };

  return (
    <div className="exp-page">
      <Navbar />

      <div className="exp-container">
        <h2 className="exp-title"><FaFlask /> Experimentos</h2>

        <div className="exp-card">
          <input className="input" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
          <input className="input" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
          <input className="input" type="date" name="data" value={form.data} onChange={handleChange} />

          <select className="input" name="status" value={form.status} onChange={handleChange}>
            <option value="PLANEJADO">Planejado</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>

          <select
            className="input"
            name="pesquisador_id"
            value={form.pesquisador_id}
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
            <FaPlus /> {editando ? 'Atualizar' : 'Criar'}
          </button>
        </div>

        <div className="exp-list">
          {lista.map(e => (
            <div key={e.id} className="exp-item">
              <div>
                <b>{e.nome}</b>
                <p>{e.status}</p>
              </div>

              <div className="actions">

                <button onClick={() => info(e)} className="btn-icon info">
                  <FaInfo />
                </button>

                <button onClick={() => editar(e)} className="btn-icon edit">
                  <FaEdit />
                </button>

                <button onClick={() => deletar(e.id)} className="btn-icon delete">
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
            <h3>Detalhes do Experimento</h3>

            <p><b>ID:</b> {selecionado.id}</p>
            <p><b>Nome:</b> {selecionado.nome}</p>
            <p><b>Descrição:</b> {selecionado.descricao}</p>
            <p><b>Status:</b> {selecionado.status}</p>
            <p><b>Data:</b> {selecionado.data}</p>
            <p><b>Pesquisador ID:</b> {selecionado.pesquisador_id}</p>

            <button className="btn-primary" onClick={() => setSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}