import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaClock, FaYoutube } from "react-icons/fa";
import "./footer.css";
import { FaUser } from "react-icons/fa6";
import logobranco from "../../assets/logoBranco.jpg";

export default function Footer() {
    return (<footer className="footerSection text-white py-5"> <div className="container"> <div className="row">

        {/* Sobre a empresa */}
        <div className="col-md-4 mb-4">
            <h5><img src={logobranco} alt="Gefrad Consulting" style={{ width: "50px" }} />&nbsp; <span className="mt-2">Gefrad Consulting</span></h5>
            <p>Consultoria especializada, oferecendo soluções profissionais e confiáveis.</p>
            <p><FaPhone /> &nbsp;(+244) 927 050 952</p>
            <p><FaEnvelope />  &nbsp;gefradconsulting@gmail.com</p>
            <p><FaClock /> &nbsp;Seg a Sáb: 08h00 às 17h30 | Dom: Fechado</p>
        </div>

        {/* Links rápidos */}
        <div className="col-md-4 mb-4">
            <h5>Links Rápidos</h5>
            <ul className="list-unstyled mt-5">
                <li className="mb-1"><a href="/">Topo</a></li>
                <li className="mb-1"><a href="#projectos">Projetos</a></li>
                <li className="mb-1"><a href="#servicos">Serviços</a></li>
                <li className="mb-1"><a href="#contactos">Contato</a></li>
            </ul>
        </div>

        {/* Redes sociais */}
        <div className="col-md-4 mb-4">
            <h5>Siga-nos</h5>
            <div className="socialIcons d-flex gap-3 mt-2">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebookF />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                    <FaYoutube />
                </a>
            </div>
        </div>

    </div>

        <hr className="bg-light" />

        <div className="text-center mt-3">
            &copy; {new Date().getFullYear()} Gefrad Consulting. Todos os direitos reservados.
            <br />
            Desenvolvido por: <FaUser />&nbsp; <span className="fw-bold" style={{ color: "#A0522D" }}>Oséias Edgar M. Dias</span>.
        </div>
    </div>
    </footer>


    );
}
