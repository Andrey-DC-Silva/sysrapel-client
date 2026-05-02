import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Relacionar2.css';
import { FaArrowRight, FaArrowLeft, FaProjectDiagram } from 'react-icons/fa';

// 🔒 util padrão
function extrairArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.projetos)) return data.projetos;
  if (Array.isArray(data?.experimentos)) return data.experimentos;
  return [];
}

export default function Relacionar2() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState(null);
  const [projetoNome, setProjetoNome] = useState('');
  const [vinculados, setVinculados] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);

  // 🔽 carregar projetos
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
    setVinculados([]);
    setDisponiveis([]);

    const p = (Array.isArray(projetos) ? projetos : []).find(
      (p) => p.id === numId
    );

    setProjetoNome(p?.nome || '');

    carregarVinculados(numId);
    carregarDisponiveis(numId);
  };

  const handleDragStart = (e, item, origem) => {
    e.dataTransfer.setData("item", JSON.stringify({ ...item, origem }));
  };

  const handleDropVinculados = async (e) => {
    if (!projetoId) return;

    try {
      const item = JSON.parse(e.dataTransfer.getData("item"));

      if (item.origem === "disponivel") {
        await api.post('/projetos-experimentos', {
          projeto_id: projetoId,
          experimento_id: Number(item.id)
        });

        carregarVinculados(projetoId);
        carregarDisponiveis(projetoId);
      }
    } catch (err) {
      console.error('Erro ao vincular:', err);
    }
  };

  const handleDropDisponiveis = async (e) => {
    if (!projetoId) return;

    try {
      const item = JSON.parse(e.dataTransfer.getData("item"));

      if (item.origem === "vinculado") {
        await api.delete(`/projetos-experimentos/${projetoId}/${item.id}`);

        carregarVinculados(projetoId);
        carregarDisponiveis(projetoId);
      }
    } catch (err) {
      console.error('Erro ao remover vínculo:', err);
    }
  };

  return (
    <div className="rel2-page">
      <Navbar />

      <div className="rel2-container">

        <h2 className="rel2-title">
          Drag & Drop Projeto ↔ Experimentos
        </h2>

        <div className="rel2-card">

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
            <h3 className="subtitle">
              <FaProjectDiagram /> {projetoNome}
            </h3>
          )}

        </div>

        {/* KANBAN */}
        <div className="kanban">

          {/* DISPONÍVEIS */}
          <div
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropDisponiveis}
          >
            <h3>
              <FaArrowLeft /> Disponíveis
            </h3>

            {(Array.isArray(disponiveis) ? disponiveis : []).map(e => (
              <div
                key={e.id}
                className="card-item available"
                draggable
                onDragStart={(ev) => handleDragStart(ev, e, "disponivel")}
              >
                {e.nome}
              </div>
            ))}
          </div>

          {/* VINCULADOS */}
          <div
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropVinculados}
          >
            <h3>
              <FaArrowRight /> Vinculados
            </h3>

            {(Array.isArray(vinculados) ? vinculados : []).map(e => (
              <div
                key={e.id}
                className="card-item linked"
                draggable
                onDragStart={(ev) => handleDragStart(ev, e, "vinculado")}
              >
                {e.nome}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}