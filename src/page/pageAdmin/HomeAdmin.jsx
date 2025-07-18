import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import EntidadesOficina from '../../components/componentesHomeOfinicaAdmin/EntidadesOficina';
import GraficoUsuabilidade from '../../components/componentesHomeOfinicaAdmin/GraficoUsuabilidade.jsx';
import Calendar from '../../components/componentesHomeOfinicaAdmin/Calendario';

export default function HomeOficinaAdmin() {
  return (
    <>
      < MenuPrincipal >
        <EntidadesOficina />
        <GraficoUsuabilidade />
        <Calendar />
      </ MenuPrincipal >

    </>

  );
}
