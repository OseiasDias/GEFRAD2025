import React from 'react';
import './nossosServicos.css';

import { FaTools } from "react-icons/fa";        // Construção Civil
import { MdEngineering } from "react-icons/md"; // Arquitetura e Engenharia
import { RiShakeHandsFill } from "react-icons/ri"; // Consultoria

const servicos = [
    {
        titulo: 'CONSTRUÇÃO CIVIL',
        icone: <FaTools className="iconServico" />,
        itens: [
            'Construção de moradias e edifícios',
            'Remodelações e acabamentos',
            'Reabilitação ou Requalificação'
        ]
    },
    {
        titulo: 'CONSULTORIA',
        icone: <RiShakeHandsFill className="iconServico" />,
        itens: [
            'Estudos e Orçamentos Completos',
            'Gestão e Planeamentos de Obras',
            'Gestão da Saúde, Segurança e Meio Ambiente',
            'Supervisão/Fiscalização de Construção',
            'Serviços de Monitorização de Projecto',
            'Gestão da qualidade',
            'Formação',
            'Outros'
        ]
    },
    {
        titulo: 'ARQUITETURA E ENGENHARIA',
        icone: <MdEngineering className="iconServico" />,
        itens: [
            'Elaboração de projectos de Arquitetura',
            'Vídeos 3D e animação',
            'Design de interiores',
            'Móveis planejados',
            'Projectos de especialidades (Estruturas, elétricas, AVAC, etc)'
        ]
    }
];

export default function NossosServicos() {
    return (
        <section className="nossosServicosSection py-5">
            <div className="container">
                <h2 className="text-start mb-5 subtitulos">Nossos Serviços</h2>

                <div className="row">
                    {servicos.map((servico, index) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={index}>
                            <div className="servicoCard">
                                <div className="iconeWrapper">{servico.icone}</div>

                                <h3 className="tituloServico">{servico.titulo}</h3>

                                <ul className="listaServicos">
                                    {servico.itens.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
