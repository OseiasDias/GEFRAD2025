import MenuPrincipal from '../../components/MenuPrincipal.jsx';
import EntidadesPrincipal from '../../components/componentesHomeAdmin/EntidadesPrincipal.jsx';
import GraficoUsuabilidade from '../../components/componentesHomeAdmin/GraficoUsuabilidade.jsx';
import Calendar from '../../components/componentesHomeAdmin/Calendario.jsx';
import UltimosUtilizadores from '../../components/UltimosUtilizadores.jsx';
import UltimosAnunciosHomeAdmin from '../../components/UltimosAnunciosHomeAdmin.jsx';
import UltimosLocais from '../../components/UltimosLocais.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function HomeOficinaAdmin() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <MenuPrincipal nomeUsuario="Administrador" tipo="Admin">
        <EntidadesPrincipal />
        <GraficoUsuabilidade />
        <div className="bordarDIV my-4 px-3 " style={{ backgroundColor: '#343a40' }}>
          <div className="row  ">
            <h5 className="mb-4 fw-bold text-white text-center">Secção de Actividade Recente</h5>
            <div className="col-12 col-lg-6">
              <div className="cad">

                <UltimosUtilizadores />

              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="cad">

                <UltimosAnunciosHomeAdmin />

              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="cad">

                <UltimosLocais />

              </div>
            </div>
          </div>
        </div>
        <Calendar />
      </ MenuPrincipal >

    </>

  );
}
