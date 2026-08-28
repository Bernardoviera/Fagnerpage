// Menu mobile + animações (GSAP/ScrollTrigger, se carregado — senão conteúdo já
// aparece normal via CSS, então falha de script nunca esconde nada).
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => links.classList.remove("is-open"));
    });
  }

  // Formulário de lead da Mentoria: monta uma mensagem e abre o WhatsApp do Fagner.
  const leadForm = document.querySelector("#mentoria-form");
  if (leadForm) {
    const WHATSAPP_NUMBER = "5500000000000"; // TODO: substituir pelo WhatsApp real do Fagner (DDI+DDD+número, só dígitos)

    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nome = leadForm.nome.value.trim();
      const whatsapp = leadForm.whatsapp.value.trim();
      const engenharia = leadForm.engenharia.value.trim();
      const regiao = leadForm.regiao.value.trim();

      const lines = [
        "Olá, Fagner! Quero saber mais sobre a Mentoria em Perícias Judiciais.",
        `Nome: ${nome}`,
        `WhatsApp: ${whatsapp}`,
      ];
      if (engenharia) lines.push(`Área de engenharia: ${engenharia}`);
      if (regiao) lines.push(`Região: ${regiao}`);

      const message = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    });
  }

  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Entrada do hero: elementos aparecem em sequência ao carregar a página.
  const heroTargets = gsap.utils.toArray(
    ".hero .eyebrow, .hero h1, .hero .lede, .hero .badge, .hero-price, .hero-actions"
  );
  if (heroTargets.length) {
    gsap.fromTo(
      heroTargets,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.12 }
    );
  }

  // Revela cada .reveal ao entrar na viewport durante o scroll.
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }
    );
  });

  // Contadores animados nas estatísticas (10 / 95%).
  gsap.utils.toArray(".stat .num").forEach((el) => {
    const raw = el.textContent.trim();
    const target = parseInt(raw, 10);
    const suffix = raw.replace(/^[0-9]+/, "");
    if (Number.isNaN(target)) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.4,
      ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => {
        el.textContent = Math.round(counter.value) + suffix;
      },
    });
  });
});
