import { IoLogoYoutube, IoMdCall } from "react-icons/io";
import "./topoMenu.css";
import { MdMarkEmailUnread } from "react-icons/md";
import { FaFacebookF, FaLinkedin, FaRegClock, FaYoutube } from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";

export default function TopoMenu() {
    return (
        <>
            <section className="topoMenuStyle   ">
                <div className="container">
                    <div className="row text-white py-2">

                        <div className="topoMenuleft col-md-8 col-lg-8">
                            <div className="justify-content-start d-flex">
                                <span className="telefoneStyle d-inline"><IoMdCall fontSize={15} />&nbsp;(+244) 927050952&nbsp;&nbsp;&nbsp;</span>
                                <span className="telefoneStyle d-inline"> <MdMarkEmailUnread fontSize={15} />&nbsp;gefradconsulting@gmail.com&nbsp;&nbsp;&nbsp;</span>
                                <span className="telefoneStyle d-inline"> <FaRegClock fontSize={15} />&nbsp;Seg a sab, das 8h às 17h30. Dom: <strong className="text-danger fw-bold">Fechado</strong></span>



                            </div>
                        </div>

                        <div className="topoMenuright col-md-4 col-lg-4">
                            <div className="justify-content-end d-flex">
                                <span className="telefoneStyle d-inline mx-1"><FaFacebookF fontSize={18} />&nbsp;</span>
                                <span className="telefoneStyle d-inline mx-1"> <BsInstagram fontSize={18} />&nbsp;</span>
                                <span className="telefoneStyle d-inline mx-1"> <FaLinkedin fontSize={18} />&nbsp;</span>
                                <span className="telefoneStyle d-inline mx-1"> <IoLogoYoutube fontSize={18} />&nbsp;</span>



                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}