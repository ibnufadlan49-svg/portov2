/**
 * MOHAMAD IBNU FADLAN (mo_nufan) — INFORMATICS & FRONT-END ENGINEER PORTFOLIO
 * Core Script: Cyber HUD Interactions, Canvas Node Engine, Interactive CLI & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initHeaderNav();
  initMobileDrawer();
  initHeroParallax();
  initProjectFiltering();
  initInteractiveTerminal();
  initContactForm();
  initLiveClock();
  initScrollAnimations();
});

/* ==================== 1. AMBIENT CYBER CANVAS ENGINE ==================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);

  class CyberNode {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.size = Math.random() * 1.8 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 30, 66, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new CyberNode());
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  let animationFrameId;
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 30, 66, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    render();
  }
}

/* ==================== 2. HEADER & ACTIVE LINK TRACKER ==================== */
function initHeaderNav() {
  const header = document.getElementById('hudHeader');
  const navLinks = document.querySelectorAll('.hud-nav .nav-link, .drawer-nav .drawer-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==================== 3. MOBILE DRAWER MENU ==================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawerOverlay = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-nav .drawer-link');

  if (!toggleBtn || !drawerOverlay) return;

  function openMenu() {
    drawerOverlay.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawerOverlay.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) closeMenu();
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOverlay.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ==================== 4. HERO MOUSE PARALLAX & TILT ==================== */
function initHeroParallax() {
  const heroStage = document.getElementById('hero');
  const giantBgText = document.getElementById('giantBgText');
  const silhouetteChassis = document.getElementById('silhouetteChassis');

  if (!heroStage || window.innerWidth < 860) return;

  heroStage.addEventListener('mousemove', (e) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (giantBgText) {
      giantBgText.style.transform = `translate(${x * -25}px, ${y * -20 - 15}px)`;
    }

    if (silhouetteChassis) {
      silhouetteChassis.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    }
  });

  heroStage.addEventListener('mouseleave', () => {
    if (giantBgText) giantBgText.style.transform = `translate(0px, -5%)`;
    if (silhouetteChassis) silhouetteChassis.style.transform = `perspective(800px) rotateY(0deg) rotateX(0deg)`;
  });
}

/* ==================== 5. PROJECT FILTER CONTROLS ==================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==================== 6. INTERACTIVE TERMINAL INSPECTOR ==================== */
function initInteractiveTerminal() {
  const tabs = document.querySelectorAll('.term-tab');
  const tabWindows = document.querySelectorAll('.terminal-window');
  const cliInput = document.getElementById('cliInput');
  const cliOutput = document.getElementById('cliOutput');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tabWindows.forEach((w) => w.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `tab-${tab.getAttribute('data-term-tab')}`;
      const targetWindow = document.getElementById(targetId);
      if (targetWindow) targetWindow.classList.add('active');

      if (tab.getAttribute('data-term-tab') === 'cli' && cliInput) {
        setTimeout(() => cliInput.focus(), 50);
      }
    });
  });

  if (!cliInput || !cliOutput) return;

  const commands = {
    help: () => `Perintah yang tersedia:
- <span class="c-crimson">whoami</span>: Identitas pemilik portofolio
- <span class="c-crimson">skills</span>: Ringkasan kompetensi teknik
- <span class="c-crimson">projects</span>: Repositori utama
- <span class="c-crimson">contact</span>: Informasi kontak langsung
- <span class="c-crimson">ping</span>: Cek koneksi latensi server
- <span class="c-crimson">clear</span>: Bersihkan layar terminal`,

    whoami: () => `Mohamad Ibnu Fadlan (alias: mo_nufan)
Informatics Engineer & Front-End Developer.
Spesialisasi: Performa web, algoritma komputasi, dan arsitektur kode bersih.`,

    skills: () => `[CORE STACK]
1. HTML5 Semantics (W3C Standard, a11y)
2. Modern CSS3 (Grid, Flexbox, Custom Props, Responsive)
3. JavaScript ES6+ (Async/Await, DOM Engine, Modular JS)
4. Data Structures & Algoritma (Big-O, Sorting, Trees, Graphs)
5. Workflow (Git, GitHub, Chrome DevTools, CLI)`,

    projects: () => `[REPOSITORI AKTIF]
1. AlgoFlow Studio — Visualizer Struktur Data & Graf (JavaScript/Canvas)
2. Nexus Lab Registry — Sistem Manajemen Inventaris Lab (REST API)
3. SyntaxDeck UI — Code Editor & Playground Berbasis Peramban`,

    contact: () => `Email: ibnufadlan49@gmail.com
GitHub: https://github.com/ibnufadlan49-svg
Lokasi: Indonesia [WIB / UTC+7]`,

    ping: () => `PING server.mo_nufan.sys (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.082 ms
Status: Nominal (100% Packet Received, 0% Packet Loss)`,

    clear: () => '__CLEAR__'
  };

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = cliInput.value.trim();
      if (!rawCmd) return;

      const userLine = document.createElement('p');
      userLine.className = 'cli-msg';
      userLine.innerHTML = `<span class="c-crimson">visitor@nufan:~$</span> ${escapeHtml(rawCmd)}`;
      cliOutput.appendChild(userLine);

      const normalized = rawCmd.toLowerCase();
      if (commands[normalized]) {
        const result = commands[normalized]();
        if (result === '__CLEAR__') {
          cliOutput.innerHTML = '';
        } else {
          const respLine = document.createElement('div');
          respLine.className = 'cli-msg';
          respLine.innerHTML = result.replace(/\n/g, '<br>');
          cliOutput.appendChild(respLine);
        }
      } else {
        const errLine = document.createElement('p');
        errLine.className = 'cli-msg';
        errLine.innerHTML = `Perintah '<span class="c-str">${escapeHtml(rawCmd)}</span>' tidak dikenali. Ketik <span class="c-crimson">help</span> untuk panduan.`;
        cliOutput.appendChild(errLine);
      }

      cliInput.value = '';
      const windowEl = document.getElementById('tab-cli');
      if (windowEl) windowEl.scrollTop = windowEl.scrollHeight;
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==================== 7. INTERACTIVE PROJECT SIMULATOR MODALS ==================== */
window.openDemoModal = function(type) {
  const modalBackdrop = document.getElementById('demoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  if (!modalBackdrop || !modalContent) return;

  if (type === 'algoflow') {
    modalTitle.textContent = 'AlgoFlow — Graph & Binary Search Simulator';
    modalContent.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.88rem;">
        <p style="margin-bottom: 1rem; color: var(--text-secondary);">
          Simulasi eksekusi algoritma <strong>Binary Search</strong> dalam array terurut berukuran 16 elemen.
        </p>
        <div id="simArray" style="display: flex; gap: 4px; overflow-x: auto; padding-bottom: 0.8rem; margin-bottom: 1rem;">
          ${[2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78, 89, 91, 94, 98, 102].map((num, i) => `
            <div id="cell-${i}" style="min-width: 32px; height: 42px; background: #181b26; border: 1px solid var(--border-tech); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; font-size: 0.75rem;">
              <span style="color: var(--text-muted); font-size: 0.6rem;">${i}</span>
              <strong style="color: #fff;">${num}</strong>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; gap: 0.8rem; align-items: center; margin-bottom: 1rem;">
          <input type="number" id="simTargetInput" value="56" style="width: 90px; background: #121319; border: 1px solid var(--border-tech); color: #fff; padding: 0.4rem 0.6rem; border-radius: 4px;">
          <button id="runSearchBtn" style="background: var(--crimson-core); color: #fff; padding: 0.45rem 1rem; border-radius: 4px; font-weight: 600;">Jalankan Cari (O(log n))</button>
        </div>
        <div id="simLog" style="background: #090a0f; border: 1px solid var(--border-tech); padding: 0.8rem; border-radius: 4px; color: #34d399; font-size: 0.78rem; min-height: 50px;">
          Klik "Jalankan Cari" untuk memulai visualisasi langkah komputasi.
        </div>
      </div>
    `;

    setTimeout(() => {
      const runBtn = document.getElementById('runSearchBtn');
      const targetInput = document.getElementById('simTargetInput');
      const logBox = document.getElementById('simLog');
      const arr = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78, 89, 91, 94, 98, 102];

      if (runBtn) {
        runBtn.onclick = () => {
          const target = parseInt(targetInput.value, 10);
          let low = 0;
          let high = arr.length - 1;
          let steps = [];

          while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            steps.push({ low, mid, high, val: arr[mid] });
            if (arr[mid] === target) break;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
          }

          let stepIdx = 0;
          function playStep() {
            if (stepIdx >= steps.length) {
              const last = steps[steps.length - 1];
              if (last && last.val === target) {
                logBox.innerHTML = `[SELESAI] Ditemukan nilai ${target} pada indeks [${last.mid}]. Total langkah: ${steps.length} eksekusi. Kompleksitas: O(log n).`;
              } else {
                logBox.innerHTML = `[SELESAI] Nilai ${target} tidak ditemukan dalam struktur data. Total langkah: ${steps.length}.`;
              }
              return;
            }

            const s = steps[stepIdx];
            for (let i = 0; i < arr.length; i++) {
              const cell = document.getElementById(`cell-${i}`);
              if (!cell) continue;
              if (i === s.mid) {
                cell.style.background = '#ff1e42';
                cell.style.borderColor = '#ff3355';
              } else if (i >= s.low && i <= s.high) {
                cell.style.background = '#1e2438';
                cell.style.borderColor = '#38bdf8';
              } else {
                cell.style.background = '#10121a';
                cell.style.borderColor = 'rgba(255,255,255,0.05)';
              }
            }

            logBox.innerHTML = `Langkah ${stepIdx + 1}: Rentang [${s.low}..${s.high}], Midpoint indeks [${s.mid}] (Nilai: ${s.val}).`;
            stepIdx++;
            setTimeout(playStep, 650);
          }
          playStep();
        };
      }
    }, 100);

  } else if (type === 'nexus') {
    modalTitle.textContent = 'Nexus Lab Registry — API Mock Query';
    modalContent.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.82rem;">
        <p style="margin-bottom: 0.8rem; color: var(--text-secondary);">
          Simulasi query HTTP GET endpoint: <code>/api/v1/lab/inventory</code>
        </p>
        <pre style="background: #090a0f; border: 1px solid var(--border-tech); padding: 1rem; border-radius: 6px; color: #a7f3d0; overflow-x: auto;">
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-Powered-By: NexusLabEngine/3.0.4

{
  "status": "SUCCESS",
  "data": {
    "totalUnits": 48,
    "activeAllocations": 32,
    "maintenanceQueue": 0,
    "rbacState": "AUTHENTICATED_ADMIN",
    "nodes": [
      { "id": "LAB-PC-01", "specs": "i7-13700 / 32GB RAM", "status": "RESERVED" },
      { "id": "LAB-PC-02", "specs": "i7-13700 / 32GB RAM", "status": "AVAILABLE" },
      { "id": "LAB-SRV-MAIN", "specs": "Xeon Gold / 128GB RAM", "status": "ONLINE" }
    ]
  }
}</pre>
        <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
          <a href="https://github.com/ibnufadlan49-svg" target="_blank" rel="noopener noreferrer" style="background: var(--crimson-core); color: #fff; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600;">Lihat Repositori Lengkap di GitHub</a>
        </div>
      </div>
    `;

  } else if (type === 'syntax') {
    modalTitle.textContent = 'SyntaxDeck — Live Playground Snippet';
    modalContent.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.85rem;">
        <p style="margin-bottom: 0.8rem; color: var(--text-secondary);">
          Uji coba reaktif algoritma JavaScript langsung di peramban:
        </p>
        <textarea id="liveCode" style="width: 100%; height: 110px; background: #090a0f; border: 1px solid var(--border-tech); color: #fff; padding: 0.8rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem;">
// Hitung faktorial bilangan secara rekursif
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
return "Faktorial 6 = " + factorial(6);</textarea>
        <div style="margin-top: 0.8rem; display: flex; gap: 0.8rem; align-items: center;">
          <button id="runLiveCodeBtn" style="background: var(--crimson-core); color: #fff; padding: 0.45rem 1.1rem; border-radius: 4px; font-weight: 600;">Eksekusi Kode</button>
          <div id="liveResult" style="color: #34d399; font-size: 0.8rem;">Hasil eksekusi akan tampil di sini.</div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const runBtn = document.getElementById('runLiveCodeBtn');
      const liveCode = document.getElementById('liveCode');
      const liveResult = document.getElementById('liveResult');
      if (runBtn && liveCode && liveResult) {
        runBtn.onclick = () => {
          try {
            const func = new Function(liveCode.value);
            const res = func();
            liveResult.innerHTML = `&gt; [OUTPUT]: <strong>${res}</strong>`;
            liveResult.style.color = '#34d399';
          } catch (err) {
            liveResult.innerHTML = `&gt; [ERROR]: ${err.message}`;
            liveResult.style.color = '#ff3355';
          }
        };
      }
    }, 100);
  }

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modalCloseBtn');
  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.onclick = closeModal;
  modalBackdrop.onclick = (e) => {
    if (e.target === modalBackdrop) closeModal();
  };
};

/* ==================== 8. CONTACT FORM DISPATCH & SIMULATION ==================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const category = document.getElementById('subjectCategory').value;
    const message = document.getElementById('messageText').value.trim();

    if (!name || !email || !message) return;

    feedback.className = 'form-feedback-console loading';
    feedback.innerHTML = `[TRANSMITTING PACKET] Menghubungkan ke gateway mo_nufan.sys...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      feedback.className = 'form-feedback-console success';
      feedback.innerHTML = `[HTTP 200 OK] Pesan transmisi dari "${escapeHtml(name)}" berhasil dikirim! Menyiapkan fallback klien email...`;

      // Trigger mailto fallback for direct email client opening
      setTimeout(() => {
        const mailtoLink = `mailto:ibnufadlan49@gmail.com?subject=${encodeURIComponent(`[Transmisi Web - ${category.toUpperCase()}] dari ${name}`)}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\nKategori: ${category}\n\nPesan:\n${message}`)}`;
        window.location.href = mailtoLink;
        submitBtn.disabled = false;
        form.reset();
      }, 900);
    }, 1100);
  });
}

/* ==================== 9. LIVE CLOCK (WIB / UTC+7) ==================== */
function initLiveClock() {
  const clockEl = document.getElementById('clockWIB');
  const yearEl = document.getElementById('currentYear');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    // WIB is UTC+7
    const options = {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeString = new Intl.DateTimeFormat('id-ID', options).format(now);
    clockEl.textContent = `${timeString} WIB (UTC+7)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==================== 10. SCROLL REVEAL OBSERVER ==================== */
function initScrollAnimations() {
  const cards = document.querySelectorAll('.project-card, .skill-module-card, .dossier-card, .terminal-card, .channel-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((c) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(18px)';
    c.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.25s ease, box-shadow 0.25s ease';
    observer.observe(c);
  });
}

