/* Shop logic: you normally don't need to edit this file. */
const TYPES = { all:"All", mug:"Mugs", cup:"Cups", bowl:"Bowls", plate:"Plates", vase:"Vases" };
const euro = n => "€" + n.toFixed(n % 1 ? 2 : 0);
const byId = id => PIECES.find(p => p.id === id);
const igUrl = "https://ig.me/m/" + SHOP.instagram;

document.title = SHOP.name + " Shop";
document.getElementById("brandMark").textContent = SHOP.name;
document.getElementById("igLink").href = igUrl;
document.getElementById("igLink").textContent = "@" + SHOP.instagram;
document.getElementById("sendBtn").href = igUrl;

/* basket state, remembered in this browser if possible */
let basket = {};
try { basket = JSON.parse(localStorage.getItem("ceramics-basket") || "{}") || {}; } catch(e) { basket = {}; }
for (const id in basket) { const p = byId(id); if (!p || p.stock < 1) delete basket[id]; else basket[id] = Math.min(basket[id], p.stock); }
const save = () => { try { localStorage.setItem("ceramics-basket", JSON.stringify(basket)); } catch(e) {} };

/* drawn placeholder pieces */
function rng(seed){ let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const SHAPES = {
  mug:   { body:"M62 66 H138 V146 Q138 160 124 160 H76 Q62 160 62 146 Z", handle:"M138 88 C178 88 178 138 138 138", top:66, bottom:160 },
  cup:   { body:"M60 70 H140 L130 152 Q100 162 70 152 Z", top:70, bottom:158 },
  bowl:  { body:"M34 92 H166 Q162 156 100 160 Q38 156 34 92 Z", top:92, bottom:160 },
  plate: { body:"M24 118 Q24 98 100 98 Q176 98 176 118 Q176 142 100 142 Q24 142 24 118 Z", top:98, bottom:142, inner:"M52 119 Q52 108 100 108 Q148 108 148 119 Q148 131 100 131 Q52 131 52 119 Z" },
  vase:  { body:"M88 40 H112 L110 66 Q150 92 146 132 Q142 166 100 166 Q58 166 54 132 Q50 92 90 66 Z", top:40, bottom:166 }
};
function drawPiece(p, uid){
  if (p.photo) return `<img src="${p.photo}" alt="${p.name}" loading="lazy">`;
  const s = SHAPES[p.type] || SHAPES.mug, r = rng(p.id), cid = "c-" + p.id + "-" + uid;
  const dripY = p.type === "plate" ? 200 : s.top + (s.bottom - s.top) * (0.55 + r() * 0.15);
  let wave = `M0 0 H200 V${dripY.toFixed(1)}`;
  for (let x = 200; x > 0; x -= 20) { const d = 4 + r() * 16; wave += ` Q${x - 10} ${(dripY + d).toFixed(1)} ${x - 20} ${(dripY + r() * 4).toFixed(1)}`; }
  wave += " Z";
  let dots = ""; for (let i = 0; i < 70; i++) dots += `<circle cx="${(20 + r() * 160).toFixed(1)}" cy="${(30 + r() * 140).toFixed(1)}" r="${(0.6 + r() * 1.3).toFixed(1)}"/>`;
  const bg = `color-mix(in srgb, ${p.glaze} 14%, #F1EFEA)`;
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.name}, illustration">
    <rect width="200" height="200" fill="${bg}"/>
    <ellipse cx="100" cy="${s.bottom + 6}" rx="${p.type === "plate" ? 82 : 58}" ry="7" fill="#1C2340" opacity=".10"/>
    <defs><clipPath id="${cid}"><path d="${s.body}"/></clipPath></defs>
    ${s.handle ? `<path d="${s.handle}" fill="none" stroke="${p.glaze}" stroke-width="11" stroke-linecap="round"/>` : ""}
    <g clip-path="url(#${cid})">
      <path d="${s.body}" fill="${p.clay}"/>
      <path d="${wave}" fill="${p.glaze}"/>
      ${s.inner ? `<path d="${s.inner}" fill="#000" opacity=".08"/>` : ""}
      <g fill="#2a2018" opacity=".35">${dots}</g>
      <rect x="0" y="0" width="70" height="200" fill="#fff" opacity=".10"/>
    </g>
  </svg>`;
}

/* filters */
let filter = "all";
function renderFilters(){
  const el = document.getElementById("filters");
  el.innerHTML = Object.entries(TYPES).filter(([k]) => k === "all" || PIECES.some(p => p.type === k)).map(([k, label]) => {
    const n = k === "all" ? PIECES.length : PIECES.filter(p => p.type === k).length;
    return `<button class="chip" type="button" data-f="${k}" aria-pressed="${filter === k}">${label}<span class="n">${n}</span></button>`;
  }).join("");
}
document.getElementById("filters").addEventListener("click", e => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  filter = b.dataset.f; renderFilters(); renderGrid();
});

function statusOf(p){
  if (p.stock < 1) return `<span class="status sold">Sold out</span>`;
  if (p.stock === 1) return `<span class="status low">Only 1 left</span>`;
  return "";
}
function addLabel(p){
  if (p.stock < 1) return "Sold out";
  const q = basket[p.id] || 0;
  if (q >= p.stock) return `In basket (${q}), max`;
  return q ? `In basket (${q}) · add another` : "Add to basket";
}

function renderGrid(){
  const list = PIECES.filter(p => filter === "all" || p.type === filter);
  document.getElementById("grid").innerHTML = list.map(p => `
    <article class="card">
      <button class="img" type="button" data-open="${p.id}" aria-label="View ${p.name}">${drawPiece(p, "g")}${statusOf(p)}</button>
      <div class="body">
        <div class="row"><h3>${p.name}</h3><span class="price">${euro(p.price)}</span></div>
        <div class="meta">${TYPES[p.type].replace(/s$/, "")} · ${p.size}</div>
        <button class="add ${basket[p.id] ? "in" : ""}" type="button" data-add="${p.id}" ${p.stock < 1 || (basket[p.id] || 0) >= p.stock ? "disabled" : ""}>${addLabel(p)}</button>
      </div>
    </article>`).join("");
}
document.getElementById("grid").addEventListener("click", e => {
  const a = e.target.closest("[data-add]"); if (a) { add(a.dataset.add); return; }
  const o = e.target.closest("[data-open]"); if (o) openDialog(o.dataset.open);
});

function add(id){
  const p = byId(id); if (!p || p.stock < 1) return;
  basket[id] = Math.min((basket[id] || 0) + 1, p.stock);
  save(); renderAll();
}
function setQty(id, q){
  const p = byId(id);
  if (q < 1) delete basket[id]; else basket[id] = Math.min(q, p.stock);
  save(); renderAll();
}

/* basket */
function orderMessage(){
  const ids = Object.keys(basket);
  const name = document.getElementById("custName").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const note = document.getElementById("custNote").value.trim();
  let total = 0;
  const lines = ids.map(id => { const p = byId(id), q = basket[id]; total += p.price * q; return `• ${q} × ${p.name} (${euro(p.price)})`; });
  return [
    `Hi! I'd like to order from ${SHOP.name}:`,
    ...lines,
    `Subtotal: ${euro(total)} + shipping`,
    name ? `Name: ${name}` : "",
    city ? `Ship to: ${city}` : "",
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join("\n");
}
function renderBasket(){
  const ids = Object.keys(basket);
  const count = ids.reduce((n, id) => n + basket[id], 0);
  const total = ids.reduce((n, id) => n + byId(id).price * basket[id], 0);
  document.getElementById("count").textContent = count;
  document.getElementById("subtotal").textContent = euro(total);
  document.getElementById("items").innerHTML = ids.length ? ids.map(id => { const p = byId(id); return `
    <div class="line-item">
      <div class="thumb">${drawPiece(p, "b")}</div>
      <div><div class="nm">${p.name}</div>
        <div class="qty"><button type="button" data-q="${id}" data-d="-1" aria-label="One less ${p.name}">−</button><span>${basket[id]}</span><button type="button" data-q="${id}" data-d="1" aria-label="One more ${p.name}" ${basket[id] >= p.stock ? "disabled" : ""}>+</button></div>
      </div>
      <div class="price">${euro(p.price * basket[id])}</div>
    </div>`; }).join("") : `<p class="empty">Your basket is empty.<br>Add a piece you love.</p>`;
  const send = document.getElementById("sendBtn");
  send.setAttribute("aria-disabled", ids.length ? "false" : "true");
  document.getElementById("orderText").value = ids.length ? orderMessage() : "";
}
document.getElementById("items").addEventListener("click", e => {
  const b = e.target.closest("[data-q]"); if (!b) return;
  setQty(b.dataset.q, (basket[b.dataset.q] || 0) + Number(b.dataset.d));
});
["custName", "custCity", "custNote"].forEach(id => document.getElementById(id).addEventListener("input", () => {
  document.getElementById("orderText").value = Object.keys(basket).length ? orderMessage() : "";
}));
document.getElementById("sendBtn").addEventListener("click", () => {
  const msg = orderMessage(), out = document.getElementById("copied");
  document.getElementById("orderText").value = msg;
  try {
    navigator.clipboard.writeText(msg).then(
      () => { out.textContent = "Order copied. Paste it in the Instagram chat that just opened."; },
      () => { out.textContent = "Couldn't copy automatically. Copy your order from the box below."; document.querySelector("details").open = true; }
    );
  } catch(e) { out.textContent = "Couldn't copy automatically. Copy your order from the box below."; document.querySelector("details").open = true; }
});

const drawer = document.getElementById("drawer"), scrim = document.getElementById("scrim"), dialog = document.getElementById("dialog");
function openBasket(){ closeDialog(); drawer.classList.add("on"); drawer.setAttribute("aria-hidden", "false"); scrim.classList.add("on"); document.getElementById("closeBasket").focus(); }
function closeBasket(){ drawer.classList.remove("on"); drawer.setAttribute("aria-hidden", "true"); if (!dialog.classList.contains("on")) scrim.classList.remove("on"); }
document.getElementById("openBasket").addEventListener("click", openBasket);
document.getElementById("closeBasket").addEventListener("click", closeBasket);

/* detail dialog */
let current = null;
function openDialog(id){
  const p = byId(id); current = id;
  document.getElementById("dPic").innerHTML = drawPiece(p, "d");
  document.getElementById("dTitle").textContent = p.name;
  document.getElementById("dPrice").textContent = euro(p.price);
  document.getElementById("dDesc").textContent = p.desc;
  document.getElementById("dSpecs").innerHTML = `<dt>Type</dt><dd>${TYPES[p.type].replace(/s$/, "")}</dd><dt>Size</dt><dd>${p.size}</dd><dt>Available</dt><dd>${p.stock < 1 ? "Sold out" : p.stock + (p.stock === 1 ? " piece" : " pieces")}</dd><dt>Care</dt><dd>Food safe glaze · hand-wash recommended</dd>`;
  updateDialogBtn();
  dialog.classList.add("on"); scrim.classList.add("on");
  document.getElementById("closeDialog").focus();
}
function updateDialogBtn(){
  if (!current) return;
  const p = byId(current), b = document.getElementById("dAdd");
  b.textContent = addLabel(p);
  b.disabled = p.stock < 1 || (basket[p.id] || 0) >= p.stock;
  b.classList.toggle("in", !!basket[p.id]);
}
function closeDialog(){ dialog.classList.remove("on"); current = null; if (!drawer.classList.contains("on")) scrim.classList.remove("on"); }
document.getElementById("closeDialog").addEventListener("click", closeDialog);
document.getElementById("dAdd").addEventListener("click", () => add(current));
dialog.addEventListener("click", e => { if (e.target === dialog) closeDialog(); });
scrim.addEventListener("click", () => { closeDialog(); closeBasket(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeDialog(); closeBasket(); } });

function renderAll(){ renderGrid(); renderBasket(); updateDialogBtn(); }
renderFilters(); renderAll();
