import React from "react";
import "./equipe.css";
import { FaLinkedin, FaEnvelope, FaPhone, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

// IMPORTAÇÃO DAS IMAGENS
import membro1 from "../../assets/equipe/barulio.jpg";
import membro2 from "../../assets/equipe/anonimo.jpg";
import membro3 from "../../assets/equipe/oseias.png";
import membro4 from "../../assets/equipe/adilson.jpg";
import membro5 from "../../assets/equipe/anonimo.jpg";
import membro6 from "../../assets/equipe/anonimo.jpg";

// LISTA DA EQUIPE
const equipe = [
    {
        nome: "Bráulio Geraldo",
        cargo: "OCPCA (MSc PM – MBA in Project Management)",
        descricao: "Chief Administration Officer",
        imagem: membro1,
        email: "pca@gfrad.com",
        telefone: "+244000000000",
        linkedin: "#",
        facebook: "#",
        instagram: "#",
        whatsapp: "+244000000000",
    },
    {
        nome: "Branca Quissanga",
        cargo: "Commercial",
        descricao: "Gestão Operacional Comercial",
        imagem: membro2,
        email: "branca@gfrad.com",
        telefone: "+244000000000",
        linkedin: "#",
        facebook: "#",
        instagram: "#",
        whatsapp: "+244000000000",
    },
    {
        nome: "Oséias Dias",
        cargo: "IT Eng, Marketing Advertising",
        descricao: "Tecnologias de Informação e Marketing",
        imagem: membro3,
        email: "edgar@gfrad.com",
        telefone: "+244000000000",
        linkedin: "#",
        facebook: "#",
        instagram: "#",
        whatsapp: "+244000000000",
    },
    {
        nome: "Adilson Garcia",
        cargo: "Chief Operation Officer",
        descricao: "Lic. Eng Civil",
        imagem: membro4,
        email: "adilson@gfrad.com",
        telefone: "+244000000000",
        linkedin: "#",
        facebook: "#",
        instagram: "#",
        whatsapp: "+244000000000",
    },
    {
        nome: "Bernadino Fernando",
        cargo: "Public Relations, Business Development",
        descricao: "Relações Públicas e Desenvolvimento",
        imagem: membro5,
        email: "bernardino@gfrad.com",
        telefone: "+244000000000",
        linkedin: "#",
        facebook: "#",
        instagram: "#",
        whatsapp: "+244000000000",
    },
    {
        nome: "Venâncio Francisco",
        cargo: "Chief Administration Officer",
        descricao: "(Lic. Gestão de Empresas) Administração e Finanças",
        imagem: membro6,
        email: "novo@gfrad.com",
        telefone: "+244000000000",
        linkedin: "#",
        facebook: "#",
        instagram: "#",
        whatsapp: "+244000000000",
    },
];

// COMPONENTE
export default function Equipe() {
    return (
        <section className="equipeSection py-5">
            <div className="container">
                <h2 className="subtitulos text-start mb-4">Nossa Equipe</h2>
                <p className="descricaoEquip text-justify mb-5">
                    A <strong>GEFRAD</strong> Conta com uma <i>equipa</i> técnica altamente <i>qualificada</i> e <i>certificada</i>, composta por profissionais com sólida experiência nas áreas de atuação

                    Além disso, a <strong>GEFRAD</strong> beneficia do suporte de uma equipa multidisciplinar de arquitetos, garantindo <i>soluções integradas e inovadoras</i> para os desafios dos projectos em que atua
                </p>

                <div className="row">
                    {equipe.map((membro, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            <div className="card equipeCard shadow-sm text-center h-100 p-3">
                                <img
                                    src={membro.imagem}
                                    alt={membro.nome}
                                    className="equipeFoto mt-2 mx-auto d-block"
                                />
                                <h4 className="nomeMembro mt-3">{membro.nome}</h4>
                                <p className="cargoMembro">{membro.cargo}</p>
                                <p className="descricaoMembro">{membro.descricao}</p>

                                <div className="socialIcons mt-3">
                                    <a href={membro.linkedin} target="_blank" rel="noreferrer">
                                        <FaLinkedin />
                                    </a>
                                    <a href={membro.facebook} target="_blank" rel="noreferrer">
                                        <FaFacebookF />
                                    </a>
                                    <a href={membro.instagram} target="_blank" rel="noreferrer">
                                        <FaInstagram />
                                    </a>
                                    <a href={`mailto:${membro.email}`}>
                                        <FaEnvelope />
                                    </a>
                                    <a href={`tel:${membro.telefone}`}>
                                        <FaPhone />
                                    </a>
                                    <a href={`https://wa.me/${membro.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                                        <FaWhatsapp />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
