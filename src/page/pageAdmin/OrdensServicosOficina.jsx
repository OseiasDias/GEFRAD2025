import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEdit, FaTrash, FaEye, FaEllipsisV, FaTools, FaCalendarAlt, FaMoneyBillWave, FaExclamationTriangle, FaCheckCircle, FaClock, FaExclamationCircle, FaBullhorn, FaMapMarkerAlt } from 'react-icons/fa';
import { Dropdown, Modal } from 'react-bootstrap';
import '../../css/StylesFuncionario/homeOficinaAdmin.css';
import logotipo from "../../assets/logotipo.png";

import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaBars,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { MdTimer } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";
import { FiEdit } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCompass } from 'react-icons/bi';

const API_URL = import.meta.env.VITE_API_URL;

function OrdensServicosLista() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [ordemParaDeletar, setOrdemParaDeletar] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);



  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/ordens-de-reparo`);
        // Garante que sempre teremos um array, mesmo que vazio
        setOrdens(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Erro ao buscar ordens de serviço:', err);
        setError('Erro ao carregar dados das ordens de serviço');
        setOrdens([]); // Define como array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, []);

  // Função segura para formatar valores monetários
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "Sem valor";
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleConfirmDelete = (ordem) => {
    setOrdemParaDeletar(ordem);
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!ordemParaDeletar?.id) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/ordens-de-reparo/${ordemParaDeletar.id}`);
      setOrdens(prev => prev.filter(o => o.id !== ordemParaDeletar.id));
      toast.success("Ordem removida com sucesso!");
    } catch (err) {
      console.error('Erro ao excluir ordem:', err);
      toast.error("Erro ao excluir ordem. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
      setOrdemParaDeletar(null);
    }
  };




  // Filtrar ordens com base no termo de busca de forma segura
  const filteredOrdens = ordens.filter(ordem => {
    if (!ordem) return false; // Proteção contra itens nulos

    const searchLower = searchTerm.toLowerCase();
    return (
      (ordem.numero_trabalho?.toLowerCase() || '').includes(searchLower) ||
      (ordem.categoria_reparo?.toLowerCase() || '').includes(searchLower) ||
      (ordem.filial?.toLowerCase() || '').includes(searchLower) ||
      (ordem.status?.toLowerCase() || '').includes(searchLower)
    );
  });

  const handleVisualizar = async (ordem) => {
    setOrdemSelecionada(ordem);
    setShowModal(true);

    try {
      const [clienteRes, veiculoRes] = await Promise.all([
        axios.get(`${API_URL}/clientes/${ordem.cliente_id}`),
        axios.get(`${API_URL}/veiculos/${ordem.veiculo_id}`)
      ]);

      setClienteSelecionado(clienteRes.data);
      setVeiculoSelecionado(veiculoRes.data);
    } catch (error) {
      console.error("Erro ao buscar cliente/veículo:", error);
      setClienteSelecionado(null);
      setVeiculoSelecionado(null);
    }
  };


  // Paginação com proteção contra arrays vazios
  const totalPages = Math.max(1, Math.ceil(filteredOrdens.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrdens.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para formatar data com validação
  const formatDate = (dateString) => {
    if (!dateString) return "Sem data";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  if (loading) {
    return (
      <div className="funcionarios-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Carregando dados das ordens de serviço...</div>
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
    if (filteredOrdens.length <= itemsPerPage) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="pagination-container paginaLimt">
        <div className="pagination-info">
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrdens.length)} de {filteredOrdens.length} ordens
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

          {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
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

  const mostrarOuNao = (valor) => {
    return valor !== null && valor !== undefined ? valor : "Sem informação";
  };

  return (
    <>
      <ToastContainer
        position="top-center"

      />


      <div className="funcionarios-page container-fluid p-4">

        <div className="row mb-4">
          <div className="col-12">
            <h3 className="text-white mb-4">Ordens de Serviço</h3>
            <div className="search-box">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control text-black"
                  placeholder="Buscar por OR, categoria, filial ou status..."
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
                <th>Data Entrada</th>
                <th>Data Saída</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Horas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((ordem) => (
                  <tr key={ordem?.id || Math.random()}>
                    <td>
                      <span className="employee-number">
                        {mostrarOuNao(ordem?.numero_trabalho)}
                      </span>
                    </td>
                    <td>
                      <div className="employee-info">
                        <FaCalendarAlt className="me-2" />
                        <span>{formatDate(ordem?.data_inicial_entrada)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="employee-info">
                        <FaCalendarAlt className="me-2" />
                        <span>{formatDate(ordem?.data_final_saida)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="employee-info">
                        <FaMoneyBillWave className="me-2" />
                        <span>{ordem?.cobrar_reparo} Kz</span>
                      </div>
                    </td>
                    <td>
                      <div className="employee-info">
                        {ordem?.status === 'em andamento' ? (
                          <FaClock className="me-2 text-warning" />
                        ) : ordem?.status === 'concluido' ? (
                          <FaCheckCircle className="me-2 text-success" />
                        ) : (
                          <FaExclamationTriangle className="me-2 text-danger" />
                        )}
                        <span>{mostrarOuNao(ordem?.status)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="employee-info">
                        <span>{mostrarOuNao(ordem?.horas_reparacao)} horas</span>
                      </div>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="action-dropdown">
                          <FaEllipsisV />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-dark">
                          <Dropdown.Item onClick={() => handleVisualizar(ordem)}>
                            <FaEye className="me-2" /> Visualizar
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-2" className='d-none'>
                            <FaEdit className="me-2" /> Editar
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleConfirmDelete(ordem)} className="text-danger">
                            <FaTrash className="me-2" /> Remover
                          </Dropdown.Item>

                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Nenhuma ordem de serviço encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}

        {/* Modal Fullscreen */}
        <Modal show={showModal} onHide={() => setShowModal(false)} fullscreen className="modal-white">
          <Modal.Header closeButton className="bg-white border-bottom">
            <Modal.Title className="text-dark">Detalhes da Ordem de Reparação</Modal.Title>
          </Modal.Header>

          <Modal.Body className="bg-white text-dark">
            {ordemSelecionada ? (
              <div className="container-fluid mt-3">
                <div className="row">
                  {/* COLUNA 1 */}
                  <div className="col-lg-6">
                    <h4 className="bg-black text-white px-3 py-2">📄 Informações Gerais</h4>
                    <div className="card bg-white text-dark shadow-sm mb-4 border">
                      <div className="card-body">
                        <p><strong>Número do Trabalho:</strong> {mostrarOuNao(ordemSelecionada.numero_trabalho)}</p>
                        <p><strong>Status:</strong> {mostrarOuNao(ordemSelecionada.status)}</p>
                        <p><strong>Filial:</strong> {mostrarOuNao(ordemSelecionada.filial)}</p>
                        <p><strong>Categoria de Reparo:</strong> {mostrarOuNao(ordemSelecionada.categoria_reparo)}</p>
                        <p className='alinharTexto'><strong>Detalhes:</strong> {mostrarOuNao(ordemSelecionada.detalhes)}</p>
                        <p><strong>Defeito ou Serviço:</strong> {mostrarOuNao(ordemSelecionada.defeito_ou_servico)}</p>
                        <p><strong>Observações:</strong> {mostrarOuNao(ordemSelecionada.observacoes)}</p>
                        <p><strong>Laudo Técnico:</strong> {mostrarOuNao(ordemSelecionada.laudo_tecnico)}</p>
                      </div>
                    </div>

                    <h4 className="bg-black text-white px-3 py-2">💰 Cobranças</h4>
                    <div className="card bg-white text-dark shadow-sm mb-4 border">
                      <div className="card-body">
                        <p><strong>Valor de Reparo:</strong> {ordemSelecionada.cobrar_reparo} Kz</p>
                        <p><strong>Lavagem:</strong> {ordemSelecionada.lavagem ? 'Sim' : 'Não'} — {formatCurrency(ordemSelecionada.cobrar_lavagem)}</p>
                        <p><strong>Teste de Motor:</strong> {ordemSelecionada.status_test_mot ? 'Sim' : 'Não'} — {formatCurrency(ordemSelecionada.cobrar_test_mot)}</p>
                      </div>
                    </div>
                  </div>

                  {/* COLUNA 2 */}
                  <div className="col-lg-6">


                    <h4 className="bg-black text-white px-3 py-2">👤 Cliente</h4>
                    <div className="card bg-white text-dark shadow-sm mb-4 border">
                      <div className="card-body">
                        <p><strong>Nome:</strong> {clienteSelecionado ? `${clienteSelecionado.primeiro_nome} ${clienteSelecionado.sobrenome}` : 'Sem informação'}</p>
                        <p><strong>Email:</strong> {mostrarOuNao(clienteSelecionado?.email)}</p>
                        <p><strong>Telefone:</strong> {mostrarOuNao(clienteSelecionado?.celular)}</p>
                        <p><strong>Empresa:</strong> {mostrarOuNao(clienteSelecionado?.nome_empresa)}</p>
                        <p><strong>Endereço:</strong> {mostrarOuNao(clienteSelecionado?.endereco)}</p>
                      </div>
                    </div>

                    <h4 className="bg-black text-white px-3 py-2">🚗 Veículo</h4>
                    <div className="card bg-white text-dark shadow-sm mb-4 border">
                      <div className="card-body">
                        <p><strong>Marca:</strong> {mostrarOuNao(veiculoSelecionado?.marca_veiculo)}</p>
                        <p><strong>Modelo:</strong> {mostrarOuNao(veiculoSelecionado?.modelo_veiculo)}</p>
                        <p><strong>Placa:</strong> {mostrarOuNao(veiculoSelecionado?.numero_placa)}</p>
                        <p><strong>Cor:</strong> {mostrarOuNao(veiculoSelecionado?.cor)}</p>
                        <p><strong>Combustível:</strong> {mostrarOuNao(veiculoSelecionado?.combustivel)}</p>
                        <p><strong>Caixa de Velocidade:</strong> {mostrarOuNao(veiculoSelecionado?.caixa_velocidade)}</p>
                        <p><strong>Leitura do Odômetro:</strong> {mostrarOuNao(veiculoSelecionado?.leitura_odometro)} km</p>
                      </div>
                    </div>

                    <h4 className="bg-black text-white px-3 py-2">📆 Datas</h4>
                    <div className="card bg-white text-dark shadow-sm mb-4 border">
                      <div className="card-body">
                        <p><strong>Entrada:</strong> {formatDate(ordemSelecionada.data_inicial_entrada)}</p>
                        <p><strong>Saída:</strong> {formatDate(ordemSelecionada.data_final_saida)}</p>
                        <p><strong>Criado em:</strong> {formatDate(ordemSelecionada.created_at)}</p>
                        <p><strong>Atualizado em:</strong> {formatDate(ordemSelecionada.updated_at)}</p>
                      </div>
                    </div>

                    <h4 className="bg-black text-white px-3 py-2">⏱️ Tempo e Garantia</h4>
                    <div className="card bg-white text-dark shadow-sm border">
                      <div className="card-body">
                        <p><strong>Horas de Reparação:</strong> {mostrarOuNao(ordemSelecionada.horas_reparacao)} h</p>
                        <p><strong>Garantia:</strong> {mostrarOuNao(ordemSelecionada.garantia_dias ? `${ordemSelecionada.garantia_dias} dias` : 'Sem garantia')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Nenhum dado encontrado.</p>
            )}
          </Modal.Body>

          <Modal.Footer className='py-2 px-4 d-flex justify-content-between align-items-center bg-white border-top'>
            <div></div>
            <img src={logotipo} width={200} alt="Logo" className='my-0' />
            <button className='links-acessos btn px-3 d-flex align-items-center gap-1'>
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
              <FaExclamationCircle className="text-danger me-3" size={24} />
              <div>
                <p className="mb-1">Tem certeza de que deseja remover a ordem de reparo nº <strong>{ordemParaDeletar?.numero_trabalho}</strong>?
                </p>
                <small className="text-muted">Esta ação não pode ser desfeita.</small>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-outline-secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
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

      </div></>
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
            <OrdensServicosLista />
          </div>
        </main>
      </div>
      <Copyright />
    </>
  );
}

export default FuncionariosOficina;
