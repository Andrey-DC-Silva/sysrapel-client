import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './Experimentos.css';

export default function Experimentos() {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    data: '',
    status: 'PLANEJADO',
    pesquisador_id: ''
  });

  const carregar = async () => {
    const res = await api.get('/experimentos');
    setLista(res.data);
  };

  useEffect(() => {
    const carregar = async () => {
      const res = await api.get('/experimentos');
      setLista(res.data);
    };

    carregar();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpar = () => {
    setForm({
      nome: '',
      descricao: '',
      data: '',
      status: 'PLANEJADO',
      pesquisador_id: ''
    });
    setEditando(null);
  };

  const salvar = async () => {
    if (!form.nome) return;

    if (editando) {
      await api.put(`/experimentos/${editando}`, form);
    } else {
      await api.post('/experimentos', form);
    }

    limpar();
    carregar();
  };

  const editar = (exp) => {
    setForm(exp);
    setEditando(exp.id);
  };

  const deletar = async (id) => {
    await api.delete(`/experimentos/${id}`);
    carregar();
  };

  return (
    <div className="exp-page">
      <Navbar />

      <div className="exp-container">

        <h2 className="exp-title">Experimentos</h2>

        {/* FORM */}
        <div className="exp-card">

          <input
            className="input"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
          />

          <input
            className="input"
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
          />

          <input
            className="input"
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
          />

          <select
            className="input"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="PLANEJADO">Planejado</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>

          <input
            className="input"
            name="pesquisador_id"
            placeholder="ID do pesquisador"
            value={form.pesquisador_id}
            onChange={handleChange}
          />

          <button className="btn-primary" onClick={salvar}>
            <FaPlus /> {editando ? 'Atualizar' : 'Criar'}
          </button>

        </div>

        {/* LISTA */}
        <div className="exp-list">
          {lista.map((e) => (
            <div key={e.id} className="exp-item">

              <div>
                <b>{e.nome}</b>
                <p>{e.status}</p>
              </div>

              <div className="actions">
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
    </div>
  );
}