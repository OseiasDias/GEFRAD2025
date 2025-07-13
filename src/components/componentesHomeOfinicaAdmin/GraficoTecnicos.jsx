import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FaSpinner } from 'react-icons/fa';

// 🔥 IMPORTA O TOASTIFY
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:8080/api';

const COLORS = ['#1bb394', '#23c6c8', '#f8ac59', '#ed5565', '#1c84c6'];

const GraficoFuncionarios = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalUtilizadores, setTotalUtilizadores] = useState(0);
  const [totalAnuncios, setTotalAnuncios] = useState(0);
  const [totalEntregas, setTotalEntregas] = useState(0);

  // ✅ BUSCAR TOTAL UTILIZADORES
  useEffect(() => {
    axios.get(`${API_URL}/utilizadores/total`)
      .then(response => {
        console.log('[DEBUG] Utilizadores:', response.data);
        setTotalUtilizadores(response.data.total || response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar total de utilizadores:', error);
        toast.warn('Falha ao carregar Utilizadores');
      });
  }, []);

  // ✅ BUSCAR TOTAL ANÚNCIOS
  useEffect(() => {
    axios.get(`${API_URL}/anuncios/total`)
      .then(response => {
        console.log('[DEBUG] Anúncios:', response.data);
        setTotalAnuncios(response.data.total || response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar total de anúncios:', error);
        toast.warn('Falha ao carregar Anúncios');
      });
  }, []);

  // ✅ BUSCAR TOTAL ENTREGAS
  useEffect(() => {
    axios.get(`${API_URL}/entregas/total`)
      .then(response => {
        console.log('[DEBUG] Entregas:', response.data);
        setTotalEntregas(response.data.total || response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar total de entregas:', error);
       // toast.warn('Falha ao carregar Entregas');
      });
  }, []);

  useEffect(() => {
    const data = [
      { nome: 'Utilizadores', produtividade: totalUtilizadores },
      { nome: 'Anúncios', produtividade: totalAnuncios },
      { nome: 'Entregas', produtividade: totalEntregas }
    ];
    console.log('[DEBUG] Data final do gráfico:', data);
    setDados(data);
    setLoading(false);
  }, [totalUtilizadores, totalAnuncios, totalEntregas]);

  return (
    <div className="chart-container my-4">
      <h5 className="chart-title text-center">Estatísticas de Utilização</h5>

      {/* ✅ Container do Toast */}
      <ToastContainer position="top-right" autoClose={3000} />

      {loading && (
        <div className="text-center">
          <FaSpinner className="spinner-border spinner-border-sm" spin="true" /> Carregando...
        </div>
      )}

      {!loading && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={dados}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2f3943" />
            <XAxis
              dataKey="nome"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: '#fff' }}
            />
            <YAxis stroke="#1bb394" tick={{ fill: '#fff' }} />
            <Tooltip
              formatter={(value) => Number(value).toFixed(2)}
              contentStyle={{
                backgroundColor: '#343a40',
                border: '1px solid #1bb394',
                color: '#fff'
              }}
            />
            <Bar
              dataKey="produtividade"
              name="Total"
              fill="#1bb394"
              radius={[4, 4, 0, 0]}
            >
              {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficoFuncionarios;
