import MenuPrincipal from '../../../components/MenuPrincipal.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert, Tab, Tabs, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

import { toast } from 'react-toastify';

import { FaEye, FaEyeSlash } from 'react-icons/fa';


const API_URL = import.meta.env.VITE_API_URL;

export function EditarAdmin() {
  //const location = useLocation();
  //const params = new URLSearchParams(location.search);
  //const email = params.get("email");
  const { email } = useParams();
  const navigate = useNavigate();
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    nomeUsuario: '',
    email: '',
    saldo: ''
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarUtilizador = async () => {
      try {
        const response = await axios.get(`${API_URL}/utilizadores/perfil/${email}`);
        const data = response.data;
        setNewAdmin({
          nomeUsuario: data.nomeUsuario || '',
          email: data.email || '',
          saldo: data.saldo || ''
        });
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Erro ao buscar os dados do utilizador.");
      } finally {
        setLoading(false);
      }
    };

    buscarUtilizador();
  }, [email]);

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSenhaInputChange = (e) => {
    const { name, value } = e.target;
    setSenhaData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (tab = 'dados') => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (tab === 'dados') {
      if (!newAdmin.nomeUsuario.trim()) {
        errors.nomeUsuario = 'Nome é obrigatório.';
      }

      if (!newAdmin.email.trim()) {
        errors.email = 'Email é obrigatório.';
      } else if (!emailRegex.test(newAdmin.email)) {
        errors.email = 'Email inválido.';
      }


    } else if (tab === 'senha') {
      if (!senhaData.senhaAtual.trim()) {
        errors.senhaAtual = 'Informe sua senha atual.';
      }

      if (!senhaData.novaSenha.trim()) {
        errors.novaSenha = 'Nova senha é obrigatória.';
      }

      if (senhaData.novaSenha !== senhaData.confirmarSenha) {
        errors.confirmarSenha = 'As senhas não coincidem.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e, tab) => {

    e.preventDefault();
    if (!validateForm(tab)) return;

    setSubmitting(true);
    try {
      if (tab === 'dados') {
        await axios.patch(`${API_URL}/utilizadores/${email}/editar`, newAdmin);
        toast.success('Dados atualizados com sucesso!');
      } else if (tab === 'senha') {
        await axios.patch(`${API_URL}/utilizadores/perfil/${email}/alterarSenha`, senhaData);
        toast.success('Senha alterada com sucesso!');
      }

      navigate('/pageTecnicos');
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error('Erro ao atualizar dados do administrador.');
      setError('Erro ao atualizar dados do administrador.');
    } finally {
      setSubmitting(false);
    }
  };





  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Tabs defaultActiveKey="dados" className="mb-4">
      <Tab eventKey="dados" title="📝 Dados Pessoais">
        <Form onSubmit={(e) => handleSubmit(e, 'dados')} className="mt-4 shadow-sm p-4 rounded empty">
          <div className="row">
            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaUser className="me-2" /> Nome Completo *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="nomeUsuario"
                    placeholder="Digite o nome completo"
                    value={newAdmin.nomeUsuario}
                    onChange={handleAdminInputChange}
                    isInvalid={!!formErrors.nomeUsuario}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.nomeUsuario}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaEnvelope className="me-2" /> Email *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Digite o email"
                    value={newAdmin.email}
                    onChange={handleAdminInputChange}
                    isInvalid={!!formErrors.email}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>



            <div className="col-12 mt-3 d-flex justify-content-center">
              <Button variant="outline-light" type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Form>
      </Tab>

      <Tab eventKey="senha" title="Alterar Senha">
        <Form onSubmit={(e) => handleSubmit(e, 'senha')} className="mt-4 shadow-sm p-4 rounded empty">
          <div className="row">
            {/* SENHA ATUAL */}
            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaLock className="me-2" /> Senha Atual *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={mostrarSenhaAtual ? "text" : "password"}
                    name="senhaAtual"
                    placeholder="Digite sua senha atual"
                    value={senhaData.senhaAtual}
                    onChange={handleSenhaInputChange}
                    isInvalid={!!formErrors.senhaAtual}
                  />
                  <Button
                    variant="success"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                  >
                    {mostrarSenhaAtual ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">{formErrors.senhaAtual}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            {/* NOVA SENHA */}
            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaLock className="me-2" /> Nova Senha *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={mostrarNovaSenha ? "text" : "password"}
                    name="novaSenha"
                    placeholder="Digite a nova senha"
                    value={senhaData.novaSenha}
                    onChange={handleSenhaInputChange}
                    isInvalid={!!formErrors.novaSenha}
                  />
                  <Button
                    variant="success" onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  >
                    {mostrarNovaSenha ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">{formErrors.novaSenha}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            {/* CONFIRMAR NOVA SENHA */}
            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaLock className="me-2" /> Confirmar Nova Senha *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    name="confirmarSenha"
                    placeholder="Confirme a nova senha"
                    value={senhaData.confirmarSenha}
                    onChange={handleSenhaInputChange}
                    isInvalid={!!formErrors.confirmarSenha}
                  />
                  <Button
                    variant="success" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  >
                    {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                  <Form.Control.Feedback type="invalid">{formErrors.confirmarSenha}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            {/* BOTÃO SUBMIT */}
            <div className="col-12 mt-3">
              <Button variant="outline-light mx-auto d-block" type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Atualizar Senha'}
              </Button>
            </div>
          </div>
        </Form>
      </Tab>
    </Tabs>
  );
}



export default function HomeOficinaAdmin() {
  return (
    <MenuPrincipal>
      <EditarAdmin />
    </MenuPrincipal>
  );
}
