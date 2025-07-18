import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AcessoOficina from "./page/pageAdmin/AcessoOficina.jsx";
import HomeAdmin from './page/pageAdmin/HomeAdmin.jsx';
import UsuariosApp from './page/pageAdmin/Utilizadores.jsx';
import ListarLocal from './page/pageAdmin/ListarLocais.jsx';
import Anuncios from './page/pageAdmin/ListarAnuncios.jsx';
import EditarFucionario from './page/pageAdmin/PageEditar/EditarPerfil.jsx';

        


import './App.css';


const ProtectedRouteAdministrador = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {


  return (
    <Router>
      <Routes>

        <Route path="/" element={

          <AcessoOficina />

        } />

        <Route
          path="/homeAdmin"
          element={
            <ProtectedRouteAdministrador>
              <HomeAdmin />
            </ProtectedRouteAdministrador>
          }
        />


        <Route path="/pageTecnicos" element={
          <ProtectedRouteAdministrador>
            <UsuariosApp />
          </ProtectedRouteAdministrador>

        } />

        <Route path="/pageAnuncios" element={
          <ProtectedRouteAdministrador>
            <Anuncios />
          </ProtectedRouteAdministrador>



        } />

        {/**Routes de Add de Entidades */}
        <Route path="/pageLocais" element={


          <ProtectedRouteAdministrador>
            <ListarLocal />
          </ProtectedRouteAdministrador>


        } />



           {/**Routes de Add de Entidades */}
        <Route path="pageEditPerfil/:id" element={


          <ProtectedRouteAdministrador>
            <EditarFucionario />
          </ProtectedRouteAdministrador>


        } />


        {/**Routes de Add de Entidades */}



      </Routes>
    </Router>
  );
}

export default App;
