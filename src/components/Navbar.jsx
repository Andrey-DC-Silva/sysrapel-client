import { FaRegUser, FaFlask, FaProjectDiagram, FaLink, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

export default function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let funcao = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      funcao = decoded.role;
    } catch (err) {
      console.error('Token inválido: ' + err);
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">

      <a className="nav-link" href="/dashboard">
        Dashboard
      </a>

      {funcao === 'ADMIN' && (
        <a className="nav-link" href="/pesquisadores">
          <FaRegUser /> Pesquisadores
        </a>
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