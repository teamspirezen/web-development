const prodlineupData = {
  thedalemun: {
    title: "thedalemun.",
    price: "Empowering Future-Ready Minds",
    desc: "thedalemun is a transformative program designed to build confidence, communication, and global awareness in students through real-world simulations, debate, and leadership training—equipping them to thrive in an interconnected world.",
    img: "thedalemun.svg",
    buttonText: "Explore thedalemun",
    link: "thedalemunclub.html"
  },
  thedalewordweft: {
    title: "thedalewordweft.",
    price: "Skill Development, Reimagined",
    desc: "Under TheDaleWordWeft, Munterra and a series of upcoming workshops offer structured learning experiences that build strong foundational skills and advance participants toward industry-ready expertise through real-world challenges.",
    img: "thedalewordweft.svg",
    buttonText: "Explore thedalewordweft",
    link: "thedalewordweft.html"
  },
  thedalediginova: {
    title: "thedalediginova.",
    price: "Master the Digital Economy",
    desc: "thedalediginova offers a comprehensive suite of digital marketing, tech, and business modules—crafted to help individuals and institutions upskill and thrive in today’s fast-evolving digital landscape.",
    img: "thedalediginova.svg",
    buttonText: "Coming Soon.",
    link: "thedalediginova.html"
  }
};

// DOM refs
const prodlineupOptions = document.querySelectorAll('.prodlineup_filter-option');
const prodlineupContainer = document.querySelector('.prodlineup_container');
const prodlineupTitle = document.getElementById('car-title');
const prodlineupPrice = document.getElementById('car-price');
const prodlineupDesc = document.getElementById('car-desc');
const prodlineupImg = document.getElementById('car-img');
const prodlineupBtn = document.getElementById('car-button');

// Timing must match CSS transition
const PRODLINEUP_TRANSITION_MS = 320;

// Attach click handlers
prodlineupOptions.forEach(option => {
  option.addEventListener('click', () => {
    if (option.classList.contains('active')) return;

    // Update active state
    prodlineupOptions.forEach(opt => {
      opt.classList.remove('active');
      opt.setAttribute('aria-selected', 'false');
    });
    option.classList.add('active');
    option.setAttribute('aria-selected', 'true');

    const model = option.dataset.model;
    const data = prodlineupData[model];
    if (!data) return;

    // Trigger fade-out
    prodlineupContainer.classList.add('fade-out');

    setTimeout(() => {
      // Update content
      prodlineupTitle.textContent = data.title;
      prodlineupPrice.textContent = data.price;
      prodlineupDesc.textContent = data.desc;
      prodlineupImg.src = data.img;
      prodlineupBtn.textContent = data.buttonText;
      prodlineupBtn.href = data.link;

      // Fade back in
      prodlineupContainer.classList.remove('fade-out');
    }, PRODLINEUP_TRANSITION_MS);
  });
});
