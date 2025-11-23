import Banner from "../../components/banner/banner";
import Menu from "../../components/menu/Menu";
import NossosServicos from "../../components/servicos/NossosServicos";
import SobreNos from "../../components/sobre/SobreNos";
import "./HomePage.css";

export default function HomePage() {
    return (

        <>
            <section className="h-100 vh-100  homePageStyle">
                <Menu />
                <Banner />
            </section>
            <section>
                 <SobreNos />
            </section>
            <section>
                <NossosServicos />
            </section>
        </>


    );
}