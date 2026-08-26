import React from 'react'
import '../styles/about.css'

const About = () => {
    return (
        <main className="about-page">
            <section className="about-card" aria-labelledby="about-title">
                <div className="about-image-wrap">
                    <img src="/jawad.png" alt="ShopNest community" className="about-image" />
                    <span className="about-badge">ShopNest</span>
                </div>
                <div className="about-content">
                    <p className="about-eyebrow">Our community</p>
                    <h1 id="about-title">About Me</h1>
                    <p className="about-lead">Join the community and grow together.</p>
                    <p className="about-description">
                        Welcome to ShopNest, a place where thoughtful products meet a simple, enjoyable shopping experience. We build with care, listen to our community, and keep improving every day.
                    </p>
                    <div className="about-highlights">
                        <div>
                            <strong>Curated</strong>
                            <span>Products worth discovering</span>
                        </div>
                        <div>
                            <strong>Community-led</strong>
                            <span>Built around your experience</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default About