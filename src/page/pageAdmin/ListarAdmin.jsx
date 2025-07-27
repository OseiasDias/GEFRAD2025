import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import ListaUtilizador from '../../components/ListarUtilizadores.jsx'
import ListarAdministrador from '../../components/ListarAdministrador.jsx';

export default function HomeOficinaAdmin() {
  return (
    <>
      <MenuPrincipal>
       
        <ListarAdministrador />
      </MenuPrincipal>

    </>

  );
}
