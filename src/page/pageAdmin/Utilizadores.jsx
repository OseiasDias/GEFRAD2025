import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import ListaUtilizador from '../../components/ListarUtilizadores.jsx'
import GraficoUtilizador from '../../components/GraficoUtilizador.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function HomeOficinaAdmin() {
  return (
    <>
        <ToastContainer position="top-center" autoClose={3000} />

      <MenuPrincipal>
        <div className="container-fluid p-4 bordarDIV">
          <h4 className="text-white font-semibold text-lg mb-4">Evolução Diária de Utilizadores Registados</h4>

          <GraficoUtilizador />
        </div>
        <ListaUtilizador />
      </MenuPrincipal>

    </>

  );
}
