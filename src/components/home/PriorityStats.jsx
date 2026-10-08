import { BadgeCheck, Heart, Handshake, Tag } from "lucide-react";

import "./PriorityStats.css";

const stats = [
    {
        id: 1,
        icon: BadgeCheck,
        number: "15 +",
        label: "Years Experience",
    },
    {
        id: 2,
        icon: Handshake,
        number: "9,862 +",
        label: "Finished Works",
    },
    {
        id: 3,
        icon: Tag,
        number: "6,534 +",
        label: "Global brands",
    },
    {
        id: 4,
        icon: Heart,
        number: "2,560 +",
        label: "Satisfied Clients",
    },
];

function PriorityStats() {
    return (
        <section className="priority-section">
            <div className="priority-card">
                <div className="priority-top">
                    <div
                        className="priority-heading"
                        data-aos="fade-up"
                        data-aos-duration="700"
                    >
                        <h2>
                            Our Only Priority Is To
                            <br />
                            Keep You Healthy
                        </h2>
                    </div>

                    <div
                        className="priority-description"
                        data-aos="fade-up"
                        data-aos-duration="700"
                        data-aos-delay="100"
                    >
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Curabitur porttitor dignissim odio non
                            posuere. Nullam porttitor malesuada magna, ut
                            ultricies lorem congue sit amet. Duis vel est dui.
                            Nunc sit amet tempor sapien. Suspendisse et cursus
                            neque, at imperdiet neque. Etiam eleifend luctus
                            magna sed pellentesque.
                        </p>
                    </div>
                </div>

                <div className="priority-stats">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                className="priority-stat"
                                key={stat.id}
                                data-aos="fade-up"
                                data-aos-duration="700"
                                data-aos-delay={index * 80}
                            >
                                <div className="priority-stat-icon">
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>

                                <div className="priority-stat-content">
                                    <span className="priority-stat-number">
                                        {stat.number}
                                    </span>

                                    <span className="priority-stat-label">
                                        {stat.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default PriorityStats;
