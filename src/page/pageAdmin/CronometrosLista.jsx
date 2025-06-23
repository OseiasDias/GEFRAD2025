import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaUser, FaTools, FaPlay, FaPause, FaExclamationTriangle, FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSearch } from 'react-icons/fa';
import '../../../css/StylesFuncionario/homeOficinaAdmin.css';

const API_URL = import.meta.env.VITE_API_URL;

function CronometrosLista() {
  const [cronometros, setCronometros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
              <th>Técnico</th>
              <th>Informações do Técnico</th>
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
                    <FaUser className="me-2" />
                    <span>{cronometro.tecnico.nome} {cronometro.tecnico.sobrenome}</span>
                  </div>
                </td>
                <td>
                  <div className="employee-details">
                    <div className="mb-1">
                      <FaBriefcase className="me-2" />
                      <span>{cronometro.tecnico.cargo}</span>
                    </div>
                    <div className="mb-1">
                      <FaMapMarkerAlt className="me-2" />
                      <span>{cronometro.tecnico.filial}</span>
                    </div>
                    <div className="mb-1">
                      <FaPhone className="me-2" />
                      <span>{cronometro.tecnico.celular}</span>
                    </div>
                    <div>
                      <FaEnvelope className="me-2" />
                      <span className="employee-email">{cronometro.tecnico.email}</span>
                    </div>
                  </div>
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
                    <FaTools className="me-2" />
                    <span>{cronometro.estado}</span>
                  </div>
                </td>
                <td>
                  <div className="employee-info">
                    <span>{cronometro.acao}</span>
                  </div>
                </td>
                <td>
                  <div className="employee-info">
                    {cronometro.rodando ? (
                      <FaPlay className="text-success" />
                    ) : (
                      <FaPause className="text-warning" />
                    )}
                    {cronometro.tempo_esgotado && (
                      <FaExclamationTriangle className="text-danger ms-2" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container paginaLimt">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </li>
          </ul>
          <div className="pagination-info">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCronometros.length)} de {filteredCronometros.length} cronômetros
          </div>
        </div>
      )}
    </div>
  );
}

export default CronometrosLista; 