// components/componentesHomeAdmin/UltimosUtilizadores.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

export default function UltimosUtilizadores() {
  const [ultimos, setUltimos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUltimos = async () => {
      try {
        const res = await axios.get(`${API_URL}/utilizadores`);
        const ordenados = res.data.sort((a, b) => b.id - a.id);
        const apenasClientes = ordenados.filter(u => u.tipo === "CLIENTE");
        setUltimos(apenasClientes.slice(0, 5));
      } catch (err) {
        console.error("Erro ao buscar últimos utilizadores:", err);
      } finally {
        setLoading(false);
      }
    };

    buscarUltimos();
  }, []);

  return (
    <Card className="mt-4 bg-dark text-white shadow-sm rounded-4">
      <Card.Header className="bg-secondary text-white fw-bold">
        Últimos Utilizadores Registados
      </Card.Header>
      <ListGroup variant="flush">
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" variant="light" />
          </div>
        ) : ultimos.length === 0 ? (
          <ListGroup.Item className="bg-dark text-muted text-center">
            Nenhum utilizador encontrado
          </ListGroup.Item>
        ) : (
          ultimos.map((u) => (
            <ListGroup.Item key={u.id} className="bg-dark text-white d-flex justify-content-between align-items-center">
              <div>
                <FaUser className="me-2 text-info" />
                {u.nomeUsuario}
              </div>
              <small className="text-light">
                <FaEnvelope className="me-1" />
                {u.email}
              </small>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Card>
  );
}
