import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaUser, FaEye, FaUsers, FaChartBar,
  FaChevronLeft, FaChevronRight,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { MdAddLocationAlt, MdTimer } from 'react-icons/md';
import { Modal, Spinner } from 'react-bootstrap';
import logotipo from "../assets/logotipo.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormCadastroLocal from './componentesHomeAdmin/ModalCadastroLocal.jsx';
// React e bibliotecas essenciais 
import { useNavigate } from 'react-router-dom';

// Ícones
import {
  FaEdit, FaTrash, FaEllipsisV,

  FaWifi
} from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { MdAccountBalance, MdInfo, MdLocationOn, MdPerson2 } from 'react-icons/md';

// Bootstrap
import { Card, Col, Dropdown, Row, } from 'react-bootstrap';
//import logo from '../assets/logotipo.png';
// Estilos e assets
import '../css/StylesFuncionario/homeOficinaAdmin.css';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ListaLocais() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [idLocal, setIdLocal] = useState(null);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [localParaDeletar, setLocalParaDeletar] = useState(null);
  const [isDeleting, setIsDeletando] = useState(false);
  const itemsPerPage = 10;
  const [showModalCadastro, setShowModalCadastro] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/locais/ListarLocais`);
        setLocais(response.data);
      } catch (err) {
        console.error('Erro ao buscar locais:', err);
        setError('Erro ao carregar dados dos locais');
      } finally {
        setLoading(false);
      }
    };
    fetchLocais();
  }, []);

  useEffect(() => {
    if (!show || !idLocal) return;

    const buscarLocal = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/locais/${idLocal}`);
        setDados(response.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErro("Erro ao buscar os dados do local.");
      } finally {
        setLoading(false);
      }
    };

    buscarLocal();
  }, [show, idLocal]);

  const handleShow = (id) => {
    setIdLocal(id);
    setShow(true);
  };

  const confirmarRemocao = (local) => {
    setLocalParaDeletar(local);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!localParaDeletar) return;
    setIsDeletando(true);
    try {
      await axios.delete(`${API_URL}/locais/Admin/RemoverLocal/${localParaDeletar.id}`);
      setLocais(prev => prev.filter(l => l.id !== localParaDeletar.id));
      setShowConfirmDelete(false);
      toast.success(`Local ${localParaDeletar.nome} removido com sucesso!`);
    } catch (err) {
      console.error('Erro ao deletar local:', err);
      toast.error('Erro ao remover o local. Tente novamente.');
    } finally {
      setIsDeletando(false);
    }
  };

  const handleEditar = (id) => {
    navigate(`/editar-local/${id}`);
  };

  const mostrarOuNao = (valor) => valor || "Sem informação";

  const filteredLocais = locais.filter(local => {
    const searchLower = searchTerm.toLowerCase();
    return (
      local.nome.toLowerCase().includes(searchLower) ||
      (local.criador && local.criador.toLowerCase().includes(searchLower)) ||
      (local.idsWifi && local.idsWifi.some(wifi => wifi.toLowerCase().includes(searchLower)))
    );
  });

  const totalPages = Math.ceil(filteredLocais.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLocais.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container paginaLimt">
        <ToastContainer position="top-center" autoClose={3000} />
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <FaChevronLeft />
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item"><button className="page-link" onClick={() => handlePageChange(1)}>1</button></li>
              {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}

          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item"><button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button></li>
            </>
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <FaChevronRight />
            </button>
          </li>
        </ul>
        <div className="pagination-info">
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLocais.length)} de {filteredLocais.length} locais
        </div>
      </div>
    );
  };

  if (loading && !show) {
    return (
      <div className="funcionarios-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando dados dos locais...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <div className="funcionarios-page  bordarDIV container-fluid p-4">
        <div className="row mb-4 ">
          <div className="col-12 d-flex justify-content-beteween">
            <button
              className="btn btn-outline-light ms-auto d-none"
              onClick={() => setShowModalCadastro(true)}
              disabled={loading}
            >
              <MdAddLocationAlt size={30} />
            </button>

          </div>
          <div className="col-12 ">

            <h3 className="text-white mb-4">Lista de Locais</h3>
            <div className="search-box">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control text-black"
                  placeholder="Buscar por nome, criador ou WiFi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th><MdLocationOn className="me-1" /> Nome</th>
                <th><FaUser className="me-1" /> Criador</th>
                <th><FaMapMarkerAlt className="me-1" /> Coordenadas</th>
                <th><FaWifi className="me-1" /> WiFi</th>
                <th><FaUsers className="me-1" /> Capacidade</th>
                <th><FaEllipsisV className="me-1" /> Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(local => (
                <tr key={local.id}>
                  <td>LC00{local.id}</td>
                  <td><MdLocationOn className="me-2 text-info" />{local.nome}</td>
                  <td><FaUser className="me-2 text-warning" />{local.criador}</td>
                  <td>
                    <small>
                      Lat: {local.latitude}<br />
                      Long: {local.longitude}
                    </small>
                  </td>
                  <td>
                    {local.idsWifi && local.idsWifi.length > 0 ? (
                      <small>{local.idsWifi[0]}{local.idsWifi.length > 1 ? ` +${local.idsWifi.length - 1}` : ''}</small>
                    ) : 'Sem WiFi'}
                  </td>
                  <td><FaUsers className="me-2 text-success" />{local.capacidade}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="action-dropdown">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-dark">
                        <Dropdown.Item onClick={() => handleShow(local.id)}>
                          <FaEye className="me-2" /> Visualizar
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEditar(local.id)} className='d-none'>
                          <FaEdit className="me-2" /> Editar
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => confirmarRemocao(local)}
                        >
                          <FaTrash className="me-2" /> Remover
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && renderPagination()}
      </div>
      <Modal show={showModalCadastro} scrollable onHide={() => setShowModalCadastro(false)} size='xl' centered>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Local</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormCadastroLocal
            onClose={() => setShowModalCadastro(false)}
            onSuccess={() => {
              // Recarrega a lista após cadastrar
              window.location.reload();
            }}
          />
        </Modal.Body>

        <Modal.Footer className='py-1'>
           <img src={logotipo} alt="Logo" width={220}  className='mx-auto d-block' />
        </Modal.Footer>
      </Modal>

      {/* Modal de Visualização */}
      <Modal show={show} onHide={() => setShow(false)} size='xl' scrollable>
        <Modal.Header closeButton >
          <Modal.Title>Detalhes do Local</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className='mx-auto pt-5 text-center'>
              <Spinner animation="border" />
              <h4>Carregando...</h4>
            </div>
          ) : erro ? (
            <p className="text-danger">{erro}</p>
          ) : dados ? (
            <div className="py-4">
              <Row className="g-4">
                {/* Coluna da esquerda: Informações básicas */}
                <Col md={4}>
                  <Card className="text-center shadow">
                    <Card.Header className="bg-black text-white">
                      <h5><MdLocationOn className="me-2" /> Informações do Local</h5>
                    </Card.Header>
                    <Card.Body>
                      <FaMapMarkerAlt fontSize={80} className="text-danger" />
                      <Card.Text className="mt-3 d-inline-block">
                        <strong>{mostrarOuNao(dados.nome)}</strong><br />
                        <span className="badge bg-primary mt-2">
                          <FaUser className="me-1" /> {mostrarOuNao(dados.criador)}
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Coluna da direita: Detalhes */}
                <Col md={8}>
                  <Card className="shadow">
                    <Card.Header className="bg-black text-white">
                      <h5><MdInfo className="me-2" /> Detalhes do Local</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>ID:</strong> LC00{mostrarOuNao(dados.id)}</p>
                          <p><strong>Nome:</strong> {mostrarOuNao(dados.nome)}</p>
                          <p><strong>Criador:</strong> {mostrarOuNao(dados.criador)}</p>
                          <p><strong>Coordenadas:</strong><br />
                            Latitude: {mostrarOuNao(dados.latitude)}<br />
                            Longitude: {mostrarOuNao(dados.longitude)}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Raio (km):</strong> {mostrarOuNao(dados.raio)}</p>
                          <p><strong>Capacidade:</strong> {mostrarOuNao(dados.capacidade)}</p>
                          <p><strong>Bônus de Entrega:</strong> {mostrarOuNao(dados.bonusEntrega)}</p>
                          <p><strong>Total de Anúncios:</strong> {mostrarOuNao(dados.totalAnuncios)}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow mt-4">
                    <Card.Header className="bg-dark text-white">
                      <h5><FaWifi className="me-2" /> Redes WiFi</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={12}>
                          {dados.idsWifi && dados.idsWifi.length > 0 ? (
                            <ul className="list-unstyled">
                              {dados.idsWifi.map((wifi, index) => (
                                <li key={index}>
                                  <FaWifi className="me-2 text-success" /> {wifi}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Sem redes WiFi registradas</p>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow mt-4">
                    <Card.Header className="bg-dark text-white">
                      <h5><FaChartBar className="me-2" /> Estatísticas</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Total de Entregas:</strong> {mostrarOuNao(dados.totalEntregas)}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Utilizadores Conectados:</strong> {mostrarOuNao(dados.utilizadoresConectados)}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className='py-1 d-flex justify-content-between'>
          <img src={logotipo} alt="..." width={220} className='mx-auto d-block' />
          <button className='btn d-none btn-primary px-3' onClick={() => handleEditar(idLocal)}>
            Editar <FiEdit fontSize={13} />
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Remoção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center">
            <FaTrash className="text-danger me-3" size={24} />
            <div>
              <p className="mb-1">
                Tem certeza de que deseja remover o local <strong>{localParaDeletar?.nome}</strong>?
              </p>
              <small className="text-muted">Esta ação não pode ser desfeita.</small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-outline-secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> {" "}
                Excluindo...
              </>
            ) : (
              'Remover'
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

;