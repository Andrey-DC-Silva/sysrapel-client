import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Defesa from './components/Defesa';
import DefesaAdmin from './components/DefesaAdmin';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CadastrarUser from './pages/CadastrarUser';
import Pesquisadores from './pages/Pesquisadores';
import Experimentos from './pages/Experimentos';
import Projetos from './pages/Projetos';
import Relacionar from './pages/Relacionar';
import Relacionar2 from './pages/Relacionar2';
import Perfil from './pages/Perfil';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/cadastro" element={<CadastrarUser />} />

        <Route path="/dashboard" element={
          <Defesa>
            <Dashboard />
          </Defesa>
        } />

        <Route path="/perfil" element={
          <Defesa>
            <Perfil />
          </Defesa>
        } />

        <Route path="/pesquisadores" element={
          <Defesa>
            <DefesaAdmin>
              <Pesquisadores />
            </DefesaAdmin>
          </Defesa>
        } />

        <Route path="/usuarios" element={
          <Defesa>
            <DefesaAdmin>
              <Usuarios />
            </DefesaAdmin>
          </Defesa>
        } />

        <Route path="/experimentos" element={
          <Defesa>
            <Experimentos />
          </Defesa>
        } />

        <Route path="/projetos" element={
          <Defesa>
            <Projetos />
          </Defesa>
        } />

        <Route path="/relacionar" element={
          <Defesa>
            <Relacionar />
          </Defesa>
        } />

        <Route path="/relacionar2" element={
          <Defesa>
            <Relacionar2 />
          </Defesa>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
