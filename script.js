const n = window.NEGOCIO;
const wa = (msg) => `https://wa.me/${n.whatsapp}?text=${encodeURIComponent(msg)}`;
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll("[data-biz-name]").forEach(e => e.textContent = n.nombre);
document.title = `${n.nombre} | Bienestar y descanso`;
document.querySelector("[data-schedule]").textContent = "Horario: " + n.horario;
document.querySelector("[data-place]").textContent = "Lugar: " + n.lugar;
document.getElementById("year").textContent = new Date().getFullYear();
const cards = document.getElementById("cards");
n.servicios.forEach(s => {
  const el = document.createElement("article");
  el.className = "card";
  const h = document.createElement("h3"); h.textContent = s.nombre;
  const d = document.createElement("p"); d.textContent = s.detalle;
  const m = document.createElement("p"); m.className = "meta"; m.textContent = `${s.duracion} · ${s.precio}`;
  const b = document.createElement("a"); b.className = "btn small"; b.textContent = "Reservar";
  b.href = wa(`Hola, quiero reservar: ${s.nombre} (${s.duracion}).`); b.target = "_blank"; b.rel = "noopener";
  el.append(h, d, m, b); cards.append(el);
});
