import { useEffect, useState } from 'react';
import api from '../api/api';
import './CadastrarUser.css';
import { useNavigate } from 'react-router-dom';

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [pesquisadores, setPesquisadores] = useState([]);
  const [form, setForm] = useState({
    pesquisador_id: '',
    senha: '',
    role: 'PESQUISADOR'
  });

  useEffect(() => {
    api.get('/pesquisadores')
      .then(res => setPesquisadores(res.data || []))
      .catch(err => {
        console.error('Erro ao carregar:', err);
        setPesquisadores([]);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrar = async () => {
    const { pesquisador_id, senha, role } = form;

    if (!pesquisador_id) {
      alert('Selecione um pesquisador');
      return;
    }

    try {
      await api.post('/usuarios', {
        pesquisador_id: Number(pesquisador_id),
        senha,
        role
      });

      alert('Usuário criado!');
      navigate('/', { replace: true });

    } catch (err) {
      console.error(err);
      alert('Erro ao criar usuário');
    }
  };

  return (
    <div className="cadastro-container">
      <h1 className="system-name">S-RAPeL</h1>
      <h2 className="cadastro-title">Criar Usuário</h2>

      <div className="input-group">
        <select
          className="input-field"
          name="pesquisador_id"
          value={form.pesquisador_id}
          onChange={handleChange}
        >
          <option value="">Selecione pesquisador</option>

          {pesquisadores.map(p => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <input
          className="input-field"
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <select
          className="input-field"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="PESQUISADOR">Pesquisador</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button className="primary-button" onClick={cadastrar}>
        Criar
      </button>
    </div>
  );
}