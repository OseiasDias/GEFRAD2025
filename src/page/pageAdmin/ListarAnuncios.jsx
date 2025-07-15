import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaSearch,
    FaEye,
    FaWifi,
    FaMapMarkerAlt,
    FaUser,
    FaBullhorn,
    FaTrash,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Card, Row, Col, Spinner, Button, Modal, Pagination } from 'react-bootstrap';
import logotipo from "../../assets/logotipo.png";
import { FaHome, FaUsers } from 'react-icons/fa';
import { BiCompass } from 'react-icons/bi';
import { CiLogout } from 'react-icons/ci';
import { FaBars } from 'react-icons/fa';

const API_URL = "http://localhost:8080/api";

function ListaAnuncios() {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para modal
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const anunciosPerPage = 9;

    useEffect(() => {
        const fetchAnuncios = async () => {
            try {
                const response = await axios.get(`${API_URL}/anuncios/ListarAnuncios`);
                setAnuncios(response.data);
            } catch (error) {
                console.error("Erro ao buscar anúncios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnuncios();
    }, []);

    // Filtra anúncios baseado no termo de busca
    const filteredAnuncios = anuncios.filter((anuncio) => {
        const search = searchTerm.toLowerCase();
        return (
            anuncio.mensagem?.toLowerCase().includes(search) ||
            anuncio.nomeLocal?.toLowerCase().includes(search) ||
            anuncio.criador?.toLowerCase().includes(search)
        );
    });

    // Paginação: calcular os anúncios a mostrar na página atual
    const indexOfLast = currentPage * anunciosPerPage;
    const indexOfFirst = indexOfLast - anunciosPerPage;
    const currentAnuncios = filteredAnuncios.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredAnuncios.length / anunciosPerPage);

    // Abrir modal para visualizar anúncio
    const handleView = (anuncio) => {
        setModalContent(anuncio);
        setShowModal(true);
    };

    // Fechar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    // Função para deletar anúncio localmente e no backend
    const handleDelete = async (id) => {
        if (!window.confirm("Deseja realmente excluir este anúncio?")) return;
        try {
            await axios.delete(`${API_URL}/anuncios/${id}`); // Ajuste a rota conforme sua API
            setAnuncios(anuncios.filter((anuncio) => anuncio.id !== id));
        } catch (error) {
            console.error("Erro ao excluir anúncio:", error);
            alert("Não foi possível excluir o anúncio.");
        }
    };

    // Funções para paginação
    const goToPage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mt-4">
            <h3 className="text-white mb-3">Lista de Anúncios</h3>

            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text"><FaSearch /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por mensagem, local ou criador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Carregando anúncios...</p>
                </div>
            ) : (
                <>
                    <Row className="g-4">
                        {currentAnuncios.map((anuncio) => (
                            <Col key={anuncio.id} md={6} lg={4}>
                                <Card className="shadow h-100">
                                    <Card.Body>
                                        <Card.Title>
                                            <FaBullhorn className="me-2" />
                                            {anuncio.mensagem
                                                ? anuncio.mensagem.length > 45
                                                    ? anuncio.mensagem.slice(0, 45) + '...'
                                                    : anuncio.mensagem
                                                : 'Sem título'}
                                        </Card.Title>

                                        <Card.Text>
                                            <MdLocationOn className="me-2 text-danger" />
                                            <strong>Local:</strong> {anuncio.nomeLocal || 'Desconhecido'}<br />
                                            <FaUser className="me-2 text-warning" />
                                            <strong>Criador:</strong> {anuncio.criador || 'Não informado'}<br />
                                            <FaMapMarkerAlt className="me-2 text-info" />
                                            <strong>Lat/Lng:</strong> {anuncio.latitude}, {anuncio.longitude}<br />
                                            <FaWifi className="me-2 text-success" />
                                            <strong>WiFi:</strong> {anuncio.idsWifi?.join(', ') || 'Nenhum'}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <Button variant="primary" size="sm" onClick={() => handleView(anuncio)}>
                                                <FaEye className="me-1" /> Visualizar
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(anuncio.id)}>
                                                <FaTrash className="me-1" /> Excluir
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Paginação */}
                    <Pagination className="justify-content-center mt-4">
                        <Pagination.Prev onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, idx) => (
                            <Pagination.Item
                                key={idx + 1}
                                active={currentPage === idx + 1}
                                onClick={() => goToPage(idx + 1)}
                            >
                                {idx + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </>
            )}

            {/* Modal para visualização */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaBullhorn className="me-2 text-primary" />
                        Detalhes do Anúncio
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent ? (
                        <div>
                            {/* Mensagem / título */}
                            <h4 className="mb-4 text-secondary">{modalContent.mensagem || 'Sem título'}</h4>

                            {/* Informações principais em card */}
                            <Card className="mb-3 shadow-sm">
                                <Card.Body>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <FaMapMarkerAlt className="me-2 text-danger" size={20} />
                                            <strong>Local:</strong>
                                            <p className="ms-4 mb-0">{modalContent.nomeLocal || 'Desconhecido'}</p>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <FaUser className="me-2 text-warning" size={20} />
                                            <strong>Criador:</strong>
                                            <p className="ms-4 mb-0">{modalContent.criador || 'Não informado'}</p>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <MdLocationOn className="me-2 text-info" size={20} />
                                            <strong>Latitude:</strong>
                                            <p className="ms-4 mb-0">{modalContent.latitude}</p>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <MdLocationOn className="me-2 text-info" size={20} />
                                            <strong>Longitude:</strong>
                                            <p className="ms-4 mb-0">{modalContent.longitude}</p>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <FaWifi className="me-2 text-success" size={20} />
                                            <strong>WiFi IDs:</strong>
                                            <p className="ms-4 mb-0">{modalContent.idsWifi?.length > 0 ? modalContent.idsWifi.join(', ') : 'Nenhum'}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Caso queira adicionar descrição maior ou outro conteúdo */}
                            {modalContent.descricao && (
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h5 className="text-muted">Descrição</h5>
                                        <p>{modalContent.descricao}</p>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    ) : (
                        <p>Carregando...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}








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



function CrometroGeralOficina() {
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
        { id: 'Anuncios', icon: <FaBullhorn />, label: 'Anuncios', path: '' },
        { id: 'Locais', icon: <BiCompass />, label: 'Locais', path: '' },
        { id: 'Localização', icon: <FaMapMarkerAlt />, label: 'Localização', path: '/pageLocais' },
        { id: 'Voltar', icon: <CiLogout />, label: 'Voltar', path: '' }
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
                        <ListaAnuncios />
                    </div>
                </main>
            </div>
            <Copyright />
        </>
    );
}

export default CrometroGeralOficina;
