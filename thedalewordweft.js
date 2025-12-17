document.addEventListener("DOMContentLoaded", () => {
  /* ===== FAQ ACCORDION ===== */
  const faqItems = document.querySelectorAll(".dw-faq__item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".dw-faq__q");
    const answer = item.querySelector(".dw-faq__a");

    if (!button || !answer) return;

    // set big number text attribute once (used for ghost background number)
    const num = button.querySelector(".dw-faq__num");
    if (num && !num.dataset.big) {
      num.dataset.big = num.textContent.trim();
    }

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("dw-open");

      // Close all others (accordion behaviour)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("dw-open");
          const btn = other.querySelector(".dw-faq__q");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle this one
      item.classList.toggle("dw-open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ===== GLASS NAV: DROPDOWNS (MOBILE) ===== */
  const dropdownParents = document.querySelectorAll(".pro-has-dd");

  dropdownParents.forEach((parent) => {
    const btn = parent.querySelector(".pro-nav__btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      const mqDesktop = window.matchMedia("(min-width: 981px)");
      if (mqDesktop.matches) return; // desktop handled by hover

      e.preventDefault();
      const isOpen = parent.classList.contains("is-open");
      dropdownParents.forEach((p) => p.classList.remove("is-open"));
      if (!isOpen) parent.classList.add("is-open");

      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ===== MOBILE SHEET NAV ===== */
  const hamburger = document.getElementById("proHamburger");
  const sheet = document.getElementById("proDrawer");
  const overlay = document.getElementById("proOverlay");
  const closeBtn = document.getElementById("proClose");

  function openSheet() {
    if (!sheet || !overlay || !hamburger) return;
    sheet.classList.add("is-open");
    overlay.classList.add("is-visible");
    overlay.hidden = false;
    hamburger.setAttribute("aria-expanded", "true");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    if (!sheet || !overlay || !hamburger) return;
    sheet.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    hamburger.setAttribute("aria-expanded", "false");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // small delay to allow fade-out before hiding
    setTimeout(() => {
      if (!overlay.classList.contains("is-visible")) {
        overlay.hidden = true;
      }
    }, 200);
  }

  if (hamburger) {
    hamburger.addEventListener("click", openSheet);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSheet);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSheet);
  }

  // close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSheet();
    }
  });

  /* ===== FOOTER YEAR & BACK TO TOP ===== */
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== FOOTER QUICK LINKS COLLAPSE (MOBILE) ===== */
  const linksToggle = document.querySelector(".links-toggle");
  const quickLinks = document.getElementById("quick-links-list");

  if (linksToggle && quickLinks) {
    linksToggle.addEventListener("click", () => {
      const expanded = linksToggle.getAttribute("aria-expanded") === "true";
      linksToggle.setAttribute("aria-expanded", String(!expanded));
      quickLinks.style.display = expanded ? "none" : "flex";
      quickLinks.style.flexDirection = "column";
      quickLinks.style.alignItems = "flex-start";
    });

    // default collapsed on small screens
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        quickLinks.style.display = "none";
        linksToggle.setAttribute("aria-expanded", "false");
      } else {
        quickLinks.style.display = "flex";
        quickLinks.style.flexDirection = "column";
        quickLinks.style.alignItems = "flex-start";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
  }

  /* ===== WORKSHOP CARD HOVER EFFECT ===== */
  const cards = document.querySelectorAll(".dw-card");
  const ctaBtn = document.querySelector(".dw-center .dw-cta");

  if (cards.length && ctaBtn) {
    // Cache the icon so we don't lose it when updating text
    const icon = ctaBtn.querySelector("svg");
    const iconHTML = icon ? icon.outerHTML : "";

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const title = card.querySelector(".dw-card__title");
        const href = card.getAttribute("href");

        if (title && href) {
          // Update button text and link
          // We use innerHTML to prepend text before the icon
          ctaBtn.innerHTML = `View ${title.textContent.trim()} Workshop ${iconHTML}`;
          ctaBtn.setAttribute("href", href);
        }
      });
    });
  }
});
