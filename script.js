
const WHATSAPP_NUMBER = "910000000000"; // change later
const CONFIG = { basePrice: 1949, decoration: 750, advance: 750 };
const KEY = "playhauz_pdf_booking_v1";
function getB(){ try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}} }
function setB(p){ const n={...getB(),...p}; localStorage.setItem(KEY, JSON.stringify(n)); return n; }
function fmt(n){ return "₹ " + (Number(n)||0).toString(); }
function setText(sel, txt){ document.querySelectorAll(sel).forEach(e=>e.textContent=txt); }
function fillSummary(){
  const b=getB();
  const theatre = CONFIG.basePrice;
  const decor = b.wantDecor ? CONFIG.decoration : 0;
  const cake = Number(b.cakePrice||0);
  const addons = (b.addons||[]).reduce((s,a)=>s+Number(a.price||0),0);
  const subtotal = theatre+decor+cake+addons;
  const advance = CONFIG.advance;
  const balance = Math.max(subtotal-advance,0);
  setText("[data-sum=service]", b.service||"");
  setText("[data-sum=city]", b.city||"Delhi NCR");
  setText("[data-sum=location]", b.location||"Lajpat Nagar - 1 (B-31 Basement)");
  setText("[data-sum=date]", b.date||"");
  setText("[data-sum=slot]", b.service==="Gaming Zone" ? (b.slot||"") : "");
  setText("[data-sum=theatre]", fmt(theatre));
  setText("[data-sum=decor]", fmt(decor));
  setText("[data-sum=cake]", fmt(cake));
  setText("[data-sum=addons]", fmt(addons));
  setText("[data-sum=subtotal]", fmt(subtotal));
  setText("[data-sum=advance]", fmt(advance));
  setText("[data-sum=balance]", fmt(balance));
  setText("[data-sum=total]", fmt(subtotal));
  document.querySelectorAll("[data-slotwrap]").forEach(w=>{
    w.style.display = b.service==="Gaming Zone" ? "" : "none";
  });
}
fillSummary();

document.getElementById("startBooking")?.addEventListener("click", ()=>{
  const city = document.getElementById("city")?.value || "Delhi NCR";
  const location = document.getElementById("location")?.value || "Lajpat Nagar - 1 (B-31 Basement)";
  const date = document.getElementById("date")?.value || "";
  setB({city, location, date});
  window.location.href = "services.html";
});

document.querySelectorAll("[data-select-service]").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const card = e.target.closest("[data-service]");
    const service = card?.dataset.service || "Celebration";
    setB({service});
    window.location.href = "booking-details.html";
  });
});

document.getElementById("basicNext")?.addEventListener("click", ()=>{
  const name = document.getElementById("name")?.value?.trim() || "";
  const phone = document.getElementById("phone")?.value?.trim() || "";
  const adults = Number(document.getElementById("adults")?.value || 2);
  const kids = Number(document.getElementById("kids")?.value || 0);
  const wantDecor = (document.getElementById("decor")?.value || "No") === "Yes";
  setB({name, phone, adults, kids, wantDecor});
  window.location.href = "occasion.html";
});

document.getElementById("slot")?.addEventListener("change", (e)=>{
  setB({slot: e.target.value});
});

document.querySelectorAll("[data-occasion]").forEach(tile=>{
  tile.addEventListener("click", ()=>{
    setB({occasion: tile.dataset.occasion || ""});
    window.location.href = "cakes.html";
  });
});

document.querySelectorAll("[data-cake]").forEach(item=>{
  item.addEventListener("click", ()=>{
    setB({cake: item.dataset.cake || "", cakePrice: item.dataset.price || "0"});
    window.location.href = "addons.html";
  });
});
document.getElementById("skipCake")?.addEventListener("click", ()=>{
  setB({cake:"", cakePrice:"0"});
  window.location.href="addons.html";
});

document.getElementById("addonsNext")?.addEventListener("click", ()=>{
  const chosen = [];
  document.querySelectorAll("[data-addon]").forEach(row=>{
    const cb = row.querySelector("input[type=checkbox]");
    if (cb?.checked){
      chosen.push({name: row.dataset.name, price: row.dataset.price});
    }
  });
  setB({addons: chosen});
  window.location.href = "terms.html";
});

document.getElementById("confirmBtn")?.addEventListener("click", ()=>{
  const agree = document.getElementById("agree")?.checked;
  if (!agree){ alert("Please agree to Terms & Conditions."); return; }
  const b = getB();
  const theatre = CONFIG.basePrice;
  const decor = b.wantDecor ? CONFIG.decoration : 0;
  const cake = Number(b.cakePrice||0);
  const addons = (b.addons||[]).reduce((s,a)=>s+Number(a.price||0),0);
  const subtotal = theatre+decor+cake+addons;

  const slotLine = (b.service==="Gaming Zone" && b.slot) ? `\nSlot: ${b.slot}` : "";
  const addonsLine = (b.addons && b.addons.length) ? `\nAdd-ons: ${b.addons.map(a=>`${a.name} (${a.price})`).join(", ")}` : "";
  const cakeLine = (b.cake) ? `\nCake: ${b.cake} (${b.cakePrice})` : "";
  const msg =
`Hi Playhauz! I want to book:
Service: ${b.service||""}
Occasion: ${b.occasion||""}
City: ${b.city||""}
Location: ${b.location||""}
Date: ${b.date||""}${slotLine}
Name: ${b.name||""}
WhatsApp: ${b.phone||""}
People: Adults ${b.adults||2}, Kids ${b.kids||0}
Decoration: ${b.wantDecor ? "Yes" : "No"}${cakeLine}${addonsLine}
Total: ₹${subtotal}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});
