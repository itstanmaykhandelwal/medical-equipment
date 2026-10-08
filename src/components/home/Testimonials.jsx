import { useEffect, useState } from "react";

import "./Testimonials.css";

import testimonialOne from "../../assets/images/team1.jpg";
import testimonialTwo from "../../assets/images/team2.jpg";
import testimonialThree from "../../assets/images/team1.jpg";

const testimonials = [
    {
        id: 1,
        name: "Testimonial #1",
        designation: "Designation",
        image: testimonialOne,
        review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas facilisis risus, sit amet dignissim lacus maximus luctus. Nulla bibendum semper purus, vitae iaculis massa lacinia a. Suspendisse commodo suscipit leo sit amet lacinia.",
    },
    {
        id: 2,
        name: "Testimonial #2",
        designation: "Designation",
        image: testimonialTwo,
        review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas facilisis risus, sit amet dignissim lacus maximus luctus. Nulla bibendum semper purus, vitae iaculis massa lacinia a. Suspendisse commodo suscipit leo sit amet lacinia.",
    },
    {
        id: 3,
        name: "Testimonial #3",
        designation: "Designation",
        image: testimonialThree,
        review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas facilisis risus, sit amet dignissim lacus maximus luctus. Nulla bibendum semper purus, vitae iaculis massa lacinia a. Suspendisse commodo suscipit leo sit amet lacinia.",
    },
];

function Testimonials() {
    const [activeSlide, setActiveSlide] = useState(0);

    const totalSlides = 2;

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % totalSlides);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div
                    className="testimonials-heading"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <h2>What Our Client’s Say</h2>
                </div>

                <div
                    className="testimonials-slider"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="100"
                >
                    <div
                        className="testimonials-track"
                        style={{
                            transform: `translateX(-${activeSlide * 50}%)`,
                        }}
                    >
                        {testimonials.map((testimonial) => (
                            <article
                                className="testimonial-card"
                                key={testimonial.id}
                            >
                                <div className="testimonial-stars">
                                    <span>★</span>
                                    <span>★</span>
                                    <span>★</span>
                                    <span>★</span>
                                    <span>★</span>
                                </div>

                                <p className="testimonial-review">
                                    {testimonial.review}
                                </p>

                                <div className="testimonial-bottom">
                                    <div className="testimonial-user">
                                        <div className="testimonial-avatar">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                            />
                                        </div>

                                        <div className="testimonial-user-info">
                                            <h3>{testimonial.name}</h3>

                                            <span>
                                                {testimonial.designation}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="testimonial-quote">”</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div
                    className="testimonials-pagination"
                    data-aos="fade-up"
                    data-aos-duration="700"
                    data-aos-delay="150"
                >
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`testimonial-dot ${
                                activeSlide === index ? "active" : ""
                            }`}
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Go to testimonial slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
