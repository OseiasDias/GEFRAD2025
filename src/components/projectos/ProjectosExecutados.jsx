import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./projectosExecutados.css"; // CSS atualizado

// Importando todas as imagens
/*import residencia1 from "../../assets/projectos/residencia1.jpg";
import residencia2 from "../../assets/projectos/residencia2.jpg";*/
import cafe1 from "../../assets/projectos/cafe (1).jpg";
import cafe2 from "../../assets/projectos/cafe (2).jpg";
import Modal from "react-bootstrap/Modal";
/*import acabamento1 from "../../assets/projectos/acabamento1.jpg";
import acabamento2 from "../../assets/projectos/acabamento2.jpg";
import interior1 from "../../assets/projectos/interior1.jpg";
import interior2 from "../../assets/projectos/interior2.jpg";
import comercial1 from "../../assets/projectos/comercial1.jpg";
import comercial2 from "../../assets/projectos/comercial2.jpg";
*/
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
        fotos: [cafe1, cafe2],
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
        fotos: [cafe1, cafe2],
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
        fotos: [cafe1, cafe2],
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
        fotos: [cafe1, cafe2],
    },
];

export default function ProjectosExecutados() {
    const [showModal, setShowModal] = useState(false);
    const [fotoAtiva, setFotoAtiva] = useState(null);

    const abrirModal = (foto) => {
        setFotoAtiva(foto);
        setShowModal(true);
    };

    const fecharModal = () => {
        setShowModal(false);
        setFotoAtiva(null);
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
                                            {(proj.fotos || []).map((foto, i) => (
                                                <div key={i} className="fotoCar col-md-6 mb-3">
                                                    <img
                                                        src={foto}
                                                        alt={proj.titulo}
                                                        className="img-fluid rounded clickable"
                                                        onClick={() => abrirModal(foto)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    ))}
                </Tabs>
            </div>

            {/* Modal para exibir foto em tamanho grande */}
            <Modal show={showModal} onHide={fecharModal} centered size="xl" style={{backgroundColor:"rgba(0, 0, 0, 0.6)"}}>
                <Modal.Body className="p-0 d-flex justify-content-center align-items-center" style={{ maxHeight: "90vh",backgroundColor:"rgba(0, 0, 0, 0.6)" }}>
                    {fotoAtiva && (
                        <img
                            src={fotoAtiva}
                            alt="Projeto"
                            className="img-fluid rounded"
                            style={{ maxHeight: "90vh", objectFit: "contain" }}
                        />
                    )}
                </Modal.Body>
            </Modal>

        </section>
    );
}
