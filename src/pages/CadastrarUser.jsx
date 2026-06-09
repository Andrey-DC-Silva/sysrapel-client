import { useState } from 'react';
import api from '../api/api';
import './CadastrarUser.css';
import { Link, useNavigate } from 'react-router-dom';

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    area_atuacao: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cadastrar = async () => {
    const { nome, cpf, email, senha } = form;

    if (!nome || !cpf || !email || !senha) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/auth/register', form);

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }

      alert('Conta criada com sucesso!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Erro ao criar conta';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h1 className="system-name">S-RAPeL</h1>
      <h2 className="cadastro-title">Criar Conta</h2>

      <div className="input-group">
        <input
          className="input-field"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <input
          className="input-field"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <input
          className="input-field"
          name="area_atuacao"
          placeholder="Área de atuação"
          value={form.area_atuacao}
          onChange={handleChange}
        />
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

      <button className="primary-button" onClick={cadastrar} disabled={loading}>
        {loading ? 'Criando...' : 'Criar conta'}
      </button>

      <Link to="/" className="cadastro-link">
        Já tenho conta
      </Link>
    </div>
  );
}
