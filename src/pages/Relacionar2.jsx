import { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import './Relacionar2.css';
import { FaLink, FaArrowRight, FaArrowLeft, FaProjectDiagram } from 'react-icons/fa';

export default function Relacionar2() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState('');
  const [vinculados, setVinculados] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);

  useEffect(() => {
    api.get('/projetos')
      .then(res => setProjetos(res.data || []))
      .catch(() => setProjetos([]));
  }, []);

  const carregarDados = async (id) => {
    try {
      const [vinculado, disponivel] = await Promise.all([
        api.get(`/projetos-experimentos/projeto/${id}`),
        api.get(`/projetos-experimentos/disponiveis/${id}`)
      ]);

      setVinculados(vinculado.data || []);
      setDisponiveis(disponivel.data || []);
    } catch (err) {
      console.error(err);
      setVinculados([]);
      setDisponiveis([]);
    }
  };

  const selecionarProjeto = (id) => {
    setProjetoId(id);
    setVinculados([]);
    setDisponiveis([]);

    if (id) carregarDados(id);
  };

  const handleDragStart = (e, item, origem) => {
    e.dataTransfer.setData('item', JSON.stringify({ ...item, origem }));
  };

  const handleDrop = async (e, destino) => {
    if (!projetoId) return;

    try {
      const item = JSON.parse(e.dataTransfer.getData('item'));

      if (item.origem === 'disponivel' && destino === 'vinculado') {
        await api.post('/projetos-experimentos', {
          projeto_id: Number(projetoId),
          experimento_id: item.id
        });

        setVinculados(prev => [...prev, item]);
        setDisponiveis(prev => prev.filter(i => i.id !== item.id));
      }

      if (item.origem === 'vinculado' && destino === 'disponivel') {
        await api.delete(`/projetos-experimentos/${projetoId}/${item.id}`);

        setDisponiveis(prev => [...prev, item]);
        setVinculados(prev => prev.filter(i => i.id !== item.id));
      }

    } catch (err) {
      console.error('Erro DnD:', err);
    }
  };

  const projetoSelecionado = projetos.find(p => p.id === Number(projetoId));

  return (
    <div className="rel2-page">
      <Navbar />

      <div className="rel2-container">

        <FaLink /> <h2 className="rel2-title"> Drag e Drop Projeto ※ Experimentos</h2>
        <div className="rel2-card">
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
              <FaProjectDiagram /> {projetoSelecionado.nome}
            </h3>
          )}
        </div>

        <div className="drag_drop">
          <div
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'disponivel')}
          >
            <h3><FaArrowLeft /> Disponíveis</h3>

            {disponiveis.map(e => (
              <div
                key={e.id}
                className="card-item available"
                draggable
                onDragStart={(ev) => handleDragStart(ev, e, 'disponivel')}
              >
                {e.nome}
              </div>
            ))}
          </div>

          <div
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'vinculado')}
          >
            <h3><FaArrowRight /> Vinculados</h3>

            {vinculados.map(e => (
              <div
                key={e.id}
                className="card-item linked"
                draggable
                onDragStart={(ev) => handleDragStart(ev, e, 'vinculado')}
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