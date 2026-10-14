(function () {
  "use strict";

  /* ---------- WhatsApp: número único para todos los botones ---------- */
  var WA_NUMBER = "5491140764045"; // celular de la Dra. Casella (11 4076-4045)
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
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  /* la hamburguesa se transforma en cruz */
  burger.addEventListener("click", function () { setNav(!body.classList.contains("nav-open")); });
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
    fio.observe(document.getElementById("cierre"));
  }

  /* ---------- formulario: se envía por email (FormSubmit) o por WhatsApp ---------- */
  var form = document.getElementById("contactForm"), btn = document.getElementById("formSubmitBtn");
  var waBtn = document.getElementById("formWaBtn"), email = document.getElementById("fEmail");
  var iframe = document.getElementById("formsubmit-iframe"), modal = document.getElementById("okModal"), sending = false;
  if (form) {
    var valid = function (input, porEmail) {
      var v = input.value.trim();
      var ok = input === email
        ? (v === "" ? !porEmail : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        : v !== "";
      input.closest(".field").classList.toggle("err", !ok);
      return ok;
    };
    var check = function (porEmail) {
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (i) { if (!valid(i, porEmail)) ok = false; });
      if (!valid(email, porEmail)) ok = false;
      if (!ok) { var f = form.querySelector(".field.err input,.field.err select,.field.err textarea"); if (f) f.focus(); }
      return ok;
    };
    form.addEventListener("submit", function (e) {
      if (!check(true)) { e.preventDefault(); return; }
      sending = true; btn.disabled = true; btn.textContent = "Enviando...";
    });
    waBtn.addEventListener("click", function () {
      if (!check(false)) return;
      var val = function (id) { return document.getElementById(id).value.trim(); };
      var txt = "Hola, soy " + val("fNombre") + ". Quisiera hacer una consulta sobre " + val("fArea") + ".\n\n" + val("fMsg") +
        "\n\nTeléfono: " + val("fTel") + (val("fEmail") ? "\nEmail: " + val("fEmail") : "");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(txt), "_blank", "noopener");
    });
    form.querySelectorAll("input:not([type=hidden]),select,textarea").forEach(function (i) {
      var re = function () { if (i.closest(".field") && i.closest(".field").classList.contains("err")) valid(i, false); };
      i.addEventListener("input", re);
      i.addEventListener("change", re);
    });
    iframe.addEventListener("load", function () {
      if (!sending) return;
      sending = false; form.reset(); btn.disabled = false; btn.textContent = "Enviar por email";
      modal.classList.add("show");
    });
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.hasAttribute("data-close")) modal.classList.remove("show"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") modal.classList.remove("show"); });
  }

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
