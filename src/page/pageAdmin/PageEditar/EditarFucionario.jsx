import { useState, useEffect } from 'react';

import '../../../../css/StylesFuncionario/homeOficinaAdmin.css';

import logotipo from "../../../../assets/logo- turbo fundo branco.png";
import {
  FaHome,
  FaUsers,
  FaTools,
  FaChartBar,
  FaBars,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { BiTimer } from 'react-icons/bi';
import { MdTimer } from 'react-icons/md';
import { CiLogout } from "react-icons/ci";
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

import {
  FaGlobe, FaMapMarkerAlt, FaMapPin, FaCamera,
  FaEnvelope, FaUser, FaCalendarAlt, FaVenusMars, FaMobileAlt, FaPhone, FaBuilding, FaSuitcase,
  FaRegCalendarAlt, FaUniversity, FaIdCard, FaCreditCard, FaArrowLeft, FaSave
} from "react-icons/fa";
import { InputGroup, Modal, Alert } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


//const API_URL = import.meta.env.VITE_API_URL;

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





// eslint-disable-next-line no-unused-vars
const API_URL = import.meta.env.VITE_API_URL;

const EditarTecnico = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados do componente
  const [formData, setFormData] = useState({
    numero_funcionario: "FN003",
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    email: '',
    bilheteIdentidade: '',
    nomeBanco: '',
    iban: '',
    foto: 'foto2.jpg',
    genero: 'masculino',
    celular: '',
    telefoneFixo: '',
    filial: '',
    cargo: '',
    dataAdmissao: '',
    pais: '',
    estado: '',
    cidade: '',
    endereco: '',
    bloqueado: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [novoCargo, setNovoCargo] = useState('');
  const [cargos, setCargos] = useState([
    'Mecânico',
    'Assistente de Mecânica',
    'Supervisor de Oficina',
    'Gerente de Oficina',
    'Atendente',
    'Técnico de Diagnóstico',
    'Chefe de Oficina',
    'Líder de Equipe',
    'Estagiário de Mecânica',
    'Analista'
  ]);
  const [errors, setErrors] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);

  // Adicione esta função para garantir que todos os campos obrigatórios tenham valores
useEffect(() => {
  const carregarFuncionario = async () => {
    try {
      const response = await axios.get(`https://biturbo.biturbomotors.com/biturboApi2/public/api/funcionarios/${id}`);
      let dados = response.data;
      
      // Corrige possíveis valores nulos
      dados = {
        ...dados,
        filial: dados.filial?.toString() || '',
        bloqueado: Boolean(dados.bloqueado),
        fotoFile: null // Limpa qualquer arquivo pré-existente
      };
      
      setFormData(dados);
    } catch (error) {
      toast.error('Erro ao carregar dados do funcionário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  carregarFuncionario();
}, [id]);

  // Carrega os dados do funcionário
  useEffect(() => {
    const carregarFuncionario = async () => {
      try {
        const response = await axios.get(`https://biturbo.biturbomotors.com/biturboApi2/public/api/funcionarios/${id}`);
        setFormData(response.data); // Já vem no formato correto da API
      } catch (error) {
        toast.error('Erro ao carregar dados do funcionário');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarFuncionario();
  }, [id]);

  // Manipuladores de eventos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manipulador de arquivo de foto


  const handleAdicionarCargo = () => {
    if (novoCargo.trim()) {
      setCargos([...cargos, novoCargo.trim()]);
      setFormData(prev => ({ ...prev, cargo: novoCargo.trim() }));
      setNovoCargo('');
      setMostrarModal(false);
      toast.success('Novo cargo adicionado com sucesso!');
    }
  };

  // Validação do formulário
 const validarFormulario = () => {
    const newErrors = {};
    const hoje = new Date().toISOString().split("T")[0];

    // Validações de dados pessoais
    if (!formData.nome) newErrors.nome = "Nome é obrigatório.";
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.nome)) newErrors.nome = "Nome inválido.";
    if (!formData.sobrenome) newErrors.sobrenome = "Sobrenome é obrigatório.";
    if (formData.dataNascimento && formData.dataNascimento > hoje) newErrors.dataNascimento = "Data de nascimento inválida.";
    if (!formData.email) newErrors.email = "E-mail é obrigatório.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "E-mail inválido.";
    if (!formData.bilheteIdentidade) newErrors.bilheteIdentidade = "Bilhete de Identidade é obrigatório.";
    if (!formData.genero) newErrors.genero = "Gênero é obrigatório.";

    // Validações de contato
    if (!formData.celular) newErrors.celular = "Celular é obrigatório.";
    if (!/^\d{9,}$/.test(formData.celular)) newErrors.celular = "Celular inválido.";
    if (formData.telefoneFixo && !/^\d{9,}$/.test(formData.telefoneFixo)) newErrors.telefoneFixo = "Telefone fixo inválido.";

    // Validações profissionais
    if (!formData.filial) newErrors.filial = "Filial é obrigatória.";
    if (!formData.cargo) newErrors.cargo = "Cargo é obrigatório.";
    if (!formData.pais) newErrors.pais = "Área de trabalho é obrigatória.";

    // Validações de endereço
    if (!formData.estado) newErrors.estado = "Província é obrigatória.";
    if (!formData.cidade) newErrors.cidade = "Município é obrigatório.";
    if (!formData.endereco) newErrors.endereco = "Endereço é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Submissão do formulário CORRIGIDA
// Modifique a função handleSubmit assim:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) {
    toast.error("Por favor, corrija os erros no formulário");
    return;
  }

  setIsSubmitting(true);

  try {
    const dadosParaEnviar = new FormData();
    
    // Adicione todos os campos manualmente para garantir o formato correto
    dadosParaEnviar.append('_method', 'PUT'); // Importante para Laravel
    dadosParaEnviar.append('numero_funcionario', formData.numero_funcionario || 'FN' + Math.floor(1000 + Math.random() * 9000));
    dadosParaEnviar.append('nome', formData.nome);
    dadosParaEnviar.append('sobrenome', formData.sobrenome);
    dadosParaEnviar.append('dataNascimento', formData.dataNascimento);
    dadosParaEnviar.append('email', formData.email);
    dadosParaEnviar.append('bilheteIdentidade', formData.bilheteIdentidade);
    dadosParaEnviar.append('genero', formData.genero);
    dadosParaEnviar.append('celular', formData.celular);
    dadosParaEnviar.append('filial', formData.filial.toString()); // Garante que é string
    dadosParaEnviar.append('cargo', formData.cargo);
    dadosParaEnviar.append('dataAdmissao', formData.dataAdmissao);
    dadosParaEnviar.append('pais', formData.pais);
    dadosParaEnviar.append('estado', formData.estado);
    dadosParaEnviar.append('cidade', formData.cidade);
    dadosParaEnviar.append('endereco', formData.endereco);
    dadosParaEnviar.append('bloqueado', formData.bloqueado ? '1' : '0');

    // Campos opcionais
    if (formData.nomeBanco) dadosParaEnviar.append('nomeBanco', formData.nomeBanco);
    if (formData.iban) dadosParaEnviar.append('iban', formData.iban);
    if (formData.telefoneFixo) dadosParaEnviar.append('telefoneFixo', formData.telefoneFixo);
    if (formData.fotoFile) dadosParaEnviar.append('foto', formData.fotoFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
    };

    // eslint-disable-next-line no-unused-vars
    const response = await axios.post(
      `https://biturbo.biturbomotors.com/biturboApi2/public/api/funcionarios/${id}`,
      dadosParaEnviar,
      config
    );

    toast.success("Funcionário atualizado com sucesso!");
    setTimeout(() => navigate("/pageTecnicos"), 2700);

  } catch (error) {
    console.error("Erro detalhado:", error.response?.data);
    
    if (error.response?.status === 422) {
      // Mostra todos os erros de validação
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(key => {
        toast.error(`${key}: ${errors[key].join(', ')}`);
      });
    } else {
      toast.error(error.response?.data?.message || "Erro ao atualizar funcionário");
    }
  }
};

  useEffect(() => {
  const carregarFuncionario = async () => {
    try {
      const response = await axios.get(`https://biturbo.biturbomotors.com/biturboApi2/public/api/funcionarios/${id}`);
      const dados = response.data;
      
      // Garante que o número do funcionário existe
      if (!dados.numero_funcionario) {
        dados.numero_funcionario = 'FN' + Math.floor(1000 + Math.random() * 9000);
      }
      
      setFormData(dados);
    } catch (error) {
      toast.error('Erro ao carregar dados do funcionário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  carregarFuncionario();
}, [id]);







  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 ">
      <ToastContainer position="top-center" autoClose={5000} />

      <div className="card shadow-sm mb-4 fundoCard">
        <div className="card-header  text-black d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-black">
            <FaUser className="me-2" style={{ color: '#000' }} />
            <span className='fs-5'>Editar Funcionário</span> :  {formData.nome} {formData.sobrenome}
          </h4>
          <Button size="sm" className='btn links-acessos' onClick={() => navigate("/pageTecnicos")}>
            <FaArrowLeft className="me-1" /> Voltar
          </Button>
        </div>

        <div className="card-body">
          <Alert variant="info" className="mb-4">
            <strong>Número do Funcionário:</strong> {formData.numero_funcionario}
          </Alert>

          <Form onSubmit={handleSubmit} className='formularioEditarUsuario'  >
            {/* Seção 1: Dados Pessoais */}
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <FaUser className="me-2" />
                Dados Pessoais
              </h5>
              <input type="hidden" name="numero_funcionario" value={formData.numero_funcionario} />

              <Row className="mb-3 d-none">
                <Col md={6}>
                  <Form.Group controlId="numero_funcionario">
                    <Form.Label>Número do Funcionário <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaUser /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="numero_funcionario"
                        value={formData.numero_funcionario}
                        onChange={handleChange}
                        readOnly // Se o número não deve ser editável
                        isInvalid={!!errors.numero_funcionario}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numero_funcionario}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="nome">
                    <Form.Label>Nome <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text ><FaUser /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        isInvalid={!!errors.nome}
                        placeholder='Digite o nome do funcionário'
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="sobrenome">
                    <Form.Label>Sobrenome <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaUser /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        isInvalid={!!errors.sobrenome}
                        placeholder='Digite o sobrenome do funcionário'
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.sobrenome}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="dataNascimento">
                    <Form.Label>Data Nascimento <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        isInvalid={!!errors.dataNascimento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dataNascimento}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="genero">
                    <Form.Label>Gênero <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaVenusMars /></InputGroup.Text>
                      <Form.Select
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                      >
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>

              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="bilheteIdentidade">
                    <Form.Label>Bilhete Identidade <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaIdCard /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="bilheteIdentidade"
                        value={formData.bilheteIdentidade}
                        onChange={handleChange}
                        isInvalid={!!errors.bilheteIdentidade}
                        placeholder='Digite o número do bilhete de identidade'
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bilheteIdentidade}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

              </Row>
            </div>

            {/* Seção 2: Contato */}
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <FaPhone className="me-2" />
                Contato
              </h5>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="foto">
                    <Form.Label>Foto</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaCamera /></InputGroup.Text>
                      <Form.Control
                        type="file"
                        name="foto"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData((prevData) => ({
                                ...prevData,
                                foto: reader.result, // base64 para preview
                                fotoFile: file       // arquivo real para envio
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </InputGroup>
                    {formData.foto && (
                      <Image src={formData.foto} thumbnail className="mt-2" style={{ maxWidth: '100px' }} />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="celular">
                    <Form.Label>Celular <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaMobileAlt fontSize={20} color="#0070fa" /></InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="celular"
                        value={formData.celular}
                        onChange={handleChange}
                        isInvalid={!!errors.celular}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.celular}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

              </Row>
            </div>

            {/* Seção 3: Dados Profissionais */}
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <FaSuitcase className="me-2" />
                Dados Profissionais
              </h5>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="filial">
                    <Form.Label>Filial <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaBuilding /></InputGroup.Text>
                      <Form.Select
                        name="filial"
                        value={formData.filial}
                        onChange={handleChange}
                        isInvalid={!!errors.filial}
                      >
                        <option value="">Selecione...</option>
                        <option value="Filial A">Filial A</option>
                        <option value="Filial B">Filial B</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.filial}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="cargo">
                    <Form.Label>Cargo <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaSuitcase /></InputGroup.Text>
                      <Form.Select
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        isInvalid={!!errors.cargo}
                      >
                        <option value="">Selecione...</option>
                        {cargos.map((cargo, index) => (
                          <option key={index} value={cargo}>{cargo}</option>
                        ))}
                      </Form.Select>
                      <Button
                        variant="btn btn-primary"
                        onClick={() => setMostrarModal(true)}
                      >
                        +
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.cargo}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="dataAdmissao">
                    <Form.Label>Data Admissão <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaRegCalendarAlt /></InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="dataAdmissao"
                        value={formData.dataAdmissao}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="pais">
                    <Form.Label>Área Trabalho <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaGlobe /></InputGroup.Text>
                      <Form.Select
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        isInvalid={!!errors.pais}
                      >
                        <option value="">Selecione...</option>
                        <option value="Mêcanico">Mecânica</option>
                        <option value="Administrativa">Administrativa</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.pais}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Seção 4: Dados Bancários */}
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <FaUniversity className="me-2" />
                Dados Bancários
              </h5>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="nomeBanco">
                    <Form.Label>Banco</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaUniversity /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="nomeBanco"
                        value={formData.nomeBanco}
                        onChange={handleChange}
                        placeholder='Digite o nome do banco'
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="iban">
                    <Form.Label>IBAN</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaCreditCard /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleChange}
                        placeholder='Digite o número do IBAN'
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Seção 5: Endereço */}
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <FaHome className="me-2" />
                Endereço
              </h5>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="telefoneFixo">
                    <Form.Label>Telefone Fixo</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaPhone /></InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="telefoneFixo"
                        value={formData.telefoneFixo}
                        onChange={handleChange}
                        placeholder='Digite o numero do telefone fixo'
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="estado">
                    <Form.Label>Província <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        isInvalid={!!errors.estado}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.estado}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="cidade">
                    <Form.Label>Município <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaMapPin /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        isInvalid={!!errors.cidade}
                        placeholder='Digite o nome do município'
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cidade}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="endereco">
                    <Form.Label>Endereço <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text ><FaHome className='fundoIconeTect' /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        isInvalid={!!errors.endereco}
                        placeholder='Digite seu endereço'
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endereco}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Seção 6: Status */}
            <div className="mb-4 text-black">

              <Form.Check
                type="checkbox"
                label={<span style={{ color: '#000' }} className='pt-1' >&nbsp;&nbsp; Bloquear acesso do funcionário</span>}
                name="bloqueado"
                checked={formData.bloqueado}
                onChange={handleChange}
              />


            </div>

            {/* Botões de ação */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)} className='d-none'
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" className="me-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Modal para adicionar novo cargo */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Novo Cargo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nome do Cargo</Form.Label>
            <Form.Control
              type="text"
              value={novoCargo}
              onChange={(e) => setNovoCargo(e.target.value)}
              placeholder="Digite o nome do novo cargo"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='d-none' onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAdicionarCargo}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};



function EditarFucionario() {
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
    { id: 'painel', icon: <FaHome />, label: 'Painel', path: '/homeOficinaAdmin' },
    { id: 'tecnicos', icon: <FaUsers />, label: 'Técnicos', path: '/pageTecnicos' },
    { id: 'cronometroGeral', icon: <BiTimer />, label: 'Cronômetro Geral', path: '/pageCrometroGeral' },
    { id: 'cronometroIndividual', icon: <MdTimer />, label: 'cronômetro individual', path: '/pageCronometroIndividual' },
    { id: 'ordens', icon: <FaTools />, label: 'Ordens de Serviço', path: '/pageOrOficina' },
    { id: 'relatorios', icon: <FaChartBar />, label: 'Relatórios', path: '/pageRelatorioOficina' },
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
        <main className={`admin-main text-white   ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
          <div className="content seccao-body bg-white h-100  container-fluid">
            <EditarTecnico />
          </div>
        </main>
      </div>
      <Copyright />
    </>
  );
}

export default EditarFucionario;
