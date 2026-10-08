import { ArrowLeftRight, Truck, Headphones, UserRound } from "lucide-react";

import "./Benefits.css";

const benefits = [
  {
    id: 1,
    title: "14-Day Return",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec.",
    icon: ArrowLeftRight,
  },
  {
    id: 2,
    title: "Free Shipping",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec.",
    icon: Truck,
  },
  {
    id: 3,
    title: "24/7 Support",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec.",
    icon: Headphones,
  },
  {
    id: 4,
    title: "Member Discount",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec.",
    icon: UserRound,
  },
];

function Benefits() {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <div className="benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article
                className="benefit-item"
                key={benefit.id}
                data-aos="fade-up"
                data-aos-duration="700"
                data-aos-delay={index * 80}
              >
                <div className="benefit-heading">
                  <div className="benefit-icon">
                    <Icon size={30} strokeWidth={1.5} />
                  </div>

                  <h3>{benefit.title}</h3>
                </div>

                <div className="benefit-line" />

                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Benefits;