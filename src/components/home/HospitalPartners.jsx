import "./HospitalPartners.css";

import logo1 from "../../assets/images/logoipsum-1.png";
import logo2 from "../../assets/images/logoipsum-2.png";

const hospitals = [
    {
        id: 1,
        logo: logo1,
    },
    {
        id: 2,
        logo: logo2,
    },
    {
        id: 3,
        logo: logo1,
    },
    {
        id: 4,
        logo: logo2,
    },
    {
        id: 5,
        logo: logo2,
    },
    {
        id: 6,
        logo: logo1,
    },
    {
        id: 7,
        logo: logo2,
    },
    {
        id: 8,
        logo: logo1,
    },
];

const HospitalPartners = () => {
    return (
        <section className="hospital-partners-section">
            <div className="hospital-partners-container">
                <div
                    className="hospital-partners-heading"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <h2>
                        Collaborated With 40+
                        <br />
                        Hospitals In The World
                    </h2>
                </div>

                <div
                    className="hospital-partners-grid"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="100"
                >
                    {hospitals.map((hospital) => (
                        <div
                            className="hospital-partner-card"
                            key={hospital.id}
                        >
                            <img src={hospital.logo} alt="Hospital Partner" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HospitalPartners;
