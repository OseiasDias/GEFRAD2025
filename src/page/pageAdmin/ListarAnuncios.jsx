import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import ListaAnuncios from '../../components/ListarAnuncios.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function HomeOficinaAdmin() {
  return (
    <>
        <ToastContainer position="top-center" autoClose={3000} />

      <MenuPrincipal>
        <ListaAnuncios />
      </MenuPrincipal>

    </>

  );
}
