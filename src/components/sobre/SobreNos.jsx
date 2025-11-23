import React from 'react';
import './sobreNos.css';
import ilustracao from '../../assets/sobre/ilustracao.jpg'; // substitua pelo caminho da sua imagem

export default function SobreNos() {
    return (
        <section className="sobreNosSection mt-5 py-5">
            <div className="container">
                {/* Texto e Imagem alinhados */}
                <div className="row align-items-center">
                    {/* Texto */}
                    <div className="sobreNosTexto col-md-7 col-lg-8">
                        <h2 className="mb-3 subtitulos">Sobre Nós</h2>
                        <p>
                            A <strong>GEFRAD Consulting LDA</strong>, com NIF <strong>5002674491</strong>, é uma sociedade de direito angolano especializada na prestação de serviços de gestão de projectos, construção, fiscalização, arquitetura e projectos de engenharia, atuando no setor da construção civil.
                        </p>
                        <p>
                            Com sede em Luanda, a <strong>GEFRAD</strong> tem um forte compromisso com os seus clientes e com o seu desenvolvimento económico e social.
                        </p>
                        <p>
                            Nossa <i>missão</i> é desenvolver e aplicar identidades visuais que expressem autoridade, sofisticação e coerência institucional, fortalecendo a presença de nossos clientes em todos os pontos de contato — do papel ao ambiente de obra. Atuamos com precisão estratégica, estética refinada e profundo entendimento dos setores que atendemos.
                        </p>
                        <p>
                            Atuamos como parceiros na materialização de projetos e na gestão eficiente de recursos, garantindo conformidade, qualidade e impacto duradouro.
                        </p>
                    </div>

                    {/* Imagem de ilustração */}
                    <div className="sobreNosImagem col-md-5 col-lg-4 d-flex justify-content-center">
                        <img src={ilustracao} alt="Ilustração GEFRAD" className="img-fluid rounded" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                </div>
            </div>
        </section>
    );
}
