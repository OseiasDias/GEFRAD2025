import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./projectosExecutados.css"; // CSS atualizado

// Importando todas as imagens
import residencia1 from "../../assets/projectos/residencia (1).jpg";
import residencia2 from "../../assets/projectos/residencia (2).jpg";
import residencia3 from "../../assets/projectos/residencia (3).jpg";
import residencia4 from "../../assets/projectos/residencia (4).jpg";
import cafe1 from "../../assets/projectos/cafe (1).jpg";
import cafe2 from "../../assets/projectos/cafe (2).jpg";
import { Modal, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import acabamento1 from "../../assets/projectos/acabamento (1).jpg";
import acabamento2 from "../../assets/projectos/acabamento (2).jpg";
import interior1 from "../../assets/projectos/interior (1).jpg";
import interior2 from "../../assets/projectos/interior (2).jpg";
import interior3 from "../../assets/projectos/interior (3).jpg";
import interior4 from "../../assets/projectos/interior (4).jpg";
import edificio1 from "../../assets/projectos/edificio (1).jpg";
import edificio2 from "../../assets/projectos/edificio (2).jpg";

const projectos = [
    {
        titulo: "Residência",
        localizacao: "Morro Bento",
        cliente: "Privado",
        descricao: [
            "Projecto completo de Arquitectura (Videos 3D)",
            "Projecto de Estrutura",
            "Projecto de Especialidades",
            "Orçamento Completo",
            "Memória Descritiva",
            "Croqui de Localização",
        ],
        fotos: [residencia1,residencia2,residencia3,residencia4],
    },
    {
        titulo: "Restaurante e Café",
        localizacao: "Belas",
        cliente: "Privado",
        descricao: [
            "Projecto completo de Arquitectura (Videos 3D)",
            "Projecto de Especialidades",
            "Orçamento Completo",
            "Croqui de Localização",
        ],
        fotos: [cafe1, cafe2],
    },
    {
        titulo: "Acabamento de uma Vivenda",
        localizacao: "Benfica",
        cliente: "Privado",
        descricao: [
            "Projecto completo de Arquitectura (Videos 3D)",
            "Orçamento Completo",
            "Gestão e Direção da Obra",
        ],
          fotos: [acabamento1, acabamento2],
    },
    {
        titulo: "Design de Interior de uma Vivenda",
        localizacao: "Patriota",
        cliente: "Privado",
        descricao: [
            "Projecto completo de Arquitectura (Videos 3D)",
            "Orçamento Completo",
            "Gestão e Direção da Obra",
        ],
        fotos: [interior1 , interior2,interior3 , interior4 ],
    },
    {
        titulo: "Edifício Comercial",
        localizacao: "Benfica",
        cliente: "Privado",
        descricao: [
            "Projecto completo de Arquitectura (Videos 3D)",
            "Projecto de Especialidades",
            "Orçamento Completo",
            "Croqui de Localização",
        ],
        fotos: [edificio2, edificio1],
    },
];

export default function ProjectosExecutados() {
    const [indexAtivo, setIndexAtivo] = useState(0);

    const abrirModal = (fotos, index) => {
        setFotosModal(fotos);
        setIndexAtivo(index);
        setShowModal(true);
    };

    const [showModal, setShowModal] = useState(false);
    const [fotosModal, setFotosModal] = useState([]);




     const fecharModal = () => {
        setShowModal(false);
        setFotosModal([]);
        setIndexAtivo(0);
    };

     const proximaFoto = () => {
        setIndexAtivo((prev) => (prev + 1) % fotosModal.length);
    };

    const fotoAnterior = () => {
        setIndexAtivo((prev) => (prev - 1 + fotosModal.length) % fotosModal.length);
    };

    return (
        <section className="projectosSection py-5">
            <div className="container">
                <h2 className="subtitulos text-center mb-4">PROJECTOS EXECUTADOS</h2>
                <Tabs defaultActiveKey={projectos[0].titulo} id="projectos-tabs" className="mb-3">
                    {projectos.map((proj, index) => (
                        <Tab key={index} eventKey={proj.titulo} title={proj.titulo}>
                            <div className="projectoContent card shadow p-4 my-3">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <h4 className="fw-bold mb-3">{proj.titulo}</h4>
                                        <p><strong>Localização:</strong> {proj.localizacao}</p>
                                        <p><strong>Cliente:</strong> {proj.cliente}</p>
                                        <p><strong>Incluindo:</strong></p>
                                        <ul>
                                            {proj.descricao.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="col-lg-8">
                                        <div className="projectoFotos d-flex flex-wrap mt-3">
                                            <div className="row">
                                                {(proj.fotos || []).map((foto, i) => (
                                                    <div key={i} className="fotoCar col-md-6 mb-3">
                                                        <img
                                                            src={foto}
                                                            alt={proj.titulo}
                                                            className="img-fluid rounded clickable"
                                                            onClick={() => abrirModal(proj.fotos, i)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-end fw-bold fs-0">Gefrad Consulting</span>
                            </div>
                            
                        </Tab>
                        
                    ))}
                    
                </Tabs>
                
            </div>

            {/* Modal para exibir foto em tamanho grande */}
            {/* Modal para exibir foto em tamanho grande */}
            <Modal
                show={showModal}
                onHide={fecharModal}
                centered
                size="xl"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            >
                <Modal.Body
                    className="p-0 d-flex justify-content-center align-items-center position-relative"
                    style={{ maxHeight: "90vh", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                    {/* Seta esquerda */}
                    <Button
                        variant="link"
                        className="position-absolute start-0 top-50 translate-middle-y text-white"
                        onClick={fotoAnterior}
                        style={{ fontSize: "2rem", zIndex: 10 }}
                    >
                        <FaChevronLeft />
                    </Button>

                    {/* Imagem */}
                    {fotosModal[indexAtivo] && (
                        <img
                            src={fotosModal[indexAtivo]}
                            alt={`Projeto ${indexAtivo + 1}`}
                            className="img-fluid rounded"
                            style={{ maxHeight: "90vh", objectFit: "contain" }}
                        />
                    )}

                    {/* Seta direita */}
                    <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y text-white"
                        onClick={proximaFoto}
                        style={{ fontSize: "2rem", zIndex: 10 }}
                    >
                        <FaChevronRight />
                    </Button>
                </Modal.Body>
            </Modal>

        </section>
    );
}
