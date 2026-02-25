/* =========================================
   SPIREZEN DIMENSION - 3D Interactions (GSAP + ScrollTrigger)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugin
    gsap.registerPlugin(ScrollTrigger);

    // =========================================
    // 1. HERO SECTION: "The Quantum Core"
    // Deep space cursor tracking on text & logo
    // =========================================
    const heroContent = document.querySelector('.welcome-section .content');
    const heroText = document.querySelector('.contenth1');
    const heroLogo = document.querySelector('.logowel');

    if (heroContent) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Normalized coordinates (-1 to 1)
            const x = (clientX - centerX) / centerX;
            const y = (clientY - centerY) / centerY;

            // Animate Text deeply Inverse
            gsap.to(heroText, {
                x: -x * 40,
                y: -y * 40,
                rotationY: x * 15,
                rotationX: -y * 15,
                duration: 1,
                ease: "power2.out"
            });

            // Animate Logo Forward
            gsap.to(heroLogo, {
                x: x * 20,
                y: y * 20,
                rotationY: x * 25,
                rotationX: -y * 25,
                duration: 1.5,
                ease: "power2.out"
            });

            // Subtle shift on the whole wrapper
            gsap.to(heroContent, {
                rotationY: x * 5,
                rotationX: -y * 5,
                duration: 2,
                ease: "power1.out"
            });
        });
    }

    // =========================================
    // 2. VIDEO SECTION: "Holographic Projection"
    // Aggressive tilt that flattens out on scroll
    // =========================================
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        // Initial set flat for trigger point
        gsap.set(videoWrapper, { rotationX: 45, scale: 0.8, y: 100, opacity: 0 });

        ScrollTrigger.create({
            trigger: '.video-section',
            start: "top 80%",
            end: "center center",
            scrub: 1, // Smooth scrubbing
            animation: gsap.to(videoWrapper, {
                rotationX: 0,
                scale: 1,
                y: 0,
                opacity: 1,
                boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 0 2px rgba(232,170,86,0.6)",
                ease: "power2.out"
            })
        });
    }

    // =========================================
    // 3. QUOTE SECTION: "Layout Tension"
    // =========================================
    const splitQuoteLeft = document.querySelector('.split-quote-left');
    const splitQuoteRight = document.querySelector('.split-quote-right');
    const accentWords = document.querySelectorAll('.split-quote-section .accent-word');

    if (splitQuoteLeft && splitQuoteRight) {
        const quoteTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.split-quote-section',
                start: "top 70%", // Start animation when 70% of the section is in view
                toggleActions: "play none none none"
            }
        });

        // Step 1: Left block fades in and slides from left
        quoteTl.to(splitQuoteLeft, {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out"
        });

        // Step 2: Right block slides in from right after 0.4s delay
        quoteTl.to(splitQuoteRight, {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out"
        }, "-=0.3"); // Overlap slightly to match the 0.4s delay after left block starts (0.7 - 0.3 = 0.4)

        // Step 3: Accent words highlight after text settles
        if (accentWords.length > 0) {
            quoteTl.add(() => {
                accentWords.forEach(word => word.classList.add('highlight'));
            }, "+=0.5"); // 0.5s delay after the blocks settle
        }
    }

    // =========================================
    // 4. BIO SECTION: "Isometric Split-View"
    // Assembles from off-screen
    // =========================================
    const bioImage = document.querySelector('.indeximagebio_image');
    const bioContent = document.querySelector('.indeximagebio_content');

    if (bioImage && bioContent) {
        const bioTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.indeximagebio_section',
                start: "top 75%",
                end: "center center",
                scrub: 1.5
            }
        });

        // Image flies in from left, isometric angle
        bioTl.fromTo(bioImage,
            { x: -200, opacity: 0, rotationY: -45, scale: 0.8 },
            { x: 0, opacity: 1, rotationY: 0, scale: 1, ease: "power3.out" }
        );

        // Content flies in from right
        bioTl.fromTo(bioContent,
            { x: 200, opacity: 0, rotationY: 45, scale: 0.8 },
            { x: 0, opacity: 1, rotationY: 0, scale: 1, ease: "power3.out" },
            "<" // start at same time
        );
    }

    // =========================================
    // 5. MUNTERRA SECTION: "Golden Monolith"
    // =========================================
    const amunImage = document.querySelector('.amun_image');
    const amunContent = document.querySelector('.amun_content');

    if (amunImage && amunContent) {
        // Metallic rise effect
        gsap.fromTo(amunImage,
            { y: 150, rotationX: 30, opacity: 0, filter: "brightness(0.5) contrast(1.5)" },
            {
                y: 0, rotationX: 0, opacity: 1, filter: "brightness(1) contrast(1)",
                duration: 1.5, ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: '.amun_intro',
                    start: "top 80%"
                }
            }
        );

        gsap.from(amunContent.children, {
            y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power2.out",
            scrollTrigger: {
                trigger: '.amun_intro',
                start: "top 70%"
            }
        });
    }

    // =========================================
    // 6. PRODUCT LINEUP: "Cybernetic Coverflow"
    // =========================================
    const prodContainer = document.querySelector('.prodlineup_container');

    if (prodContainer) {
        gsap.fromTo(prodContainer,
            { z: -800, rotationX: 60, opacity: 0 },
            {
                z: 0, rotationX: 0, opacity: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.prodlineup_section',
                    start: "top 85%",
                    end: "center center",
                    scrub: 1
                }
            }
        );
    }

    // =========================================
    // 7. STATS SECTION: "Floating Orbs/Nodes"
    // Animate the entire container to prevent cloning conflicts
    // =========================================
    const statContainer = document.querySelector('.testimun_name-container');
    if (statContainer) {
        gsap.from(statContainer, {
            y: 100,
            z: -200,
            opacity: 0,
            rotationX: -20,
            duration: 1.5,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: '.testimun_name-section',
                start: "top 85%"
            }
        });
    }

    // =========================================
    // 8. TEAM SECTION: "Carousel Dimension"
    // Note: Depends on existing cardscript for loop, this just adds 3D entry
    // =========================================
    const teamCarousel = document.querySelector('.team-carousel');
    if (teamCarousel) {
        gsap.fromTo(teamCarousel,
            { rotationY: -90, scale: 0.5, opacity: 0 },
            {
                rotationY: 0, scale: 1, opacity: 1,
                duration: 1.5, ease: "power3.out",
                scrollTrigger: {
                    trigger: '.team-split-section',
                    start: "top 80%"
                }
            }
        );
    }

    // =========================================
    // 9. FEATURES: "Levitating Pillars"
    // =========================================
    const features = document.querySelectorAll('.feature-box');
    if (features.length > 0) {
        features.forEach((feat, i) => {
            gsap.fromTo(feat,
                { y: 150, z: -300, rotationX: -45, opacity: 0 },
                {
                    y: 0, z: 0, rotationX: 0, opacity: 1,
                    duration: 1.2, delay: i * 0.15, ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: '.key-features-section',
                        start: "top 80%"
                    }
                }
            );
        });
    }

    // =========================================
    // 10. ANNOUNCEMENTS: "Hyper-Tunnel"
    // =========================================
    const announcementSlider = document.querySelector('.announcement_slider');
    if (announcementSlider) {
        gsap.fromTo(announcementSlider,
            { scale: 0.2, z: -2000, opacity: 0 },
            {
                scale: 1, z: 0, opacity: 1,
                duration: 1.5, ease: "expo.out",
                scrollTrigger: {
                    trigger: '.announcement_section',
                    start: "top 80%"
                }
            }
        );
    }

    // =========================================
    // 11. FOOTER REVEAL
    // =========================================
    const footer = document.querySelector('.footer-container');
    if (footer) {
        gsap.fromTo(footer,
            { rotationX: -20, y: 100, transformOrigin: "top center", opacity: 0 },
            {
                rotationX: 0, y: 0, opacity: 1,
                scrollTrigger: {
                    trigger: '.footer-container',
                    start: "top 95%",
                    end: "bottom bottom",
                    scrub: 1
                }
            }
        );
    }

});
