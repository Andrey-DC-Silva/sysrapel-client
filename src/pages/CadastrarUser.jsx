import { useEffect, useState } from 'react';
import api from '../api/api';
import './CadastrarUser.css';
import { useNavigate } from 'react-router-dom';

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [pesquisadores, setPesquisadores] = useState([]);
  const [idPesquisador, setIdPesquisador] = useState('');
  const [senha, setSenha] = useState('');
  const [funcao, setFuncao] = useState('PESQUISADOR');

  useEffect(() => {
    async function load() {
      const res = await api.get('/pesquisadores');
      setPesquisadores(res.data);
    }
    load();
  }, []);

  const cadastrar = async () => {
    try {
      const pesquisador = pesquisadores.find(
        (p) => p.id === Number(idPesquisador)
      );

      if (!pesquisador) {
        alert('Selecione um pesquisador válido');
        return;
      }

      await api.post('/usuarios', {
        pesquisador_id: Number(idPesquisador),
        senha,
        role: funcao
      });

      alert('Usuário criado!');

      setTimeout(() => {
        navigate('/');
      }, 800);
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
          value={idPesquisador}
          onChange={(e) => setIdPesquisador(e.target.value)}
        >
          <option value="">Selecione pesquisador</option>
          {pesquisadores.map((p) => (
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
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <div className="input-group">
        <select
          className="input-field"
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
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