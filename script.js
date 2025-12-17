document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger"); 
  const menubar = document.querySelector(".menubar");

  if (hamburger && menubar) {
    hamburger.addEventListener("click", function () {
      menubar.classList.toggle("active");
    });
  }
});
