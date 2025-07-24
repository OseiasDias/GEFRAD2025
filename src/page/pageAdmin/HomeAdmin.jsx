import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import EntidadesPrincipal from '../../components/componentesHomeAdmin/EntidadesPrincipal.jsx';
import GraficoUsuabilidade from '../../components/componentesHomeAdmin/GraficoUsuabilidade.jsx';
import Calendar from '../../components/componentesHomeAdmin/Calendario.jsx';

export default function HomeOficinaAdmin() {
  return (
    <>
      <MenuPrincipal nomeUsuario="Administrador" tipo="Admin">
        <EntidadesPrincipal />
        <GraficoUsuabilidade />
        <Calendar />
      </ MenuPrincipal >

    </>

  );
}
