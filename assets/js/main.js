/* ============================================================
   روائع التصميم للديكور — main.js (vanilla)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Preloader: always hide ---------- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("hidden");
    setTimeout(function () { preloader.style.display = "none"; }, 650);
  }
  window.addEventListener("load", hidePreloader);
  // Hard fallback — never leave content hidden
  setTimeout(hidePreloader, 1200);

  /* ---------- Sticky header shrink ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile full-screen menu ---------- */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");
  var mmClose = document.getElementById("mmClose");

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
    if (burger) burger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (mmClose) mmClose.addEventListener("click", closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); closeLightbox(); }
  });

  /* ---------- Scroll reveal (IntersectionObserver + fallback) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // Fallback: ensure everything visible after 1.6s even if observer misfires
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add("visible"); });
    }, 1600);
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var src = item.getAttribute("data-full");
      if (src && lightbox && lightboxImg) {
        lightboxImg.setAttribute("src", src);
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    if (toastMsg && msg) toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  /* ---------- Quote form → WhatsApp + localStorage ---------- */
  var form = document.getElementById("quoteForm");
  var WA_NUMBER = "966501908463";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = (document.getElementById("name") || {}).value || "";
      var phone = (document.getElementById("phone") || {}).value || "";
      var service = (document.getElementById("service") || {}).value || "";
      var notes = (document.getElementById("notes") || {}).value || "";

      name = name.trim();
      phone = phone.trim();

      if (!name || !phone || !service) {
        showToast("يرجى تعبئة الاسم والجوال والخدمة");
        return;
      }

      // Save to localStorage (demo)
      try {
        var key = "rawae_quotes";
        var list = JSON.parse(localStorage.getItem(key) || "[]");
        list.push({
          name: name, phone: phone, service: service, notes: notes.trim(),
          at: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(list));
      } catch (err) { /* ignore storage errors */ }

      // Build WhatsApp message
      var lines = [
        "السلام عليكم، أرغب في طلب عرض سعر من روائع التصميم للديكور:",
        "",
        "• الاسم: " + name,
        "• الجوال: " + phone,
        "• الخدمة: " + service
      ];
      if (notes.trim()) lines.push("• التفاصيل: " + notes.trim());
      var text = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + text;

      showToast("تم تجهيز طلبك — يتم تحويلك إلى واتساب");
      form.reset();
      setTimeout(function () { window.open(url, "_blank"); }, 700);
    });
  }

  /* ---------- Year (footer is static 2026 per dossier) ---------- */
})();
