// ✅ LayoutAdmin.jsx 100% corrigido

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  FaHome, FaUsers, FaBullhorn, FaBars, FaChevronLeft, FaChevronRight, FaRegUserCircle
} from 'react-icons/fa';
import { BiCompass } from 'react-icons/bi';
import { CiLogout, CiWarning } from "react-icons/ci";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import logotipo from '../assets/logotipo.png';
import Copyright from './CopyRigth';
import axios from 'axios';

export default function MenuPrincipal({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showModal, setShowModal] = useState(false);
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  
  console.log(carregando, erro);
  const { email} = useParams();
 // Obtém o ID do blog a partir da URL

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => isMobile && setIsMenuOpen(false);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsMenuOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8080/api/utilizadores/perfil/${email}`)
        .then(res => {
          setDados(res.data);
          setCarregando(false);
        })
        .catch(() => {
          setErro('Erro ao carregar os dados do perfil');
          setCarregando(false);
        });
    }
  }, [email]);

  const handleItemClick = (itemId) => {
    if (itemId === 'Sair') {
      setShowModal(true);
    } else {
      const path = menuItems.find(item => item.id === itemId)?.path;
      if (path) navigate(path + `?email=${encodeURIComponent(email)}`);
      if (isMobile) closeMenu();
    }
  };

  const redirectToPerfil = () => {
    navigate("/pageEditPerfil" + `?email=${encodeURIComponent(email)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idSessao');
    navigate('/');
    setShowModal(false);
  };

  const menuItems = [
    { id: 'painel', icon: <FaHome />, label: 'Painel', path: `/homeAdmin/${email}` },
    { id: 'Utilizadores', icon: <FaUsers />, label: 'Utilizadores', path: '/pageTecnicos' },
    { id: 'Anuncios', icon: <FaBullhorn />, label: 'Anuncios', path: '/pageAnuncios' },
    { id: 'Locais', icon: <BiCompass />, label: 'Locais', path: '/pageLocais' },
    { id: 'Sair', icon: <CiLogout />, label: 'Sair', path: null }
  ];

  return (
    <>
      <div className="admin-container">
        <div className="col-12">
          {isMobile && (
            <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Abrir menu">
              <FaBars />
            </button>
          )}

          {isMobile && isMenuOpen && <div className="menu-overlay" onClick={closeMenu} />}

          <aside className={`admin-sidebar ${isMenuOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
            <div className="sidebar-header">
              <div className="logo-container">
                <h3>{isMenuOpen ? <img src={logotipo} alt="logotipo" className='w-100' /> : 'Admin'}</h3>
              </div>
              {!isMobile && (
                <button className="toggle-menu-btn" onClick={toggleMenu}>
                  {isMenuOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
              )}
            </div>

            <div title='Perfil' onClick={redirectToPerfil} className="profile-section text-center py-3">
              <FaRegUserCircle fontSize={50} />

              {isMenuOpen && dados && (
                <>
                  <div className="fw-bold mt-1">{dados.nomeUsuario}</div>
                  <div className="small text-white">{dados.tipo}</div>
                </>
              )}
            </div>

            <nav className="sidebar-nav">
              <ul>
                {menuItems.map((item) => {
                  const isActive = item.path === currentPath;
                  return (
                    <li key={item.id}>
                      {item.id === 'Sair' ? (
                        <button
                          className={`nav-item btn btn-link w-100 text-start ${isActive ? 'active' : ''}`}
                          onClick={() => handleItemClick(item.id)}
                          style={{ textDecoration: 'none', color: 'inherit', border: 'none', background: 'transparent' }}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {isMenuOpen && <span className="nav-label">{item.label}</span>}
                        </button>
                      ) : (
                        <a
                          href={item.path}
                          className={`nav-item ${isActive ? 'active' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleItemClick(item.id);
                          }}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          {isMenuOpen && <span className="nav-label">{item.label}</span>}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <main className={`admin-main text-white ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
            <div className="content seccao-body h-100 container-fluid">
              {children}
            </div>
            <Copyright />
          </main>
        </div>
      </div>

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <CiWarning size={24} />
                  Confirmar Saída
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Fechar"
                ></button>
              </div>
              <div className="modal-body text-center">
                <CiWarning size={60} className="text-danger mb-3" />
                <p className="fs-5">Tem certeza que deseja sair da sessão?</p>
              </div>
              <div className="modal-footer justify-content-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes /> Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Sair Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
