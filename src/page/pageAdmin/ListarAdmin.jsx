import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import ListaUtilizador from '../../components/ListarUtilizadores.jsx'
import ListarAdministrador from '../../components/ListarAdministrador.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function HomeOficinaAdmin() {
  return (
    <>
        <ToastContainer position="top-center" autoClose={3000} />

      <MenuPrincipal>
       
        <ListarAdministrador />
      </MenuPrincipal>

    </>

  );
}
