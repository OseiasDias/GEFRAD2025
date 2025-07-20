import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import LogoMarca from "../../assets/logotipo.png";
import "../../css/Login.css";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;


const Login = () => {
  const [email, setEmail] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setErro('');
  setLoading(true);

  try {
    const response = await axios.post((`${API_URL}/utilizadores/login`), {
      email,
      palavraPasse,
    });

    console.log('[Login] Resposta completa:', response.data);

    const data = response.data;

    // Logs detalhados
    console.log('[Login] data.user:', data.user);
    console.log('[Login] data.user.tipo:', data.user?.tipo);

    if (data.user && data.user.tipo === "ADMIN") {
      localStorage.setItem('token', data.token);
      localStorage.setItem('idSessao', data.idSessao);

      console.log('[Login] Login autorizado! Redirecionando em 15 segundos...');

   
        navigate('/homeAdmin');
    

    } else {
      console.log('[Login] Tipo de utilizador não permitido:', data.user?.tipo);
      setErro('Você não tem permissão para acessar esta área.');
    }

  } catch (error) {
    console.error('[Login] Erro ao fazer login:', error);
    setErro(error.response?.data?.message || 'Email ou senha inválidos.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container w-100">
      <div className="login-box">
        <div className="login-header">
          <img src={LogoMarca} alt="Logo Turbo" className="login-logo" />
          <h2 className="login-title">
            Acesso Anúncios Loc <br />
            <h3>Administrador</h3>
          </h2>
          <p className="login-subtitle">
            Digite seu e-mail e senha para acessar o painel administrativo web
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          {/* Campo de senha com botão de exibir/ocultar */}
          <div className="mb-3 position-relative">
            <label className="form-label">Senha:</label>
            <div className="input-group d-flex justify-content-between">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                className="form-control w-75"
                value={palavraPasse}
                onChange={(e) => setPalavraPasse(e.target.value)}
                required
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="input-group-text w5 bg-white border-start-0"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ cursor: 'pointer' }}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>


          {erro && <div className="alert alert-danger">{erro}</div>}
          <button type="submit" className="login-btn mt-4" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
