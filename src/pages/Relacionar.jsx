import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Relacionar.css';

function extrairArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.projetos)) return data.projetos;
  if (Array.isArray(data?.experimentos)) return data.experimentos;
  return [];
}

export default function Relacionar() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState(null);
  const [projetoNome, setProjetoNome] = useState('');
  const [vinculados, setVinculados] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [experimentoId, setExperimentoId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/projetos');
        console.log('PROJETOS:', res.data);
        setProjetos(extrairArray(res.data));
      } catch (err) {
        console.error(err);
        setProjetos([]);
      }
    }
    load();
  }, []);

  const carregarVinculados = async (id) => {
    try {
      const res = await api.get(`/projetos-experimentos/projeto/${id}`);
      console.log('VINCULADOS:', res.data);
      setVinculados(extrairArray(res.data));
    } catch (err) {
      console.error(err);
      setVinculados([]);
    }
  };

  const carregarDisponiveis = async (id) => {
    try {
      const res = await api.get(`/projetos-experimentos/disponiveis/${id}`);
      console.log('DISPONIVEIS:', res.data);
      setDisponiveis(extrairArray(res.data));
    } catch (err) {
      console.error(err);
      setDisponiveis([]);
    }
  };

  const selecionarProjeto = (id) => {
    const numId = Number(id);

    setProjetoId(numId);
    setExperimentoId(null);
    setVinculados([]);
    setDisponiveis([]);

    const projeto = (Array.isArray(projetos) ? projetos : []).find(
      (p) => p.id === numId
    );

    setProjetoNome(projeto?.nome || '');

    carregarVinculados(numId);
    carregarDisponiveis(numId);
  };

  const relacionar = async () => {
    if (!projetoId || !experimentoId) return;

    try {
      await api.post('/projetos-experimentos', {
        projeto_id: projetoId,
        experimento_id: experimentoId
      });

      carregarVinculados(projetoId);
      carregarDisponiveis(projetoId);
      setExperimentoId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const remover = async (expId) => {
    try {
      await api.delete(`/projetos-experimentos/${projetoId}/${expId}`);

      carregarVinculados(projetoId);
      carregarDisponiveis(projetoId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rel-page">
      <Navbar />

      <div className="rel-container">

        <h2 className="rel-title">Projeto ↔ Experimentos</h2>

        <div className="rel-card">
          <select
            className="input"
            onChange={(e) => selecionarProjeto(e.target.value)}
          >
            <option value="">Selecione Projeto</option>

            {(Array.isArray(projetos) ? projetos : []).map(p => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          {projetoNome && (
            <h3 className="subtitle">Projeto: {projetoNome}</h3>
          )}
        </div>

        {projetoId && (
          <div className="rel-card">
            <h3>Experimentos do Projeto</h3>

            <div className="list">
              {(Array.isArray(vinculados) ? vinculados : []).map(e => (
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

        {projetoId && (
          <div className="rel-card">
            <h3>Adicionar Experimento</h3>

            <select
              className="input"
              value={experimentoId || ''}
              onChange={(e) => setExperimentoId(Number(e.target.value))}
            >
              <option value="">Selecione</option>

              {(Array.isArray(disponiveis) ? disponiveis : []).map(e => (
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