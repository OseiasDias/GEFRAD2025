import "./banner.css";
export default function Banner() {
    return (
        <>
            <section className="bannerStyle d-flex justify-content-center align-items-center" style={{ height: '100vh', overflow: 'hidden' }}>
                <div className="d-flex justify-content-center align-items-center text-center w-100 h-100">
                    <h1 className="textoPrincipalBanner"
                    >
                        GEFRAD <br />
                        <span className="ms-lg-5 ps-lg-5 ">CONSTRUÇÕES</span>                    </h1>
                </div>
            </section>
        </>
    );
}