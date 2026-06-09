"use client";

import { useEffect } from "react";

/**
 * Orquesta las animaciones de scroll de toda la app:
 *  - reveal de [data-reveal] al entrar en viewport (con stagger en [data-reveal-group]).
 *  - contadores [data-count] que se animan una vez al verse.
 *  - barra de progreso de scroll (.scroll-progress).
 *
 * Respeta prefers-reduced-motion y no oculta nada si JS no se ejecuta.
 *
 * Importante: vive en el layout raíz, así que también cubre las páginas de la
 * app, cuyo contenido se monta DESPUÉS (cuando Convex carga los tickets) o tras
 * navegar entre rutas. Por eso, además del escaneo inicial, un MutationObserver
 * registra cualquier [data-reveal] que aparezca luego; si no, el CSS de
 * `.reveal-ready` lo dejaría oculto (opacity:0) para siempre.
 */
export function ScrollFX() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Activa el "hiding" controlado por CSS solo cuando hay JS.
    root.classList.add("reveal-ready");

    let revealObs: IntersectionObserver | undefined;
    if (!reduce) {
      revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-revealed", "true");
            revealObs?.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
      );
    }

    // Stagger para los hijos directos de un [data-reveal-group].
    const applyStagger = (group: HTMLElement) => {
      const step = Number(group.dataset.revealStep || 90);
      group
        .querySelectorAll<HTMLElement>(":scope > [data-reveal]")
        .forEach((el, i) => {
          if (!el.style.getPropertyValue("--reveal-delay")) {
            el.style.setProperty("--reveal-delay", `${i * step}ms`);
          }
        });
    };

    // Registra un [data-reveal]: lo revela (reduced motion) o lo observa.
    // Idempotente: data-reveal-bound evita volver a observar el mismo nodo.
    const register = (el: HTMLElement) => {
      if (el.dataset.revealBound === "true") return;
      el.dataset.revealBound = "true";
      if (reduce) {
        el.setAttribute("data-revealed", "true");
      } else {
        revealObs?.observe(el);
      }
    };

    // Procesa un subárbol: primero stagger de grupos, luego registra reveals.
    const scan = (node: ParentNode) => {
      node
        .querySelectorAll<HTMLElement>("[data-reveal-group]")
        .forEach(applyStagger);
      node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(register);
    };

    scan(document);

    // Contenido que se monta después (datos async, navegación SPA).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal-group]")) applyStagger(node);
          node
            .querySelectorAll<HTMLElement>("[data-reveal-group]")
            .forEach(applyStagger);
          if (node.matches("[data-reveal]")) register(node);
          node.querySelectorAll<HTMLElement>("[data-reveal]").forEach(register);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Contadores animados.
    const formatES = (n: number, dec: number) =>
      n.toLocaleString("es-ES", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      });

    const runCount = (el: HTMLElement) => {
      const target = Number(el.dataset.count || 0);
      const dec = Number(el.dataset.decimals || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      if (reduce) {
        el.textContent = prefix + formatES(target, dec) + suffix;
        return;
      }
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + formatES(target * eased, dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCount(entry.target as HTMLElement);
          countObs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-count]")
      .forEach((el) => countObs.observe(el));

    // Barra de progreso de scroll.
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    let ticking = false;
    const update = () => {
      if (!bar) return;
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? root.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      revealObs?.disconnect();
      mo.disconnect();
      countObs.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
