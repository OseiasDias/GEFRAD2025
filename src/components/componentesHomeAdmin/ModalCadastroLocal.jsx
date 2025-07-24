import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { MdLocationOn, MdGpsFixed, MdGpsNotFixed } from 'react-icons/md';
import { FaRulerCombined, FaUsers, FaGift } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

export default function FormCadastroLocal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    latitude: '',
    longitude: '',
    raio: '',
    capacidade: '',
    bonusEntrega: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    const raio = parseFloat(formData.raio);
    const capacidade = parseInt(formData.capacidade);
    const bonusEntrega = parseFloat(formData.bonusEntrega);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(raio)) {
      toast.warn("⚠️ Preencha Latitude, Longitude e Raio corretamente!");
      return;
    }

    const localData = {
      nome: formData.nome,
      latitude,
      longitude,
      raio,
      capacidade: isNaN(capacidade) ? 0 : capacidade,
      bonusEntrega: isNaN(bonusEntrega) ? 0 : bonusEntrega,
      idsWifi: [],
    };

    try {
      await axios.post(`${API_URL}/locais/RegistarLocal`, localData);
      toast.success("✅ Local cadastrado com sucesso!");

      // Limpa o formulário
      setFormData({
        nome: '',
        latitude: '',
        longitude: '',
        raio: '',
        capacidade: '',
        bonusEntrega: '',
      });

      // Chama callbacks do modal
      if (onClose) onClose();
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao cadastrar local. Verifique os campos ou tente novamente.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col lg={6} className="mb-3">
          <Form.Label>Nome</Form.Label>
          <InputGroup>
            <InputGroup.Text><MdLocationOn /></InputGroup.Text>
            <Form.Control
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Escritório Central"
              required
            />
          </InputGroup>
        </Col>

        <Col lg={6} className="mb-3">
          <Form.Label>Latitude</Form.Label>
          <InputGroup>
            <InputGroup.Text><MdGpsFixed /></InputGroup.Text>
            <Form.Control
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Ex: -23.55052"
              required
            />
          </InputGroup>
        </Col>

        <Col lg={6} className="mb-3">
          <Form.Label>Longitude</Form.Label>
          <InputGroup>
            <InputGroup.Text><MdGpsNotFixed /></InputGroup.Text>
            <Form.Control
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Ex: -46.633308"
              required
            />
          </InputGroup>
        </Col>

        <Col lg={6} className="mb-3">
          <Form.Label>Raio (metros)</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaRulerCombined /></InputGroup.Text>
            <Form.Control
              type="number"
              step="any"
              name="raio"
              value={formData.raio}
              onChange={handleChange}
              placeholder="Ex: 200"
              required
            />
          </InputGroup>
        </Col>

        <Col lg={6} className="mb-3">
          <Form.Label>Capacidade</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaUsers /></InputGroup.Text>
            <Form.Control
              type="number"
              name="capacidade"
              value={formData.capacidade}
              onChange={handleChange}
              placeholder="Ex: 50"
            />
          </InputGroup>
        </Col>

        <Col lg={6} className="mb-3">
          <Form.Label>Bônus Entrega</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaGift /></InputGroup.Text>
            <Form.Control
              type="number"
              step="any"
              name="bonusEntrega"
              value={formData.bonusEntrega}
              onChange={handleChange}
              placeholder="Ex: 10"
            />
          </InputGroup>
        </Col>
      </Row>

      <div className="text-end">
        <Button type="submit" variant="outline-primary" className='mx-auto d-block px-5'>
          Cadastrar
        </Button>
      </div>
    </Form>
  );
}
