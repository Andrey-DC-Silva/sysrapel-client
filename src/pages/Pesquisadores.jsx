import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Pesquisadores.css';
import { FaRegUser, FaEdit, FaTrash } from 'react-icons/fa';

const initialForm = {
  nome: '',
  cpf: '',
  email: '',
  area_atuacao: ''
};

export default function Pesquisadores() {
  const [lista, setLista] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    api.get('/pesquisadores')
      .then(res => setLista(res.data || []))
      .catch(err => {
        console.error(err);
        setLista([]);
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const salvar = async (e) => {
    e.preventDefault();

    try {
      const req = editando
        ? api.put(`/pesquisadores/${editando}`, form)
        : api.post('/pesquisadores', form);

      await req;

      setForm(initialForm);
      setEditando(null);

      const res = await api.get('/pesquisadores');
      setLista(res.data || []);

    } catch (err) {
      console.error(err);
    }
  };

  const editar = (p) => {
    setForm({
      nome: p.nome || '',
      cpf: p.cpf || '',
      email: p.email || '',
      area_atuacao: p.area_atuacao || ''
    });
    setEditando(p.id);
  };

  const excluir = async (id) => {
    try {
      await api.delete(`/pesquisadores/${id}`);
      setLista(lista.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pesq-page">
      <Navbar />

      <div className="pesq-container">
        <h2 className="pesq-title"><FaRegUser /> Pesquisadores</h2>

        <form className="pesq-card" onSubmit={salvar}>
          <input className="input" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
          <input className="input" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} />
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input className="input" name="area_atuacao" placeholder="Área de atuação" value={form.area_atuacao} onChange={handleChange} />

          <button className="btn-primary" type="submit">
            {editando ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>

        <div className="pesq-list">
          {lista.map(p => (
            <div key={p.id} className="pesq-item">
              <div>
                {p.id} <b> {p.nome}</b>
                <p>{p.area_atuacao}</p>
              </div>

              <div className="actions">
                <button className="btn-icon edit" onClick={() => editar(p)}>
                  <FaEdit />
                </button>

                <button className="btn-icon delete" onClick={() => excluir(p.id)}>
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