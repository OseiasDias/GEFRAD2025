import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AcessoOficina from "./page/pageAdmin/AcessoOficina.jsx";
import HomeAdmin from './page/pageAdmin/HomeAdmin.jsx';
import UsuariosApp from './page/pageAdmin/FuncionariosOficina.jsx';
import Cronometro from './page/pageAdmin/CronometroIndividualOficina.jsx';
import OrdensServicosOficina from './page/pageAdmin/OrdensServicosOficina.jsx';
import  RelatoriosOficina from './page/pageAdmin/RelatoriosOficina.jsx';

import './App.css';


const ProtectedRouteAdministrador = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Exemplo de verificação de autenticação
  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {


  return (
    <Router>
      <Routes>

        <Route path="/" element={<AcessoOficina />} />

        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/pageTecnicos" element={

          <UsuariosApp />


        } />

        {/**Routes de Add de Entidades */}
        <Route path="/pageCronometroIndividual" element={

          <Cronometro />

        } />

        {/**Routes de Add de Entidades */}
        <Route path="/pageOrOficina" element={

          <OrdensServicosOficina />

        } />

           {/**Routes de Add de Entidades */}
               <Route path="/pageRelatorioOficina" element={
             
                  <RelatoriosOficina />
            
              } />




      </Routes>
    </Router>
  );
}

export default App;
