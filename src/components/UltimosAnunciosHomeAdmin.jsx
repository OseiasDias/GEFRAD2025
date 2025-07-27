import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spinner, Table } from "react-bootstrap";
import { FaBullhorn } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

export default function UltimosAnunciosTabela() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const response = await axios.get(`${API_URL}/anuncios/ListarAnuncios`);
        const anunciosOrdenados = response.data.sort((a, b) => b.id - a.id);
        setAnuncios(anunciosOrdenados.slice(0, 5)); // mostrar os 5 mais recentes
      } catch (error) {
        console.error("Erro ao buscar anúncios recentes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnuncios();
  }, []);

  return (
    <Card className="mt-4 bg-dark text-white shadow-sm rounded-4">
      <Card.Header className="bg-secondary text-white fw-bold">
        Últimos Anúncios Publicados
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" variant="light" />
          </div>
        ) : anuncios.length === 0 ? (
          <p className="text-muted text-center">Nenhum anúncio disponível</p>
        ) : (
          <Table striped bordered hover variant="dark" responsive size="sm">
            <thead>
              <tr>
                <th><FaBullhorn className="me-1" />Mensagem</th>
                <th><MdLocationOn className="me-1" />Local</th>
              </tr>
            </thead>
            <tbody>
              {anuncios.map((anuncio) => (
                <tr key={anuncio.id}>
                  <td>{anuncio.mensagem?.slice(0, 50)}{anuncio.mensagem?.length > 50 ? '...' : ''}</td>
                  <td>{anuncio.nomeLocal || "Desconhecido"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
