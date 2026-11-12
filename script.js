/* ЗВЁЗДНОЕ НЕБО */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createStars();
}

function createStars() {
  const count = Math.min(
    Math.floor((width * height) / 5000),
    350
  );

  stars = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.002,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    star.alpha += star.speed * star.direction;

    if (star.alpha >= 1) {
      star.alpha = 1;
      star.direction = -1;
    }

    if (star.alpha <= 0.05) {
      star.alpha = 0.05;
      star.direction = 1;

      if (Math.random() > 0.65) {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      }
    }

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(225, 215, 255, ${star.alpha})`;

    ctx.shadowBlur = star.radius * 8;
    ctx.shadowColor = "#b99cff";

    ctx.fill();
  }

  ctx.shadowBlur = 0;

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawStars();

/* ПЕРЕХОД К ПИСЬМУ */

const scanButton = document.getElementById("scanButton");
const intro = document.getElementById("intro");
const letterScreen = document.getElementById("letterScreen");

scanButton.addEventListener("click", () => {
  if (scanButton.disabled) return;

  scanButton.disabled = true;

  intro.classList.add("glitch");

  setTimeout(() => {
    intro.style.display = "none";
    letterScreen.classList.add("visible");
  }, 850);
});

/* ОТКРЫТИЕ И РАЗРЫВ КОНВЕРТА */

const envelope = document.getElementById("envelope");
const paper = document.getElementById("paper");

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("opened")) return;

  // Шаг 1. Конверт открывается
  envelope.classList.add("opened");

  // Шаг 2. Оболочка разрывается на фрагменты
  setTimeout(() => {
    envelope.classList.add("shattering");
  }, 850);

  // Шаг 3. Появляется письмо
  setTimeout(() => {
    paper.classList.add("show");

    setTimeout(() => {
      paper.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 300);

  }, 2100);
});


/* ===== HANDWRITING EFFECT ===== */

function startHandwriting() {
    const paper = document.getElementById("paper");

    if (!paper || paper.dataset.handwritingStarted) return;

    paper.dataset.handwritingStarted = "true";

    const elements = paper.querySelectorAll(
        ".paper-content h2, .paper-content p, .paper-content .signature"
    );

    let delay = 0;

    elements.forEach(element => {
        const originalText = element.textContent;

        element.textContent = "";

        [...originalText].forEach(character => {
            const span = document.createElement("span");

            span.className = "handwriting-char";
            span.textContent = character;
            span.style.setProperty("--char-delay", `${delay}s`);

            element.appendChild(span);

            delay += 0.045;
        });

        delay += 0.6;
    });
}

// Запускаем написание после появления письма
const handwritingPaper = document.getElementById("paper");

if (handwritingPaper) {
    const handwritingObserver = new MutationObserver(() => {
        if (handwritingPaper.classList.contains("show")) {
            startHandwriting();
            handwritingObserver.disconnect();
        }
    });

    handwritingObserver.observe(handwritingPaper, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

