import axios from "axios";
import { useEffect, useState } from "react";
import { FaBullhorn, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaMapLocation } from "react-icons/fa6";


export default function EntidadesOficina() {

    const [totalOrdens, setTotalOrdens] = useState(null);


    useEffect(() => {
        axios.get('http://localhost:8080/api/utilizadores/total')
            .then(response => {
                setTotalOrdens(response.data.total_ordens);

            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => {
                console.log('Erro ao buscar total de ordens');

            });
    }, []);

    const [totalTime, setTotalTime] = useState(null);


    useEffect(() => {
        axios.get('https://biturbo.biturbomotors.com/biturboApi2/public/api/cronometrosContarTodos')
            .then(response => {
                setTotalTime(response.data.total_cronometros);

            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => {
                console.log('Erro ao buscar total de ordens');

            });
    }, []);

    const [totalFuncionarios, setTotalFuncionarios] = useState(null);
    /**FUNCao para buscar Funcionario */

    useEffect(() => {
        axios
            .get('https://biturbo.biturbomotors.com/biturboApi2/public/api/funcionariosContar')
            .then(response => {
                setTotalFuncionarios(response.data.total_funcionarios);

            })
            .catch(error => {
                console.error('Erro ao buscar total de funcionários:', error);
                console.log('Erro ao carregar dados');

            });
    }, []);



    return (

        <section className="row">
            <div className="col-12 col-md-6 col-lg-3 ">
                <div className="icones-painel-oficina my-1">
                    <div className="seccaoF d-flex  h-100 justify-content-between">

                        <div className="iconeFigura">
                            <div className="mx-auto fotoIcone">
                                <FaUsers size={30} color="#EEF3F9" />

                            </div>
                        </div>
                        <div className="textFigura">
                            <small className="text-end">Utilizadores</small>
                            <h3 className="text-end mt-1">{totalFuncionarios}</h3>
                        </div>
                    </div>



                    <div className="footerConfig d-flex justify-content-between">
                        <span></span>
                        <small className="fonteFooter"><b> <IoMdArrowDropup fontSize={25} />27,3%</b>&nbsp;&nbsp;
                            <span className="fontNew">Mês passado</span></small>
                    </div>
                </div>

            </div>

            <div className="col-12 col-md-6 col-lg-3 ">
                <div className="icones-painel-oficina my-1">
                    <div className="seccaoF d-flex h-100  justify-content-between">

                        <div className="iconeFigura">
                            <div className="mx-auto fotoIcone">
                                <FaBullhorn size={30} color="#EEF3F9" />

                            </div>
                        </div>
                        <div className="textFigura">
                            <small className="text-end">Anuncios</small>
                            <h2 className="text-end mt-1">{0}</h2>
                        </div>
                    </div>




                    <div className="footerConfig d-flex justify-content-between">
                        <span></span>
                        <small className="fonteFooter"><b><IoMdArrowDropup fontSize={25} />56,3%</b>&nbsp;&nbsp;
                            <span className="fontNew"> Mês passado</span></small>                    </div>
                </div>

            </div>
            <div className="col-12 col-md-6 col-lg-3 ">
                <div className="icones-painel-oficina my-1">
                    <div className="seccaoF d-flex h-100 justify-content-between">

                        <div className="iconeFigura">
                            <div className="mx-auto fotoIcone">
                                <FaMapMarkerAlt size={30} color="#EEF3F9" />

                            </div>
                        </div>

                        <div className="textFigura">
                            <small className="text-end">Localização</small>
                            <h3 className="text-end mt-1">{totalTime}</h3>
                        </div>
                    </div>



                    <div className="footerConfig d-flex justify-content-between">
                        <span></span>
                        <small className="fonteFooter"><b><IoMdArrowDropdown fontSize={25} />34,3%</b>&nbsp;&nbsp;
                            <span className="fontNew">Mês passado</span></small>                    </div>
                </div>

            </div>
            <div className="col-12 col-md-6 col-lg-3 ">
                <div className="icones-painel-oficina my-1">
                    <div className="seccaoF d-flex h-100  justify-content-between">
                        <div className="iconeFigura">
                            <div className="mx-auto fotoIcone">
                                <FaMapLocation size={30} color="#EEF3F9" />




                            </div>
                        </div>
                        <div className="textFigura">

                            <small className="text-end">Locais</small>
                            <h3 className="text-end mt-1">{totalOrdens}</h3>
                        </div>
                    </div>


                    <div className="footerConfig d-flex justify-content-between">
                        <span></span>
                        <small className="fonteFooter"><b><IoMdArrowDropup fontSize={25} /> 12,3%</b>&nbsp;&nbsp;
                            <span className="fontNew">Mês passado</span></small>                    </div>


                </div>

            </div>
        </section>
    )
}