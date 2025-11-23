import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaHome, FaUsers, FaTools, FaProjectDiagram, FaBlog, FaPhoneAlt } from 'react-icons/fa';
import { MdEngineering, MdConstruction, MdHistoryEdu, MdArchitecture } from 'react-icons/md';
import { GiFactory } from 'react-icons/gi';
import { BsBuildingsFill } from 'react-icons/bs';
import logoGefrad from '../../assets/logoOficial.png';
import './menu.css';
import TopoMenu from '../topoMenu/TopoMenu';

function Menu() {
    return (
       <section className='fixed-top'>
        <TopoMenu />
        <Navbar expand="lg" className="bg-light py-2 shadow-sm ">
        
            <Container>
                <Navbar.Brand href="/" className="d-flex ">
                    <img 
                        src={logoGefrad} 
                        alt="Gefrad Consulting Logo" 
                        width="70"
                        className="me-2"
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto  gap-3">

                        <Nav.Link href="/" className=" gap-1">
                            <FaHome />&nbsp; Bem-vindo
                        </Nav.Link>

                        {/* Sobre Nós */}
                        <NavDropdown title={<span className="  gap-1"><FaUsers />&nbsp; Sobre Nós</span>} id="sobre-nos-dropdown">
                            <NavDropdown.Item href="#quem-somos" className="d-flex  gap-2"><MdEngineering /> Quem Somos</NavDropdown.Item>
                            <NavDropdown.Item href="#historia" className="d-flex  gap-2"><MdHistoryEdu /> Nossa História</NavDropdown.Item>
                            <NavDropdown.Item href="#equipa" className="d-flex  gap-2"><FaUsers /> Equipa</NavDropdown.Item>
                            <NavDropdown.Item href="#missao" className="d-flex  gap-2"><FaTools /> Missão, Visão e Valores</NavDropdown.Item>
                        </NavDropdown>

                        {/* Serviços */}
                        <NavDropdown title={<span className="  gap-1"><FaTools /> &nbsp;Serviços</span>} id="servicos-dropdown">
                            <NavDropdown.Item href="#construcao" className="d-flex  gap-2"><MdConstruction /> Construção de Edifícios</NavDropdown.Item>
                            <NavDropdown.Item href="#obras-publicas" className="d-flex  gap-2"><BsBuildingsFill /> Obras Públicas</NavDropdown.Item>
                            <NavDropdown.Item href="#reabilitacao" className="d-flex  gap-2"><MdConstruction /> Reabilitação & Remodelação</NavDropdown.Item>
                            <NavDropdown.Item href="#engenharia" className="d-flex  gap-2"><MdEngineering /> Projetos de Engenharia</NavDropdown.Item>
                            <NavDropdown.Item href="#fiscalizacao" className="d-flex  gap-2"><GiFactory /> Fiscalização de Obras</NavDropdown.Item>
                            <NavDropdown.Item href="#arquitetura" className="d-flex  gap-2"><MdArchitecture /> Arquitetura</NavDropdown.Item>
                        </NavDropdown>

                        {/* Projetos */}
                        <NavDropdown title={<span className="  gap-1"><FaProjectDiagram />&nbsp; Projetos</span>} id="projetos-dropdown">
                            <NavDropdown.Item href="#residenciais" className="d-flex  gap-2"><BsBuildingsFill /> Residenciais</NavDropdown.Item>
                            <NavDropdown.Item href="#comerciais" className="d-flex  gap-2"><GiFactory /> Comerciais</NavDropdown.Item>
                            <NavDropdown.Item href="#industriais" className="d-flex  gap-2"><GiFactory /> Industriais</NavDropdown.Item>
                            <NavDropdown.Item href="#infraestruturas" className="d-flex  gap-2"><BsBuildingsFill /> Infraestruturas</NavDropdown.Item>
                            <NavDropdown.Item href="#execucao" className="d-flex  gap-2"><FaTools /> Em Execução</NavDropdown.Item>
                            <NavDropdown.Item href="#concluidos" className="d-flex  gap-2"><FaTools /> Finalizados</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link href="#blog" className="d-none  gap-1">
                            <FaBlog />&nbsp;Blog
                        </Nav.Link>

                        <Nav.Link href="#contactos" className="d-none  gap-1">
                            <FaPhoneAlt /> &nbsp;Contactos
                        </Nav.Link>

                      

                    </Nav>
                      {/* Botão Orçamento */}
                        <Nav.Link 
                            href="#orcamento"
                            className="btn-pedirOracamento text-center gap-1"
                        >
                            Pedir Orçamento
                        </Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar></section>
    );
}

export default Menu;