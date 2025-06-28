// React e bibliotecas essenciais
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Ícones
import {
  FaSearch, FaEdit, FaTrash, FaUser, FaPhone, FaBriefcase, FaEye, FaEllipsisV, FaBullhorn, FaMapMarkerAlt,
  FaUserShield, FaUserTie, FaUserCog, FaCheckCircle, FaBan, FaHourglassHalf, FaEnvelope,
  FaHome, FaUsers, FaTools, FaChartBar, FaBars, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { BiCompass } from 'react-icons/bi';
import { MdAccountBalance, MdInfo, MdLocationOn, MdPerson2, MdTimer } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';

// Bootstrap
import { Card, Col, Dropdown, Row, Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

// Estilos e assets
import '../../css/StylesFuncionario/homeOficinaAdmin.css';
import logotipo from '../../assets/logotipo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:8080/api";

function ListaUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [idUtilizador, setIdUtilizador] = useState(null);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [utilizadorParaDeletar, setUtilizadorParaDeletar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUtilizadores = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/utilizadores/listar`);
        setUtilizadores(response.data);
      } catch (err) {
        console.error('Erro ao buscar utilizadores:', err);
        setError('Erro ao carregar dados dos utilizadores');
      } finally {
        setLoading(false);
      }
    };
    fetchUtilizadores();
  }, []);

  useEffect(() => {
    if (!show || !idUtilizador) return;

    const buscarUtilizador = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/utilizadores/perfil/${idUtilizador}`);
        setDados(response.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErro("Erro ao buscar os dados do utilizador.");
      } finally {
        setLoading(false);
      }
    };

    buscarUtilizador();
  }, [show, idUtilizador]);

  const handleShow = (email) => {
    setIdUtilizador(email);
    setShow(true);
  };

  const confirmarRemocao = (utilizador) => {
    setUtilizadorParaDeletar(utilizador);
    setShowConfirmDelete(true);
  };

const handleDelete = async () => {

  if (!utilizadorParaDeletar) return;
  setIsDeleting(true);
  try {
    await axios.delete(`${API_URL}/utilizadores/${encodeURIComponent(utilizadorParaDeletar.email)}`);
    setUtilizadores(prev => prev.filter(u => u.email !== utilizadorParaDeletar.email));
    setShowConfirmDelete(false);
    toast.success(`Utilizador ${utilizadorParaDeletar.nomeUsuario} removido com sucesso!`);
  } catch (err) {
    console.error('Erro ao deletar utilizador:', err);
    toast.error('Erro ao remover o utilizador. Tente novamente.');
  } finally {
    setIsDeleting(false);


  }
};


  const handleEditar = (id) => {
    navigate(`/editar-utilizador/${id}`);
  };

  const mostrarOuNao = (valor) => valor || "Sem informação";

  const getTelefone = (perfis) => {
    const telefonePerfil = perfis?.find(perfil => perfil.chave === 'telefone');
    return telefonePerfil ? telefonePerfil.valor : 'Sem informação';
  };

  const filteredUtilizadores = utilizadores.filter(utilizador => {
    const searchLower = searchTerm.toLowerCase();
    return (
      utilizador.nomeUsuario.toLowerCase().includes(searchLower) ||
      (utilizador.email && utilizador.email.toLowerCase().includes(searchLower)) ||
      (utilizador.perfis && utilizador.perfis.some(perfil =>
        perfil.valor && perfil.valor.toLowerCase().includes(searchLower)
      ))
    );
  });

  const totalPages = Math.ceil(filteredUtilizadores.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUtilizadores.slice(indexOfFirstItem, indexOfLastItem);

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
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUtilizadores.length)} de {filteredUtilizadores.length} utilizadores
        </div>
      </div>
    );
  };

  if (loading && !show) {
    return (
      <div className="funcionarios-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando dados dos utilizadores...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Aq

  return (
    <>
      <div className="funcionarios-page container-fluid p-4">
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="text-white mb-4">Lista de Utilizadores</h3>
            <div className="search-box">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control text-black"
                  placeholder="Buscar por nome, email ou telefone..."
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
                <th><FaUser className="me-1" /> Nome</th>
                <th><FaEnvelope className="me-1" /> Email</th>
                <th><FaUserShield className="me-1" /> Tipo</th>
                <th><FaPhone className="me-1" /> Telefone</th>

                <th><FaCheckCircle className="me-1" /> Estado</th>
                <th><FaEllipsisV className="me-1" /> Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(utilizador => (
                <tr key={utilizador.id}>
                  <td>UT00{utilizador.id}</td>
                  <td><FaUser className="me-2 text-info" />{utilizador.nomeUsuario}</td>
                  <td><FaEnvelope className="me-2 text-warning" />{utilizador.email}</td>
                  <td>
                    <span className={`badge d-flex align-items-center gap-1 ${utilizador.tipo === 'CLIENTE' ? 'bg-primary' :
                      utilizador.tipo === 'ADMIN' ? 'bg-danger' :
                        utilizador.tipo === 'TECNICO' ? 'bg-warning text-dark' :
                          'bg-secondary'
                      }`}>
                      {utilizador.tipo === 'CLIENTE' && <FaUser />}
                      {utilizador.tipo === 'ADMIN' && <FaUserShield />}
                      {utilizador.tipo === 'TECNICO' && <FaUserTie />}
                      {utilizador.tipo}
                    </span>
                  </td>
                  <td><FaPhone className="me-2 text-success" />{getTelefone(utilizador.perfis)}</td>

                  <td>
                    <span className={`badge d-flex align-items-center gap-1 ${utilizador.estado === 'ATIVO' ? 'bg-success' :
                      utilizador.estado === 'BLOQUEADO' ? 'bg-danger' :
                        utilizador.estado === 'PENDENTE' ? 'bg-warning text-dark' :
                          'bg-secondary'
                      }`}>
                      {utilizador.estado === 'ATIVO' && <FaCheckCircle />}
                      {utilizador.estado === 'BLOQUEADO' && <FaBan />}
                      {utilizador.estado === 'PENDENTE' && <FaHourglassHalf />}
                      {utilizador.estado}
                    </span>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="action-dropdown">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-dark">
                        <Dropdown.Item onClick={() => handleShow(utilizador.email)}>
                          <FaEye className="me-2" /> Visualizar
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEditar(utilizador.id)}>
                          <FaEdit className="me-2" /> Editar
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => confirmarRemocao(utilizador)}
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


      {/* Modal de Visualização */}
      <Modal show={show} onHide={() => setShow(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Utilizador</Modal.Title>
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
                {/* Coluna da esquerda: Perfil */}
                <Col md={4}>
                  <Card className="text-center shadow">
                    <Card.Header className="bg-black text-white">
                      <h5><FaUser className="me-2" /> Perfil do Utilizador</h5>
                    </Card.Header>
                    <Card.Body>
                      <FaUser fontSize={80} />
                      <Card.Text className="mt-3 d-inline-block">
                        <strong>{mostrarOuNao(dados.nomeUsuario)}</strong><br />
                        <span className={`badge d-flex align-items-center gap-1 mt-2 ${dados.tipo === 'CLIENTE' ? 'bg-primary' :
                            dados.tipo === 'ADMIN' ? 'bg-danger' :
                              dados.tipo === 'TECNICO' ? 'bg-warning text-dark' :
                                'bg-secondary'
                          }`}>
                          {dados.tipo === 'CLIENTE' && <FaUser />}
                          {dados.tipo === 'ADMIN' && <FaUserShield />}
                          {dados.tipo === 'TECNICO' && <FaUserTie />}
                          {mostrarOuNao(dados.tipo)}
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Coluna da direita: Informações e Perfis */}
                <Col md={8}>
                  <Card className="shadow">
                    <Card.Header className="bg-black text-white">
                      <h5><FaUser className="me-2" /> Informações Gerais</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Numero do Utilizador:</strong><b>UT00{mostrarOuNao(dados.id)}</b></p>
                          <p><strong>Email:</strong> {mostrarOuNao(dados.email)}</p>
                          <p><strong>Tipo:</strong>
                            <span className={`ms-2 badge d-inline-block align-items-center gap-1 ${dados.tipo === 'CLIENTE' ? 'bg-primary' :
                                dados.tipo === 'ADMIN' ? 'bg-danger' :
                                dados.tipo === 'TECNICO' ? 'bg-warning text-dark' :
                                    'bg-secondary'
                              }`}>
                              {dados.tipo === 'CLIENTE' && <FaUser />}
                              {dados.tipo === 'ADMIN' && <FaUserShield />}
                              {dados.tipo === 'TECNICO' && <FaUserTie />}
                              {mostrarOuNao(dados.tipo)}
                            </span>
                          </p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Estado:</strong>
                            <span className={`ms-2 badge d-inline-block align-items-center gap-1 ${dados.estado === 'ATIVO' ? 'bg-success' :
                                dados.estado === 'BLOQUEADO' ? 'bg-danger' :
                                  dados.estado === 'PENDENTE' ? 'bg-warning text-dark' :
                                    'bg-secondary'
                              }`}>
                              {dados.estado === 'ATIVO' && <FaCheckCircle />}
                              {dados.estado === 'BLOQUEADO' && <FaBan />}
                              {dados.estado === 'PENDENTE' && <FaHourglassHalf />}
                              {mostrarOuNao(dados.estado)}
                            </span>
                          </p>
                          <p><strong>Saldo:</strong> {mostrarOuNao(dados.saldo)}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow mt-4">
                    <Card.Header className="bg-dark text-white">
                      <h5><FaPhone className="me-2" /> Perfis e Contactos</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={12}>
                          {dados.perfis && dados.perfis.length > 0 ? (
                            <ul className="list-unstyled">
                              {dados.perfis.map((perfil, index) => (
                                <li key={index}>
                                  <strong>{perfil.chave}:</strong> {mostrarOuNao(perfil.valor)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Sem perfis adicionais</p>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className='py-0 d-flex justify-content-between'>
          <div></div>
          <button className='btn btn-primary px-3' onClick={() => handleEditar(idUtilizador)}>
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
                Tem certeza de que deseja remover o utilizador <strong>{utilizadorParaDeletar?.nomeUsuario}</strong>?
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





export default function FuncionariosOficina() {
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
            <ListaUtilizadores />
          </div>
        </main>
      </div>
      <Copyright />
    </>
  );
}
