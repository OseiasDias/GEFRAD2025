import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './page/LoginPage.jsx';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';


const ProtectedRouteAdministrador = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Exemplo de verificação de autenticação
  return isAuthenticated ? children : <Navigate to="/" />;
};


function App() {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Outras rotas aqui, quando quiser */}
      </Routes>
    </Router>
  );
}

export default App;
