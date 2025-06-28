import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import LogoMarca from "../../assets/logotipo.png";
import "../../css/Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [palavraPasse, setPalavraPasse] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

            console.log('[Login] Login bem-sucedido:', response.data);

            // ⚠️ Verifica se o token e idSessao vieram
            if (!response.data?.token || !response.data?.idSessao) {
                throw new Error('Credenciais inválidas.'); // Força ir para o catch
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('idSessao', response.data.idSessao);

       
                
            navigate('/homeAdmin');
        


        } catch (error) {
            console.error('[Login] Erro ao fazer login:', error);

            // Se backend mandou mensagem, use. Senão, mensagem padrão.
            if (error.response && error.response.data && error.response.data.message) {
                setErro(error.response.data.message);
            } else {
                setErro('Credenciais inválidas.');
            }

        } finally {
            setLoading(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="login-container w-100">
            <div className="login-box">
                <div className="login-header">
                    <img src={LogoMarca} alt="Logo Turbo" className="login-logo" />
                    <h2 className="login-title">
                        Acesso Anúncios Loc
                    </h2>
                    <h3 className="login-subtitle-h3 text-white">
                        Administrador
                    </h3>

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

                    <div className="mb-3" style={{ position: 'relative' }}>
                        <label className="form-label">Senha:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            value={palavraPasse}
                            onChange={(e) => setPalavraPasse(e.target.value)}
                            required
                            placeholder="Digite sua senha"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "10px",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: "#333",
                                cursor: "pointer"
                            }}
                        >
                            {showPassword ? <FaEyeSlash className='marginOlho' fontSize={22} color='#fff' /> : <FaEye className='marginOlho' fontSize={22} color='#fff' />}
                        </button>
                    </div>

                    {erro && <div className="alert alert-danger">{erro}</div>}

                    <button type="submit" className="btn btn-primary login-btn mt-4 w-100" disabled={loading}>
                        {loading ? 'Entrando...' : <>Entrar <FiLogIn /></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
