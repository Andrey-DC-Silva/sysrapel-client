import { useState } from 'react';
import api from '../api/api';
import { FaUser, FaLock } from 'react-icons/fa';
import './Login.css';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const login = async () => {
    try {
      if (!cpf || !senha) {
        alert('Preencha CPF e senha');
        return;
      }
      const res = await api.post('/auth/login', {
        cpf,
        senha
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      alert('CPF ou senha inválidos');
      console.error(err);
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

      <button className="login-button" onClick={login}>
        Entrar
      </button>
      <a href="/cadastro" className="login-link">Criar conta</a>
    </div>
  );
}