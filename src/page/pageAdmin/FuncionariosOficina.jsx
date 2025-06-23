import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash, FaUser, FaPhone, FaBriefcase, FaEye, FaEllipsisV, FaBullhorn, FaMapMarkerAlt } from 'react-icons/fa';
import { Card, Col, Dropdown, Row, Spinner } from 'react-bootstrap';
import '../../css/StylesFuncionario/homeOficinaAdmin.css';
import logotipo from "../../assets/logotipo.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';

import {
  FaHome,
  FaUsers,
  FaTools,
  FaChartBar,

  FaBars,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { MdAccountBalance, MdInfo, MdLocationOn, MdPerson2, MdTimer } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";

import Modal from 'react-bootstrap/Modal';








import { FiEdit } from 'react-icons/fi';
import { BiCompass } from 'react-icons/bi';

const API_URL = import.meta.env.VITE_API_URL;

function FuncionariosOficinaUni() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [idFuncionario, setIdFuncionario] = useState(null);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [funcionarioParaDeletar, setFuncionarioParaDeletar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);



  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/funcionarios`);
        setFuncionarios(response.data);
      } catch (err) {
        console.error('Erro ao buscar funcionários:', err);
        setError('Erro ao carregar dados dos funcionários');
      } finally {
        setLoading(false);
      }
    };
    fetchFuncionarios();
  }, []);

  const handleShow = (id) => {
    setIdFuncionario(id);
    setShow(true);
  };

  useEffect(() => {

    if (!show || !idFuncionario) return;

    const buscarFuncionario = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/funcionarios/${idFuncionario}`);
        setDados(response.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErro("Erro ao buscar os dados do funcionário.");
      } finally {
        setLoading(false);
      }
    };

    buscarFuncionario();
  }, [show, idFuncionario]);

  const confirmarRemocao = (funcionario) => {
    setFuncionarioParaDeletar(funcionario);
    setShowConfirmDelete(true);
  };


  const filteredFuncionarios = funcionarios.filter(funcionario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      funcionario.nome.toLowerCase().includes(searchLower) ||
      funcionario.sobrenome.toLowerCase().includes(searchLower) ||
      funcionario.numero_funcionario.toLowerCase().includes(searchLower) ||
      funcionario.cargo.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async () => {
    if (!funcionarioParaDeletar) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/funcionarios/${funcionarioParaDeletar.id}`);
      setFuncionarios((prev) => prev.filter(f => f.id !== funcionarioParaDeletar.id));
      setShowConfirmDelete(false);
      toast.success(`Funcionário nº ${funcionarioParaDeletar.numero_funcionario} removido com sucesso!`);
    } catch (err) {
      console.error('Erro ao deletar funcionário:', err);
      toast.error('Erro ao remover o funcionário. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };



  const totalPages = Math.ceil(filteredFuncionarios.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFuncionarios.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigate = useNavigate();

  const handleEditar = (PegaId) => {

    navigate(`/pageEditarTecnicos/${PegaId}`);
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
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredFuncionarios.length)} de {filteredFuncionarios.length} funcionários
        </div>
      </div>
    );
  };

  if (loading && !show) {
    return (
      <div className="funcionarios-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando dados dos funcionários...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const mostrarOuNao = (valor) => {
    return valor ? valor : "Sem informação";
  };

  return (
    <>
      <div className="funcionarios-page container-fluid p-4">
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="text-white mb-4">Lista de Técnicos</h3>
            <div className="search-box">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control text-black"
                  placeholder="Buscar por nome, cargo ou filial..."
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
                <th>Nº Funcionário</th>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(funcionario => (
                <tr key={funcionario.id}>
                  <td>{funcionario.numero_funcionario}</td>
                  <td><FaUser className="me-2" />{funcionario.nome} {funcionario.sobrenome}</td>
                  <td><FaBriefcase className="me-2" />{funcionario.cargo}</td>
                  <td><FaPhone className="me-2" />{funcionario.celular}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" className="action-dropdown">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-dark">
                        <Dropdown.Item onClick={() => handleShow(funcionario.id)}>
                          <FaEye className="me-2" /> Visualizar
                        </Dropdown.Item>
                        <Dropdown.Item href="#/editar" onClick={() => handleEditar(funcionario.id)}>
                          <FaEdit className="me-2" /> Editar
                        </Dropdown.Item>
                        <Dropdown.Item

                          className="text-danger"
                          onClick={() => confirmarRemocao(funcionario)}
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

      <Modal show={show} onHide={() => setShow(false)} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Funcionário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className='mx-auto pt-5 text-center'>
              <Spinner animation="border" />
              <h4>Carregando...</h4>
            </div>
          ) : erro ? (
            <p>{erro}</p>
          ) : dados ? (
            <div className="py-4">
              <Row className="g-4">
                {/* Coluna da Foto */}
                <Col md={4}>
                  <Card className="text-center shadow">
                    <Card.Header className="bg-black text-white">
                      <h5> <MdPerson2 className="me-2" /> Foto do Funcionário</h5>

                    </Card.Header>
                    <Card.Body>
                      {dados.foto ? (
                        <MdPerson2 fontSize={80} />
                      ) : (
                        <p>Sem informação</p>
                      )}
                      <Card.Text className="mt-3">
                        <strong>{mostrarOuNao(`${dados.nome} ${dados.sobrenome}`)}</strong><br />
                        <span className="text-muted">{mostrarOuNao(dados.cargo)}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Coluna dos Dados */}
                <Col md={8}>
                  <Card className="shadow">
                    <Card.Header className="bg-black text-white">

                      <h5><MdInfo className="me-2" /> Informações Gerais</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Número:</strong> {mostrarOuNao(dados.numero_funcionario)}</p>
                          <p><strong>Email:</strong> {mostrarOuNao(dados.email)}</p>
                          <p><strong>Gênero:</strong> {mostrarOuNao(dados.genero)}</p>
                          <p><strong>Data de Nascimento:</strong> {mostrarOuNao(dados.dataNascimento)}</p>
                          <p><strong>Bilhete de Identidade:</strong> {mostrarOuNao(dados.bilheteIdentidade)}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Celular:</strong> {mostrarOuNao(dados.celular)}</p>
                          <p><strong>Telefone Fixo:</strong> {mostrarOuNao(dados.telefoneFixo)}</p>
                          <p><strong>Filial:</strong> {mostrarOuNao(dados.filial)}</p>
                          <p><strong>Cargo:</strong> {mostrarOuNao(dados.cargo)}</p>
                          <p><strong>Data de Admissão:</strong> {mostrarOuNao(dados.dataAdmissao)}</p>
                          <p><strong>Bloqueado:</strong> {dados.bloqueado === 1 ? 'Sim' : 'Não'}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow mt-4">
                    <Card.Header className="bg-dark text-white">
                      <h5><MdLocationOn className="me-2" /> Endereço e Localização
                      </h5>

                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>País:</strong> {mostrarOuNao(dados.pais)}</p>
                          <p><strong>Estado:</strong> {mostrarOuNao(dados.estado)}</p>
                          <p><strong>Cidade:</strong> {mostrarOuNao(dados.cidade)}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Endereço:</strong> {mostrarOuNao(dados.endereco)}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow mt-4">
                    <Card.Header className="bg-black text-white">
                      <h5><MdAccountBalance className="me-2" /> Dados Bancários</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>Banco:</strong> {mostrarOuNao(dados.nomeBanco)}</p>
                          <p><strong>IBAN:</strong> {mostrarOuNao(dados.iban)}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="shadow mt-4">
                    <Card.Footer className="text-muted">
                      Registrado em: {mostrarOuNao(new Date(dados.created_at).toLocaleString())} | Atualizado em: {mostrarOuNao(new Date(dados.updated_at).toLocaleString())}
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className='py-0 d-flex justify-content-between'>
          <div></div>
          <img src={logotipo} width={200} alt="..." className='my-0' />
          <button className='links-acessos btn px-3' onClick={() => handleEditar(idFuncionario)} >
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
                Tem certeza de que deseja remover o funcionário nº <strong>{funcionarioParaDeletar?.numero_funcionario}</strong> <br /><strong>{funcionarioParaDeletar?.nome} {funcionarioParaDeletar?.sobrenome}</strong>?
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
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Removendo...
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





function FuncionariosOficina() {
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
            <FuncionariosOficinaUni />
          </div>
        </main>
      </div>
      <Copyright />
    </>
  );
}

export default FuncionariosOficina;
