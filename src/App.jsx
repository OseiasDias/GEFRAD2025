import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AcessoOficina from "./page/pageAdmin/AcessoOficina.jsx";
import HomeAdmin from './page/pageAdmin/HomeAdmin.jsx';
import UsuariosApp from './page/pageAdmin/Utilizadores.jsx';
import ListarLocal from './page/pageAdmin/ListarLocais.jsx';


import './App.css';


const ProtectedRouteAdministrador = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Exemplo de verificação de autenticação
  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {


  return (
    <Router>
      <Routes>

        <Route path="/" element={

          <AcessoOficina />

        } />
        <Route path="/homeAdmin" element={
         
            <HomeAdmin />

    
        } />
        <Route path="/pageTecnicos" element={
        
            <UsuariosApp />

      
        } />

        {/**Routes de Add de Entidades */}
        <Route path="/pageLocais" element={
        
            <ListarLocal />

        
        } />

        {/**Routes de Add de Entidades */}



      </Routes>
    </Router>
  );
}

export default App;
