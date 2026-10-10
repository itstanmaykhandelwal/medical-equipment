import { ArrowRight } from "lucide-react";
import heroImage from "../../assets/images/home-banner.png";
import "./Hero.css";

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero__container">
                {/* Content */}
                <div
                    className="hero__content"
                    data-aos="fade-up"
                    data-aos-duration="500"
                >
                    <span
                        className="hero__eyebrow"
                        data-aos="fade-up"
                        data-aos-duration="400"
                    >
                        ECO Allies Association
                    </span>

                    <h1
                        className="hero__title"
                        data-aos="fade-up"
                        data-aos-duration="500"
                    >
                        Providing Quality &
                        <br />
                        Reliable Health Solutions
                    </h1>

                    <p
                        className="hero__description"
                        data-aos="fade-up"
                        data-aos-duration="600"
                    >
                        Providing reliable and high-quality medical equipment
                        designed to support healthcare professionals and improve
                        patient care.
                    </p>

                    <a
                        href="/products"
                        className="hero__button"
                        data-aos="fade-up"
                        data-aos-duration="600"
                    >
                        DISCOVER MORE
                        <ArrowRight size={16} />
                    </a>

                    {/* Reviews */}
                    <div
                        className="hero__review"
                        data-aos="fade-up"
                        data-aos-duration="600"
                    >
                        <div className="hero__avatars">
                            <img src="/images/user-1.jpg" alt="" />
                            <img src="/images/user-2.jpg" alt="" />
                            <img src="/images/user-3.jpg" alt="" />
                            <img src="/images/user-4.jpg" alt="" />
                            <img src="/images/user-5.jpg" alt="" />
                        </div>

                        <div className="hero__rating">
                            <strong>4.9/5</strong>
                            <span>1000+ Happy Customer</span>
                        </div>
                    </div>
                </div>

                {/* Doctor */}
                <div
                    className="hero__visual"
                    data-aos="fade-up"
                    data-aos-duration="600"
                >
                    <img
                        src={heroImage}
                        alt="Medical equipment"
                        className="hero__doctor"
                    />

                    <div
                        className="hero__client-card"
                        data-aos="fade-up"
                        data-aos-duration="500"
                    >
                        <strong>125+</strong>
                        <span>Happy Client</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
