import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import PublicHeader from "./PublicHeader";
import "./Home.css";

function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
        console.log("EmailJS key:", process.env.REACT_APP_EMAILJS_PUBLIC_KEY),
        console.log("ALL ENV:", process.env)

      )
      .then(
        () => {
          alert("Message sent successfully.");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          alert("Failed to send message.");
        }
      );
  };

  return (
    <div className="home-container">
      <PublicHeader />
      <h1>Welcome to XTrack, Your Expense Tracker</h1>
      <p>Manage your expenses easily and keep track of your spending.</p>

      <div className="button-group">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>

      <div className="contact-section">
        <h2>Contact Us </h2>

        <p><strong>Phone:</strong> +233 56 180 1889</p>

        <p>
          <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/0561801889"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:maila.report.team@gmail.com">
            maila.report.team@gmail.com
          </a>
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Report an Issue</h3>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div><textarea
            name="message"
            placeholder="Your Issue"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea></div>

          <button className="button-group" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
