import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import ListaUtilizador from '../../components/ListarUtilizadores.jsx'
import GraficoUtilizador from '../../components/GraficoUtilizador.jsx';

export default function HomeOficinaAdmin() {
  return (
    <>
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
