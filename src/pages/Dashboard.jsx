import Navbar from '../components/Navbar';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <h1 className="dashboard-title">
          Bem-vindo ao Sistema Registro de Atividades de Pesquisa em Laboratório
        </h1>

        <p className="dashboard-subtitle">
          Gerencie pesquisadores, projetos e experimentos de forma centralizada.
        </p>
      </div>
    </div>
  );
}