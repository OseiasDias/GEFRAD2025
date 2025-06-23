import { useState, useEffect } from 'react';

import '../../../css/StylesFuncionario/homeOficinaAdmin.css';
import logotipo from "../../../assets/logo- turbo fundo branco.png";
import {
  FaHome,
  FaUsers,
  FaTools,
  FaChartBar,
  FaCog,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaBullhorn,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";
import { BiCompass } from 'react-icons/bi';

//const API_URL = import.meta.env.VITE_API_URL;


export function Copyright() {
  return (
    <p className="text-center d-block text-white fundoFooter">
      Copyright © <strong>2024</strong> <em>Bi-tubo Moters</em>, Ltd. Todos os
      direitos reservados.
      <br />
      Desenvolvido por: <strong><a href="https://oseiasdiasfrontend.netlify.app/" target="_blank">Oseias Dias</a></strong>
    </p>
  );
}

function ConfiguracoesOficina() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeItem, setActiveItem] = useState('dashboard');

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
    setActiveItem(item);
    if (isMobile) {
      closeMenu();
    }
  };

   const menuItems = [
     { id: 'painel', icon: <FaHome />, label: 'Painel', path: '/homeAdmin' },
     { id: 'Utilizadores', icon: <FaUsers />, label: 'Utilizadores', path: '/pageTecnicos' },
     { id: 'Anuncios', icon: <FaBullhorn /> , label: 'Anuncios', path: '/pageCronometroIndividual' },
     { id: 'Locais', icon: <BiCompass /> , label: 'Locais', path: '/pageOrOficina' },
     { id: 'Localização', icon: <FaMapMarkerAlt />, label: 'Localização', path: '/pageRelatorioOficina' },
     { id: 'Voltar', icon: <CiLogout />, label: 'Voltar', path: '/homeAdministrador' }
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
          <div
            className="menu-overlay"
            onClick={closeMenu}
          />
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
          
          </div>
        </main>
      </div>
      <Copyright />
    </>
  );
}

export default ConfiguracoesOficina;
