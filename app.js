const defaultSettings = {
  marlaSqft: 272.25,
  kanalSqft: 5445,
  acreSqft: 43560,
  kanalMarla: 20,
  acreKanal: 8,
  acreMarla: 160,
  acreVishwasian: 96,
  kanalVishwasian: 12,
  bighaVishwasian: 20,
  karamFeet: 5.5,
  ownerWhatsapp: ""
};

let currentShape = "rectangle";
let lang = "pa";
let lastResult = null;

function normalizeSettings(s){
  const merged = {...defaultSettings, ...s};
  if (s.acreVishve !== undefined) merged.acreVishwasian = s.acreVishve;
  if (s.kanalVishve !== undefined) merged.kanalVishwasian = s.kanalVishve;
  if (s.bighaVishve !== undefined) merged.bighaVishwasian = s.bighaVishve;
  return merged;
}


const text = {
  pa: {
    title: "ਜ਼ਮੀਨ ਮਿਣਤੀ ਕੈਲਕੂਲੇਟਰ",
    subtitle: "ਪੰਜਾਬ ਜ਼ਮੀਨ ਮਿਣਤੀ ਕੈਲਕੂਲੇਟਰ",
    selectShape: "Shape ਚੁਣੋ",
    owner: "Owner Settings",
    reference: "Land Unit Reference",
    calculate: "Calculate",
    length: "ਲੰਬਾਈ",
    width: "ਚੌੜਾਈ",
    top: "ਉੱਪਰ ਵਾਲੀ ਸਾਈਡ",
    bottom: "ਥੱਲੇ ਵਾਲੀ ਸਾਈਡ",
    left: "ਖੱਬੀ ਸਾਈਡ",
    right: "ਸੱਜੀ ਸਾਈਡ",
    sideA: "Side A",
    sideB: "Side B",
    sideC: "Side C",
    totalArea: "ਕੁੱਲ ਰਕਬਾ",
    print: "Print / PDF",
    newCalc: "New Calculation",
    password: "Password",
    unlock: "Unlock",
    save: "Save Settings",
    reset: "Reset Default",
    invalid: "ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ values ਭਰੋ।",
    triangleInvalid: "Triangle ਦੀ sides valid ਨਹੀਂ ਹਨ।",
    acreRate: "1 ਏਕੜ/ਕਿੱਲਾ ਦਾ ਸਾਲਾਨਾ ਠੇਕਾ",
    acreInput: "ਏਕੜ/ਕਿੱਲੇ",
    kanalInput: "ਕਨਾਲਾਂ",
    marlaInput: "ਮਰਲੇ",
    leaseResult: "ਠੇਕਾ ਰਿਜ਼ਲਟ",
    perKanal: "1 ਕਨਾਲ ਦਾ ਠੇਕਾ",
    perMarla: "1 ਮਰਲੇ ਦਾ ਠੇਕਾ",
    fullTheka: "ਕੁੱਲ ਸਾਲਾਨਾ ਠੇਕਾ",
    firstInstallment: "ਪਹਿਲੀ ਕਿਸ਼ਤ",
    secondInstallment: "ਦੂਜੀ ਕਿਸ਼ਤ",
    totalLand: "ਕੁੱਲ ਜ਼ਮੀਨ"
  },
  en: {
    title: "Zameen Minti Calculator",
    subtitle: "Punjab Land Measurement Calculator",
    selectShape: "Select Shape",
    owner: "Owner Settings",
    reference: "Land Unit Reference",
    calculate: "Calculate",
    length: "Length",
    width: "Width",
    top: "Top Side",
    bottom: "Bottom Side",
    left: "Left Side",
    right: "Right Side",
    sideA: "Side A",
    sideB: "Side B",
    sideC: "Side C",
    totalArea: "Total Area",
    print: "Print / PDF",
    newCalc: "New Calculation",
    password: "Password",
    unlock: "Unlock",
    save: "Save Settings",
    reset: "Reset Default",
    invalid: "Please enter valid values.",
    triangleInvalid: "Triangle sides are not valid.",
    acreRate: "Annual lease rate for 1 Acre/Killa",
    acreInput: "Acres/Kille",
    kanalInput: "Kanal",
    marlaInput: "Marle",
    leaseResult: "Lease/Theka Result",
    perKanal: "Lease per Kanal",
    perMarla: "Lease per Marla",
    fullTheka: "Total Annual Lease",
    firstInstallment: "First Installment",
    secondInstallment: "Second Installment",
    totalLand: "Total Land"
  }
};

function getSettings(){
  const raw = JSON.parse(localStorage.getItem("landSettings") || JSON.stringify(defaultSettings));
  const fixed = normalizeSettings(raw);
  localStorage.setItem("landSettings", JSON.stringify(fixed));
  return fixed;
}

function setSettings(s){
  localStorage.setItem("landSettings", JSON.stringify(s));
}

function init(){
  if(!localStorage.getItem("landSettings")) setSettings(defaultSettings);
  document.getElementById("languageSelect").addEventListener("change", e => {
    lang = e.target.value;
    updateLanguage();
  });
  updateLanguage();
  setShape("rectangle");
  renderReference();
}

function updateLanguage(){
  const t = text[lang];
  document.getElementById("appTitle").innerText = t.title;
  document.getElementById("subtitle").innerText = t.subtitle;
  document.getElementById("selectShapeTitle").innerText = t.selectShape;
  document.getElementById("ownerBtn").innerText = t.owner;
  document.getElementById("referenceTitle").innerText = t.reference;
  document.getElementById("calculateBtn").innerText = t.calculate;
  document.getElementById("passwordLabel").innerText = t.password;
  document.getElementById("unlockBtn").innerText = t.unlock;
  document.getElementById("saveBtn").innerText = t.save;
  document.getElementById("resetBtn").innerText = t.reset;
  document.getElementById("rectTab").innerText = lang === "pa" ? "ਚੌਰਸ/ਆਇਤ" : "Rectangle";
  document.getElementById("unequalTab").innerText = lang === "pa" ? "4-ਸਾਈਡ ਪਲਾਟ" : "4-Side Plot";
  document.getElementById("triangleTab").innerText = lang === "pa" ? "ਤਿਕੋਣ" : "Triangle";
  
  renderFields();
  renderReference();
}

function renderReference(){
  const s = getSettings();
  let html = "";
  if (lang === "pa") {
    html = `
      <div class="ref-section main-ref"><h4>Sq Ft ਮੁੱਖ ਮਾਪ</h4><ul>
        <li>1 ਮਰਲਾ = ${s.marlaSqft} sq ft</li>
        <li>1 ਕਨਾਲ = ${s.kanalSqft} sq ft</li>
        <li>1 ਏਕੜ/ਕਿੱਲਾ = ${s.acreSqft} sq ft</li>
        <li>1 ਕਰਮ = ${s.karamFeet} ft</li>
      </ul></div>
      <div class="ref-section"><h4>ਕਰਮ</h4><ul><li>1 ਕਰਮ = ${s.karamFeet} ft</li></ul></div>
      <div class="ref-section"><h4>ਗਜ</h4><ul><li>ਗਜ = ਬਾਅਦ ਵਿੱਚ add ਕਰਾਂਗੇ</li></ul></div>
      <div class="ref-section"><h4>ਮਰਲਾ</h4><ul><li>1 ਮਰਲਾ = ${s.marlaSqft} sq ft</li></ul></div>
      <div class="ref-section"><h4>ਕਨਾਲ</h4><ul>
        <li>1 ਕਨਾਲ = ${s.kanalSqft} sq ft</li>
        <li>1 ਕਨਾਲ = ${s.kanalMarla} ਮਰਲੇ</li>
        <li>1 ਕਨਾਲ = ${s.kanalVishwasian} ਵਿਸ਼ਵੇ</li>
      </ul></div>
      <div class="ref-section"><h4>ਏਕੜ/ਕਿੱਲਾ</h4><ul>
        <li>1 ਏਕੜ/ਕਿੱਲਾ = ${s.acreSqft} sq ft</li>
        <li>1 ਏਕੜ/ਕਿੱਲਾ = ${s.acreKanal} ਕਨਾਲਾਂ</li>
        <li>1 ਏਕੜ/ਕਿੱਲਾ = ${s.acreMarla} ਮਰਲੇ</li>
        <li>1 ਏਕੜ/ਕਿੱਲਾ = ${s.acreVishwasian} ਵਿਸ਼ਵੇ</li>
      </ul></div>
      <div class="ref-section"><h4>ਬਿੱਘਾ / ਵਿਸ਼ਵਾਸੀਆਂ</h4><ul><li>1 ਬਿੱਘਾ = ${s.bighaVishwasian} ਵਿਸ਼ਵਾਸੀਆਂ</li></ul></div>`;
  } else {
    html = `
      <div class="ref-section main-ref"><h4>Main Sq Ft Units</h4><ul>
        <li>1 Marla = ${s.marlaSqft} sq ft</li>
        <li>1 Kanal = ${s.kanalSqft} sq ft</li>
        <li>1 Acre/Killa = ${s.acreSqft} sq ft</li>
        <li>1 Karam = ${s.karamFeet} ft</li>
      </ul></div>
      <div class="ref-section"><h4>Karam</h4><ul><li>1 Karam = ${s.karamFeet} ft</li></ul></div>
      <div class="ref-section"><h4>Gaj</h4><ul><li>Gaj = will be added later</li></ul></div>
      <div class="ref-section"><h4>Marla</h4><ul><li>1 Marla = ${s.marlaSqft} sq ft</li></ul></div>
      <div class="ref-section"><h4>Kanal</h4><ul>
        <li>1 Kanal = ${s.kanalSqft} sq ft</li>
        <li>1 Kanal = ${s.kanalMarla} Marle</li>
        <li>1 Kanal = ${s.kanalVishwasian} Vishve</li>
      </ul></div>
      <div class="ref-section"><h4>Acre/Killa</h4><ul>
        <li>1 Acre/Killa = ${s.acreSqft} sq ft</li>
        <li>1 Acre/Killa = ${s.acreKanal} Kanal</li>
        <li>1 Acre/Killa = ${s.acreMarla} Marle</li>
        <li>1 Acre/Killa = ${s.acreVishwasian} Vishve</li>
      </ul></div>
      <div class="ref-section"><h4>Bigha / Vishwasian</h4><ul><li>1 Bigha = ${s.bighaVishwasian} Vishwasian</li></ul></div>`;
  }
  document.getElementById("referenceList").innerHTML = html;
}

function setShape(shape){
  currentShape = shape;
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  const map = {rectangle:"rectTab", unequal:"unequalTab", triangle:"triangleTab"};
  document.getElementById(map[shape]).classList.add("active");
  renderDiagram();
  renderFields();
  document.getElementById("result").classList.add("hidden");
}

function renderDiagram(){
  const d = document.getElementById("shapeDiagram");
  if(currentShape === "rectangle") d.innerHTML = '<div class="shape-box"></div>';
  if(currentShape === "unequal") d.innerHTML = '<div class="shape-trap"></div>';
  if(currentShape === "triangle") d.innerHTML = '<div class="triangle"></div>';
  if(currentShape === "theka") d.innerHTML = '<div class="theka-diagram">ਠੇਕਾ<br><small>ਏਕੜ/ਕਨਾਲ/ਮਰਲੇ</small></div>';
}

function field(id,label){
  return `<label>${label}<input type="number" id="${id}" step="0.01" min="0" required></label>`;
}

function renderFields(){
  const t = text[lang];
  let html = "";
  if(currentShape === "rectangle"){
    html = `<div class="grid-2">${field("length",t.length)}${field("width",t.width)}</div>`;
  }
  if(currentShape === "unequal"){
    html = `<div class="grid-2">${field("top",t.top)}${field("bottom",t.bottom)}${field("left",t.left)}${field("right",t.right)}</div>`;
  }
  if(currentShape === "triangle"){
    html = `<div class="grid-2">${field("a",t.sideA)}${field("b",t.sideB)}${field("c",t.sideC)}</div>`;
  }
  if(currentShape === "theka"){
    html = `
      <div class="help-box">
        ${lang === "pa" ? "Example: 1 ਏਕੜ/ਕਿੱਲਾ ਦਾ ਠੇਕਾ 80000 ਹੈ। 1 ਕਨਾਲ = 80000 ÷ 8, ਅਤੇ 1 ਮਰਲਾ = ਕਨਾਲ ਰੇਟ ÷ 20." : "Example: If 1 Acre/Killa lease is 80000, then 1 Kanal = 80000 ÷ 8, and 1 Marla = Kanal rate ÷ 20."}
      </div>
      <div class="grid-2">
        ${field("acreRate",t.acreRate)}
        ${field("leaseAcres",t.acreInput)}
        ${field("leaseKanal",t.kanalInput)}
        ${field("leaseMarla",t.marlaInput)}
      </div>`;
  }
  document.getElementById("fields").innerHTML = html;
}

function val(id){ return parseFloat(document.getElementById(id).value); }


function calculateTheka(){
  const t = text[lang], s = getSettings();
  const acreRate = val("acreRate") || 0;
  const acres = val("leaseAcres") || 0;
  const kanal = val("leaseKanal") || 0;
  const marla = val("leaseMarla") || 0;
  if(!acreRate || (acres === 0 && kanal === 0 && marla === 0)) return alert(t.invalid);

  const kanalRate = acreRate / s.acreKanal;
  const marlaRate = kanalRate / s.kanalMarla;
  const total = (acres * acreRate) + (kanal * kanalRate) + (marla * marlaRate);
  const totalKanal = (acres * s.acreKanal) + kanal + (marla / s.kanalMarla);
  const totalMarla = (acres * s.acreMarla) + (kanal * s.kanalMarla) + marla;

  document.getElementById("result").innerHTML = `
    <h2>${t.leaseResult}</h2>
    <p><b>Formula:</b> ${acreRate} ÷ ${s.acreKanal} = ${round(kanalRate)} | ${round(kanalRate)} ÷ ${s.kanalMarla} = ${round(marlaRate)}</p>
    <div class="result-grid">
      <div class="result-item"><span>${t.totalLand}</span><b>${acres} ${lang==="pa"?"ਏਕੜ/ਕਿੱਲਾ":"Acre/Killa"}, ${kanal} ${lang==="pa"?"ਕਨਾਲ":"Kanal"}, ${marla} ${lang==="pa"?"ਮਰਲੇ":"Marle"}</b></div>
      <div class="result-item"><span>${lang==="pa"?"ਕੁੱਲ ਕਨਾਲ":"Total Kanal"}</span><b>${round(totalKanal)}</b></div>
      <div class="result-item"><span>${lang==="pa"?"ਕੁੱਲ ਮਰਲੇ":"Total Marle"}</span><b>${round(totalMarla)}</b></div>
      <div class="result-item"><span>${t.perKanal}</span><b>₹${round(kanalRate)}</b></div>
      <div class="result-item"><span>${t.perMarla}</span><b>₹${round(marlaRate)}</b></div>
      <div class="result-item"><span>${t.fullTheka}</span><b>₹${round(total)}</b></div>
      <div class="result-item"><span>${t.firstInstallment}</span><b>₹${round(total/2)}</b></div>
      <div class="result-item"><span>${t.secondInstallment}</span><b>₹${round(total/2)}</b></div>
    </div><br>
    <button onclick="printOnly('result', 'Zameen Measurement Report')" class="primary">${t.print}</button>
    <button onclick="setShape(currentShape)">${t.newCalc}</button>`;
  document.getElementById("result").classList.remove("hidden");
}

function calculateArea(e){
  e.preventDefault();
  if(currentShape === "theka") return calculateTheka();
  const t = text[lang];
  let area = 0;
  let formula = "";

  if(currentShape === "rectangle"){
    const l = val("length"), w = val("width");
    if(!l || !w) return alert(t.invalid);
    area = l * w;
    formula = `${l} × ${w}`;
  }

  if(currentShape === "unequal"){
    const top = val("top"), bottom = val("bottom"), left = val("left"), right = val("right");
    if(!top || !bottom || !left || !right) return alert(t.invalid);
    const avgW = (top + bottom) / 2;
    const avgL = (left + right) / 2;
    area = avgW * avgL;
    formula = `((${top} + ${bottom}) / 2) × ((${left} + ${right}) / 2)`;
  }

  if(currentShape === "triangle"){
    const a = val("a"), b = val("b"), c = val("c");
    if(!a || !b || !c) return alert(t.invalid);
    if(a + b <= c || a + c <= b || b + c <= a) return alert(t.triangleInvalid);
    const s = (a + b + c) / 2;
    area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    formula = `√(${s}×${(s-a).toFixed(2)}×${(s-b).toFixed(2)}×${(s-c).toFixed(2)})`;
  }

  showResult(area, formula);
}

function round(n){ return Number(n).toFixed(3); }

function showResult(area, formula){
  const s = getSettings();
  const t = text[lang];
  const marla = area / s.marlaSqft;
  const kanal = area / s.kanalSqft;
  const acre = area / s.acreSqft;
  const vishve = acre * s.acreVishwasian;
  const bigha = vishve / s.bighaVishwasian;

  lastResult = {area, marla, kanal, acre, vishve, bigha, formula};

  document.getElementById("result").innerHTML = `
    <h2>${t.totalArea}</h2>
    <p><b>Formula:</b> ${formula}</p>
    <div class="result-grid">
      <div class="result-item"><span>Sq Ft</span><b>${round(area)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਮਰਲਾ" : "Marla"}</span><b>${round(marla)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਕਨਾਲ" : "Kanal"}</span><b>${round(kanal)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਏਕੜ/ਕਿੱਲਾ" : "Acre/Killa"}</span><b>${round(acre)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਵਿਸ਼ਵਾਸੀਆਂ" : "Vishwasian"}</span><b>${round(vishve)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਬਿੱਘਾ" : "Bigha"}</span><b>${round(bigha)}</b></div>
    </div>
    <br>
    <button onclick="printOnly('result', 'Zameen Measurement Report')" class="primary">${t.print}</button>
    <button onclick="setShape(currentShape)">${t.newCalc}</button>
  `;
  document.getElementById("result").classList.remove("hidden");
}

function openOwnerPanel(){
  document.getElementById("ownerModal").classList.remove("hidden");
  document.getElementById("passwordBox").classList.remove("hidden");
  document.getElementById("settingsBox").classList.add("hidden");
  document.getElementById("ownerPassword").value = "";
}

function closeOwnerPanel(){
  document.getElementById("ownerModal").classList.add("hidden");
}

function checkOwnerPassword(){
  if(document.getElementById("ownerPassword").value !== "owner123"){
    alert("Wrong password");
    return;
  }
  document.getElementById("passwordBox").classList.add("hidden");
  document.getElementById("settingsBox").classList.remove("hidden");
  loadSettingsForm();
}

function loadSettingsForm(){
  const s = getSettings();
  Object.keys(s).forEach(k => document.getElementById(k).value = s[k]);
}

function saveSettings(){
  const s = {};
  Object.keys(defaultSettings).forEach(k => {
    if(document.getElementById(k)){
      s[k] = (k === "ownerWhatsapp") ? document.getElementById(k).value.trim() : parseFloat(document.getElementById(k).value);
    } else {
      s[k] = getSettings()[k];
    }
  });
  setSettings(s);
  renderReference();
  alert("Settings saved");
}

function resetSettings(){
  setSettings(defaultSettings);
  loadSettingsForm();
  renderReference();
}

init();



function calculateSeparateTheka(){
  const s = getSettings();
  const acreRate = parseFloat(document.getElementById("sepAcreRate").value) || 0;
  const acres = parseFloat(document.getElementById("sepAcres").value) || 0;
  const kanal = parseFloat(document.getElementById("sepKanal").value) || 0;
  const marla = parseFloat(document.getElementById("sepMarla").value) || 0;

  if(!acreRate || (acres === 0 && kanal === 0 && marla === 0)){
    alert("ਕਿਰਪਾ ਕਰਕੇ 1 ਏਕੜ/ਕਿੱਲਾ ਦਾ ਠੇਕਾ ਅਤੇ ਜ਼ਮੀਨ ਦੀ value ਭਰੋ।");
    return;
  }

  const kanalRate = acreRate / s.acreKanal;
  const marlaRate = kanalRate / s.kanalMarla;

  const acreAmount = acres * acreRate;
  const kanalAmount = kanal * kanalRate;
  const marlaAmount = marla * marlaRate;
  const total = acreAmount + kanalAmount + marlaAmount;

  const totalKanal = (acres * s.acreKanal) + kanal + (marla / s.kanalMarla);
  const totalMarla = (acres * s.acreMarla) + (kanal * s.kanalMarla) + marla;

  if(document.getElementById("thekaSummaryStrip")){
    document.getElementById("thekaSummaryStrip").classList.remove("hidden");
    document.getElementById("sumAcreRate").innerText = "₹" + round(acreRate);
    document.getElementById("sumAcres").innerText = acres;
    document.getElementById("sumKanal").innerText = kanal;
    document.getElementById("sumMarla").innerText = marla;
  }

  const box = document.getElementById("sepThekaResult");
  box.innerHTML = `
    <div class="theka-result-head">
      <div>
        <h2><span class="section-icon blue-icon">▣</span> ਠੇਕਾ ਰਿਜ਼ਲਟ</h2>
        <p><b>Formula:</b> 1 ਕਨਾਲ = ₹${acreRate} ÷ ${s.acreKanal} = ₹${round(kanalRate)} | 1 ਮਰਲਾ = ₹${round(kanalRate)} ÷ ${s.kanalMarla} = ₹${round(marlaRate)}</p>
      </div>
      <div class="result-actions">
        <button class="whatsapp-btn" onclick="shareCurrentResult()">🟢 WhatsApp ਤੇ ਸਾਂਝਾ ਕਰੋ</button>
        <button onclick="printOnly('sepThekaResult', 'Theka / Lease Report')">🖨 PDF / Print</button>
      </div>
    </div>

    <div class="rate-row">
      <div class="rate-card acre-rate"><span class="round-icon">🌿</span><span>1 ਏਕੜ/ਕਿੱਲਾ ਦਾ ਠੇਕਾ</span><b>₹${round(acreRate)}</b></div>
      <div class="rate-card kanal-rate"><span class="round-icon">👥</span><span>1 ਕਨਾਲ ਦਾ ਠੇਕਾ</span><b>₹${round(kanalRate)}</b></div>
      <div class="rate-card marla-rate"><span class="round-icon">📋</span><span>1 ਮਰਲਾ ਦਾ ਠੇਕਾ</span><b>₹${round(marlaRate)}</b></div>
    </div>

    <div class="theka-detail-grid">
      <div class="partition-card blue-part">
        <h3><span class="section-icon">🌐</span> ਕਨਾਲ ਦੇ ਵੇਰਵੇ</h3>
        <div class="mini-result"><span>ਕੁੱਲ ਕਨਾਲ</span><b>${round(totalKanal)}</b></div>
        <div class="mini-result"><span>ਕੁੱਲ ਮਰਲੇ</span><b>${round(totalMarla)}</b></div>
      </div>

      <div class="partition-card orange-part">
        <h3><span class="section-icon">🏅</span> ਮਰਲੇ ਦੇ ਵੇਰਵੇ</h3>
        <div class="mini-result"><span>ਕਨਾਲਾਂ ਵਾਲੀ amount</span><b>₹${round(kanalAmount)}</b></div>
        <div class="mini-result"><span>ਮਰਲਿਆਂ ਵਾਲੀ amount</span><b>₹${round(marlaAmount)}</b></div>
      </div>

      <div class="main-total-card">
        <h3>🏵 ਕੁੱਲ ਸਾਲਾਨਾ ਠੇਕਾ</h3>
        <div class="total-inner">
          <span>ਸਾਲਾਨਾ ਕੁੱਲ ਠੇਕਾ (Total)</span>
          <b>₹${round(total)}</b>
          <small>(ਇਹ ਤੁਹਾਡਾ ਕੁੱਲ ਸਾਲਾਨਾ ਠੇਕਾ ਹੈ)</small>
        </div>
      </div>
    </div>

    <div class="payments-card">
      <h3>📅 ਕਿਸ਼ਤਾਂ (Payments)</h3>
      <div class="payment-grid">
        <div><span>ਪਹਿਲੀ ਕਿਸ਼ਤ (50%)</span><b>₹${round(total/2)}</b><small>(ਝੋਨੇ ਦੀ ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ)</small></div>
        <div><span>ਦੂਜੀ ਕਿਸ਼ਤ (50%)</span><b>₹${round(total/2)}</b><small>(ਦੂਜੀ ਫਸਲ ਦੀ ਕਟਾਈ ਤੋਂ ਬਾਅਦ)</small></div>
      </div>
    </div>

    <div class="note-card">💡 ਨੋਟ: ਇਹ ਕੇਵਲ ਇੱਕ ਹਿਸਾਬ ਹੈ। ਅਸਲ ਠੇਕਾ ਜ਼ਮੀਨ ਦੀ ਕਿਸਮ, ਇਲਾਕੇ ਅਤੇ ਸਮਝੌਤੇ ਮੁਤਾਬਕ ਵੱਧ ਜਾਂ ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ।</div>
  `;
  box.classList.remove("hidden");
}




function printOnly(elementId, titleText){
  const el = document.getElementById(elementId);
  if(!el || el.classList.contains("hidden")){
    alert("ਪਹਿਲਾਂ calculation ਕਰੋ, ਫਿਰ Print / PDF ਕਰੋ।");
    return;
  }

  const clean = el.cloneNode(true);
  clean.querySelectorAll("button").forEach(btn => btn.remove());

  const w = window.open("", "_blank", "width=900,height=700");
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${titleText || "Report"}</title>
      <style>
        *{box-sizing:border-box}
        body{font-family:Arial, sans-serif;margin:0;padding:18px;color:#111;background:white}
        .report{max-width:760px;margin:0 auto;border:1px solid #ddd;border-radius:14px;padding:18px}
        h1{font-size:24px;margin:0 0 14px 0;color:#0f5132}
        h2{font-size:22px;margin:0 0 12px 0}
        p{font-size:14px;margin:6px 0 12px 0}
        .result{background:white!important;border:none!important;padding:0!important;margin:0!important}
        .result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .result-item{border:1px solid #ddd;border-radius:10px;padding:10px;min-height:64px}
        .result-item span{display:block;font-size:13px;margin-bottom:4px}
        .result-item b{font-size:20px;color:#0f5132}
        @page{size:A4 portrait;margin:12mm}
        @media print{
          body{padding:0}
          .report{border:none;padding:0;max-width:none}
          h1{font-size:22px}
          h2{font-size:20px}
          .result-grid{grid-template-columns:repeat(3,1fr);gap:8px}
          .result-item{padding:8px;break-inside:avoid}
        }
      </style>
    </head>
    <body>
      <div class="report">
        <h1>${titleText || "Zameen Report"}</h1>
        ${clean.outerHTML}
      </div>
      <script>
        window.onload = function(){ window.print(); };
      <\/script>
    </body>
    </html>
  `);
  w.document.close();
}



function getVisibleResultText(){
  const result = document.getElementById("result");
  const theka = document.getElementById("sepThekaResult");
  let target = null;

  if(result && !result.classList.contains("hidden") && result.innerText.trim()) target = result;
  if(theka && !theka.classList.contains("hidden") && theka.innerText.trim()) target = theka;

  if(!target) return "";
  return target.innerText.replace(/Print\s*\/\s*PDF/g, "").replace(/New Calculation/g, "").trim();
}

function getOwnerWhatsapp(){
  const s = getSettings();
  let n = (s.ownerWhatsapp || "").toString().replace(/\D/g, "");
  if(!n){
    n = prompt("Owner WhatsApp number ਭਰੋ, ਜਿਵੇਂ 9198xxxxxxxx");
  }
  return (n || "").replace(/\D/g, "");
}

function sendWhatsAppMessage(){
  const n = getOwnerWhatsapp();
  if(!n) return alert("WhatsApp number ਲਾਜ਼ਮੀ ਹੈ।");
  const name = document.getElementById("clientName")?.value || "";
  const mobile = document.getElementById("clientMobile")?.value || "";
  const msg = document.getElementById("contactMessage")?.value || "";
  const textMsg = `Name: ${name}\nMobile: ${mobile}\nMessage: ${msg}`;
  window.open(`https://wa.me/${n}?text=${encodeURIComponent(textMsg)}`, "_blank");
}

function shareCurrentResult(){
  const resultText = getVisibleResultText();
  if(!resultText) return alert("ਪਹਿਲਾਂ calculation ਕਰੋ, ਫਿਰ result share ਕਰੋ।");

  if(navigator.share){
    navigator.share({title:"Zameen Minti Result", text:resultText}).catch(()=>{});
    return;
  }

  const n = getOwnerWhatsapp();
  if(!n) return;
  window.open(`https://wa.me/${n}?text=${encodeURIComponent(resultText)}`, "_blank");
}

function openQuickChat(){
  const n = getOwnerWhatsapp();
  if(!n) return;
  window.open(`https://wa.me/${n}?text=${encodeURIComponent("ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਨੂੰ ਜ਼ਮੀਨ ਮਿਣਤੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ।")}`, "_blank");
}



// -------- v10 Member, Saved Chat and Analytics Demo System --------
// Note: This static demo saves data in this browser using localStorage.
// Real website version needs backend database + login + socket/live analytics.

function todayKey(){
  return new Date().toISOString().slice(0,10);
}
function weekKey(){
  const d = new Date();
  const onejan = new Date(d.getFullYear(),0,1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
  return `${d.getFullYear()}-W${week}`;
}
function monthKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
function getAnalytics(){
  return JSON.parse(localStorage.getItem("zmAnalytics") || "{}");
}
function saveAnalytics(a){
  localStorage.setItem("zmAnalytics", JSON.stringify(a));
}
function trackVisit(){
  const a = getAnalytics();
  const sessionKey = "zmSessionTracked";
  if(!sessionStorage.getItem(sessionKey)){
    a.today = a.today || {};
    a.week = a.week || {};
    a.month = a.month || {};
    a.overall = (a.overall || 0) + 1;
    a.today[todayKey()] = (a.today[todayKey()] || 0) + 1;
    a.week[weekKey()] = (a.week[weekKey()] || 0) + 1;
    a.month[monthKey()] = (a.month[monthKey()] || 0) + 1;
    sessionStorage.setItem(sessionKey, "1");
    saveAnalytics(a);
  }
  updateAnalyticsUI();
}
function updateAnalyticsUI(){
  const a = getAnalytics();
  const online = parseInt(localStorage.getItem("zmOnlineFake") || "1",10);
  const onlineNow = Math.max(1, online + Math.floor(Math.random()*3));
  if(document.getElementById("onlineNow")) document.getElementById("onlineNow").innerText = onlineNow;
  if(document.getElementById("todayVisits")) document.getElementById("todayVisits").innerText = (a.today && a.today[todayKey()]) || 0;
  if(document.getElementById("weekVisits")) document.getElementById("weekVisits").innerText = (a.week && a.week[weekKey()]) || 0;
  if(document.getElementById("monthVisits")) document.getElementById("monthVisits").innerText = (a.month && a.month[monthKey()]) || 0;
  if(document.getElementById("overallVisits")) document.getElementById("overallVisits").innerText = a.overall || 0;
}

function getMembers(){
  return JSON.parse(localStorage.getItem("zmMembers") || "[]");
}
function saveMembers(members){
  localStorage.setItem("zmMembers", JSON.stringify(members));
}
function memberIdFrom(mobile,email){
  const key = (mobile || email || "guest").toString().replace(/[^a-zA-Z0-9]/g,"").slice(-8);
  return "ZM-" + (key || Date.now().toString().slice(-6));
}
function createOrLoginMember(){
  const name = document.getElementById("memberName").value.trim();
  const mobile = document.getElementById("memberMobile").value.trim();
  const email = document.getElementById("memberEmail").value.trim();

  if(!mobile && !email){
    alert("Mobile ਜਾਂ Email ਵਿਚੋਂ ਇੱਕ ਲਾਜ਼ਮੀ ਭਰੋ।");
    return;
  }

  let members = getMembers();
  let member = members.find(m => (mobile && m.mobile === mobile) || (email && m.email === email));
  if(!member){
    member = {id: memberIdFrom(mobile,email), name, mobile, email, createdAt: new Date().toISOString()};
    members.push(member);
    saveMembers(members);
  }else{
    member.name = name || member.name;
    member.mobile = mobile || member.mobile;
    member.email = email || member.email;
    saveMembers(members);
  }

  localStorage.setItem("zmCurrentMember", JSON.stringify(member));
  document.getElementById("memberStatus").innerHTML = `<b>Login:</b> ${member.id}<br>${member.name || ""} ${member.mobile || ""}`;
  loadChatHistory();
}

function currentMember(){
  return JSON.parse(localStorage.getItem("zmCurrentMember") || "null");
}
function getChats(){
  return JSON.parse(localStorage.getItem("zmChats") || "{}");
}
function saveChats(chats){
  localStorage.setItem("zmChats", JSON.stringify(chats));
}
function loadChatHistory(){
  const member = currentMember();
  const win = document.getElementById("chatWindow");
  if(!win) return;
  if(!member){
    win.innerHTML = `<div class="chat-note">ਪਹਿਲਾਂ client ID create/login ਕਰੋ।</div>`;
    return;
  }
  const chats = getChats();
  const list = chats[member.id] || [];
  if(list.length === 0){
    win.innerHTML = `<div class="chat-note">ਹਾਲੇ ਕੋਈ chat saved ਨਹੀਂ।</div>`;
    return;
  }
  win.innerHTML = list.map(m => `
    <div class="msg ${m.from === "client" ? "client-msg" : "owner-msg"}">
      <div>${m.text}</div>
      <small>${new Date(m.time).toLocaleString()}</small>
    </div>
  `).join("");
  win.scrollTop = win.scrollHeight;
}
function sendSavedChat(){
  const member = currentMember();
  if(!member){
    alert("ਪਹਿਲਾਂ client ID create/login ਕਰੋ।");
    return;
  }
  const input = document.getElementById("chatMessageInput");
  const msg = input.value.trim();
  if(!msg) return;

  const chats = getChats();
  chats[member.id] = chats[member.id] || [];
  chats[member.id].push({from:"client", text:msg, time:new Date().toISOString()});

  // Demo auto-reply for quick response feel
  chats[member.id].push({
    from:"owner",
    text:"ਤੁਹਾਡਾ message save ਹੋ ਗਿਆ ਹੈ। ਅਸੀਂ ਜਲਦੀ reply ਕਰਾਂਗੇ।",
    time:new Date().toISOString()
  });

  saveChats(chats);
  input.value = "";
  loadChatHistory();
}
function clearChatHistory(){
  const member = currentMember();
  if(!member) return;
  if(!confirm("ਇਸ member ਦੀ chat clear ਕਰਨੀ ਹੈ?")) return;
  const chats = getChats();
  chats[member.id] = [];
  saveChats(chats);
  loadChatHistory();
}

setTimeout(() => {
  trackVisit();
  loadChatHistory();
  const member = currentMember();
  if(member && document.getElementById("memberStatus")){
    document.getElementById("memberStatus").innerHTML = `<b>Login:</b> ${member.id}<br>${member.name || ""} ${member.mobile || ""}`;
  }
}, 300);
setInterval(updateAnalyticsUI, 5000);



// -------- v11 Professional Login + Private Chat Demo --------
// Static version: data is saved in this browser localStorage.
// Real online version will use database, secure password hashing and live chat server.

let authMode = "signup";

function openAuthModal(){
  document.getElementById("authModal").classList.remove("hidden");
  setAuthMode("signup");
}
function closeAuthModal(){
  document.getElementById("authModal").classList.add("hidden");
}
function setAuthMode(mode){
  authMode = mode;
  document.getElementById("signupBox").classList.toggle("hidden", mode !== "signup");
  document.getElementById("loginBox").classList.toggle("hidden", mode !== "login");
  document.getElementById("signupTabBtn").classList.toggle("active", mode === "signup");
  document.getElementById("loginTabBtn").classList.toggle("active", mode === "login");
}
function getMembers(){
  return JSON.parse(localStorage.getItem("zmMembers") || "[]");
}
function saveMembers(members){
  localStorage.setItem("zmMembers", JSON.stringify(members));
}
function makeMemberId(mobile,email){
  const base = (mobile || email || Date.now().toString()).replace(/[^a-zA-Z0-9]/g,"").slice(-8);
  return "ZM-" + base;
}
function signupMember(){
  const name = document.getElementById("signupName").value.trim();
  const mobile = document.getElementById("signupMobile").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if(!name || (!mobile && !email) || !password){
    alert("Name, password ਅਤੇ mobile/email ਲਾਜ਼ਮੀ ਹਨ।");
    return;
  }

  let members = getMembers();
  const exists = members.find(m => (mobile && m.mobile === mobile) || (email && m.email === email));
  if(exists){
    alert("ਇਹ mobile/email ਪਹਿਲਾਂ ਹੀ signup ਹੈ। Login ਕਰੋ।");
    setAuthMode("login");
    return;
  }

  const member = {
    id: makeMemberId(mobile,email),
    name, mobile, email,
    password, // demo only
    plan: "Free",
    createdAt: new Date().toISOString()
  };
  members.push(member);
  saveMembers(members);
  localStorage.setItem("zmCurrentMember", JSON.stringify(member));
  closeAuthModal();
  updateTopMemberUI();
  openPrivateChat();
}
function loginMember(){
  const identity = document.getElementById("loginIdentity").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const member = getMembers().find(m => (m.mobile === identity || m.email === identity || m.id === identity) && m.password === password);
  if(!member){
    alert("Login details wrong ਹਨ।");
    return;
  }

  localStorage.setItem("zmCurrentMember", JSON.stringify(member));
  closeAuthModal();
  updateTopMemberUI();
  openPrivateChat();
}
function currentMember(){
  return JSON.parse(localStorage.getItem("zmCurrentMember") || "null");
}
function logoutMember(){
  localStorage.removeItem("zmCurrentMember");
  updateTopMemberUI();
}
function updateTopMemberUI(){
  const m = currentMember();
  const status = document.getElementById("topMemberStatus");
  if(!status) return;

  if(m){
    status.innerText = `${m.name || "Client"} | ${m.id} | Plan: ${m.plan || "Free"}`;
    document.getElementById("loginTopBtn").classList.add("hidden");
    document.getElementById("chatTopBtn").classList.remove("hidden");
    document.getElementById("logoutTopBtn").classList.remove("hidden");
  }else{
    status.innerText = "Guest mode — calculation free ਹੈ";
    document.getElementById("loginTopBtn").classList.remove("hidden");
    document.getElementById("chatTopBtn").classList.add("hidden");
    document.getElementById("logoutTopBtn").classList.add("hidden");
  }
}
function openPrivateChat(){
  const m = currentMember();
  if(!m){
    openAuthModal();
    return;
  }
  document.getElementById("privateChatModal").classList.remove("hidden");
  document.getElementById("privateChatUser").innerHTML = `<b>${m.name}</b> | ${m.id}<br>${m.mobile || ""} ${m.email || ""}`;
  loadPrivateChat();
}
function closePrivateChat(){
  document.getElementById("privateChatModal").classList.add("hidden");
}
function getChats(){
  return JSON.parse(localStorage.getItem("zmChats") || "{}");
}
function saveChats(chats){
  localStorage.setItem("zmChats", JSON.stringify(chats));
}
function loadPrivateChat(){
  const m = currentMember();
  const win = document.getElementById("privateChatWindow");
  if(!m || !win) return;

  const chats = getChats();
  const list = chats[m.id] || [];
  if(list.length === 0){
    win.innerHTML = `<div class="chat-note">ਇਹ ਤੁਹਾਡੀ private chat ਹੈ। ਤੁਹਾਡੇ message ਇੱਥੇ save ਰਹਿਣਗੇ।</div>`;
    return;
  }

  win.innerHTML = list.map(x => `
    <div class="msg ${x.from === "client" ? "client-msg" : "owner-msg"}">
      <div>${x.text}</div>
      <small>${new Date(x.time).toLocaleString()}</small>
    </div>
  `).join("");
  win.scrollTop = win.scrollHeight;
}
function sendPrivateChat(){
  const m = currentMember();
  if(!m) return openAuthModal();

  const input = document.getElementById("privateChatInput");
  const text = input.value.trim();
  if(!text) return;

  const chats = getChats();
  chats[m.id] = chats[m.id] || [];
  chats[m.id].push({from:"client", text, time:new Date().toISOString()});

  // Demo auto-response
  chats[m.id].push({
    from:"owner",
    text:"Message save ਹੋ ਗਿਆ ਹੈ। Owner panel ਤੋਂ ਇਸਦਾ reply ਕੀਤਾ ਜਾ ਸਕੇਗਾ।",
    time:new Date().toISOString()
  });

  saveChats(chats);
  input.value = "";
  loadPrivateChat();
}
function shareChatOnWhatsapp(){
  const m = currentMember();
  if(!m) return;
  const chats = getChats()[m.id] || [];
  const txt = chats.map(c => `${c.from}: ${c.text}`).join("\n");
  if(!txt) return alert("Chat empty ਹੈ।");
  if(navigator.share){
    navigator.share({title:"My Zameen Chat", text:txt}).catch(()=>{});
  }else{
    navigator.clipboard.writeText(txt);
    alert("Chat copied.");
  }
}

setTimeout(updateTopMemberUI, 400);




function showModule(name){
  updateActiveNav(name);
  const ids = ["dashboardModule","measurementModule","thekaModule","saleModule","registryModule","reportsModule","adminModule","gpsModule"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.classList.add("hidden");
  });

  const map = {
    dashboard:"dashboardModule",
    measurement:"measurementModule",
    theka:"thekaModule",
    sale:"saleModule",
    registry:"registryModule",
    reports:"reportsModule",
    admin:"adminModule",
    gps:"gpsModule"
  };

  const target = document.getElementById(map[name] || "dashboardModule");
  if(target) target.classList.remove("hidden");

  if(name === "reports") loadReports();
  if(name === "admin") loadAdminStats();
  window.scrollTo({top:0, behavior:"smooth"});
}
setTimeout(()=>showModule("dashboard"), 200);


function updateActiveNav(name){
  document.querySelectorAll(".app-nav .nav-pill").forEach(btn => btn.classList.remove("active"));
  const navs = document.querySelectorAll(".app-nav .nav-pill");
  if(name === "dashboard" && navs[0]) navs[0].classList.add("active");
  if(name === "measurement" && navs[1]) navs[1].classList.add("active");
  if(name === "theka" && navs[2]) navs[2].classList.add("active");
}


function saveLocalReport(type, data){
  const reports = JSON.parse(localStorage.getItem("zmReports") || "[]");
  reports.unshift({ id:"REP-" + Date.now(), type, data, createdAt:new Date().toISOString() });
  localStorage.setItem("zmReports", JSON.stringify(reports.slice(0,100)));
}

function calculateSale(){
  const s = getSettings();
  const acreRate = parseFloat(document.getElementById("saleAcreRate").value) || 0;
  const acres = parseFloat(document.getElementById("saleAcres").value) || 0;
  const kanal = parseFloat(document.getElementById("saleKanal").value) || 0;
  const marla = parseFloat(document.getElementById("saleMarla").value) || 0;
  const advance = parseFloat(document.getElementById("saleAdvance").value) || 0;

  if(!acreRate || (acres === 0 && kanal === 0 && marla === 0)){ alert("Rate ਅਤੇ ਜ਼ਮੀਨ ਦੀ value ਭਰੋ।"); return; }

  const kanalRate = acreRate / s.acreKanal;
  const marlaRate = kanalRate / s.kanalMarla;
  const total = (acres * acreRate) + (kanal * kanalRate) + (marla * marlaRate);
  const balance = total - advance;
  const totalKanal = (acres * s.acreKanal) + kanal + (marla / s.kanalMarla);
  const totalMarla = (acres * s.acreMarla) + (kanal * s.kanalMarla) + marla;

  const box = document.getElementById("saleResult");
  box.innerHTML = `
    <h2>Sale / Purchase Result</h2>
    <div class="rate-row">
      <div class="rate-card acre-rate"><span class="round-icon">💰</span><span>1 ਏਕੜ/ਕਿੱਲਾ Rate</span><b>₹${round(acreRate)}</b></div>
      <div class="rate-card kanal-rate"><span class="round-icon">👥</span><span>1 ਕਨਾਲ Rate</span><b>₹${round(kanalRate)}</b></div>
      <div class="rate-card marla-rate"><span class="round-icon">📋</span><span>1 ਮਰਲਾ Rate</span><b>₹${round(marlaRate)}</b></div>
    </div>
    <div class="theka-detail-grid">
      <div class="partition-card blue-part"><h3>ਜ਼ਮੀਨ ਵੇਰਵਾ</h3><div class="mini-result"><span>ਕੁੱਲ ਕਨਾਲ</span><b>${round(totalKanal)}</b></div><div class="mini-result"><span>ਕੁੱਲ ਮਰਲੇ</span><b>${round(totalMarla)}</b></div></div>
      <div class="partition-card orange-part"><h3>Payment</h3><div class="mini-result"><span>Advance / Token</span><b>₹${round(advance)}</b></div><div class="mini-result"><span>Balance</span><b>₹${round(balance)}</b></div></div>
      <div class="main-total-card"><h3>ਕੁੱਲ Sale Value</h3><div class="total-inner"><span>Total Amount</span><b>₹${round(total)}</b><small>Sale/Purchase estimate</small></div></div>
    </div>
    <button onclick="printOnly('saleResult','Sale Purchase Report')" class="primary">Print / PDF</button>`;
  box.classList.remove("hidden");
  saveLocalReport("Sale/Purchase", {acreRate, acres, kanal, marla, total, advance, balance});
}

function calculateRegistry(){
  const amount = parseFloat(document.getElementById("regAmount").value) || 0;
  const stampPercent = parseFloat(document.getElementById("stampPercent").value) || 0;
  const regPercent = parseFloat(document.getElementById("regPercent").value) || 0;
  const other = parseFloat(document.getElementById("otherCharges").value) || 0;
  if(!amount){ alert("Sale amount ਭਰੋ।"); return; }
  const stamp = amount * stampPercent / 100;
  const reg = amount * regPercent / 100;
  const total = amount + stamp + reg + other;
  const box = document.getElementById("registryResult");
  box.innerHTML = `<h2>Registry Estimate Result</h2>
    <div class="result-grid">
      <div class="result-item"><span>Sale Amount</span><b>₹${round(amount)}</b></div>
      <div class="result-item"><span>Stamp Duty</span><b>₹${round(stamp)}</b></div>
      <div class="result-item"><span>Registration Fee</span><b>₹${round(reg)}</b></div>
      <div class="result-item"><span>Other Charges</span><b>₹${round(other)}</b></div>
      <div class="result-item"><span>Total Estimate</span><b>₹${round(total)}</b></div>
    </div><br><button onclick="printOnly('registryResult','Registry Estimate Report')" class="primary">Print / PDF</button>`;
  box.classList.remove("hidden");
  saveLocalReport("Registry", {amount, stampPercent, regPercent, other, total});
}

function loadReports(){
  const list = document.getElementById("reportsList");
  if(!list) return;
  const reports = JSON.parse(localStorage.getItem("zmReports") || "[]");
  if(!reports.length){
    list.innerHTML = `<div class="note-card">ਹਾਲੇ ਕੋਈ report saved ਨਹੀਂ। Sale ਜਾਂ Registry calculation ਕਰਕੇ reports ਇੱਥੇ ਆ ਜਾਣਗੀਆਂ।</div>`;
    return;
  }
  list.innerHTML = reports.map(r => `<div class="saved-report-card"><b>${r.type}</b><span>${new Date(r.createdAt).toLocaleString()}</span><pre>${JSON.stringify(r.data, null, 2)}</pre></div>`).join("");
}

function clearReports(){
  if(confirm("ਸਾਰੀਆਂ local reports clear ਕਰਨੀਆਂ ਹਨ?")){
    localStorage.removeItem("zmReports");
    loadReports();
  }
}

function loadAdminStats(){
  const members = JSON.parse(localStorage.getItem("zmMembers") || "[]");
  const chats = JSON.parse(localStorage.getItem("zmChats") || "{}");
  const reports = JSON.parse(localStorage.getItem("zmReports") || "[]");
  const analytics = JSON.parse(localStorage.getItem("zmAnalytics") || "{}");
  if(document.getElementById("adminMembers")) document.getElementById("adminMembers").innerText = members.length;
  if(document.getElementById("adminChats")) document.getElementById("adminChats").innerText = Object.keys(chats).length;
  if(document.getElementById("adminReports")) document.getElementById("adminReports").innerText = reports.length;
  if(document.getElementById("adminVisits")) document.getElementById("adminVisits").innerText = analytics.overall || 0;
}



let gpsPoints = [];

function addGpsPoint(point){
  if(!gpsPoints.includes(point)){
    gpsPoints.push(point);
  }
}

function simulateGpsMeasurement(){
  const sqFt = 43560;
  const marla = (sqFt / 272.25).toFixed(2);
  const kanal = (sqFt / 5445).toFixed(2);
  const acre = (sqFt / 43560).toFixed(2);

  const box = document.getElementById("gpsResult");

  box.innerHTML = `
    <div class="theka-result-head">
      <div>
        <h2>🌍 GPS Measurement Result</h2>
        <p>Selected Points: ${gpsPoints.length ? gpsPoints.join(" → ") : "A → B → C → D"}</p>
      </div>
      <div class="result-actions">
        <button class="whatsapp-btn" onclick="shareCurrentResult()">🟢 Share</button>
        <button onclick="printOnly('gpsResult','GPS Land Report')">🖨 Print</button>
      </div>
    </div>

    <div class="gps-stat-grid">
      <div class="gps-stat">
        <span>Square Feet</span>
        <b>${sqFt}</b>
      </div>

      <div class="gps-stat">
        <span>ਮਰਲੇ</span>
        <b>${marla}</b>
      </div>

      <div class="gps-stat">
        <span>ਕਨਾਲ</span>
        <b>${kanal}</b>
      </div>

      <div class="gps-stat">
        <span>ਏਕੜ/ਕਿੱਲਾ</span>
        <b>${acre}</b>
      </div>
    </div>

    <div class="note-card" style="margin-top:20px">
      📍 Future version ਵਿੱਚ real Google Maps polygon measurement add ਹੋਵੇਗੀ।
    </div>
  `;

  box.classList.remove("hidden");

  saveLocalReport("GPS Measurement", {
    points:gpsPoints,
    sqFt, marla, kanal, acre
  });
}

function resetGpsMeasurement(){
  gpsPoints = [];
  document.getElementById("gpsResult").classList.add("hidden");
}
