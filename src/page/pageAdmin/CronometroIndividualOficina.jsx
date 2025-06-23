import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch, FaClock, FaPlay, FaPause, FaExclamationTriangle,
  FaUser, FaEye, FaHome, FaUsers, FaTools, FaChartBar,
  FaBars, FaChevronLeft, FaChevronRight,
  FaTrashAlt,
  FaExclamationCircle,
  FaBullhorn,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { BiCompass, BiTimer } from 'react-icons/bi';
import { MdTimer } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";
import { Modal, Spinner } from 'react-bootstrap';
import '../../css/StylesFuncionario/homeOficinaAdmin.css';
import logotipo from "../../assets/logotipo.png";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_URL = import.meta.env.VITE_API_URL;

function CronometrosLista() {
  // Estados principais
  const [cronometros, setCronometros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleting, setDeleting] = useState(false); // novo estado


  // Estados para a modal
  const [showModal, setShowModal] = useState(false);
  const [selectedCronometro, setSelectedCronometro] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cronometroToDelete, setCronometroToDelete] = useState(null);


  // Estados para nomes de técnicos
  const [nomesTecnicos, setNomesTecnicos] = useState({});

  // Buscar cronômetros
  useEffect(() => {
    const fetchCronometros = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/ordem-de-reparacao-cronometro-tecnicos`);

        // Ordena os cronômetros pela data mais recente primeiro
        const dadosOrdenados = response.data.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));

        setCronometros(dadosOrdenados);
      } catch (err) {
        console.error('Erro ao buscar cronômetros:', err);
        setError('Erro ao carregar dados dos cronômetros');
      } finally {
        setLoading(false);
      }
    };

    fetchCronometros();
  }, []);



  // Buscar nomes dos técnicos
  useEffect(() => {
    const fetchNomesTecnicos = async () => {
      try {
        // Filtra IDs válidos (números inteiros positivos)
        const tecnicoIds = [...new Set(
          cronometros
            .map(c => c.tecnico_id)
            .filter(id => Number.isInteger(id) && id > 0)
        )];

        const nomesMap = {};

        await Promise.all(tecnicoIds.map(async (id) => {
          try {
            const response = await axios.get(`${API_URL}/funcionarios/${id}`);
            nomesMap[id] = `${response.data.nome} ${response.data.sobrenome}`;
          } catch (err) {
            console.error(`Erro ao buscar técnico ${id}:`, err);
            nomesMap[id] = 'Técnico não encontrado';
          }
        }));

        setNomesTecnicos(nomesMap);
      } catch (error) {
        console.error('Erro geral ao buscar nomes dos técnicos:', error);
      }
    };

    if (cronometros.length > 0) {
      fetchNomesTecnicos();
    }
  }, [cronometros]);

  // Funções auxiliares
  const mostrarOuNao = (valor) => valor || "Sem informação";

  const formatTime = (seconds) => {
    if (seconds == null) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calculateProgress = (segundosAtual, segundoFinal) => {
    if (!segundosAtual || !segundoFinal) return 0;
    return Math.min(Math.round((segundosAtual / segundoFinal) * 100), 100);
  };

  // Filtragem e paginação
  const filteredCronometros = cronometros.filter(cronometro => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (cronometro.numero_or?.toLowerCase() || '').includes(searchLower) ||
      (cronometro.estado?.toLowerCase() || '').includes(searchLower) ||
      (cronometro.acao?.toLowerCase() || '').includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredCronometros.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCronometros.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manipulador da modal
  const handleOpenModal = async (cronometro) => {
    setShowModal(true);
    setModalLoading(true);
    setModalError(null);
    setSelectedCronometro(cronometro);
    setFuncionario(null);

    try {
      const response = await axios.get(`${API_URL}/ordem-de-reparacao-cronometro-tecnicos/${cronometro.id}`);
      setSelectedCronometro(response.data);

      if (response.data.tecnico_id) {
        try {
          const funcionarioResponse = await axios.get(`${API_URL}/funcionarios/${response.data.tecnico_id}`);
          setFuncionario(funcionarioResponse.data);
        } catch (err) {
          console.error('Erro ao buscar funcionário:', err);
          // Define um funcionário padrão quando não encontrado
          setFuncionario({
            nome: 'Não encontrado',
            sobrenome: '',
            cargo: 'N/A',
            filial: 'N/A',
            celular: 'N/A',
            email: 'N/A'
          });
        }
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      setModalError('Erro ao carregar detalhes do cronômetro');
    } finally {
      setModalLoading(false);
    }
  };
 const handleDeleteCronometro = async (id) => {
  if (!id) return;

  setDeleting(true); // inicia o spinner

  try {
    await axios.delete(`${API_URL}/ordem-de-reparacao-cronometro-tecnicos/${id}`);
    setCronometros((prev) => prev.filter(c => c.id !== id));
    toast.success("Cronômetro eliminado com sucesso!");
  } catch (error) {
    console.error("Erro ao eliminar cronômetro:", error);
    toast.error("Erro ao eliminar cronômetro.");
  } finally {
    setDeleting(false); // encerra o spinner
    setShowDeleteModal(false); // fecha a modal
  }
};

  // Renderização condicional
  if (loading) {
    return (
      <div className="funcionarios-page">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <div className="loading-text">Carregando dados dos cronômetros...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  // Componente principal
  return (
    <div className="funcionarios-page container-fluid p-4">
      <ToastContainer position='top-center' autoClose= {3000}/>
      {/* Cabeçalho e busca */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="text-white mb-4">Cronômetros Individuais</h3>
          <div className="search-box">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control text-black"
                placeholder="Buscar por OR, estado ou ação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de cronômetros */}
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>Nº OR</th>
              <th>Técnico</th>
              <th>Tempo Atual</th>
              <th>Tempo Final</th>

              <th>Progresso</th>
              <th>Estado</th>
              <th>Data / Hora de Inicio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((cronometro) => (
                <tr key={cronometro.id}>
                  <td>{mostrarOuNao(cronometro.numero_or)}</td>
                  <td>{cronometro.tecnico_id ? nomesTecnicos[cronometro.tecnico_id] || 'Carregando...' : 'Não atribuído'}</td>
                  <td><FaClock className="me-2" />{formatTime(cronometro.segundos_atual)}</td>
                  <td><FaClock className="me-2" />{formatTime(cronometro.segundo_final)}</td>

                  <td>
                    <div className="progress">
                      <div
                        className={`progress-bar ${cronometro.tempo_esgotado ? 'bg-danger' : 'bg-success'}`}
                        style={{ width: `${calculateProgress(cronometro.segundos_atual, cronometro.segundo_final)}%` }}
                      >
                        {calculateProgress(cronometro.segundos_atual, cronometro.segundo_final)}%
                      </div>
                    </div>
                  </td>
                  <td>{mostrarOuNao(cronometro.estado)}</td>
                  <td>{mostrarOuNao(new Date(cronometro.data_hora).toLocaleString())}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary px-3"
                        onClick={() => handleOpenModal(cronometro)}
                      >
                        <FaEye className="" />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger px-3"
                        onClick={() => {
                          setCronometroToDelete(cronometro);
                          setShowDeleteModal(true);
                        }}
                      >
                        <FaTrashAlt title="Eliminar" />
                      </button>


                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Nenhum cronômetro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal de detalhes */}
        <Modal show={showModal} onHide={() => setShowModal(false)} fullscreen className="modal-white">
          <Modal.Header closeButton className="bg-white border-bottom">
            <Modal.Title className="text-dark">
              <BiTimer className="me-2" />
              Detalhes do Cronômetro: {selectedCronometro?.numero_or || ''}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="bg-white text-dark">
            {modalLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Carregando detalhes...</p>
              </div>
            ) : modalError ? (
              <div className="alert alert-danger">{modalError}</div>
            ) : selectedCronometro ? (
              <div className="container-fluid mt-3">
                <div className="row">
                  {/* Seção do técnico */}
                  <div className="col-md-6 mb-4">
                    <h4 className="bg-dark text-white px-3 py-2">
                      <FaUser className="me-2" /> Técnico Responsável
                    </h4>
                    <div className="card bg-white text-dark shadow-sm border">
                      <div className="card-body">
                        {funcionario ? (
                          <>
                            <p><strong>Nome:</strong> {mostrarOuNao(`${funcionario.nome} ${funcionario.sobrenome}`)}</p>
                            <p><strong>Cargo:</strong> {mostrarOuNao(funcionario.cargo)}</p>
                            <p><strong>Filial:</strong> {mostrarOuNao(funcionario.filial)}</p>
                            <p><strong>Contato:</strong> {mostrarOuNao(funcionario.celular)}</p>
                            <p><strong>Email:</strong> {mostrarOuNao(funcionario.email)}</p>
                          </>
                        ) : (
                          <p>Nenhuma informação de técnico disponível</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seção do cronômetro */}
                  <div className="col-md-6 mb-4">
                    <h4 className="bg-dark text-white px-3 py-2">
                      <BiTimer className="me-2" /> Detalhes do Cronômetro
                    </h4>
                    <div className="card bg-white text-dark shadow-sm border">
                      <div className="card-body">
                        <p><strong>Nº OR:</strong> {mostrarOuNao(selectedCronometro.numero_or)}</p>
                        <p><strong>Horas Previstas:</strong> {mostrarOuNao(selectedCronometro.numero_horas)} horas</p>
                        <p><strong>Tempo Atual:</strong> {formatTime(selectedCronometro.segundos_atual)}</p>
                        <p><strong>Tempo Final:</strong> {formatTime(selectedCronometro.segundo_final)}</p>
                        <p><strong>Data de Início:</strong> {mostrarOuNao(new Date(selectedCronometro.data_hora).toLocaleString())}</p>

                        <p><strong>Progresso:</strong></p>
                        <div className="progress mb-3">
                          <div
                            className={`progress-bar ${selectedCronometro.tempo_esgotado ? 'bg-danger' : 'bg-success'}`}
                            style={{ width: `${calculateProgress(selectedCronometro.segundos_atual, selectedCronometro.segundo_final)}%` }}
                          >
                            {calculateProgress(selectedCronometro.segundos_atual, selectedCronometro.segundo_final)}%
                          </div>
                        </div>

                        <p><strong>Estado:</strong> {mostrarOuNao(selectedCronometro.estado)}</p>
                        <p><strong>Ação:</strong> {mostrarOuNao(selectedCronometro.acao)}</p>
                        <p><strong>Status:</strong>
                          {selectedCronometro.rodando ? (
                            <span className="text-success ms-2"><FaPlay className="me-1" /> Em execução</span>
                          ) : (
                            <span className="text-warning ms-2"><FaPause className="me-1" /> Pausado</span>
                          )}
                          {selectedCronometro.tempo_esgotado && (
                            <span className="text-danger ms-2"><FaExclamationTriangle className="me-1" /> Tempo esgotado</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Nenhum dado encontrado.</p>
            )}
          </Modal.Body>

          <Modal.Footer className="py-0 d-flex justify-content-between">
            <div></div>
            <img src={logotipo} width={200} alt="Logo" className="my-0 mx-auto d-block " />
     
          </Modal.Footer>
        </Modal>
<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} >
  <Modal.Header closeButton className='text-white bg-danger'>
    <Modal.Title>Confirmar Eliminação</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="d-flex align-items-center">
      <FaExclamationCircle className="text-danger me-3" size={24} />
      <div>
        <p className="mb-1">
          Tem certeza que deseja eliminar o cronômetro <strong>{cronometroToDelete?.numero_or}</strong>?
        </p>
        <small className="text-muted">Esta ação não pode ser desfeita.</small>
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <button
      className="btn btn-outline-secondary"
      onClick={() => setShowDeleteModal(false)}
      disabled={deleting}
    >
      Cancelar
    </button>
    <button
      className="btn btn-danger"
      onClick={() => handleDeleteCronometro(cronometroToDelete.id)}
      disabled={deleting}
    >
      {deleting ? (
        <>
          <Spinner animation="border" size="sm" className="me-2" />
          Eliminando...
        </>
      ) : (
        "Eliminar"
      )}
    </button>
  </Modal.Footer>
</Modal>



      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="pagination-container paginaLimt">
          <div className="pagination-info">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCronometros.length)} de {filteredCronometros.length} cronômetros
          </div>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </li>
          </ul>
        </div>
      )}
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
            <CronometrosLista />
          </div>
        </main>
      </div>
      <Copyright />
    </>
  );
}

export default CrometroGeralOficina;
