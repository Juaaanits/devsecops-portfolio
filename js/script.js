const animEls = document.querySelectorAll(".animate-on-scroll");
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("animate");
    });
  },
  { threshold: 0.08 },
);
animEls.forEach((el) => obs.observe(el));

const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section, header");
const navSpy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const match = document.querySelector(
          'nav a[href="#' + e.target.id + '"]',
        );
        if (match) match.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" },
);
sections.forEach((s) => navSpy.observe(s));

function submitForm() {
  const n = document.getElementById("name").value;
  const e = document.getElementById("email").value;
  const m = document.getElementById("message").value;
  if (n && e && m) {
    alert("Thanks for reaching out! I'll get back to you soon.");
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  } else {
    alert("Please fill in all fields.");
  }
}

/* scroll progress bar */
const progressBar = document.getElementById("scroll-progress");
function updateProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = scrolled + "%";
}
document.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* custom cursor (desktop only) */
const isFinePointer = window.matchMedia("(pointer:fine)").matches;
if (isFinePointer) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  let rx = 0,
    ry = 0,
    tx = 0,
    ty = 0;
  window.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    tx = e.clientX;
    ty = e.clientY;
  });
  (function loop() {
    rx += (tx - rx) * 0.18;
    ry += (ty - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button, .tag, .card").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
  });
}

/* tilt on project cards */
if (isFinePointer) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translate(-2px,-2px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* magnetic primary buttons */
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const mx = (e.clientX - r.left - r.width / 2) * 0.25;
      const my = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${mx}px, ${my}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* count-up numbers, triggered when stat grid scrolls into view */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0");
  const suffix = el.dataset.suffix || "";
  const dur = 1300;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent =
      (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll(".stat-num[data-count]");
const countObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 },
);
countEls.forEach((el) => countObs.observe(el));
/* particle field (light, sparse) */
(function () {
  const field = document.getElementById("particleField");
  const colors = ["#2552A3", "#C8761A", "#1F8A5F"];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 2 + Math.random() * 2.5;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${10 + Math.random() * 16}s;
      animation-delay:${Math.random() * 14}s;
    `;
    field.appendChild(p);
  }
})();

/* typing eyebrow line */
(function () {
  const el = document.getElementById("typedLine");
  if (!el) return;
  const phrases = [
    "$ whoami",
    "$ cat skills.txt",
    "$ docker ps -a",
    "$ kubectl get pods",
    "$ git push origin main",
  ];
  let pi = 0,
    ci = 0,
    deleting = false;
  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      ci++;
      el.innerHTML = phrase.slice(0, ci) + '<span class="caret"></span>';
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 1700);
        return;
      }
    } else {
      ci--;
      el.innerHTML = phrase.slice(0, ci) + '<span class="caret"></span>';
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 35 : 75);
  }
  type();
})();

/* sliding nav indicator */
(function () {
  const navUl = document.querySelector("nav ul");
  if (!navUl) return;
  const indicator = document.createElement("div");
  indicator.className = "nav-indicator";
  navUl.appendChild(indicator);
  function moveTo(link) {
    if (!link) return;
    indicator.style.left = link.offsetLeft + "px";
    indicator.style.width = link.offsetWidth + "px";
  }
  navLinks.forEach((l) => l.addEventListener("mouseenter", () => moveTo(l)));
  navUl.addEventListener("mouseleave", () => {
    const active = document.querySelector("nav a.active");
    moveTo(active || navLinks[0]);
  });
  const navMo = new MutationObserver(() => {
    const active = document.querySelector("nav a.active");
    if (active) moveTo(active);
  });
  navLinks.forEach((l) =>
    navMo.observe(l, { attributes: true, attributeFilter: ["class"] }),
  );
  setTimeout(() => moveTo(navLinks[0]), 100);
})();
/* card spotlight follow */
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

/* background grid parallax on scroll */
(function () {
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY * 0.04;
          document.body.style.backgroundPosition = `0 ${y}px, 0 ${y}px`;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
})();

/* button click ripple */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(r.width, r.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - r.left - size / 2 + "px";
    ripple.style.top = e.clientY - r.top - size / 2 + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
/* hero terminal scripted output */
(function () {
  const body = document.getElementById("termBody");
  if (!body) return;
  const lines = [
    { t: "$ kubectl apply -f deployment.yaml", cls: "term-line-prompt" },
    { t: "deployment.apps/portfolio-api created", cls: "term-line-ok" },
    { t: "service/portfolio-api created", cls: "term-line-ok" },
    { t: "", cls: "term-line-dim" },
    {
      t: "$ docker build -t taheer/devops:latest .",
      cls: "term-line-prompt",
    },
    { t: "[+] Building 18.4s (12/12) FINISHED", cls: "term-line-info" },
    { t: "$ trivy image taheer/devops:latest", cls: "term-line-prompt" },
    {
      t: "0 critical, 0 high vulnerabilities found",
      cls: "term-line-ok",
    },
    { t: "", cls: "term-line-dim" },
    { t: "$ git push origin main", cls: "term-line-prompt" },
    { t: "CI: build ✓  scan ✓  deploy ✓", cls: "term-line-ok" },
    { t: "status: production-ready", cls: "term-line-warn" },
  ];
  let i = 0;
  function nextLine() {
    document.querySelectorAll(".term-cursor").forEach((c) => c.remove());
    if (i >= lines.length) {
      const cursorLn = document.createElement("div");
      cursorLn.className = "ln";
      cursorLn.style.opacity = "1";
      cursorLn.innerHTML = '<span class="term-cursor"></span>';
      body.appendChild(cursorLn);
      return;
    }
    const line = lines[i];
    const div = document.createElement("div");
    div.className = "ln " + line.cls;
    div.textContent = line.t || "\u00A0";
    body.appendChild(div);
    i++;
    setTimeout(nextLine, line.t.startsWith("$") ? 480 : 360);
  }
  setTimeout(nextLine, 1300);
})();
