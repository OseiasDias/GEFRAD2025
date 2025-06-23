import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaClock, FaPlay, FaPause, FaExclamationTriangle, FaEye, FaBullhorn, FaMapMarkerAlt } from 'react-icons/fa';
import '../../../css/StylesFuncionario/homeOficinaAdmin.css';
import logotipo from "../../../assets/logo- turbo fundo branco.png";
import logotipoAzul from "../../../assets/lgo.png";

import {
  FaHome,
  FaUsers,
  FaTools,
  FaChartBar,
  FaBars,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { BiCompass, BiTimer } from 'react-icons/bi';
import { MdTimer } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";
import { FiEdit } from 'react-icons/fi';
import { Modal, Spinner } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;





function CronometrosLista() {
  const [cronometros, setCronometros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados para a modal
  const [showModal, setShowModal] = useState(false);
  const [selectedCronometro, setSelectedCronometro] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [funcionario, setFuncionario] = useState(null);


  const [tecnicos, setTecnicos] = useState([]);


  useEffect(() => {
    const carregarTecnicos = async () => {
      try {
        // 1. Buscar os IDs dos técnicos da ordem
        const idsResponse = await fetch(
          `https://biturbo.biturbomotors.com/biturboApi2/public/api/ordensTecnicosRetornosId/${selectedCronometro?.numero_or}`
        );

        if (!idsResponse.ok) {
          throw new Error('Erro ao buscar IDs dos técnicos');
        }

        const idsData = await idsResponse.json();
        const ids = idsData.tecnicos;

        // Concatena os IDs em uma string (ex: [7,4] vira "74")

        if (!ids || ids.length === 0) {
          setTecnicos([]);

          return;
        }

        // 2. Buscar dados completos dos técnicos com base nos IDs
        const tecnicosData = await Promise.all(
          ids.map(async (id) => {
            if (!id) {
              console.error(`ID inválido encontrado: ${id}`);
              return null;
            }

            const tecnicoResponse = await fetch(
              `https://biturbo.biturbomotors.com/biturboApi2/public/api/funcionarios/${id}`
            );

            if (!tecnicoResponse.ok) {
              throw new Error(`Erro ao buscar dados do técnico com ID: ${id}`);
            }

            return await tecnicoResponse.json();
          })
        );

        // Filtra quaisquer valores nulos que possam ter sido retornados
        setTecnicos(tecnicosData.filter(tecnico => tecnico !== null));
      } catch (error) {
        console.log(error.message);
      } finally {
        console.log(false);
      }
    };

    carregarTecnicos();
  }, [selectedCronometro?.numero_or]);

  useEffect(() => {
    const fetchCronometros = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/cronometros`);
        setCronometros(response.data);
      } catch (err) {
        console.error('Erro ao buscar cronômetros:', err);
        setError('Erro ao carregar dados dos cronômetros');
      } finally {
        setLoading(false);
      }
    };

    fetchCronometros();
  }, []);




  const mostrarOuNao = (valor) => {
    return valor ? valor : "Sem informação";
  };

  // Função para abrir a modal com os detalhes do cronômetro
  const handleOpenModal = async (cronometro) => {
    setSelectedCronometro(cronometro);
    setShowModal(true);
    setModalLoading(true);
    setModalError(null);

    try {
      // Buscar detalhes adicionais se necessário
      const response = await axios.get(`${API_URL}/cronometros/${cronometro.id}`);
      setSelectedCronometro(response.data);
    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      setModalError('Erro ao carregar detalhes do cronômetro');
    } finally {
      setModalLoading(false);
    }
  };

  // Filtrar cronômetros com base no termo de busca
  const filteredCronometros = cronometros.filter(cronometro => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cronometro.numero_or.toLowerCase().includes(searchLower) ||
      cronometro.tecnico.nome.toLowerCase().includes(searchLower) ||
      cronometro.estado.toLowerCase().includes(searchLower) ||
      cronometro.acao.toLowerCase().includes(searchLower)
    );
  });


  useEffect(() => {
    axios.get(`${API_URL}/funcionarios/${7}`)
      .then(response => {
        setFuncionario(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar funcionário:', error);
      });
  }, []);

  if (!funcionario) {
    return <div>Carregando dados do funcionário...</div>;
  }



  // Paginação
  const totalPages = Math.ceil(filteredCronometros.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCronometros.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para formatar o tempo
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Função para calcular o progresso
  const calculateProgress = (segundosAtual, segundoFinal) => {
    return Math.min(Math.round((segundosAtual / segundoFinal) * 100), 100);
  };

  if (loading) {
    return (
      <div className="funcionarios-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
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

  const renderPagination = () => {
    //const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="pagination-container   paginaLimt">
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

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
              </li>
              {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}

          {[...Array(endPage - startPage + 1)].map((_, index) => (
            <li key={startPage + index} className={`page-item ${currentPage === startPage + index ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(startPage + index)}
              >
                {startPage + index}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}

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
    );
  };

  return (
    <div className="funcionarios-page container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="text-white mb-4">Lista de Cronômetros</h3>
          <div className="search-box">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control text-black"
                placeholder="Buscar por OR, técnico ou estado..."
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
              <th>Nº OR</th>

              <th>Tempo Atual</th>
              <th>Tempo Final</th>
              <th>Progresso</th>
              <th>Estado</th>
              <th>Ação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((cronometro) => (
              <tr key={cronometro.id}>
                <td>
                  <span className="employee-number">
                    {cronometro.numero_or}
                  </span>
                </td>


                <td>
                  <div className="employee-info">
                    <FaClock className="me-2" />
                    <span>{formatTime(cronometro.segundos_atual)}</span>
                  </div>
                </td>
                <td>
                  <div className="employee-info">
                    <FaClock className="me-2" />
                    <span>{formatTime(cronometro.segundo_final)}</span>
                  </div>
                </td>
                <td>
                  <div className="progress">
                    <div
                      className={`progress-bar ${cronometro.tempo_esgotado ? 'bg-danger' : 'bg-success'}`}
                      role="progressbar"
                      style={{ width: `${calculateProgress(cronometro.segundos_atual, cronometro.segundo_final)}%` }}
                      aria-valuenow={calculateProgress(cronometro.segundos_atual, cronometro.segundo_final)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {calculateProgress(cronometro.segundos_atual, cronometro.segundo_final)}%
                    </div>
                  </div>
                </td>
                <td>
                  <div className="employee-info">
                    <span>{cronometro.estado}</span>
                  </div>
                </td>
                <td>
                  <div className="employee-info">
                    <span>{cronometro.acao}</span>
                  </div>
                </td>
                <td>
                  <div className="status-indicator">
                    {cronometro.rodando ? (
                      <FaPlay className="status-icon text-success" />
                    ) : (
                      <FaPause className="status-icon text-warning" />
                    )}
                    {cronometro.tempo_esgotado && (
                      <FaExclamationTriangle className="status-icon text-danger" />
                    )}
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => handleOpenModal(cronometro)}
                    >
                      <FaEye className="me-2" /> Visualizar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && renderPagination()}


      {/* Modal Fullscreen */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        fullscreen
        className="modal-white"
      >
        {/* Cabeçalho */}
        <Modal.Header closeButton className="bg-white border-bottom">
          <Modal.Title className="text-dark">
            Detalhes do Cronômetro: {mostrarOuNao(selectedCronometro?.numero_or)}
          </Modal.Title>
        </Modal.Header>

        {/* Corpo da Modal */}
        <Modal.Body className="bg-white text-dark">
          {modalLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Carregando detalhes...</p>
            </div>
          ) : modalError ? (
            <div className="alert alert-danger">{modalError}</div>
          ) : selectedCronometro ? (
            <div className="container-fluid mt-3">




              <div className="row">
                {/* Detalhes do Cronômetro */}


                {/* Ordem de Reparação */}
                {selectedCronometro.ordem_reparacao && (
                  <div className="mb-4 col-lg-6">
                    <h4 className="bg-dark text-white px-3 py-2 rounded">
                      <FaTools className="me-2" /> Ordem de Reparação
                    </h4>
                    <div className="card bg-light text-dark shadow-sm mt-2 border">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4">
                            <p><strong>Nº Trabalho:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.numero_trabalho)}</p>
                            <p><strong>Categoria:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.categoria_reparo)}</p>
                            <p><strong>KM Entrada:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.km_entrada)}</p>
                          </div>
                          <div className="col-md-4">
                            <p><strong>Valor Reparo:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.cobrar_reparo)} Kz</p>
                            <p><strong>Status:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.status)}</p>
                            <p><strong>Garantia:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.garantia_dias)} dias</p>
                          </div>
                          <div className="col-md-4">
                            <p><strong>Data Entrada:</strong> {mostrarOuNao(new Date(selectedCronometro.ordem_reparacao.data_inicial_entrada).toLocaleString())}</p>
                            <p><strong>Data Saída:</strong> {mostrarOuNao(new Date(selectedCronometro.ordem_reparacao.data_final_saida).toLocaleString())}</p>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-12">
                            <p><strong>Defeito/Serviço:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.defeito_ou_servico)}</p>
                            <p><strong>Detalhes:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.detalhes)}</p>
                            <p><strong>Observações:</strong> {mostrarOuNao(selectedCronometro.ordem_reparacao.observacoes)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-4 col-lg-6">
                  <h4 className="bg-dark text-white px-3 py-2 rounded">
                    <BiTimer className="me-2" /> Detalhes do Cronômetro
                  </h4>
                  <div className="card  bg-light text-dark shadow-sm mt-2 border">
                    <div className="card-body">
                      <p><strong>Nº OR:</strong> {mostrarOuNao(selectedCronometro.numero_or)}</p>
                      <p><strong>Tempo Atual:</strong> {selectedCronometro.segundos_atual !== null ? formatTime(selectedCronometro.segundos_atual) : "Sem informação"}</p>
                      <p><strong>Tempo Final:</strong> {selectedCronometro.segundo_final !== null ? formatTime(selectedCronometro.segundo_final) : "Sem informação"}</p>

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
                          <span className="text-success"><FaPlay className="me-1" /> Em execução</span>
                        ) : (
                          <span className="text-warning"><FaPause className="me-1" /> Pausado</span>
                        )}
                        {selectedCronometro.tempo_esgotado && (
                          <span className="text-danger ms-3"><FaExclamationTriangle className="me-1" /> Tempo esgotado</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>


              </div>
              <div className="row">
                
                {/* Técnicos da Ordem */}
                <div className="mb-4  col-lg-12">
                  <h4 className="text-white bg-black px-3 py-2 rounded ">👨‍🔧 Técnicos da Ordem</h4>
                  {tecnicos.length === 0 ? (
                    <p>Nenhum técnico encontrado para esta ordem.</p>
                  ) : (
                    <>

                      <div className="row">
                        {tecnicos.map((tecnico) => (
                          <div key={tecnico.id} className="col-lg-4 col-md-6 mb-4">
                            <div className="card h-100 shadow bg-light mt-2 p-3 rounded">
                              <div className="card-body">
                                <h5 className="card-title text-black">
                                  {tecnico.nome} {tecnico.sobrenome} — {tecnico.cargo}
                                </h5>
                                <p className="mb-1">
                                  <strong>Nº Funcionário:</strong> <span className='bg-dark fw-bold  rounded text-white px-2'>{tecnico.numero_funcionario}</span>
                                </p>
                                <p className="mb-1">
                                  <strong>Email:</strong> {tecnico.email}
                                </p>
                                <p className="mb-1">
                                  <strong>BI:</strong> {tecnico.bilheteIdentidade}
                                </p>

                                <p className="mb-0">
                                  <strong>Gênero:</strong> {tecnico.genero}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>


                    </>
                  )}
                </div>
              </div>

            </div>


          ) : (
            <p>Nenhum dado encontrado.</p>
          )}
        </Modal.Body>

        {/* Rodapé */}
        <Modal.Footer className="d-flex justify-content-between bg-white border-top">
          <div></div>
          <img src={logotipoAzul} width={200} alt="Logotipo" />
          <button className="btn links-acessos  px-3">
            Editar <FiEdit className="ms-2" />
          </button>
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
