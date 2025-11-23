import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./clientesCarousel.css"; // CSS personalizado

const clientesPrivados = [
  { 
    nome: "CENTRO VISÃO JUVENIL", 
    descricao: "Instituição dedicada ao apoio e desenvolvimento de jovens, oferecendo programas educacionais, culturais e sociais." 
  },
  { 
    nome: "MCC ARQ.", 
    descricao: "Empresa de arquitetura e design, especializada em projetos residenciais, comerciais e corporativos com soluções inovadoras." 
  },
  { 
    nome: "CLIENTES PRIVADOS", 
    descricao: "Diversos clientes do setor privado que confiam em nossos serviços para consultoria, gestão e implementação de projetos." 
  },
];

export default function ClientesCarousel() {
  return (
    <section className="clientesSection py-5">
      <div className="container text-center">
        <h2 className="subtitulos mb-4 text-center">OS NOSSOS CLIENTES</h2>
        <div 
          id="clientesCarousel" 
          className="carousel slide" 
          data-bs-ride="carousel" 
          data-bs-interval="4000"
        >
          <div className="carousel-inner">
            {clientesPrivados.map((cliente, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="carouselContent d-flex flex-column justify-content-center align-items-center">
                  <h4 className="fw-bold mb-3">{cliente.nome}</h4>
                  <p className="descricaoCliente">{cliente.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Botão anterior */}
          <button
            className="carousel-control-prev custom-carousel-btn"
            type="button"
            data-bs-target="#clientesCarousel"
            data-bs-slide="prev"
          >
            <FaArrowLeft size={30} />
            <span className="visually-hidden">Anterior</span>
          </button>

          {/* Botão próximo */}
          <button
            className="carousel-control-next custom-carousel-btn"
            type="button"
            data-bs-target="#clientesCarousel"
            data-bs-slide="next"
          >
            <FaArrowRight size={30} />
            <span className="visually-hidden">Próximo</span>
          </button>
        </div>
      </div>
    </section>
  );
}
