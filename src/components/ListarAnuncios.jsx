
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
import logotipo from '../assets/logotipo.png';

import { MdLocationOn } from 'react-icons/md';
import { Card, Row, Col, Spinner, Button, Modal } from 'react-bootstrap';
import { BiCompass } from 'react-icons/bi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import logotipo from "../../assets/logotipo.png";
import '../css/StylesFuncionario/homeOficinaAdmin.css';
import GraficoAnuncios from "./componentesHomeAdmin/GraficoAnuncios.jsx";


const API_URL = import.meta.env.VITE_API_URL;

export default function ListaAnuncios() {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [anuncioToDelete, setAnuncioToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
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

    const filteredAnuncios = anuncios.filter((anuncio) => {
        const search = searchTerm.toLowerCase();
        return (
            anuncio.mensagem?.toLowerCase().includes(search) ||
            anuncio.nomeLocal?.toLowerCase().includes(search) ||
            anuncio.criador?.toLowerCase().includes(search)
        );
    });

    const totalPages = Math.ceil(filteredAnuncios.length / anunciosPerPage);
    const indexOfLast = currentPage * anunciosPerPage;
    const indexOfFirst = indexOfLast - anunciosPerPage;
    const currentAnuncios = filteredAnuncios.slice(indexOfFirst, indexOfLast);

    const pageBlockSize = 5;
    const startPage = Math.floor((currentPage - 1) / pageBlockSize) * pageBlockSize + 1;
    const endPage = Math.min(startPage + pageBlockSize - 1, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleView = (anuncio) => {
        setModalContent(anuncio);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    const handleDeleteClick = (anuncio) => {
        setAnuncioToDelete(anuncio);
        setShowDeleteModal(true);
    };


    const handleDeleteConfirm = async () => {
        if (!anuncioToDelete) return;
        setIsDeleting(true);

        try {
            // Fecha a modal primeiro
            setShowDeleteModal(false);

            // Pequeno delay para evitar conflito no React com a desmontagem
            await new Promise((resolve) => setTimeout(resolve, 300));

            // Requisição de exclusão
            await axios.delete(`${API_URL}/anuncios/${anuncioToDelete.id}`);

            // Atualiza a lista localmente
            setAnuncios((prev) => prev.filter((a) => a.id !== anuncioToDelete.id));

            // Feedback visual
            toast.success("Anúncio excluído com sucesso!", {
                position: "top-center",
                autoClose: 3000,
            });

            // Ajusta a página se necessário
            if (currentAnuncios.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            console.log("Tentando apagar anúncio com id:", anuncioToDelete.id);

        } catch (error) {
            console.error("Erro ao excluir anúncio:", error);
            toast.error("Erro ao excluir anúncio", {
                position: "top-center",
                autoClose: 3000,
            });
        } finally {
            setIsDeleting(false);
            setAnuncioToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setAnuncioToDelete(null);
    };

    return (
        <div className="container-fluid mt-4">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="row bordarDIV">
                <GraficoAnuncios />
            </div>

            <div className="row bordarDIV mt-5">
                <h4 className="text-white mb-3 ">Lista de Anúncios</h4>

                <div className="mb-3 ">
                    <div className="input-group ">
                        <span className="input-group-text"><FaSearch /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por mensagem, local ou criador..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Carregando anúncios...</p>
                    </div>
                ) : filteredAnuncios.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-white">Nenhum anúncio encontrado.</p>
                    </div>
                ) : (

                    <>
                        <Row className="g-4  bgGeneral pb-4 mt-3">
                            {currentAnuncios.map((anuncio) => (
                                <Col key={anuncio.id} md={6} lg={4}>
                                    <Card className="shadow h-100">
                                        <Card.Body>
                                            <Card.Title>
                                                <FaBullhorn className="me-2" />
                                                {anuncio.mensagem?.slice(0, 32) || 'Sem título'}
                                                {anuncio.mensagem?.length > 32 ? '...' : ''}
                                            </Card.Title>

                                            <div className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                                <strong>ID:</strong> {anuncio.id}
                                            </div>

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
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(anuncio)}>
                                                    <FaTrash className="me-1" /> Excluir
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Paginação */}
                        <div className="pagination-container paginaLimt mt-4 d-flex flex-column align-items-center">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                        <FaChevronLeft />
                                    </button>
                                </li>

                                {startPage > 1 && (
                                    <>
                                        <li className="page-item"><button className="page-link" onClick={() => goToPage(1)}>1</button></li>
                                        {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                    </>
                                )}

                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => goToPage(number)}>{number}</button>
                                    </li>
                                ))}

                                {endPage < totalPages && (
                                    <>
                                        {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                        <li className="page-item"><button className="page-link" onClick={() => goToPage(totalPages)}>{totalPages}</button></li>
                                    </>
                                )}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                        <FaChevronRight />
                                    </button>
                                </li>
                            </ul>
                            <div className="pagination-info text-white mt-2">
                                Mostrando {indexOfFirst + 1} - {Math.min(indexOfLast, filteredAnuncios.length)} de {filteredAnuncios.length} anúncios
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal de confirmação de exclusão */}
            <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tem certeza que deseja excluir este anúncio?</p>
                    {anuncioToDelete && (
                        <>
                            <strong>Mensagem:</strong> {anuncioToDelete.mensagem}<br />
                            <strong>Local:</strong> {anuncioToDelete.nomeLocal}<br />
                            <strong>Criador:</strong> {anuncioToDelete.criador}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de visualização */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#e3e3e6ff' }}>
                    <Modal.Title className="text-black">
                        <FaBullhorn className="me-2" />
                        Detalhes do Anúncio
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="bg-white">
                    {modalContent ? (
                        <>
                            <h4 className="mb-4 text-secondary border-bottom pb-2">
                                <FaBullhorn className="me-2 text-warning" />
                                {modalContent.mensagem || 'Sem título'}
                            </h4>

                            <Card className="mb-3 shadow-sm border-0 " style={{ backgroundColor: '#e3e3e6ff' }}>
                                <Card.Body>
                                    <Row className="mb-3">
                                        <Col md={6} className="mb-2">
                                            <FaMapMarkerAlt className="me-2 text-danger" />
                                            <strong>Local:</strong> {modalContent.nomeLocal}
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <FaUser className="me-2 text-primary" />
                                            <strong>Criador:</strong> {modalContent.criador}
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <BiCompass className="me-2 text-success" />
                                            <strong>Latitude:</strong> {modalContent.latitude}
                                        </Col>
                                        <Col md={6} className="mb-2">
                                            <BiCompass className="me-2 text-success" />
                                            <strong>Longitude:</strong> {modalContent.longitude}
                                        </Col>
                                        <Col md={12}>
                                            <FaWifi className="me-2 text-info" />
                                            <strong>WiFi:</strong> {modalContent.idsWifi?.join(', ') || 'Nenhum'}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {modalContent.descricao && (
                                <Card className="shadow-sm border-0">
                                    <Card.Body>
                                        <h5 className="text-muted mb-2">
                                            <FaEye className="me-2 text-secondary" />
                                            Descrição
                                        </h5>
                                        <p className="mb-0">{modalContent.descricao}</p>
                                    </Card.Body>
                                </Card>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-3">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Carregando detalhes...</p>
                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer className="bg-light">
                    <img src={logotipo} alt="..." width={220} className='mx-auto d-block' />
                    <Button variant="outline-danger" className='mt-2 float-end' onClick={handleCloseModal}>
                        <b> Fechar</b>
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
}

