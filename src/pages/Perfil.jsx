import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Perfil.css';

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    area_atuacao: '',
    senha: ''
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.get('/usuarios/me')
      .then((res) => {
        setPerfil(res.data);
        setForm({
          nome: res.data.nome || '',
          email: res.data.email || '',
          area_atuacao: res.data.area_atuacao || '',
          senha: ''
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar perfil');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvar = async (e) => {
    e.preventDefault();

    try {
      setSalvando(true);

      const payload = {
        nome: form.nome,
        email: form.email,
        area_atuacao: form.area_atuacao
      };

      if (form.senha) {
        payload.senha = form.senha;
      }

      const res = await api.put('/usuarios/me', payload);
      setPerfil(res.data);
      setForm((prev) => ({ ...prev, senha: '' }));
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erro ao salvar perfil');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="perfil-page">
        <Navbar />
        <div className="perfil-container">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <Navbar />

      <div className="perfil-container">
        <h1 className="perfil-title">Meu Perfil</h1>

        <div className="perfil-info">
          <p><strong>CPF:</strong> {perfil?.cpf}</p>
          <p><strong>Perfil:</strong> {perfil?.role}</p>
        </div>

        <form className="perfil-card" onSubmit={salvar}>
          <input
            className="input"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="area_atuacao"
            placeholder="Área de atuação"
            value={form.area_atuacao}
            onChange={handleChange}
          />

          <input
            className="input"
            type="password"
            name="senha"
            placeholder="Nova senha (opcional)"
            value={form.senha}
            onChange={handleChange}
          />

          <button className="btn-salvar" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
