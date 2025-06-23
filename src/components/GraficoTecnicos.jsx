import { useEffect, useState } from 'react';
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
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const GraficoFuncionarios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#1bb394', '#23c6c8', '#f8ac59', '#ed5565', '#1c84c6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/total-segundos-por-tecnico`);

        const processedData = response.data.map((item) => {
          const horas = parseFloat(item.total_segundos) / 3600;
          return {
            nome: item.nome || 'Sem nome',
            produtividade: horas > 0 ? 1 / horas : 0
          };
        });

        setData(processedData);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="chart-container loading mx-auto pt-5">
        <p className='text-center'> <FaSpinner className="spinner" />Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container error">
        <p>{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-container empty">
        <p>Nenhum dado disponível para exibição</p>
      </div>
    );
  }

  return (
    <div className="chart-container my-4">
      <h5 className="chart-title text-center">Produtividade dos Técnicos</h5>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
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
          <YAxis
            stroke="#1bb394"
            tick={{ fill: '#fff' }}
          />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            contentStyle={{
              backgroundColor: '#343a40',
              border: '1px solid #1bb394',
              color: '#fff'
            }}
          />
          <Bar
            dataKey="produtividade"
            name="Produtividade"
            fill="#1bb394"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoFuncionarios;
