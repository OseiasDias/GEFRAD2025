import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import LogoMarca from "../../assets/logotipo.png";
import "../../css/Login.css";


const AcessoOficina = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

   
    // Função para alternar a visibilidade da senha
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <img src={LogoMarca} alt="Logo Turbo" className="login-logo" />
                    <h1 className="login-title">Acesso à Oficina <br /><h2>Administrador</h2></h1>
                    <p className="login-subtitle">
                        Digite sua senha para acessar o painel administrativo da oficina
                    </p>
                </div>

                <form >
                    <div className="form-group">
                        <label htmlFor="senha" className="form-label">
                            <FaLock className="me-2" />
                            Senha de Acesso
                        </label>
                        <div className="input-group" style={{ position: 'relative' }}>
                            <input
                                id="senha"
                                type={showPassword ? "text" : "password"} // Alterna entre text e password
                                placeholder="Digite sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-control text-white"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                className="toggle-password d-none"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    

                    <button
                        type="submit"
                        className="login-btn"
                    >
                       
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcessoOficina;