import { FaRegUser, FaFlask, FaProjectDiagram, FaLink, FaSignOutAlt } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

export default function Navbar() {

  const token = localStorage.getItem('token');
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error('Token inválido: ' + err);
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">

      <a className="nav-link" href="/dashboard">
        Dashboard
      </a>

      {role === 'ADMIN' && (
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