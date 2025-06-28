import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import LogoMarca from "../../assets/logotipo.png";
import "../../css/Login.css";

import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
    const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/utilizadores/login', {
        email,
        palavraPasse,
      });

      // ✅ Resposta esperada: { token, idSessao, utilizador }
      console.log('[Login] Login bem-sucedido:', response.data);

      // Armazena o JWT localmente (opcional)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('idSessao', response.data.idSessao);

        // Redireciona ou faz algo:
      navigate('/homeAdmin');

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

        <div className="mb-3">
          <label className="form-label">Senha:</label>
          <input
            type="password"
            className="form-control"
            value={palavraPasse}
            onChange={(e) => setPalavraPasse(e.target.value)}
            required
            placeholder="Digite sua senha"
          />
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
