import { FaRegUser, FaFlask, FaProjectDiagram, FaLink, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">

      <a className="nav-link" href="/dashboard">
        Dashboard
      </a>

      <a className="nav-link" href="/perfil">
        <FaUserCog /> Meu Perfil
      </a>

      {user?.role === 'ADMIN' && (
        <>
          <a className="nav-link" href="/pesquisadores">
            <FaRegUser /> Pesquisadores
          </a>

          <a className="nav-link" href="/usuarios">
            <FaRegUser /> Usuários
          </a>
        </>
      )}

      <a className="nav-link" href="/experimentos">
        <FaFlask /> Experimentos
      </a>

      <a className="nav-link" href="/projetos">
        <FaProjectDiagram /> Projetos
      </a>

      <a className="nav-link" href="/relacionar">
        <FaLink /> Relacionar
      </a>

      <a className="nav-link" href="/relacionar2">
        <FaLink /> Relacionar 2
      </a>

      <button className="logout-button" onClick={logout}>
        <FaSignOutAlt /> Sair
      </button>

    </nav>
  );
}
