import { useState } from "react";
import { Map, Mail, Phone, Clock } from "lucide-react";

import "./Contact.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/+$/, "");

const Contact = () => {
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) return;

        const form = event.currentTarget;
        const formData = new FormData(form);

        const firstName = String(formData.get("firstName") || "").trim();
        const lastName = String(formData.get("lastName") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const confirmEmail = String(formData.get("confirmEmail") || "").trim();
        const message = String(formData.get("message") || "").trim();

        setFeedback({ type: "", message: "" });

        if (!firstName || !lastName || !email || !confirmEmail || !message) {
            setFeedback({
                type: "error",
                message: "Please fill in all fields.",
            });
            return;
        }

        if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
            setFeedback({
                type: "error",
                message: "Email addresses do not match.",
            });
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    confirmEmail,
                    message,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to send your message.",
                );
            }

            form.reset();

            setFeedback({
                type: "success",
                message:
                    result.message ||
                    "Your message has been sent successfully.",
            });
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="contact-page">
            {/* CONTACT BANNER */}
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

            {/* CONTACT INFORMATION */}
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
                            Monday – Saturday
                            <br />
                            9:00 AM – 6:00 PM
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT FORM */}
            <section className="contact-form-section">
                <div
                    className="contact-form-container"
                    data-aos="fade-up"
                    data-aos-duration="700"
                >
                    <h2>Send Message Anytime</h2>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="contact-form-row">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                autoComplete="given-name"
                                maxLength={80}
                                required
                            />

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                autoComplete="family-name"
                                maxLength={80}
                                required
                            />
                        </div>

                        <div className="contact-form-row">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                maxLength={254}
                                required
                            />

                            <input
                                type="email"
                                name="confirmEmail"
                                placeholder="Confirm Email"
                                autoComplete="off"
                                maxLength={254}
                                required
                            />
                        </div>

                        <textarea
                            name="message"
                            placeholder="Message"
                            rows={7}
                            maxLength={5000}
                            required
                        />

                        {feedback.message && (
                            <p
                                className={`contact-feedback contact-feedback-${feedback.type}`}
                                role={
                                    feedback.type === "error"
                                        ? "alert"
                                        : "status"
                                }
                                aria-live="polite"
                            >
                                {feedback.message}
                            </p>
                        )}

                        <button type="submit" disabled={submitting}>
                            {submitting ? "SENDING..." : "SEND"}
                        </button>
                    </form>
                </div>
            </section>

            {/* MAP */}
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
                />
            </section>
        </main>
    );
};

export default Contact;
