import { Map, Mail, Phone, Clock } from "lucide-react";

import "./Contact.css";

const Contact = () => {
    return (
        <main className="contact-page">
            {/* =================================
          CONTACT BANNER
      ================================= */}

            <section className="contact-banner">
                <div className="contact-banner-overlay"></div>

                <div className="contact-banner-container">
                    <h1 data-aos="fade-up" data-aos-duration="700">
                        Contact Us
                    </h1>

                    <div
                        className="contact-breadcrumb"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="100"
                    >
                        <span>Home</span>

                        <span className="contact-breadcrumb-separator">–</span>

                        <span className="contact-breadcrumb-current">
                            Contact Us
                        </span>
                    </div>
                </div>
            </section>

            {/* =================================
          CONTACT INFORMATION
      ================================= */}

            <section className="contact-info-section">
                <div className="contact-info-container">
                    <div
                        className="contact-info-card"
                        data-aos="fade-up"
                        data-aos-duration="700"
                    >
                        <div className="contact-info-icon">
                            <Map size={42} strokeWidth={1.5} />
                        </div>

                        <h2>Our Address</h2>

                        <p>
                            2nd Ronggo Town House,
                            <br />
                            Pekanbaru, Riau, Indonesia
                        </p>
                    </div>

                    <div
                        className="contact-info-card"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="80"
                    >
                        <div className="contact-info-icon">
                            <Mail size={42} strokeWidth={1.5} />
                        </div>

                        <h2>Our Mail</h2>

                        <p>
                            Hello@rehat.com
                            <br />
                            Support@rehat.com
                        </p>
                    </div>

                    <div
                        className="contact-info-card"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="160"
                    >
                        <div className="contact-info-icon">
                            <Phone size={42} strokeWidth={1.5} />
                        </div>

                        <h2>Our Contact</h2>

                        <p>
                            761-123-456
                            <br />
                            +62 223-456-789
                        </p>
                    </div>

                    <div
                        className="contact-info-card"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="240"
                    >
                        <div className="contact-info-icon">
                            <Clock size={42} strokeWidth={1.5} />
                        </div>

                        <h2>Opening Hours</h2>

                        <p>
                            2nd Ronggo Town House,
                            <br />
                            Pekanbaru, Riau, Indonesia
                        </p>
                    </div>
                </div>
            </section>

            {/* =================================
          CONTACT FORM
      ================================= */}

            <section className="contact-form-section">
                <div
                    className="contact-form-container"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <h2>Send Message Anytime</h2>

                    <form className="contact-form">
                        <div className="contact-form-row">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Name"
                            />

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Name"
                            />
                        </div>

                        <div className="contact-form-row">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                            />

                            <input
                                type="email"
                                name="confirmEmail"
                                placeholder="Email"
                            />
                        </div>

                        <textarea
                            name="message"
                            placeholder="Message"
                            rows="7"
                        ></textarea>

                        <button type="submit">SEND</button>
                    </form>
                </div>
            </section>

            {/* =================================
          MAP
      ================================= */}

            <section
                className="contact-map-section"
                data-aos="fade-up"
                data-aos-duration="700"
            >
                <iframe
                    title="Medical Equipment Location"
                    src="https://www.google.com/maps?q=London%20Eye%2C%20London%2C%20UK&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </section>
        </main>
    );
};

export default Contact;
