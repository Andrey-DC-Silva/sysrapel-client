import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Relacionar.css';
import { FaLink } from 'react-icons/fa';

export default function Relacionar() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState('');
  const [vinculados, setVinculados] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [experimentoId, setExperimentoId] = useState('');

  useEffect(() => {
    api.get('/projetos')
      .then(res => setProjetos(res.data || []))
      .catch(() => setProjetos([]));
  }, []);

  const carregarDadosProjeto = async (id) => {
    try {
      const [vinc, disp] = await Promise.all([
        api.get(`/projetos-experimentos/projeto/${id}`),
        api.get(`/projetos-experimentos/disponiveis/${id}`)
      ]);

      setVinculados(vinc.data || []);
      setDisponiveis(disp.data || []);
    } catch (err) {
      console.error(err);
      setVinculados([]);
      setDisponiveis([]);
    }
  };

  const selecionarProjeto = (id) => {
    setProjetoId(id);
    setExperimentoId('');
    setVinculados([]);
    setDisponiveis([]);

    if (id) carregarDadosProjeto(id);
  };

  const relacionar = async () => {
    if (!projetoId || !experimentoId) return;

    try {
      await api.post('/projetos-experimentos', {
        projeto_id: Number(projetoId),
        experimento_id: Number(experimentoId)
      });

      carregarDadosProjeto(projetoId);
      setExperimentoId('');
    } catch (err) {
      console.error(err);
    }
  };

  const remover = async (expId) => {
    try {
      await api.delete(`/projetos-experimentos/${projetoId}/${expId}`);

      setVinculados(prev => prev.filter(e => e.id !== expId));
      setDisponiveis(prev => [...prev, vinculados.find(e => e.id === expId)]);
    } catch (err) {
      console.error(err);
    }
  };

  const projetoSelecionado = projetos.find(p => p.id === Number(projetoId));

  return (
    <div className="rel-page">
      <Navbar />

      <div className="rel-container">
        <h2 className="rel-title"><FaLink /> Projeto ※ Experimentos</h2>
        <div className="rel-card">
          <select
            className="input"
            value={projetoId}
            onChange={(e) => selecionarProjeto(e.target.value)}
          >
            <option value="">Selecione Projeto</option>

            {projetos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          {projetoSelecionado && (
            <h3 className="subtitle">
              Projeto: {projetoSelecionado.nome}
            </h3>
          )}
        </div>

        {projetoId && (
          <>
            <div className="rel-card">
              <h3>Experimentos do Projeto</h3>

              <div className="list">
                {vinculados.map(e => (
                  <div key={e.id} className="item">
                    <span>{e.nome}</span>

                    <button
                      className="btn-danger"
                      onClick={() => remover(e.id)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rel-card">
              <h3>Adicionar Experimento</h3>

              <select
                className="input"
                value={experimentoId}
                onChange={(e) => setExperimentoId(e.target.value)}
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
          </>
        )}
      </div>
    </div>
  );
}