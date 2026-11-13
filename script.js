// Número de WhatsApp: código de país (52 = México) + número, sin espacios.
const WHATSAPP = "527351453373";

document.documentElement.classList.add("js");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const setWa = (a, msg) => { a.href = waLink(msg); a.target = "_blank"; a.rel = "noopener"; };

$$("[data-wa]").forEach((a) => setWa(a, a.dataset.wa));
$("#year").textContent = new Date().getFullYear();

/* Aparición al hacer scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));

/* Precios y promociones */
const money = (v) => "$" + (Number.isInteger(v) ? v : v.toFixed(2));
const promoText = {
  regular: "Precios regulares por sesión.",
  primera: "Primera visita: $100 de descuento en cualquier paquete.",
  segunda: "Segunda visita: 50% de descuento en Terapia Total.",
};
const visitText = { regular: "", primera: " Es mi primera visita.", segunda: " Es mi segunda visita." };

function setMode(mode) {
  $$(".toggle button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  $("#promoLine").textContent = promoText[mode];
  $$(".plan").forEach((plan) => {
    const base = Number(plan.dataset.base);
    let price = base;
    if (mode === "primera") price = base - 100;
    if (mode === "segunda" && plan.dataset.id === "total") price = base / 2;
    const box = $(".price", plan);
    $("s", box).textContent = price < base ? money(base) : "";
    $("b", box).textContent = money(price);
    box.classList.remove("pop");
    void box.offsetWidth;
    box.classList.add("pop");
    setWa($(".btn", plan), `Hola, quiero reservar el paquete ${plan.dataset.name} (${money(price)}).${visitText[mode]}`);
  });
}
$$(".toggle button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
setMode("primera");

/* Test: ¿necesitas un masaje? */
const levels = ["sin marcar", "leve", "leve", "moderado", "moderado", "alto", "alto", "muy alto", "muy alto"];
const advice = {
  relajacion: ["Masaje Relajación · 35 min", "Tu cuerpo empieza a avisar. Un masaje sueco con vibración es justo lo que necesitas para soltar el estrés antes de que se acumule."],
  alivio: ["Masaje Alivio · 50 min", "Ya hay tensión acumulada. Además del masaje, el calor de la termoterapia y la electroterapia ayudan a relajar las zonas más cargadas."],
  total: ["Terapia Total · 70 min", "Tu cuerpo necesita un break completo: masaje, calor, aromaterapia, manos, tobillos, facial y mascarilla. De la cara a los pies."],
};
function updateQuiz() {
  const checked = $$("#quizOpts input:checked");
  const n = checked.length;
  $("#meterBar").style.width = (n / 8) * 100 + "%";
  $("#meterText").textContent = levels[n];
  const btn = $("#quizBtn");
  if (!n) {
    $("#quizTitle").textContent = "Marca al menos una opción";
    $("#quizText").textContent = "Cada señal que marques nos ayuda a recomendarte la sesión adecuada.";
    btn.hidden = true;
    return;
  }
  const wantsAll = checked.some((c) => c.closest("[data-total]"));
  const key = wantsAll || n >= 5 ? "total" : n >= 3 ? "alivio" : "relajacion";
  $("#quizTitle").textContent = "Te recomendamos: " + advice[key][0];
  $("#quizText").textContent = advice[key][1];
  btn.hidden = false;
  setWa(btn, `Hola, hice el test de la página y me recomendó ${advice[key][0]}. Marqué: ${checked.map((c) => c.value).join(", ")}. Quiero agendar una cita.`);
}
$("#quizOpts").addEventListener("change", updateQuiz);

/* Técnicas */
const tech = {
  sueco: ["Masaje sueco", "La técnica clásica de relajación: movimientos largos y suaves, amasamiento y círculos sobre los músculos. Ayuda a soltar la tensión y a calmar el cuerpo y la mente.", "Incluido en los tres paquetes", "assets/cuello.jpg"],
  vibra: ["Masaje de vibración", "Vibración aplicada sobre los músculos para ayudar a relajarlos y dar una sensación de descanso profundo en las zonas más cargadas.", "Incluido en los tres paquetes", "assets/relajacion.jpg"],
  termo: ["Termoterapia", "Aplicación de calor sobre la zona tensa. El calor relaja el músculo, da una sensación de alivio y lo prepara para un masaje más efectivo.", "Incluido en Masaje Alivio y Terapia Total", "assets/alivio.jpg"],
  electro: ["Electroterapia", "Estímulos eléctricos suaves sobre zonas con tensión o molestia. Se siente como un hormigueo y ayuda a relajar el músculo. No se aplica a personas con marcapasos.", "Incluido en Masaje Alivio y Terapia Total", "assets/hero.jpg"],
  aroma: ["Aromaterapia", "Aceites con aromas que acompañan la sesión para crear un ambiente de calma y ayudarte a desconectar por completo.", "Incluido en Terapia Total", "assets/aroma.jpg"],
  facial: ["Masaje facial y mascarilla", "Masaje facial antiarrugas que relaja los músculos del rostro, más mascarilla para cara, manos y pies. Sales con la piel fresca y expresión descansada.", "Incluido en Terapia Total", "assets/total.jpg"],
};
function setTab(key) {
  const [title, text, inc, img] = tech[key];
  $$(".tab-btns button").forEach((b) => b.classList.toggle("on", b.dataset.tab === key));
  $("#tabTitle").textContent = title;
  $("#tabText").textContent = text;
  $("#tabIn").textContent = inc;
  $("#tabImg").src = img;
  $("#tabImg").alt = title;
  const panel = $(".tab-panel");
  panel.classList.remove("swap");
  void panel.offsetWidth;
  panel.classList.add("swap");
}
$$(".tab-btns button").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
setTab("sueco");

/* Ejercicio de respiración: 3 ciclos de inhalar 4 s y exhalar 6 s */
const ring = $("#ring"), ringText = $("#ringText"), bBtn = $("#breatheBtn"), bMsg = $("#breatheMsg");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
bBtn.addEventListener("click", async () => {
  bBtn.disabled = true;
  bMsg.textContent = "";
  for (let i = 1; i <= 3; i++) {
    ring.className = "ring in"; ringText.textContent = "Inhala"; await wait(4000);
    ring.className = "ring out"; ringText.textContent = "Exhala"; await wait(6000);
  }
  ring.className = "ring"; ringText.textContent = "Listo";
  bMsg.textContent = "¿Notas la diferencia? Ahora imagina 70 minutos así.";
  bBtn.textContent = "Repetir";
  bBtn.disabled = false;
});
