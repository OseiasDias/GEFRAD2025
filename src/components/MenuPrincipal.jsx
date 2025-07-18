// components/Layout/LayoutAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaBullhorn,
    FaBars,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';
import { BiCompass } from 'react-icons/bi';
import { CiLogout } from "react-icons/ci";
import logotipo from '../assets/logotipo.png';
import Copyright from './CopyRigth';

export default function MenuPrincipal({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeItem, setActiveItem] = useState('painel');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => isMobile && setIsMenuOpen(false);

    const handleItemClick = (itemId) => {
        if (itemId === 'Sair') {
            setShowModal(true);
        } else {
            setActiveItem(itemId);
            const path = menuItems.find(item => item.id === itemId)?.path;
            if (path) navigate(path);
            if (isMobile) closeMenu();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('idSessao');
        navigate('/');
        setShowModal(false);
    };

    const menuItems = [
        { id: 'painel', icon: <FaHome />, label: 'Painel', path: '/homeAdmin' },
        { id: 'Utilizadores', icon: <FaUsers />, label: 'Utilizadores', path: '/pageTecnicos' },
        { id: 'Anuncios', icon: <FaBullhorn />, label: 'Anuncios', path: '/pageAnuncios' },
        { id: 'Locais', icon: <BiCompass />, label: 'Locais', path: '/pageLocais' },
        { id: 'Sair', icon: <CiLogout />, label: 'Sair', path: null }
    ];

    return (
        <>
            <div className="admin-container">
              <div className="col-12">
                  {/* Botão de menu para mobile */}
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
                            <button className="toggle-menu-btn" onClick={toggleMenu} title={isMenuOpen ? "Minimizar menu" : "Maximizar menu"}>
                                {isMenuOpen ? <FaChevronLeft /> : <FaChevronRight />}
                            </button>
                        )}
                    </div>

                    <nav className="sidebar-nav">
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    {item.id === 'Sair' ? (
                                        <button
                                            className={`nav-item btn btn-link w-100 text-start ${activeItem === item.id ? 'active' : ''}`}
                                            onClick={() => handleItemClick(item.id)}
                                            style={{ textDecoration: 'none', color: 'inherit', border: 'none', background: 'transparent' }}
                                        >
                                            <span className="nav-icon">{item.icon}</span>
                                            {isMenuOpen && <span className="nav-label">{item.label}</span>}
                                        </button>
                                    ) : (
                                        <a
                                            href={item.path}
                                            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
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
                            ))}
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


            {/* Modal de confirmação */}
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
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleLogout}>Sair</button>
                            </div>
                        </div>
                    </div>

                </div>

            )}
          
        </>
    );
}
