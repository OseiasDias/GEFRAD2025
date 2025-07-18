import axios from "axios";
import { useEffect, useState } from "react";
import { FaBullhorn,  FaUsers } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaEnvelopeCircleCheck } from "react-icons/fa6";

export default function EntidadesPrincipal() {

  const [totalUtilizadores, setTotalUtilizadores] = useState(0);
  const [totalAnuncios, setTotalAnuncios] = useState(0);
  const [totalEntregas, setTotalEntregas] = useState(0);

  // Buscar total de Utilizadores
  useEffect(() => {
    axios.get('http://localhost:8080/api/utilizadores/total')
      .then(response => {
        console.log('[DEBUG] Utilizadores:', response.data);
        // Se resposta for { total: 10 }
        setTotalUtilizadores(response.data.total || response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar total de utilizadores:', error);
      });
  }, []);

  // Buscar total de Anúncios
  useEffect(() => {
    axios.get('http://localhost:8080/api/anuncios/total')
      .then(response => {
        console.log('[DEBUG] Anúncios:', response.data);
        setTotalAnuncios(response.data.total || response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar total de anúncios:', error);
      });
  }, []);

  // Buscar total de Entregas
  useEffect(() => {
    axios.get('http://localhost:8080/api/entregas/total')
      .then(response => {
        console.log('[DEBUG] Entregas:', response.data);
        setTotalEntregas(response.data.total || response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar total de entregas:', error);
      });
  }, []);

  return (
    <section className="row">
      {/* Utilizadores */}
      <div className="col-12 col-md-6 col-lg-4">
        <div className="icones-painel-oficina my-1">
          <div className="seccaoF d-flex h-100 justify-content-between">
            <div className="iconeFigura">
              <div className="mx-auto fotoIcone">
                <FaUsers size={30} color="#EEF3F9" />
              </div>
            </div>
            <div className="textFigura">
              <small className="text-end">Utilizadores</small>
              <h3 className="text-end mt-1">{totalUtilizadores}</h3>
            </div>
          </div>
          <div className="footerConfig d-flex justify-content-between">
            <span></span>
            <small className="fonteFooter">
              <b><IoMdArrowDropup fontSize={25} />27,3%</b>&nbsp;&nbsp;
              <span className="fontNew">Mês passado</span>
            </small>
          </div>
        </div>
      </div>

      {/* Anúncios */}
      <div className="col-12 col-md-6 col-lg-4">
        <div className="icones-painel-oficina my-1">
          <div className="seccaoF d-flex h-100 justify-content-between">
            <div className="iconeFigura">
              <div className="mx-auto fotoIcone">
                <FaBullhorn size={30} color="#EEF3F9" />
              </div>
            </div>
            <div className="textFigura">
              <small className="text-end">Anúncios</small>
              <h3 className="text-end mt-1">{totalAnuncios}</h3>
            </div>
          </div>
          <div className="footerConfig d-flex justify-content-between">
            <span></span>
            <small className="fonteFooter">
              <b><IoMdArrowDropup fontSize={25} />56,3%</b>&nbsp;&nbsp;
              <span className="fontNew">Mês passado</span>
            </small>
          </div>
        </div>
      </div>

      {/* Entregas */}
      <div className="col-12 col-md-6 col-lg-4">
        <div className="icones-painel-oficina my-1">
          <div className="seccaoF d-flex h-100 justify-content-between">
            <div className="iconeFigura">
              <div className="mx-auto fotoIcone">
        
                <FaEnvelopeCircleCheck size={30} color="#EEF3F9" />
              </div>
            </div>
            <div className="textFigura">
              <small className="text-end">Entregas</small>
              <h3 className="text-end mt-1">{totalEntregas}</h3>
            </div>
          </div>
          <div className="footerConfig d-flex justify-content-between">
            <span></span>
            <small className="fonteFooter">
              <b><IoMdArrowDropdown fontSize={25} />34,3%</b>&nbsp;&nbsp;
              <span className="fontNew">Mês passado</span>
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
