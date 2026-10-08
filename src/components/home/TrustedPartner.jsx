import { BadgeDollarSign, Tags } from "lucide-react";

import "./TrustedPartner.css";

import trustedPartnerImage from "../../assets/images/trusted-partner.jpg";

const features = [
    {
        id: 1,
        title: "Affordable Price",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        icon: BadgeDollarSign,
    },
    {
        id: 2,
        title: "Trusted Brands",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        icon: Tags,
    },
];

function TrustedPartner() {
    return (
        <section className="trusted-partner-section">
            <div className="trusted-partner-container">
                <div className="trusted-partner-content">
                    <h2 data-aos="fade-up" data-aos-duration="700">
                        Your Trusted Partner In Providing Quality Medical Tools
                        For Clinical Excellence
                    </h2>

                    <p
                        className="trusted-partner-intro"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="100"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur porttitor dignissim odio non posuere. Nullam
                        porttitor malesuada magna, ut ultricies lorem congue sit
                        amet.
                    </p>

                    <p
                        className="trusted-partner-description"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="150"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur porttitor dignissim odio non posuere. Nullam
                        porttitor malesuada magna, ut ultricies lorem congue sit
                        amet. Duis vel est dui. Nunc sit amet tempor sapien.
                        Suspendisse et cursus neque, at imperdiet neque. Etiam
                        eleifend luctus magna sed pellentesque.
                    </p>

                    <div className="trusted-partner-features">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    className="trusted-feature"
                                    key={feature.id}
                                    data-aos="fade-up"
                                    data-aos-duration="700"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="trusted-feature-heading">
                                        <div className="trusted-feature-icon">
                                            <Icon size={25} strokeWidth={1.5} />
                                        </div>

                                        <h3>{feature.title}</h3>
                                    </div>

                                    <div className="trusted-feature-line" />

                                    <p>{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className="trusted-partner-button"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="200"
                    >
                        DISCOVER MORE
                    </button>
                </div>

                <div
                    className="trusted-partner-image"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="150"
                >
                    <img
                        src={trustedPartnerImage}
                        alt="Medical professionals"
                    />
                </div>
            </div>
        </section>
    );
}

export default TrustedPartner;
