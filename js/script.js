const sections = document.querySelectorAll(".section");
const links = document.querySelectorAll(".navbar a");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));

    sections.forEach(section => section.classList.remove("active"));
    target.classList.add("active");
  });
});
