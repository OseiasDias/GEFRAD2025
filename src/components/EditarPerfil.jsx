import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert, Tab, Tabs, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

export default function EditarAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newAdmin, setNewAdmin] = useState({
    nomeUsuario: '',
    email: '',
    telefone: ''
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
    async function fetchAdmin() {
      try {
        const res = await axios.get(`/api/admin/${id}`);
        setNewAdmin({
          nomeUsuario: res.data.nomeUsuario || '',
          email: res.data.email || '',
          telefone: res.data.telefone || ''
        });
        setLoading(false);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Erro ao carregar os dados do administrador.');
        setLoading(false);
      }
    }

    fetchAdmin();
  }, [id]);

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleSenhaInputChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (tab = 'dados') => {
    const errors = {};
    if (tab === 'dados') {
      if (!newAdmin.nomeUsuario.trim()) errors.nomeUsuario = 'Nome é obrigatório.';
      if (!newAdmin.email.trim()) errors.email = 'Email é obrigatório.';
      if (!newAdmin.telefone.trim()) errors.telefone = 'Telefone é obrigatório.';
    } else if (tab === 'senha') {
      if (!senhaData.senhaAtual.trim()) errors.senhaAtual = 'Informe sua senha atual.';
      if (!senhaData.novaSenha.trim()) errors.novaSenha = 'Nova senha é obrigatória.';
      if (senhaData.novaSenha !== senhaData.confirmarSenha) errors.confirmarSenha = 'As senhas não coincidem.';
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
        await axios.put(`/api/admin/${id}`, newAdmin);
      } else if (tab === 'senha') {
        await axios.put(`/api/admin/${id}/alterarSenha`, senhaData); // seu endpoint de senha
      }
      navigate('/pageTecnicos');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
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
        <Form onSubmit={(e) => handleSubmit(e, 'dados')} className="mt-4 shadow-sm p-4  rounded empty">
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

            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaPhone className="me-2" /> Telefone *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="telefone"
                    placeholder="Digite o telefone"
                    value={newAdmin.telefone}
                    onChange={handleAdminInputChange}
                    isInvalid={!!formErrors.telefone}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.telefone}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-12 mt-3 d-flex justify-content-center">
            
              <Button variant="outline-light " type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Form>
      </Tab>

      <Tab eventKey="senha" title="🔐 Alterar Senha">
        <Form onSubmit={(e) => handleSubmit(e, 'senha')} className="mt-4  shadow-sm p-4 empty rounded">
          <div className="row">
            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaLock className="me-2" /> Senha Atual *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="password"
                    name="senhaAtual"
                    placeholder="Digite sua senha atual"
                    value={senhaData.senhaAtual}
                    onChange={handleSenhaInputChange}
                    isInvalid={!!formErrors.senhaAtual}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.senhaAtual}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaLock className="me-2" /> Nova Senha *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="password"
                    name="novaSenha"
                    placeholder="Digite a nova senha"
                    value={senhaData.novaSenha}
                    onChange={handleSenhaInputChange}
                    isInvalid={!!formErrors.novaSenha}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.novaSenha}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-lg-6 mb-3">
              <Form.Group>
                <Form.Label><FaLock className="me-2" /> Confirmar Nova Senha *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="password"
                    name="confirmarSenha"
                    placeholder="Confirme a nova senha"
                    value={senhaData.confirmarSenha}
                    onChange={handleSenhaInputChange}
                    isInvalid={!!formErrors.confirmarSenha}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.confirmarSenha}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-12 mt-3">
              <Button variant="outline-light mx-auto d-block"  type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Atualizar Senha'}
              </Button>
            </div>
          </div>
        </Form>
      </Tab>
    </Tabs>
  );
}
