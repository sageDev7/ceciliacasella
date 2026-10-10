(function () {
  "use strict";

  /* ---------- WhatsApp: número único para todos los botones ---------- */
  var WA_NUMBER = "5490000000000"; // PENDIENTE: reemplazar por el número real de la Dra. Casella
  document.querySelectorAll(".js-wa").forEach(function (a) {
    var msg = a.getAttribute("data-msg") || "Hola, quisiera hacer una consulta.";
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  var body = document.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header ---------- */
  var hdr = document.getElementById("hdr");
  function onScroll() { hdr.classList.toggle("sc", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- menú mobile ---------- */
  var burger = document.getElementById("burger");
  function setNav(open) {
    body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  }
  burger.addEventListener("click", function () { setNav(true); });
  document.getElementById("mnavX").addEventListener("click", function () { setNav(false); });
  document.getElementById("mnavOv").addEventListener("click", function () { setNav(false); });
  document.querySelectorAll(".mnav a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  /* ---------- áreas: paneles que se expanden (solo desktop) ---------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var mqDesk = window.matchMedia("(min-width:1025px)");
  function open(p) {
    if (!mqDesk.matches) return;
    panels.forEach(function (x) { x.classList.toggle("is-open", x === p); });
  }
  var hoverT;
  panels.forEach(function (p) {
    /* pequeña pausa: si el mouse solo pasa de largo, no se abre */
    p.addEventListener("mouseenter", function () { clearTimeout(hoverT); hoverT = setTimeout(function () { open(p); }, 140); });
    p.addEventListener("mouseleave", function () { clearTimeout(hoverT); });
    p.addEventListener("focus", function () { open(p); });
    p.addEventListener("click", function () { open(p); });
  });
  /* los links del hero (Familia, Civil...) abren el panel correspondiente */
  document.querySelectorAll('.hero-areas a').forEach(function (a) {
    a.addEventListener("click", function () {
      var p = document.querySelector(a.getAttribute("href"));
      if (p) open(p);
    });
  });

  /* ---------- reveals ---------- */
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- WhatsApp flotante: se oculta en el contacto y el footer ---------- */
  var fab = document.getElementById("waFloat");
  if ("IntersectionObserver" in window) {
    var hidden = new Set();
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) hidden.add(en.target); else hidden.delete(en.target); });
      fab.classList.toggle("hide", hidden.size > 0);
    });
    fio.observe(document.getElementById("contacto"));
    fio.observe(document.getElementById("ftr"));
  }

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
