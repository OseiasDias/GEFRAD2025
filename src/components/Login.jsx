import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Se usares React Router
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import LogoMarca from "../assets/logotipo.png";
import "../css/Login.css";

const AcessoOficina = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Para redirecionar

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      if (!response.ok) {
        alert("Credenciais inválidas.");
        return;
      }

      // Depois de receber a resposta JSON:
      const data = await response.json();

      console.log("🔍 Dados completos da resposta:", data);
      console.log("🔍 data.user:", data.user);
      console.log("🔍 data.user.tipo:", data.user ? data.user.tipo : "user não definido");

      if (data.user && data.user.tipo === "Maravilhoso") {
        // Guarda o token no localStorage (opcional)
        localStorage.setItem("token", data.token);

        setTimeout(() => {
          navigate("/home");
        }, 15000); // 15.000 milissegundos = 15 segundos

      } else {
        console.log("⚠️ Condição NÃO satisfeita: tipo:", data.user ? data.user.tipo : "sem tipo");
        alert("Você não tem permissão para acessar esta área.");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Tente novamente.");
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

        <form onSubmit={handleSubmit}>
          {/* E-MAIL */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control text-white"
            />
          </div>

          {/* SENHA */}
          <div className="form-group mt-3">
            <label htmlFor="senha" className="form-label">
              <FaLock className="me-2" />
              Senha de Acesso
            </label>
            <div className="input-grou" style={{ position: "relative" }}>
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control text-white"
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  zIndex: 1,
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* BOTÃO ENTRAR */}
          <button type="submit" className="login-btn mt-4">
            Entrar <FiLogIn />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcessoOficina;
