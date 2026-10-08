import { ShoppingCart } from "lucide-react";
import "./Categories.css";

const categories = [
    {
        id: 1,
        title: "Diagnostic Tools",
        heading: "Save up to $15 on select Digital Thermometers",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        className: "category-card--large category-card--thermometer",
    },
    {
        id: 2,
        title: "Accessories",
        heading: "Save up to $5 on N95 Medical Mask",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        className: "category-card--large category-card--mask",
    },
    {
        id: 3,
        title: "Lab Tools",
        heading: "Save up to $15 All Item",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        className: "category-card--small",
    },
    {
        id: 4,
        title: "Surgical Tools",
        heading: "Save up to $15 All Item",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        className: "category-card--small category-card--surgical",
    },
    {
        id: 5,
        title: "Rehabilitation Tools",
        heading: "Save up to $15 All Item",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        className: "category-card--small",
    },
];

function Categories() {
    return (
        <section className="categories-section">
            <div className="categories-container">
                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <article
                            className={`category-card ${category.className}`}
                            key={category.id}
                            data-aos="fade-up"
                            data-aos-duration="700"
                            data-aos-delay={index * 80}
                        >
                            <div className="category-content">
                                <span className="category-label">
                                    {category.title}
                                </span>

                                <h3>{category.heading}</h3>

                                <p>{category.description}</p>

                                <button
                                    type="button"
                                    className="category-button"
                                >
                                    <ShoppingCart size={16} strokeWidth={2} />
                                    <span>SHOP NOW</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Categories;
