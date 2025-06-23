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
//import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const GraficoFuncionarios = () => {

  const COLORS = ['#1bb394', '#23c6c8', '#f8ac59', '#ed5565', '#1c84c6'];




  return (
    <div className="chart-container my-4">
      <h5 className="chart-title text-center">Produtividade dos Técnicos</h5>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          //data={data}
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
            {/*data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))*/}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoFuncionarios;
