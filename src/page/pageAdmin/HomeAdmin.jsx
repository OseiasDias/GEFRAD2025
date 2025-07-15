import '../../css/StylesFuncionario/homeOficinaAdmin.css';
import { useState, useEffect } from 'react';
import logotipo from "../../assets/logotipo.png";
import { useNavigate } from 'react-router-dom';

import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaBullhorn
} from 'react-icons/fa';
import EntidadesOficina from '../../components/componentesHomeOfinicaAdmin/EntidadesOficina';
import { CiLogout } from "react-icons/ci";
import GraficoTecnicos from '../../components/componentesHomeOfinicaAdmin/GraficoTecnicos';
import Copyright from '../../components/componentesHomeOfinicaAdmin/Copyright.jsx';
import { BiCompass } from 'react-icons/bi';
import Calendar from '../../components/componentesHomeOfinicaAdmin/Calendario.jsx';
import { FaMapMarkerAlt } from "react-icons/fa";

export default function HomeOficinaAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleItemClick = (item) => {
    if (item === 'Sair') {
      setShowModal(true);
    } else {
      setActiveItem(item);
      if (isMobile) {
        closeMenu();
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Redireciona para login
    setShowModal(false);
  };

  const menuItems = [
    { id: 'painel', icon: <FaHome />, label: 'Painel', path: '/homeAdmin' },
    { id: 'Utilizadores', icon: <FaUsers />, label: 'Utilizadores', path: '/pageTecnicos' },
    { id: 'Anuncios', icon: <FaBullhorn />, label: 'Anuncios', path: '/pageAnuncios'  },
    { id: 'Locais', icon: <BiCompass />, label: 'Locais', path: null },
    { id: 'Localização', icon: <FaMapMarkerAlt />, label: 'Localização', path: '/pageLocais' },
    { id: 'Sair', icon: <CiLogout />, label: 'Sair', path: null }
  ];

  return (
    <>
      <div className="admin-container">
        {/* Botão de menu para mobile */}
        {isMobile && (
          <button
            className="mobile-menu-btn"
            onClick={toggleMenu}
            aria-label="Abrir menu"
          >
            <FaBars />
          </button>
        )}

        {/* Overlay para mobile */}
        {isMobile && isMenuOpen && (
          <div className="menu-overlay" onClick={closeMenu} />
        )}

        {/* Menu Lateral */}
        <aside className={`admin-sidebar ${isMenuOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-container">
              <h3>{isMenuOpen ? <img src={logotipo} alt="logotipo" className='w-100' /> : 'Admin'}</h3>
            </div>
            {!isMobile && (
              <button
                className="toggle-menu-btn"
                onClick={toggleMenu}
                title={isMenuOpen ? "Minimizar menu" : "Maximizar menu"}
              >
                {isMenuOpen ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.path}
                    className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {isMenuOpen && <span className="nav-label">{item.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Conteúdo Principal */}
        <main className={`admin-main text-white ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
          <div className="content seccao-body h-100 container-fluid">
            <EntidadesOficina />
            <GraficoTecnicos />
            <Calendar />
          </div>
        </main>
      </div>

      <Copyright />

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Saída</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja sair?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
