import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { FaUser, FaLock } from 'react-icons/fa';
import './Login.css';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    if (loading) return;

    try {
      if (!cpf || !senha) {
        alert('Preencha CPF e senha');
        return;
      }

      setLoading(true);

      const res = await api.post('/auth/login', { cpf, senha });

      const token = res.data?.token || res.data?.accessToken;

      if (!token) {
        alert('Erro ao autenticar');
        console.error(res.data);
        return;
      }

      localStorage.setItem('token', token);

      navigate('/dashboard');

    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao fazer login';

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="system-name">S-RAPeL</h1>
      <h2 className="login-title">Login</h2>

      <div className="input-group">
        <FaUser className="input-icon" />
        <input
          className="input-field"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
      </div>

      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          className="input-field"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <button className="login-button" onClick={login} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <Link to="/cadastro" className="login-link">
        Criar conta
      </Link>
    </div>
  );
}