import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Relacionar.css';

export default function Relacionar() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState(null);
  const [projetoNome, setProjetoNome] = useState('');
  const [vinculados, setVinculados] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [experimentoId, setExperimentoId] = useState(null);

  useEffect(() => {
    api.get('/projetos').then(res => setProjetos(res.data));
  }, []);

  const carregarVinculados = async (id) => {
    const res = await api.get(`/projetos-experimentos/projeto/${id}`);
    setVinculados(res.data);
  };

  const carregarDisponiveis = async (id) => {
    const res = await api.get(`/projetos-experimentos/disponiveis/${id}`);
    setDisponiveis(res.data);
  };

  const selecionarProjeto = (id) => {
    const numId = Number(id);

    setProjetoId(numId);
    setExperimentoId(null);
    setVinculados([]);
    setDisponiveis([]);

    const projeto = projetos.find(p => p.id === numId);
    setProjetoNome(projeto?.nome || '');

    carregarVinculados(numId);
    carregarDisponiveis(numId);
  };

  const relacionar = async () => {
    if (!projetoId || !experimentoId) return;

    await api.post('/projetos-experimentos', {
      projeto_id: projetoId,
      experimento_id: experimentoId
    });

    carregarVinculados(projetoId);
    carregarDisponiveis(projetoId);
    setExperimentoId(null);
  };

  const remover = async (expId) => {
    await api.delete(`/projetos-experimentos/${projetoId}/${expId}`);

    carregarVinculados(projetoId);
    carregarDisponiveis(projetoId);
  };

  return (
    <div className="rel-page">
      <Navbar />

      <div className="rel-container">

        <h2 className="rel-title">Projeto ↔ Experimentos</h2>

        {/* SELETOR PROJETO */}
        <div className="rel-card">

          <select
            className="input"
            onChange={(e) => selecionarProjeto(e.target.value)}
          >
            <option value="">Selecione Projeto</option>
            {projetos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          {projetoNome && (
            <h3 className="subtitle">Projeto: {projetoNome}</h3>
          )}

        </div>

        {/* VINCULADOS */}
        {projetoId && (
          <div className="rel-card">

            <h3>Experimentos do Projeto</h3>

            <div className="list">
              {vinculados.map(e => (
                <div key={e.id} className="item">
                  <span>{e.nome}</span>

                  <button className="btn-danger" onClick={() => remover(e.id)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ADICIONAR */}
        {projetoId && (
          <div className="rel-card">

            <h3>Adicionar Experimento</h3>

            <select
              className="input"
              value={experimentoId || ''}
              onChange={(e) => setExperimentoId(Number(e.target.value))}
            >
              <option value="">Selecione</option>
              {disponiveis.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>

            <button
              className="btn-primary"
              onClick={relacionar}
              disabled={!experimentoId}
            >
              Adicionar
            </button>

          </div>
        )}

      </div>
    </div>
  );
}