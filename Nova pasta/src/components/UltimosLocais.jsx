import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Spinner } from "react-bootstrap";
import { MdLocationOn } from "react-icons/md";
import { FaUser, FaWifi } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function UltimosLocais() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const response = await axios.get(`${API_URL}/locais/ListarLocais`);
        const locaisOrdenados = response.data.sort((a, b) => b.id - a.id);
        setLocais(locaisOrdenados.slice(0, 5)); // Apenas os 5 mais recentes
      } catch (error) {
        console.error("Erro ao buscar locais recentes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocais();
  }, []);

  return (
    <Card className="mt-4 bg-dark text-white shadow-sm rounded-4">
      <Card.Header className="bg-secondary text-white fw-bold">
        Últimos Locais Criados
      </Card.Header>
      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" variant="light" />
        </div>
      ) : locais.length === 0 ? (
        <div className="text-center my-3 text-muted">Nenhum local encontrado</div>
      ) : (
        <Table responsive bordered hover variant="dark" className="mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th><MdLocationOn className="me-1" /> Nome</th>
              <th><FaUser className="me-1" /> Criador</th>
              <th><FaWifi className="me-1" /> WiFi</th>
            </tr>
          </thead>
          <tbody>
            {locais.map((local) => (
              <tr key={local.id}>
                <td>LC00{local.id}</td>
                <td>{local.nome}</td>
                <td>{local.criador || 'Desconhecido'}</td>
                <td>
                  {local.idsWifi?.length > 0
                    ? `${local.idsWifi[0]}${local.idsWifi.length > 1 ? ` +${local.idsWifi.length - 1}` : ''}`
                    : 'Sem WiFi'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
