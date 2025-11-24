import React from "react";
import CountUp from "react-countup";
import { FaCheckCircle, FaProjectDiagram, FaSmile } from "react-icons/fa";
import "./estatisticas.css"; // CSS personalizado

const estatisticas = [
{ titulo: "Projetos Feitos", valor: 23, icone: <FaProjectDiagram size={40} /> },
{ titulo: "Projetos em Execução", valor: 5, icone: <FaCheckCircle size={40} /> },
{ titulo: "Clientes Satisfeitos", valor: 17, icone: <FaSmile size={40} /> },
];

export default function Estatisticas() {
return ( <section className="estatisticasSection py-5"> 
<div className="container"> <h2 className="subtitulos mb-5">Nossas Conquistas</h2> <div className="row justify-content-center">
{estatisticas.map((estat, index) => ( <div key={index} className="col-md-4 mb-4"> <div className="estatCard text-center p-4 shadow rounded"> <div className="mb-3">{estat.icone}</div> <h3 className="countNumber"> <CountUp start={0} end={estat.valor} duration={2.5} separator="," /> </h3> <p className="estatTitulo">{estat.titulo}</p> </div> </div>
))} </div> </div> </section>
);
}
