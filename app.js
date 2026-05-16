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
    vishweSqft: 453.75,
    vishweSqft: 453.75,
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
        <li>1 Karam = ${s.karamFeet} ft</li>\n        <li><b>1 ਵਿਸ਼ਵੇ = 453.75 sq ft</b></li>
      </ul></div>
      <div class="ref-section"><h4>Karam</h4><ul><li>1 Karam = ${s.karamFeet} ft</li></ul></div>
      <div class="ref-section"><h4>Gaj</h4><ul><li>Gaj = will be added later</li></ul></div>
      <div class="ref-section vishwe-ref-section"><h4>ਵਿਸ਼ਵੇ / Vishwe</h4><ul><li>1 ਵਿਸ਼ਵੇ = 453.75 sq ft</li></ul></div>
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
  const totalVishwe = ((acres * s.acreSqft) + (kanal * s.kanalSqft) + (marla * s.marlaSqft)) / (window.ZM_VISHWE_SQFT || 453.75);

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
  const vishve = area / (window.ZM_VISHWE_SQFT || 453.75);
  const bigha = vishve / s.bighaVishwasian;

  lastResult = {area, marla, kanal, acre, vishve, bigha, formula};

  document.getElementById("result").innerHTML = `
    <h2>${t.totalArea}</h2>
    <p><b>Formula:</b> ${formula}</p>
    <div class="result-grid">
      <div class="result-item"><span>Sq Ft</span><b>${round(area)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਮਰਲਾ" : "Marla"}</span><b>${round(marla)}</b></div>
      <div class="result-item vishwe-result-item"><span>${lang === "pa" ? "ਵਿਸ਼ਵੇ" : "Vishwe"}</span><b>${round(vishve)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਕਨਾਲ" : "Kanal"}</span><b>${round(kanal)}</b></div>
      <div class="result-item"><span>${lang === "pa" ? "ਏਕੜ/ਕਿੱਲਾ" : "Acre/Killa"}</span><b>${round(acre)}</b></div>
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
        <div class="mini-result vishwe-result-item"><span>ਕੁੱਲ ਵਿਸ਼ਵੇ</span><b>${round(totalVishwe)}</b></div>
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
  const totalVishwe = ((acres * s.acreSqft) + (kanal * s.kanalSqft) + (marla * s.marlaSqft)) / (window.ZM_VISHWE_SQFT || 453.75);

  const box = document.getElementById("saleResult");
  box.innerHTML = `
    <h2>Sale / Purchase Result</h2>
    <div class="rate-row">
      <div class="rate-card acre-rate"><span class="round-icon">💰</span><span>1 ਏਕੜ/ਕਿੱਲਾ Rate</span><b>₹${round(acreRate)}</b></div>
      <div class="rate-card kanal-rate"><span class="round-icon">👥</span><span>1 ਕਨਾਲ Rate</span><b>₹${round(kanalRate)}</b></div>
      <div class="rate-card marla-rate"><span class="round-icon">📋</span><span>1 ਮਰਲਾ Rate</span><b>₹${round(marlaRate)}</b></div>
    </div>
    <div class="theka-detail-grid">
      <div class="partition-card blue-part"><h3>ਜ਼ਮੀਨ ਵੇਰਵਾ</h3><div class="mini-result"><span>ਕੁੱਲ ਕਨਾਲ</span><b>${round(totalKanal)}</b></div><div class="mini-result"><span>ਕੁੱਲ ਮਰਲੇ</span><b>${round(totalMarla)}</b></div><div class="mini-result vishwe-result-item"><span>ਕੁੱਲ ਵਿਸ਼ਵੇ</span><b>${round(totalVishwe)}</b></div></div>
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


// -------- v18 Admin Inbox / Owner Reply System --------
let selectedAdminClientId = null;

function getAllMembersForAdmin(){
  return JSON.parse(localStorage.getItem("zmMembers") || "[]");
}

function getChats(){
  return JSON.parse(localStorage.getItem("zmChats") || "{}");
}

function saveChats(chats){
  localStorage.setItem("zmChats", JSON.stringify(chats));
}

function sendPrivateChat(){
  const m = currentMember();
  if(!m) return openAuthModal();

  const input = document.getElementById("privateChatInput");
  const text = input.value.trim();
  if(!text) return;

  const chats = getChats();
  chats[m.id] = chats[m.id] || [];
  chats[m.id].push({
    from:"client",
    text:text,
    time:new Date().toISOString(),
    unreadForOwner:true
  });

  saveChats(chats);
  input.value = "";
  loadPrivateChat();
  updateAdminUnreadBadge();
  alert("Message owner inbox ਵਿੱਚ save ਹੋ ਗਿਆ ਹੈ।");
}

function openAdminInbox(){
  const pass = prompt("Owner password ਭਰੋ:");
  if(pass !== "owner123"){
    alert("Wrong owner password");
    return;
  }
  document.getElementById("adminInboxModal").classList.remove("hidden");
  loadAdminInbox();
}

function closeAdminInbox(){
  document.getElementById("adminInboxModal").classList.add("hidden");
}

function getClientNameById(id){
  const members = getAllMembersForAdmin();
  return members.find(m => m.id === id) || {id:id, name:"Guest/Unknown", mobile:"", email:""};
}

function loadAdminInbox(){
  const list = document.getElementById("adminChatList");
  if(!list) return;

  const chats = getChats();
  const ids = Object.keys(chats);

  if(ids.length === 0){
    list.innerHTML = '<div class="chat-note">ਹਾਲੇ ਕੋਈ client message ਨਹੀਂ ਆਇਆ।</div>';
    document.getElementById("adminChatWindow").innerHTML = "";
    updateAdminUnreadBadge();
    return;
  }

  ids.sort((a,b)=>{
    const ca = chats[a] || [];
    const cb = chats[b] || [];
    return new Date((cb[cb.length-1]||{}).time || 0) - new Date((ca[ca.length-1]||{}).time || 0);
  });

  list.innerHTML = ids.map(id=>{
    const member = getClientNameById(id);
    const chat = chats[id] || [];
    const last = chat[chat.length-1] || {};
    const unread = chat.filter(m => m.from === "client" && m.unreadForOwner).length;
    const initial = (member.name || "C").charAt(0).toUpperCase();
    return `
      <button class="admin-client-row ${selectedAdminClientId === id ? "active" : ""}" onclick="selectAdminChat('${id}')">
        <div class="avatar-circle">${initial}</div>
        <div class="client-row-text">
          <b>${member.name || "Client"}</b>
          <span>${last.text ? last.text.slice(0,55) : "No message"}</span>
          <small>${last.time ? new Date(last.time).toLocaleString() : ""}</small>
        </div>
        ${unread ? `<em>${unread}</em>` : ""}
      </button>
    `;
  }).join("");

  updateAdminUnreadBadge();
}

function selectAdminChat(id){
  selectedAdminClientId = id;
  const member = getClientNameById(id);
  document.getElementById("adminSelectedClient").innerHTML = `
    <b>${member.name || "Client"}</b> | ${member.id}<br>
    ${member.mobile || ""} ${member.email || ""}
  `;
  renderAdminChat();
  loadAdminInbox();
}

function renderAdminChat(){
  const win = document.getElementById("adminChatWindow");
  const chats = getChats();
  const list = chats[selectedAdminClientId] || [];

  if(!selectedAdminClientId){
    win.innerHTML = '<div class="chat-note">ਕਿਸੇ client ਦੀ chat select ਕਰੋ।</div>';
    return;
  }

  win.innerHTML = list.map(m => `
    <div class="msg ${m.from === "client" ? "client-msg" : "owner-msg"}">
      <div>${m.text}</div>
      <small>${new Date(m.time).toLocaleString()} ${m.unreadForOwner ? " • unread" : ""}</small>
    </div>
  `).join("");
  win.scrollTop = win.scrollHeight;
}

function sendAdminReply(){
  if(!selectedAdminClientId){
    alert("ਪਹਿਲਾਂ client select ਕਰੋ।");
    return;
  }
  const input = document.getElementById("adminReplyInput");
  const text = input.value.trim();
  if(!text) return;

  const chats = getChats();
  chats[selectedAdminClientId] = chats[selectedAdminClientId] || [];
  chats[selectedAdminClientId].push({
    from:"owner",
    text:text,
    time:new Date().toISOString(),
    unreadForClient:true
  });

  saveChats(chats);
  input.value = "";
  renderAdminChat();
  loadAdminInbox();
}

function markChatRead(){
  if(!selectedAdminClientId) return;
  const chats = getChats();
  chats[selectedAdminClientId] = (chats[selectedAdminClientId] || []).map(m => {
    m.unreadForOwner = false;
    return m;
  });
  saveChats(chats);
  renderAdminChat();
  loadAdminInbox();
  updateAdminUnreadBadge();
}

function updateAdminUnreadBadge(){
  const badge = document.getElementById("adminUnreadBadge");
  if(!badge) return;
  const chats = getChats();
  let total = 0;
  Object.values(chats).forEach(list=>{
    total += (list || []).filter(m => m.from === "client" && m.unreadForOwner).length;
  });
  if(total > 0){
    badge.innerText = total;
    badge.classList.remove("hidden");
  }else{
    badge.classList.add("hidden");
  }
}

function exportSelectedChat(){
  if(!selectedAdminClientId) return alert("Client select ਕਰੋ।");
  const member = getClientNameById(selectedAdminClientId);
  const chats = getChats()[selectedAdminClientId] || [];
  const text = "Chat Export\\nClient: " + member.name + " (" + member.id + ")\\nMobile: " + (member.mobile || "") + "\\nEmail: " + (member.email || "") + "\\n\\n" +
    chats.map(m => "[" + new Date(m.time).toLocaleString() + "] " + m.from + ": " + m.text).join("\\n");

  const blob = new Blob([text], {type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = member.id + "-chat.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function loadPrivateChat(){
  const m = currentMember();
  const win = document.getElementById("privateChatWindow");
  if(!m || !win) return;

  const chats = getChats();
  const list = chats[m.id] || [];
  if(list.length === 0){
    win.innerHTML = '<div class="chat-note">ਇਹ ਤੁਹਾਡੀ private chat ਹੈ। ਤੁਹਾਡੇ message ਇੱਥੇ save ਰਹਿਣਗੇ।</div>';
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

setTimeout(updateAdminUnreadBadge, 600);
setInterval(updateAdminUnreadBadge, 5000);



// -------- v19 Admin Login + Inbox Sync Fix --------
const ADMIN_ID = "owner";

function isAdminLoggedIn(){
  return localStorage.getItem("zmAdminLoggedIn") === "yes";
}

function adminLogin(){
  const id = document.getElementById("adminUserId")?.value.trim();
  const pass = document.getElementById("adminUserPass")?.value.trim();

  if(id !== ADMIN_ID || pass !== "owner123"){
    alert("Admin ID ਜਾਂ password wrong ਹੈ।");
    return;
  }

  localStorage.setItem("zmAdminLoggedIn", "yes");
  document.getElementById("adminLoginBox").classList.add("hidden");
  document.getElementById("adminInboxBox").classList.remove("hidden");
  syncAllChatsToAdmin();
  loadAdminInbox();
}

function openAdminInbox(){
  document.getElementById("adminInboxModal").classList.remove("hidden");

  if(isAdminLoggedIn()){
    document.getElementById("adminLoginBox").classList.add("hidden");
    document.getElementById("adminInboxBox").classList.remove("hidden");
    syncAllChatsToAdmin();
    loadAdminInbox();
  }else{
    document.getElementById("adminLoginBox").classList.remove("hidden");
    document.getElementById("adminInboxBox").classList.add("hidden");
  }
}

function sendPrivateChat(){
  const m = currentMember();
  if(!m) return openAuthModal();

  const input = document.getElementById("privateChatInput");
  const text = input.value.trim();
  if(!text) return;

  const chats = getChats();
  chats[m.id] = chats[m.id] || [];

  const msg = {
    from:"client",
    text:text,
    time:new Date().toISOString(),
    unreadForOwner:true,
    memberId:m.id,
    memberName:m.name || "",
    memberMobile:m.mobile || "",
    memberEmail:m.email || ""
  };

  chats[m.id].push(msg);
  saveChats(chats);

  const inbox = JSON.parse(localStorage.getItem("zmAdminInbox") || "[]");
  inbox.unshift(msg);
  localStorage.setItem("zmAdminInbox", JSON.stringify(inbox.slice(0,500)));

  input.value = "";
  loadPrivateChat();
  updateAdminUnreadBadge();
  alert("Message admin inbox ਵਿੱਚ save ਹੋ ਗਿਆ ਹੈ।");
}

function syncAllChatsToAdmin(){
  const chats = getChats();
  const members = getAllMembersForAdmin();
  let inbox = [];

  Object.keys(chats).forEach(id => {
    const member = members.find(m => m.id === id) || {};
    (chats[id] || []).forEach(m => {
      if(m.from === "client"){
        inbox.push({
          ...m,
          memberId:id,
          memberName:m.memberName || member.name || "Client",
          memberMobile:m.memberMobile || member.mobile || "",
          memberEmail:m.memberEmail || member.email || ""
        });
      }
    });
  });

  inbox.sort((a,b)=>new Date(b.time || 0)-new Date(a.time || 0));
  localStorage.setItem("zmAdminInbox", JSON.stringify(inbox.slice(0,500)));
  updateAdminUnreadBadge();
}

function loadAdminInbox(){
  if(!isAdminLoggedIn()) return;

  const list = document.getElementById("adminChatList");
  if(!list) return;

  syncAllChatsToAdmin();

  const chats = getChats();
  const ids = Object.keys(chats);

  if(ids.length === 0){
    list.innerHTML = '<div class="chat-note">ਹਾਲੇ ਕੋਈ client message ਨਹੀਂ ਆਇਆ।</div>';
    document.getElementById("adminChatWindow").innerHTML = "";
    updateAdminUnreadBadge();
    return;
  }

  ids.sort((a,b)=>{
    const ca = chats[a] || [];
    const cb = chats[b] || [];
    return new Date((cb[cb.length-1]||{}).time || 0) - new Date((ca[ca.length-1]||{}).time || 0);
  });

  list.innerHTML = ids.map(id=>{
    const member = getClientNameById(id);
    const chat = chats[id] || [];
    const last = chat[chat.length-1] || {};
    const unread = chat.filter(m => m.from === "client" && m.unreadForOwner).length;
    const initial = (member.name || "C").charAt(0).toUpperCase();

    return `
      <button class="admin-client-row ${selectedAdminClientId === id ? "active" : ""}" onclick="selectAdminChat('${id}')">
        <div class="avatar-circle">${initial}</div>
        <div class="client-row-text">
          <b>${member.name || "Client"}</b>
          <span>${last.text ? last.text.slice(0,55) : "No message"}</span>
          <small>${last.time ? new Date(last.time).toLocaleString() : ""}</small>
        </div>
        ${unread ? `<em>${unread}</em>` : ""}
      </button>
    `;
  }).join("");

  updateAdminUnreadBadge();
}

function updateAdminUnreadBadge(){
  const badge = document.getElementById("adminUnreadBadge");
  if(!badge) return;

  const chats = getChats();
  let total = 0;
  Object.values(chats).forEach(list=>{
    total += (list || []).filter(m => m.from === "client" && m.unreadForOwner).length;
  });

  if(total > 0){
    badge.innerText = total;
    badge.classList.remove("hidden");
  }else{
    badge.classList.add("hidden");
  }
}



// -------- v24 Security added on top of working v19 --------
// Keeps v19 working module/navigation structure. Adds local hashed admin password + change password.

async function zmSha256(text){
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,"0")).join("");
}

async function zmGetAdminHash(){
  let h = localStorage.getItem("zmAdminPassHash");
  if(!h){
    h = await zmSha256("owner123");
    localStorage.setItem("zmAdminPassHash", h);
  }
  return h;
}

async function zmVerifyAdminPassword(pass){
  const saved = await zmGetAdminHash();
  const attempt = await zmSha256(pass);
  return saved === attempt;
}

// Override v19 adminLogin only; no module navigation touched.
async function adminLogin(){
  const id = document.getElementById("adminUserId")?.value.trim();
  const pass = document.getElementById("adminUserPass")?.value.trim();

  if(id !== "owner" || !(await zmVerifyAdminPassword(pass))){
    alert("Admin ID ਜਾਂ password wrong ਹੈ।");
    return;
  }

  localStorage.setItem("zmAdminLoggedIn", "yes");
  document.getElementById("adminLoginBox")?.classList.add("hidden");
  document.getElementById("adminInboxBox")?.classList.remove("hidden");
  document.getElementById("adminSecurityPanel")?.classList.remove("hidden");
  if(typeof syncAllChatsToAdmin === "function") syncAllChatsToAdmin();
  if(typeof loadAdminInbox === "function") loadAdminInbox();
}

function adminLogout(){
  localStorage.removeItem("zmAdminLoggedIn");
  document.getElementById("adminInboxBox")?.classList.add("hidden");
  document.getElementById("adminSecurityPanel")?.classList.add("hidden");
  document.getElementById("adminLoginBox")?.classList.remove("hidden");
}

function toggleAdminSecurity(){
  const panel = document.getElementById("adminSecurityPanel");
  if(!panel) return;
  if(localStorage.getItem("zmAdminLoggedIn") !== "yes"){
    alert("ਪਹਿਲਾਂ admin login ਕਰੋ।");
    return;
  }
  panel.classList.toggle("hidden");
}

// Override v19 openAdminInbox only; no prompt, proper login panel.
function openAdminInbox(){
  document.getElementById("adminInboxModal")?.classList.remove("hidden");

  if(localStorage.getItem("zmAdminLoggedIn") === "yes"){
    document.getElementById("adminLoginBox")?.classList.add("hidden");
    document.getElementById("adminInboxBox")?.classList.remove("hidden");
    document.getElementById("adminSecurityPanel")?.classList.remove("hidden");
    if(typeof syncAllChatsToAdmin === "function") syncAllChatsToAdmin();
    if(typeof loadAdminInbox === "function") loadAdminInbox();
  }else{
    document.getElementById("adminLoginBox")?.classList.remove("hidden");
    document.getElementById("adminInboxBox")?.classList.add("hidden");
    document.getElementById("adminSecurityPanel")?.classList.add("hidden");
  }
}

async function changeAdminPassword(){
  const current = document.getElementById("adminCurrentPass")?.value.trim();
  const next = document.getElementById("adminNewPass")?.value.trim();

  if(!current || !next){
    alert("Current ਤੇ new password ਦੋਵੇਂ ਭਰੋ।");
    return;
  }
  if(next.length < 6){
    alert("New password ਘੱਟੋ-ਘੱਟ 6 characters ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।");
    return;
  }
  if(!(await zmVerifyAdminPassword(current))){
    alert("Current password wrong ਹੈ।");
    return;
  }

  const newHash = await zmSha256(next);
  localStorage.setItem("zmAdminPassHash", newHash);
  document.getElementById("adminCurrentPass").value = "";
  document.getElementById("adminNewPass").value = "";
  alert("Admin password change ਹੋ ਗਿਆ ਹੈ।");
}

// Safe extra module open only for added backendSecurity module, preserves old v19 showModule for other modules.
function showModuleSafeV24(name){
  if(name === "backendSecurity"){
    const all = ["dashboardModule","measurementModule","thekaModule","saleModule","registryModule","reportsModule","adminModule","gpsModule","backendSecurityModule"];
    all.forEach(id => document.getElementById(id)?.classList.add("hidden"));
    document.getElementById("backendSecurityModule")?.classList.remove("hidden");
    window.scrollTo({top:0, behavior:"smooth"});
    return;
  }
  if(typeof showModule === "function") showModule(name);
}



// -------- v26 Owner/Client UI Separation --------
function isOwnerMode(){
  return localStorage.getItem("zmOwnerMode") === "yes" || localStorage.getItem("zmAdminLoggedIn") === "yes";
}
function applyOwnerClientUI(){
  const owner = isOwnerMode();
  document.querySelectorAll(".owner-only").forEach(el => el.classList.toggle("hidden", !owner));
  if(!owner){
    ["adminModule","backendSecurityModule"].forEach(id => document.getElementById(id)?.classList.add("hidden"));
  }
  const btn = document.getElementById("ownerModeBtn");
  if(btn){
    btn.innerHTML = owner ? "🔓 Owner Mode" : "🔐 Owner";
    btn.classList.toggle("active-owner", owner);
  }
}
async function ownerModeLogin(){
  if(isOwnerMode()){
    if(confirm("Owner mode logout ਕਰਨਾ ਹੈ?")){
      localStorage.removeItem("zmOwnerMode");
      localStorage.removeItem("zmAdminLoggedIn");
      applyOwnerClientUI();
      if(typeof showModule === "function") showModule("dashboard");
    }
    return;
  }
  const pass = prompt("Owner password ਭਰੋ:");
  if(!pass) return;
  let ok = false;
  try{
    if(typeof zmVerifyAdminPassword === "function") ok = await zmVerifyAdminPassword(pass);
    else ok = pass === "owner123";
  }catch(e){ ok = pass === "owner123"; }
  if(!ok) return alert("Wrong owner password");
  localStorage.setItem("zmOwnerMode", "yes");
  localStorage.setItem("zmAdminLoggedIn", "yes");
  applyOwnerClientUI();
  alert("Owner mode active ਹੋ ਗਿਆ ਹੈ।");
}
const oldAdminLoginV26 = window.adminLogin;
window.adminLogin = async function(){
  if(typeof oldAdminLoginV26 === "function") await oldAdminLoginV26();
  if(localStorage.getItem("zmAdminLoggedIn") === "yes"){
    localStorage.setItem("zmOwnerMode", "yes");
    applyOwnerClientUI();
  }
};
const oldShowModuleV26 = window.showModule;
window.showModule = function(name){
  if((name === "admin" || name === "backendSecurity") && !isOwnerMode()){
    alert("ਇਹ Owner/Admin area ਹੈ। ਪਹਿਲਾਂ Owner login ਕਰੋ।");
    return;
  }
  if(typeof oldShowModuleV26 === "function") oldShowModuleV26(name);
  applyOwnerClientUI();
};
document.addEventListener("DOMContentLoaded", function(){ setTimeout(applyOwnerClientUI, 300); });
setTimeout(applyOwnerClientUI, 500);



// -------- v28 Real Map Polygon Measurement --------
// Free map uses Leaflet + OpenStreetMap. Google Maps can be added later with an API key.

let zmMap = null;
let zmMapPoints = [];
let zmMapMarkers = [];
let zmMapPolygon = null;

function initRealMap(){
  const mapBox = document.getElementById("realMap");
  if(!mapBox) return;

  if(typeof L === "undefined"){
    mapBox.innerHTML = `<div class="map-loading-note">Map library load ਨਹੀਂ ਹੋਈ। Internet connection check ਕਰੋ ਜਾਂ online site ਤੇ open ਕਰੋ।</div>`;
    return;
  }

  if(zmMap){
    setTimeout(() => zmMap.invalidateSize(), 200);
    return;
  }

  mapBox.innerHTML = "";
  zmMap = L.map("realMap").setView([30.7333, 76.7794], 13); // Punjab/Chandigarh default

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 22,
    attribution: "© OpenStreetMap"
  }).addTo(zmMap);

  zmMap.on("click", function(e){
    addMapPoint(e.latlng);
  });

  setTimeout(() => zmMap.invalidateSize(), 400);
}

function locateMeOnMap(){
  initRealMap();
  if(!navigator.geolocation){
    alert("Geolocation supported ਨਹੀਂ।");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    zmMap.setView([lat, lng], 18);
    L.circleMarker([lat,lng], {radius:8}).addTo(zmMap).bindPopup("Your location").openPopup();
  }, () => alert("Location permission ਨਹੀਂ ਮਿਲੀ।"));
}

function addMapPoint(latlng){
  if(!zmMap) return;
  zmMapPoints.push(latlng);

  const marker = L.marker(latlng, {title:`Point ${zmMapPoints.length}`}).addTo(zmMap);
  marker.bindTooltip(String.fromCharCode(64 + zmMapPoints.length), {permanent:true, direction:"top"});
  zmMapMarkers.push(marker);

  drawMapPolygon();
}

function drawMapPolygon(){
  if(!zmMap) return;
  if(zmMapPolygon){
    zmMap.removeLayer(zmMapPolygon);
    zmMapPolygon = null;
  }
  if(zmMapPoints.length >= 3){
    zmMapPolygon = L.polygon(zmMapPoints, {
      color:"#0f6b3a",
      weight:3,
      fillColor:"#0f6b3a",
      fillOpacity:0.18
    }).addTo(zmMap);
  }else if(zmMapPoints.length >= 2){
    zmMapPolygon = L.polyline(zmMapPoints, {color:"#0f6b3a", weight:3}).addTo(zmMap);
  }
}

function undoMapPoint(){
  if(!zmMap || zmMapPoints.length === 0) return;
  zmMapPoints.pop();
  const marker = zmMapMarkers.pop();
  if(marker) zmMap.removeLayer(marker);
  drawMapPolygon();
}

function clearMapPolygon(){
  if(!zmMap) return;
  zmMapPoints = [];
  zmMapMarkers.forEach(m => zmMap.removeLayer(m));
  zmMapMarkers = [];
  if(zmMapPolygon) zmMap.removeLayer(zmMapPolygon);
  zmMapPolygon = null;
  document.getElementById("gpsResult")?.classList.add("hidden");
}

function radians(deg){ return deg * Math.PI / 180; }

// Approx spherical polygon area in square meters
function polygonAreaSqMeters(latlngs){
  if(latlngs.length < 3) return 0;
  const R = 6378137;
  let area = 0;

  for(let i=0; i<latlngs.length; i++){
    const p1 = latlngs[i];
    const p2 = latlngs[(i+1) % latlngs.length];
    area += radians(p2.lng - p1.lng) * (2 + Math.sin(radians(p1.lat)) + Math.sin(radians(p2.lat)));
  }

  area = area * R * R / 2;
  return Math.abs(area);
}

function calculateMapPolygonArea(){
  const s = getSettings ? getSettings() : {marlaSqft:272.25, kanalSqft:5445, acreSqft:43560};

  if(zmMapPoints.length < 3){
    alert("ਘੱਟੋ-ਘੱਟ 3 points add ਕਰੋ।");
    return;
  }

  const sqMeters = polygonAreaSqMeters(zmMapPoints);
  const sqFt = sqMeters * 10.76391041671;
  const marla = sqFt / s.marlaSqft;
  const kanal = sqFt / s.kanalSqft;
  const acre = sqFt / s.acreSqft;
  const vishve = sqFt / (window.ZM_VISHWE_SQFT || 453.75);

  const box = document.getElementById("gpsResult");
  box.innerHTML = `
    <div class="theka-result-head">
      <div>
        <h2>🌍 Real Map Polygon Result</h2>
        <p><b>Points:</b> ${zmMapPoints.length} | <b>Area:</b> ${round(sqMeters)} sq meter</p>
      </div>
      <div class="result-actions">
        <button class="whatsapp-btn" onclick="shareCurrentResult()">🟢 Share</button>
        <button onclick="printOnly('gpsResult','Map Polygon Land Report')">🖨 Print</button>
      </div>
    </div>

    <div class="gps-stat-grid">
      <div class="gps-stat"><span>Square Feet</span><b>${round(sqFt)}</b></div>
      <div class="gps-stat"><span>ਮਰਲੇ</span><b>${round(marla)}</b></div>
      <div class="gps-stat vishwe-result-item"><span>ਵਿਸ਼ਵੇ</span><b>${round(vishve)}</b></div>
      <div class="gps-stat"><span>ਕਨਾਲ</span><b>${round(kanal)}</b></div>
      <div class="gps-stat"><span>ਏਕੜ/ਕਿੱਲਾ</span><b>${round(acre)}</b></div>
      <div class="gps-stat"><span>Sq Meter</span><b>${round(sqMeters)}</b></div>
    </div>

    <div class="note-card" style="margin-top:16px">
      📍 ਇਹ map measurement approximate ਹੈ। Legal/registry work ਲਈ official survey measurement ਲਾਜ਼ਮੀ ਹੈ।
    </div>
  `;
  box.classList.remove("hidden");

  if(typeof saveLocalReport === "function"){
    saveLocalReport("Map Polygon Measurement", {
      points: zmMapPoints.map(p => ({lat:p.lat, lng:p.lng})),
      sqMeters, sqFt, marla, kanal, acre, vishve
    });
  }
}

// When GPS module opens, map size refresh
const oldShowModuleV28 = window.showModule;
window.showModule = function(name){
  if(typeof oldShowModuleV28 === "function") oldShowModuleV28(name);
  if(name === "gps"){
    setTimeout(() => {
      if(zmMap) zmMap.invalidateSize();
    }, 400);
  }
};



// -------- v29 Map Search + Distance Measurement --------
let zmMapMode = "area";
let zmDistanceLine = null;

function setMapMode(mode){
  zmMapMode = mode;
  const areaBtn = document.getElementById("areaModeBtn");
  const distBtn = document.getElementById("distanceModeBtn");
  if(areaBtn && distBtn){
    areaBtn.classList.toggle("primary", mode === "area");
    distBtn.classList.toggle("primary", mode === "distance");
  }
  if(mode === "distance"){
    alert("Distance Mode: map ਤੇ 2 points click ਕਰੋ, ਫਿਰ Calculate Distance.");
  }else{
    alert("Area Mode: ਜ਼ਮੀਨ ਦੇ corner points click ਕਰੋ, ਫਿਰ Calculate Area.");
  }
}

// Override addMapPoint from v28 to support area/distance modes
function addMapPoint(latlng){
  if(!zmMap) return;

  if(zmMapMode === "distance" && zmMapPoints.length >= 2){
    clearMapPolygon();
  }

  zmMapPoints.push(latlng);

  const label = zmMapMode === "distance" ? (zmMapPoints.length === 1 ? "A" : "B") : String.fromCharCode(64 + zmMapPoints.length);
  const marker = L.marker(latlng, {title:`Point ${label}`}).addTo(zmMap);
  marker.bindTooltip(label, {permanent:true, direction:"top"});
  zmMapMarkers.push(marker);

  if(zmMapMode === "distance") drawDistanceLine();
  else drawMapPolygon();
}

function drawDistanceLine(){
  if(!zmMap) return;
  if(zmDistanceLine){
    zmMap.removeLayer(zmDistanceLine);
    zmDistanceLine = null;
  }
  if(zmMapPoints.length >= 2){
    zmDistanceLine = L.polyline([zmMapPoints[0], zmMapPoints[1]], {
      color:"#1669c7",
      weight:4,
      dashArray:"8,8"
    }).addTo(zmMap);
  }
}

function clearMapPolygon(){
  if(!zmMap) return;
  zmMapPoints = [];
  zmMapMarkers.forEach(m => zmMap.removeLayer(m));
  zmMapMarkers = [];
  if(zmMapPolygon) zmMap.removeLayer(zmMapPolygon);
  if(zmDistanceLine) zmMap.removeLayer(zmDistanceLine);
  zmMapPolygon = null;
  zmDistanceLine = null;
  document.getElementById("gpsResult")?.classList.add("hidden");
}

function undoMapPoint(){
  if(!zmMap || zmMapPoints.length === 0) return;
  zmMapPoints.pop();
  const marker = zmMapMarkers.pop();
  if(marker) zmMap.removeLayer(marker);
  if(zmMapMode === "distance") drawDistanceLine();
  else drawMapPolygon();
}

function haversineMeters(p1,p2){
  const R = 6371000;
  const dLat = radians(p2.lat - p1.lat);
  const dLng = radians(p2.lng - p1.lng);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(radians(p1.lat)) * Math.cos(radians(p2.lat)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function calculateMapDistance(){
  if(zmMapPoints.length < 2){
    alert("Distance ਲਈ 2 points click ਕਰੋ।");
    return;
  }

  const meters = haversineMeters(zmMapPoints[0], zmMapPoints[1]);
  const feet = meters * 3.280839895;
  const km = meters / 1000;
  const miles = meters / 1609.344;
  const karam = feet / (getSettings().karamFeet || 5.5);

  const box = document.getElementById("gpsResult");
  box.innerHTML = `
    <div class="theka-result-head">
      <div>
        <h2>📏 Distance Result</h2>
        <p><b>Point A ਤੋਂ Point B ਤੱਕ distance</b></p>
      </div>
      <div class="result-actions">
        <button class="whatsapp-btn" onclick="shareCurrentResult()">🟢 Share</button>
        <button onclick="printOnly('gpsResult','Map Distance Report')">🖨 Print</button>
      </div>
    </div>

    <div class="gps-stat-grid">
      <div class="gps-stat"><span>Feet</span><b>${round(feet)}</b></div>
      <div class="gps-stat"><span>Meter</span><b>${round(meters)}</b></div>
      <div class="gps-stat"><span>Kilometer</span><b>${round(km)}</b></div>
      <div class="gps-stat"><span>Mile</span><b>${round(miles)}</b></div>
      <div class="gps-stat"><span>ਕਰਮ</span><b>${round(karam)}</b></div>
    </div>

    <div class="note-card" style="margin-top:16px">
      📍 ਇਹ distance approximate ਹੈ। Legal/survey ਲਈ official measurement ਜ਼ਰੂਰੀ ਹੈ।
    </div>
  `;
  box.classList.remove("hidden");

  if(typeof saveLocalReport === "function"){
    saveLocalReport("Map Distance Measurement", {
      pointA: {lat:zmMapPoints[0].lat, lng:zmMapPoints[0].lng},
      pointB: {lat:zmMapPoints[1].lat, lng:zmMapPoints[1].lng},
      feet, meters, km, miles, karam
    });
  }
}

async function searchMapPlace(){
  const q = document.getElementById("mapSearchInput")?.value.trim();
  if(!q) return alert("Search ਲਈ place/area name ਲਿਖੋ।");

  initRealMap();

  const resultsBox = document.getElementById("mapSearchResults");
  resultsBox.classList.remove("hidden");
  resultsBox.innerHTML = `<div class="map-result-loading">Searching...</div>`;

  try{
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=1&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {headers: {"Accept":"application/json"}});
    const data = await res.json();

    if(!data || data.length === 0){
      resultsBox.innerHTML = `<div class="note-card">ਕੋਈ result ਨਹੀਂ ਮਿਲਿਆ। Search words ਬਦਲ ਕੇ try ਕਰੋ।</div>`;
      return;
    }

    resultsBox.innerHTML = data.map((r,idx)=>`
      <button class="map-search-result" onclick="goToSearchResult(${idx})" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${encodeURIComponent(r.display_name)}">
        <b>${r.display_name.split(",").slice(0,2).join(", ")}</b>
        <span>${r.display_name}</span>
      </button>
    `).join("");

  }catch(e){
    resultsBox.innerHTML = `<div class="note-card">Search service load ਨਹੀਂ ਹੋਈ। Internet ਤੇ online site ਤੇ try ਕਰੋ।</div>`;
  }
}

function goToSearchResult(index){
  const btn = document.querySelectorAll(".map-search-result")[index];
  if(!btn || !zmMap) return;

  const lat = parseFloat(btn.dataset.lat);
  const lon = parseFloat(btn.dataset.lon);
  const name = decodeURIComponent(btn.dataset.name || "");

  zmMap.setView([lat, lon], 16);
  L.marker([lat, lon]).addTo(zmMap).bindPopup(name).openPopup();
}



// -------- v30 Google-Maps-style live search suggestions --------
let liveSuggestTimer = null;
let liveSuggestAbort = null;
let liveSuggestData = [];
let recentMapSearches = JSON.parse(localStorage.getItem("zmRecentMapSearches") || "[]");

function normalizeSearchTerm(q){
  return (q || "").trim().replace(/\s+/g, " ");
}

function initLiveMapSearch(){
  const input = document.getElementById("mapSearchInput");
  const box = document.getElementById("liveMapSuggestions");
  if(!input || !box) return;

  input.addEventListener("input", function(){
    const q = normalizeSearchTerm(input.value);

    clearTimeout(liveSuggestTimer);

    if(q.length < 2){
      renderRecentMapSuggestions();
      return;
    }

    liveSuggestTimer = setTimeout(() => fetchLiveMapSuggestions(q), 350);
  });

  input.addEventListener("focus", function(){
    const q = normalizeSearchTerm(input.value);
    if(q.length < 2) renderRecentMapSuggestions();
    else fetchLiveMapSuggestions(q);
  });

  input.addEventListener("keydown", function(e){
    const items = Array.from(document.querySelectorAll(".live-suggestion-item"));
    if(!items.length) return;

    let active = items.findIndex(x => x.classList.contains("active"));
    if(e.key === "ArrowDown"){
      e.preventDefault();
      active = (active + 1) % items.length;
      items.forEach(x => x.classList.remove("active"));
      items[active].classList.add("active");
    }else if(e.key === "ArrowUp"){
      e.preventDefault();
      active = active <= 0 ? items.length - 1 : active - 1;
      items.forEach(x => x.classList.remove("active"));
      items[active].classList.add("active");
    }else if(e.key === "Enter"){
      const selected = items[active >= 0 ? active : 0];
      if(selected){
        e.preventDefault();
        selected.click();
      }
    }else if(e.key === "Escape"){
      hideLiveMapSuggestions();
    }
  });

  document.addEventListener("click", function(e){
    if(!e.target.closest(".live-search-wrap")){
      hideLiveMapSuggestions();
    }
  });
}

function hideLiveMapSuggestions(){
  const box = document.getElementById("liveMapSuggestions");
  if(box) box.classList.add("hidden");
}

function renderRecentMapSuggestions(){
  const box = document.getElementById("liveMapSuggestions");
  if(!box) return;

  if(!recentMapSearches.length){
    box.innerHTML = `<div class="suggestion-empty">Search place name — live suggestions ਇੱਥੇ ਆਉਣਗੀਆਂ।</div>`;
    box.classList.remove("hidden");
    return;
  }

  box.innerHTML = `
    <div class="suggestion-title">Recent Searches</div>
    ${recentMapSearches.slice(0,5).map((r,idx)=>`
      <button class="live-suggestion-item recent" onclick="selectLiveSuggestionFromRecent(${idx})">
        <span class="suggestion-icon">🕘</span>
        <span><b>${r.short}</b><small>${r.full}</small></span>
      </button>
    `).join("")}
  `;
  box.classList.remove("hidden");
}

async function fetchLiveMapSuggestions(q){
  const box = document.getElementById("liveMapSuggestions");
  if(!box) return;

  if(liveSuggestAbort) liveSuggestAbort.abort();
  liveSuggestAbort = new AbortController();

  box.innerHTML = `<div class="suggestion-loading">Searching “${q}”...</div>`;
  box.classList.remove("hidden");

  try{
    // Add Punjab/India context for better village results if user did not type it.
    const contextualQ = /punjab|india|haryana|rajasthan|delhi/i.test(q) ? q : `${q} Punjab India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&accept-language=en&q=${encodeURIComponent(contextualQ)}`;
    const res = await fetch(url, {
      signal: liveSuggestAbort.signal,
      headers: {"Accept":"application/json"}
    });
    const data = await res.json();
    liveSuggestData = data || [];

    if(!liveSuggestData.length){
      box.innerHTML = `
        <div class="suggestion-empty">
          ਕੋਈ result ਨਹੀਂ ਮਿਲਿਆ। Spelling ਬਦਲ ਕੇ try ਕਰੋ ਜਾਂ district ਨਾਲ ਲਿਖੋ।
          <br><small>Example: “Mohar Singh Wala Mansa Punjab”</small>
        </div>`;
      return;
    }

    box.innerHTML = liveSuggestData.map((r,idx)=>{
      const address = r.address || {};
      const primary = address.village || address.town || address.city || address.hamlet || address.suburb || address.county || r.name || r.display_name.split(",")[0];
      const type = r.type ? r.type.replace(/_/g," ") : "place";
      const detail = r.display_name;
      return `
        <button class="live-suggestion-item" onclick="selectLiveSuggestion(${idx})">
          <span class="suggestion-icon">📍</span>
          <span>
            <b>${primary}</b>
            <small>${detail}</small>
            <em>${type}</em>
          </span>
        </button>
      `;
    }).join("");

  }catch(e){
    if(e.name === "AbortError") return;
    box.innerHTML = `<div class="suggestion-empty">Internet/search service issue. Online site ਤੇ try ਕਰੋ।</div>`;
  }
}

function selectLiveSuggestion(idx){
  const r = liveSuggestData[idx];
  if(!r) return;

  const input = document.getElementById("mapSearchInput");
  const address = r.address || {};
  const primary = address.village || address.town || address.city || address.hamlet || address.suburb || address.county || r.name || r.display_name.split(",")[0];

  if(input) input.value = primary;
  hideLiveMapSuggestions();
  goToLivePlace(r);
  saveRecentMapSearch(primary, r.display_name, r.lat, r.lon);
}

function selectLiveSuggestionFromRecent(idx){
  const r = recentMapSearches[idx];
  if(!r) return;
  const input = document.getElementById("mapSearchInput");
  if(input) input.value = r.short;
  hideLiveMapSuggestions();
  goToLivePlace({lat:r.lat, lon:r.lon, display_name:r.full});
}

function saveRecentMapSearch(short, full, lat, lon){
  recentMapSearches = recentMapSearches.filter(x => x.full !== full);
  recentMapSearches.unshift({short, full, lat, lon, time:Date.now()});
  recentMapSearches = recentMapSearches.slice(0,8);
  localStorage.setItem("zmRecentMapSearches", JSON.stringify(recentMapSearches));
}

function goToLivePlace(r){
  initRealMap();

  const lat = parseFloat(r.lat);
  const lon = parseFloat(r.lon);
  const name = r.display_name || "Selected place";

  if(!zmMap || isNaN(lat) || isNaN(lon)) return;

  zmMap.setView([lat, lon], 16);

  const marker = L.marker([lat, lon]).addTo(zmMap);
  marker.bindPopup(`
    <b>${name.split(",").slice(0,2).join(", ")}</b><br>
    <small>${name}</small><br>
    <button onclick="startAreaFromSearch(${lat},${lon})">ਇੱਥੇ ਤੋਂ Area Start</button>
  `).openPopup();

  const resultBox = document.getElementById("mapSearchResults");
  if(resultBox){
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div class="selected-place-card">
        <b>Selected Place</b>
        <span>${name}</span>
        <small>Lat: ${lat.toFixed(6)}, Lng: ${lon.toFixed(6)}</small>
      </div>
    `;
  }
}

function startAreaFromSearch(lat,lng){
  setMapMode("area");
  clearMapPolygon();
  addMapPoint(L.latLng(lat,lng));
}

// Override normal search button to use first live result if available
async function searchMapPlace(){
  const q = normalizeSearchTerm(document.getElementById("mapSearchInput")?.value);
  if(!q) return alert("Search ਲਈ place/area name ਲਿਖੋ।");

  await fetchLiveMapSuggestions(q);
  if(liveSuggestData && liveSuggestData.length){
    selectLiveSuggestion(0);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  setTimeout(initLiveMapSearch, 400);
});
setTimeout(initLiveMapSearch, 800);



// -------- v31 Selected place shown top + bottom --------
// Keeps selected place visible above map and below map.

function renderSelectedPlaceCards(name, lat, lon){
  const shortName = (name || "").split(",").slice(0,2).join(", ");
  const cardHTML = `
    <div class="selected-place-card selected-place-highlight">
      <div>
        <b>📍 Selected Place</b>
        <span>${name}</span>
        <small>Lat: ${Number(lat).toFixed(6)}, Lng: ${Number(lon).toFixed(6)}</small>
      </div>
      <button onclick="startAreaFromSearch(${lat},${lon})">ਇੱਥੇ ਤੋਂ Area Start</button>
    </div>
  `;

  const top = document.getElementById("selectedPlaceTop");
  if(top){
    top.innerHTML = cardHTML;
    top.classList.remove("hidden");
  }

  const bottom = document.getElementById("mapSearchResults");
  if(bottom){
    bottom.classList.remove("hidden");
    bottom.innerHTML = cardHTML;
  }
}

// Override place selection display from v30
function goToLivePlace(r){
  initRealMap();

  const lat = parseFloat(r.lat);
  const lon = parseFloat(r.lon);
  const name = r.display_name || "Selected place";

  if(!zmMap || isNaN(lat) || isNaN(lon)) return;

  zmMap.setView([lat, lon], 16);

  L.marker([lat, lon]).addTo(zmMap).bindPopup(`
    <b>${name.split(",").slice(0,2).join(", ")}</b><br>
    <small>${name}</small><br>
    <button onclick="startAreaFromSearch(${lat},${lon})">ਇੱਥੇ ਤੋਂ Area Start</button>
  `).openPopup();

  renderSelectedPlaceCards(name, lat, lon);
}



// -------- v32 custom password modal + eye toggle --------
function togglePasswordEye(inputId, btn){
  const input = document.getElementById(inputId);
  if(!input) return;
  if(input.type === "password"){
    input.type = "text";
    if(btn) btn.textContent = "🙈";
  }else{
    input.type = "password";
    if(btn) btn.textContent = "👁";
  }
}

function closeOwnerModeLogin(){
  document.getElementById("ownerModeLoginModal")?.classList.add("hidden");
  const input = document.getElementById("ownerModePasswordInput");
  if(input) input.value = "";
}

// Override ownerModeLogin to avoid browser prompt showing password clearly
async function ownerModeLogin(){
  if(typeof isOwnerMode === "function" && isOwnerMode()){
    if(confirm("Owner mode logout ਕਰਨਾ ਹੈ?")){
      localStorage.removeItem("zmOwnerMode");
      localStorage.removeItem("zmAdminLoggedIn");
      if(typeof applyOwnerClientUI === "function") applyOwnerClientUI();
      if(typeof showModule === "function") showModule("dashboard");
    }
    return;
  }

  const modal = document.getElementById("ownerModeLoginModal");
  if(modal){
    modal.classList.remove("hidden");
    setTimeout(()=>document.getElementById("ownerModePasswordInput")?.focus(), 100);
  }
}

async function submitOwnerModeLogin(){
  const input = document.getElementById("ownerModePasswordInput");
  const pass = input?.value || "";
  if(!pass) return alert("Owner password ਭਰੋ।");

  let ok = false;
  try{
    if(typeof zmVerifyAdminPassword === "function") ok = await zmVerifyAdminPassword(pass);
    else ok = pass === "owner123";
  }catch(e){
    ok = pass === "owner123";
  }

  if(!ok) return alert("Wrong owner password");

  localStorage.setItem("zmOwnerMode", "yes");
  localStorage.setItem("zmAdminLoggedIn", "yes");
  closeOwnerModeLogin();
  if(typeof applyOwnerClientUI === "function") applyOwnerClientUI();
  alert("Owner mode active ਹੋ ਗਿਆ ਹੈ।");
}



// -------- v33 Map Layers: Street / Satellite / Hybrid / Topo --------
let zmCurrentBaseLayer = null;
let zmLabelLayer = null;
let zmLayerMode = "street";

function getMapLayerDefs(){
  return {
    street: {
      name: "Street",
      tile: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: { maxZoom: 22, attribution: "© OpenStreetMap" }
    },
    satellite: {
      name: "Satellite",
      tile: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: { maxZoom: 20, attribution: "Tiles © Esri" }
    },
    hybrid: {
      name: "Hybrid",
      tile: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: { maxZoom: 20, attribution: "Tiles © Esri" }
    },
    topo: {
      name: "Topo",
      tile: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      options: { maxZoom: 17, attribution: "© OpenTopoMap" }
    }
  };
}

function setMapLayer(mode){
  zmLayerMode = mode;
  initRealMap();

  const defs = getMapLayerDefs();
  const def = defs[mode] || defs.street;

  if(zmCurrentBaseLayer && zmMap){
    zmMap.removeLayer(zmCurrentBaseLayer);
  }
  if(zmLabelLayer && zmMap){
    zmMap.removeLayer(zmLabelLayer);
    zmLabelLayer = null;
  }

  zmCurrentBaseLayer = L.tileLayer(def.tile, def.options).addTo(zmMap);

  // Hybrid = Satellite + labels/roads overlay
  if(mode === "hybrid"){
    zmLabelLayer = L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 20,
      attribution: "Labels © Esri"
    }).addTo(zmMap);
  }

  ["street","satellite","hybrid","topo"].forEach(x => {
    const btn = document.getElementById(x === "street" ? "streetLayerBtn" : x === "satellite" ? "satLayerBtn" : x === "hybrid" ? "hybridLayerBtn" : "topoLayerBtn");
    if(btn) btn.classList.toggle("primary", x === mode);
  });

  setTimeout(() => zmMap.invalidateSize(), 200);
}

// Override initRealMap so first load uses selected layer system
function initRealMap(){
  const mapBox = document.getElementById("realMap");
  if(!mapBox) return;

  if(typeof L === "undefined"){
    mapBox.innerHTML = `<div class="map-loading-note">Map library load ਨਹੀਂ ਹੋਈ। Internet connection check ਕਰੋ ਜਾਂ online site ਤੇ open ਕਰੋ।</div>`;
    return;
  }

  if(zmMap){
    setTimeout(() => zmMap.invalidateSize(), 200);
    return;
  }

  mapBox.innerHTML = "";
  zmMap = L.map("realMap", {
    zoomControl: true
  }).setView([30.7333, 76.7794], 13);

  setMapLayer(zmLayerMode || "street");

  // Helpful scale like Google Maps bottom scale
  if(!document.querySelector(".leaflet-control-scale")){
    L.control.scale({imperial:true, metric:true}).addTo(zmMap);
  }

  zmMap.on("click", function(e){
    addMapPoint(e.latlng);
  });

  setTimeout(() => zmMap.invalidateSize(), 400);
}



// v37 module drawer
function toggleModuleDrawer(){
  const drawer = document.getElementById("moduleDrawer");
  if(drawer) drawer.classList.toggle("hidden");
}
document.addEventListener("click", function(e){
  const drawer = document.getElementById("moduleDrawer");
  const btn = document.getElementById("moduleMenuBtn");
  if(!drawer || drawer.classList.contains("hidden")) return;
  if(e.target === btn || btn?.contains(e.target) || drawer.contains(e.target)) return;
  drawer.classList.add("hidden");
});


// =========================================================
// Zameen Minti Project v63 - Multilingual Voice Assistant
// =========================================================
let zmVoiceRecognition = null;
let zmVoiceListening = false;
let zmLastParsedVoice = null;

function openVoiceAssistant(){
  document.getElementById("voiceAssistantModal")?.classList.remove("hidden");
}
function closeVoiceAssistant(){
  stopVoiceAssistant();
  document.getElementById("voiceAssistantModal")?.classList.add("hidden");
}
function clearVoiceText(){
  const t = document.getElementById("voiceTextOutput");
  const p = document.getElementById("voiceParsedPreview");
  if(t) t.value = "";
  if(p){ p.innerHTML = ""; p.classList.add("hidden"); }
  zmLastParsedVoice = null;
}
function getSpeechRecognition(){
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}
function startVoiceAssistant(){
  const SR = getSpeechRecognition();
  if(!SR){
    alert("ਤੁਹਾਡੇ browser ਵਿੱਚ Speech Recognition support ਨਹੀਂ। Chrome/Edge ਵਰਤ ਕੇ try ਕਰੋ।");
    return;
  }
  stopVoiceAssistant();
  const lang = document.getElementById("voiceLangSelect")?.value || "pa-IN";
  const output = document.getElementById("voiceTextOutput");
  const btn = document.getElementById("voiceStartBtn");
  zmVoiceRecognition = new SR();
  zmVoiceRecognition.lang = lang;
  zmVoiceRecognition.interimResults = true;
  zmVoiceRecognition.continuous = false;
  zmVoiceRecognition.onstart = () => { zmVoiceListening = true; if(btn) btn.innerText = "🎙️ Listening..."; };
  zmVoiceRecognition.onresult = (event) => {
    let txt = "";
    for(let i=event.resultIndex; i<event.results.length; i++){ txt += event.results[i][0].transcript; }
    if(output){ output.value = txt.trim(); previewVoiceCommand(); }
  };
  zmVoiceRecognition.onerror = (e) => alert("Voice error: " + e.error + ". Language ਬਦਲ ਕੇ try ਕਰੋ।");
  zmVoiceRecognition.onend = () => { zmVoiceListening = false; if(btn) btn.innerText = "🎙️ Start Listening"; previewVoiceCommand(); };
  zmVoiceRecognition.start();
}
function stopVoiceAssistant(){
  if(zmVoiceRecognition && zmVoiceListening){ try{ zmVoiceRecognition.stop(); }catch(e){} }
  zmVoiceListening = false;
  const btn = document.getElementById("voiceStartBtn");
  if(btn) btn.innerText = "🎙️ Start Listening";
}
function digitsToEnglish(s){
  const map = {"੦":"0","੧":"1","੨":"2","੩":"3","੪":"4","੫":"5","੬":"6","੭":"7","੮":"8","੯":"9","०":"0","१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9"};
  return (s || "").replace(/[੦-੯०-९]/g, d => map[d] || d);
}
function normVoice(s){
  return digitsToEnglish(s || "").toLowerCase().replace(/[₹,]/g," ").replace(/ਕਨਾਲਾਂ/g,"ਕਨਾਲ").replace(/ਕਿੱਲੇ|ਕਿਲੇ|ਕਿਲਾ/g,"ਕਿੱਲਾ").replace(/kanals/g,"kanal").replace(/marles/g,"marla").replace(/acres/g,"acre").replace(/\s+/g," ").trim();
}
function numBefore(t, words){
  const re = new RegExp("(\\d+(?:\\.\\d+)?)\\s*(?:" + words.join("|") + ")", "i");
  const m = t.match(re);
  return m ? parseFloat(m[1]) : 0;
}
function largestNum(t){
  const nums = [...t.matchAll(/\d+(?:\.\d+)?/g)].map(x=>parseFloat(x[0]));
  return nums.length ? Math.max(...nums) : 0;
}
function parseVoiceCommand(text){
  const t = normVoice(text);
  const forced = document.getElementById("voiceCommandType")?.value || "auto";
  const hasTheka = /ਠੇਕਾ|theka|lease|rent/.test(t);
  const hasSale = /sale|sell|ਖਰੀਦ|ਵੇਚ|registry|ਰੇਟ/.test(t);
  const hasMeasurement = /ਮਿਣਤੀ|measurement|area|sq|square|ਲੰਬਾਈ|ਚੌੜਾਈ|by|x/.test(t);
  const type = forced !== "auto" ? forced : (hasTheka ? "theka" : hasSale ? "sale" : hasMeasurement ? "measurement" : "theka");
  const acre = numBefore(t, ["ਏਕੜ","ਕਿੱਲਾ","acre","killa"]);
  const kanal = numBefore(t, ["ਕਨਾਲ","kanal"]);
  const marla = numBefore(t, ["ਮਰਲਾ","ਮਰਲੇ","marla"]);
  let rate = 0;
  let r = t.match(/(?:ਠੇਕਾ|theka|lease|rate|ਰੇਟ|ਨਾਲ)\s*(?:ਦਾ|de|of|with|ਨਾਲ)?\s*(\d+(?:\.\d+)?)/i) || t.match(/(\d+(?:\.\d+)?)\s*(?:ਦਾ|de|rate|ਰੇਟ|theka|ਠੇਕਾ|ਨਾਲ)/i);
  rate = r ? parseFloat(r[1]) : largestNum(t);
  let length = 0, width = 0;
  let m = t.match(/(\d+(?:\.\d+)?)\s*(?:by|x|×|\*)\s*(\d+(?:\.\d+)?)/i);
  if(m){ length = parseFloat(m[1]); width = parseFloat(m[2]); }
  if(!length) length = numBefore(t, ["ਲੰਬਾਈ","length","lambai"]);
  if(!width) width = numBefore(t, ["ਚੌੜਾਈ","width","chaurai"]);
  return {raw:text, type, acre, kanal, marla, rate, length, width};
}
function previewVoiceCommand(){
  const text = document.getElementById("voiceTextOutput")?.value || "";
  const box = document.getElementById("voiceParsedPreview");
  if(!text.trim() || !box) return;
  const p = parseVoiceCommand(text);
  zmLastParsedVoice = p;
  box.innerHTML = `<h3>Voice Parsed Preview</h3><div class="voice-preview-grid">
    <div><span>Type</span><b>${p.type}</b></div><div><span>Rate</span><b>${p.rate || 0}</b></div>
    <div><span>ਏਕੜ/ਕਿੱਲਾ</span><b>${p.acre || 0}</b></div><div><span>ਕਨਾਲ</span><b>${p.kanal || 0}</b></div>
    <div><span>ਮਰਲੇ</span><b>${p.marla || 0}</b></div><div><span>Length</span><b>${p.length || 0}</b></div>
    <div><span>Width</span><b>${p.width || 0}</b></div></div><p class="voice-note">ਜੇ values ਸਹੀ ਹਨ ਤਾਂ Apply ਦਬਾਓ।</p>`;
  box.classList.remove("hidden");
}
function setInputValue(ids, value){
  if(!value) return false;
  for(const id of ids){
    const el = document.getElementById(id);
    if(el){ el.value = value; el.dispatchEvent(new Event("input",{bubbles:true})); return true; }
  }
  return false;
}
function applyVoiceCommand(){
  const text = document.getElementById("voiceTextOutput")?.value || "";
  const p = zmLastParsedVoice || parseVoiceCommand(text);
  if(!text.trim()) return alert("ਪਹਿਲਾਂ voice command ਬੋਲੋ ਜਾਂ text ਲਿਖੋ।");
  if(p.type === "theka"){
    if(typeof showModule === "function") showModule("theka");
    setTimeout(()=>{ setInputValue(["sepAcreRate","thekaAcreRate","acreRate"], p.rate); setInputValue(["sepAcres","thekaAcres","acres"], p.acre); setInputValue(["sepKanal","thekaKanal","kanal"], p.kanal); setInputValue(["sepMarla","thekaMarla","marla"], p.marla); if(typeof calculateSeparateTheka === "function") calculateSeparateTheka(); closeVoiceAssistant(); }, 350);
  } else if(p.type === "measurement"){
    if(typeof showModule === "function") showModule("measurement");
    setTimeout(()=>{ if(typeof setShape === "function") setShape("rectangle"); setInputValue(["length","plotLength"], p.length); setInputValue(["width","plotWidth"], p.width); const form=document.getElementById("calcForm"); if(form) form.dispatchEvent(new Event("submit",{cancelable:true,bubbles:true})); closeVoiceAssistant(); }, 350);
  } else if(p.type === "sale"){
    if(typeof showModule === "function") showModule("sale");
    setTimeout(()=>{ setInputValue(["saleAcreRate"], p.rate); setInputValue(["saleAcres"], p.acre); setInputValue(["saleKanal"], p.kanal); setInputValue(["saleMarla"], p.marla); if(typeof calculateSale === "function") calculateSale(); closeVoiceAssistant(); }, 350);
  }
}
document.addEventListener("DOMContentLoaded", function(){
  const txt = document.getElementById("voiceTextOutput");
  if(txt) txt.addEventListener("input", previewVoiceCommand);
});


// ======================================================
// Zameen Minti Project v63 - Clean Voice Auto Detect
// Based on v39 stable buttons. No Chat/Admin binding changes.
// ======================================================
let zmVoiceAutoTimerV47 = null;
let zmVoiceFinalTextV47 = "";

function zmVoiceStatusV47(text, mode){
  const el = document.getElementById("voiceAutoStatusV47");
  if(!el) return;
  el.innerHTML = text;
  el.className = "voice-auto-status-v47 " + (mode || "");
  el.classList.remove("hidden");
}

function zmVoiceLangV47(){
  const selected = document.getElementById("voiceLangSelect")?.value || "pa-IN";
  if(selected !== "auto") return selected;
  const nav = navigator.language || "en-IN";
  if(nav.toLowerCase().startsWith("pa")) return "pa-IN";
  if(nav.toLowerCase().startsWith("hi")) return "hi-IN";
  return "en-IN";
}

function zmScheduleVoiceAutoApplyV47(){
  clearTimeout(zmVoiceAutoTimerV47);
  if(!document.getElementById("voiceAutoApplyV47")?.checked) return;
  const delay = parseInt(document.getElementById("voiceSilenceDelayV47")?.value || "1800", 10);
  zmVoiceStatusV47("⏳ ਚੁੱਪ ਹੋਣ ਦੀ waiting... " + (delay/1000).toFixed(1) + " sec ਬਾਅਦ result/apply ਹੋਵੇਗਾ।", "waiting");
  zmVoiceAutoTimerV47 = setTimeout(() => {
    const text = document.getElementById("voiceTextOutput")?.value || "";
    if(text.trim()){
      if(typeof previewVoiceCommand === "function") previewVoiceCommand();
      zmVoiceStatusV47("✅ Command complete — result/apply ਕਰ ਰਿਹਾ ਹੈ।", "ok");
      if(typeof applyVoiceCommand === "function") applyVoiceCommand();
    }
  }, delay);
}

// Override only start/stop voice; old modal open/close remains from v39.
const zmOldStartVoiceAssistantV47 = window.startVoiceAssistant;
window.startVoiceAssistant = function(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const httpsOk = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if(!SR){
    alert("Voice ਇਸ browser ਵਿੱਚ supported ਨਹੀਂ। Chrome/Edge ਜਾਂ Android Chrome ਤੇ try ਕਰੋ। Text manually ਲਿਖ ਕੇ Apply ਕਰ ਸਕਦੇ ਹੋ।");
    return;
  }
  if(!httpsOk){
    alert("Voice ਲਈ HTTPS live site ਚਾਹੀਦੀ ਹੈ। Netlify live URL ਤੇ open ਕਰੋ, local file ਤੋਂ ਨਹੀਂ।");
    return;
  }

  try{ if(window.zmVoiceRecognition && window.zmVoiceListening) window.zmVoiceRecognition.stop(); }catch(e){}
  clearTimeout(zmVoiceAutoTimerV47);
  zmVoiceFinalTextV47 = "";

  const lang = zmVoiceLangV47();
  const output = document.getElementById("voiceTextOutput");
  const btn = document.getElementById("voiceStartBtn");

  window.zmVoiceRecognition = new SR();
  window.zmVoiceRecognition.lang = lang;
  window.zmVoiceRecognition.interimResults = true;
  window.zmVoiceRecognition.continuous = false;
  window.zmVoiceRecognition.maxAlternatives = 3;

  zmVoiceStatusV47("🎙️ Listening... Language: " + lang + ". Command ਬੋਲੋ।", "listening");

  window.zmVoiceRecognition.onstart = () => {
    window.zmVoiceListening = true;
    if(btn) btn.innerText = "🎙️ Listening...";
  };

  window.zmVoiceRecognition.onresult = (event) => {
    let interim = "";
    let finalText = "";
    for(let i = event.resultIndex; i < event.results.length; i++){
      const transcript = event.results[i][0].transcript;
      if(event.results[i].isFinal) finalText += transcript;
      else interim += transcript;
    }

    if(finalText.trim()) zmVoiceFinalTextV47 = (zmVoiceFinalTextV47 + " " + finalText).trim();
    const combined = (zmVoiceFinalTextV47 + " " + interim).trim();

    if(output){
      output.value = combined;
      if(typeof previewVoiceCommand === "function") previewVoiceCommand();
    }

    clearTimeout(zmVoiceAutoTimerV47);
    if(finalText.trim()){
      zmScheduleVoiceAutoApplyV47();
    }else{
      zmVoiceStatusV47("🎙️ ਸੁਣ ਰਿਹਾ ਹੈ... ਬੋਲਣਾ ਖਤਮ ਕਰੋ।", "listening");
    }
  };

  window.zmVoiceRecognition.onerror = (e) => {
    zmVoiceStatusV47("⚠️ Voice error: " + e.error + ". ਦੁਬਾਰਾ Listen click ਕਰੋ।", "warn");
  };

  window.zmVoiceRecognition.onend = () => {
    window.zmVoiceListening = false;
    if(btn) btn.innerText = "🎙️ Start Listening";
    const text = output?.value || "";
    if(text.trim()) zmScheduleVoiceAutoApplyV47();
    else zmVoiceStatusV47("Ready. New command ਲਈ Listen ਦੁਬਾਰਾ click ਕਰੋ।", "ok");
  };

  window.zmVoiceRecognition.start();
};

window.stopVoiceAssistant = function(){
  clearTimeout(zmVoiceAutoTimerV47);
  try{ if(window.zmVoiceRecognition) window.zmVoiceRecognition.stop(); }catch(e){}
  window.zmVoiceListening = false;
  const btn = document.getElementById("voiceStartBtn");
  if(btn) btn.innerText = "🎙️ Start Listening";
  zmVoiceStatusV47("⏹ Stopped. New command ਲਈ Listen ਦੁਬਾਰਾ click ਕਰੋ।", "ok");
};

const zmOldApplyVoiceCommandV47 = window.applyVoiceCommand;
window.applyVoiceCommand = function(){
  clearTimeout(zmVoiceAutoTimerV47);
  const res = typeof zmOldApplyVoiceCommandV47 === "function" ? zmOldApplyVoiceCommandV47() : undefined;
  zmVoiceFinalTextV47 = "";
  setTimeout(() => zmVoiceStatusV47("✅ Command applied. New command ਲਈ Listen ਦੁਬਾਰਾ click ਕਰੋ।", "ok"), 500);
  return res;
};


// ======================================================
// Zameen Minti Project v63 - Vishwe Sq Ft Added
// 
// ======================================================
const ZM_VISHWE_SQFT_V48 = (window.ZM_VISHWE_SQFT || 453.75);

function convertSqftWithVishweV48(sqft){
  const area = Number(sqft) || 0;
  return {
    sqft: area,
    marla: area / 272.25,
    kanal: area / 5445,
    acre: area / 43560,
    vishwe: area / ZM_VISHWE_SQFT_V48,
    bigha: (area / ZM_VISHWE_SQFT_V48) / 20
  };
}

window.zmConvertSqft = convertSqftWithVishweV48;
window.ZM_VISHWE_SQFT = ZM_VISHWE_SQFT_V48;

document.addEventListener("DOMContentLoaded", function(){
  // Add reference line dynamically if not already visible
  if(document.body && !document.body.innerText.includes("")){
    const sections = Array.from(document.querySelectorAll(".reference-card, aside, .sidebar-card, .unit-reference, body"));
    for(const el of sections){
      const txt = el.innerText || "";
      if(txt.includes("Sq Ft") || txt.includes("ਮੁੱਖ ਮਾਪ") || txt.includes("ਬਿੱਘਾ")){
        const ul = el.querySelector("ul");
        if(ul){
          const li = document.createElement("li");
          li.textContent = "";
          ul.appendChild(li);
          break;
        }
      }
    }
  }
});


// =============================
// Zameen Minti Project v63
// Vishwe Support Added
// =============================
const VISHWE_SQFT_V49 = (window.ZM_VISHWE_SQFT || 453.75);

function zmUpdateVishweValue(areaSqft){
    try{
        const vishwe = Number(areaSqft || 0) / VISHWE_SQFT_V49;
        const el = document.getElementById("vishweResult");
        if(el){
            el.innerText = vishwe.toFixed(3);
        }
    }catch(e){}
}

// Auto watch result updates
setInterval(()=>{
    try{
        let sqft = 0;
        const sqftEl = document.querySelector("#sqftResult, .sqftResult, [data-sqft]");
        if(sqftEl){
            sqft = parseFloat((sqftEl.innerText || sqftEl.value || "0").replace(/,/g,'')) || 0;
        }
        zmUpdateVishweValue(sqft);
    }catch(err){}
}, 700);



// v54 Vishwe safety check
document.addEventListener("DOMContentLoaded", function(){
  setTimeout(function(){
    const list = document.getElementById("referenceList");
    if(list && !list.innerText.includes("1 ਵਿਸ਼ਵੇ = 453.75 sq ft")){
      const gaj = Array.from(list.querySelectorAll(".ref-section")).find(x => (x.innerText || "").includes("Gaj") || (x.innerText || "").includes("ਗਜ"));
      const div = document.createElement("div");
      div.className = "ref-section vishwe-ref-section";
      div.innerHTML = "<h4>ਵਿਸ਼ਵੇ / Vishwe</h4><ul><li>1 ਵਿਸ਼ਵੇ = 453.75 sq ft</li></ul>";
      if(gaj) gaj.insertAdjacentElement("afterend", div); else list.prepend(div);
    }
  }, 400);
});


// v55 Vishwe also in top Sq Ft main reference box
document.addEventListener("DOMContentLoaded", function(){
  setTimeout(function(){
    const list = document.getElementById("referenceList");
    if(!list) return;
    const first = list.querySelector(".ref-section");
    if(first && !first.innerText.includes("1 ਵਿਸ਼ਵੇ = 453.75 sq ft")){
      const ul = first.querySelector("ul");
      if(ul){
        const li = document.createElement("li");
        li.innerHTML = "<b>1 ਵਿਸ਼ਵੇ = 453.75 sq ft</b>";
        ul.appendChild(li);
      }
    }
  }, 500);
});


// ======================================================
// Zameen Minti Project v63 - Stable Owner Vishwe Setting
// No heavy observer. Owner Settings button remains visible.
// ======================================================
(function(){
  const DEFAULT_VISHWE = (window.ZM_VISHWE_SQFT || 453.75);

  function getVishweValue(){
    try{
      const s = JSON.parse(localStorage.getItem("zmSettings") || "{}");
      const v = parseFloat(s.vishweSqft || localStorage.getItem("zmVishweSqft") || DEFAULT_VISHWE);
      return isFinite(v) && v > 0 ? v : DEFAULT_VISHWE;
    }catch(e){
      const v = parseFloat(localStorage.getItem("zmVishweSqft") || DEFAULT_VISHWE);
      return isFinite(v) && v > 0 ? v : DEFAULT_VISHWE;
    }
  }

  function saveVishweValue(v){
    const val = parseFloat(v);
    const finalVal = isFinite(val) && val > 0 ? val : DEFAULT_VISHWE;
    localStorage.setItem("zmVishweSqft", String(finalVal));
    try{
      const s = JSON.parse(localStorage.getItem("zmSettings") || "{}");
      s.vishweSqft = finalVal;
      localStorage.setItem("zmSettings", JSON.stringify(s));
    }catch(e){}
    window.ZM_VISHWE_SQFT = finalVal;
    return finalVal;
  }

  window.getVishweSqft = getVishweValue;
  window.setVishweSqft = saveVishweValue;
  window.ZM_VISHWE_SQFT = getVishweValue();

  function ensureOwnerSettingsButton(){
    if(Array.from(document.querySelectorAll("button")).some(b => (b.innerText || "").includes("Owner Settings"))) return;
    const lang = document.querySelector("#langSelect, select");
    const btn = document.createElement("button");
    btn.className = "btn owner-settings-top-btn";
    btn.textContent = "Owner Settings";
    btn.onclick = function(){ 
      if(typeof openOwnerSettings === "function") openOwnerSettings(); 
    };
    if(lang && lang.parentElement) lang.parentElement.appendChild(btn);
  }

  function findOwnerModal(){
    return Array.from(document.querySelectorAll(".modal-content, .modal, div"))
      .find(el => {
        const t = el.innerText || "";
        return t.includes("Owner Settings") && t.includes("1 Karam Feet");
      });
  }

  function addFieldToOwnerModal(){
    const modal = findOwnerModal();
    if(!modal) return;
    if(modal.querySelector("#settingVishweSqft")){
      modal.querySelector("#settingVishweSqft").value = getVishweValue();
      return;
    }

    const field = document.createElement("div");
    field.className = "form-field v60-vishwe-setting-field";
    field.innerHTML = '<label>1 ਵਿਸ਼ਵੇ Sq Ft</label><input id="settingVishweSqft" type="number" step="0.01" value="'+getVishweValue()+'">';

    const karam = modal.querySelector("#settingKaramFeet");
    if(karam){
      (karam.closest(".form-field") || karam.parentElement).insertAdjacentElement("afterend", field);
    }else{
      const ownerWhatsapp = Array.from(modal.querySelectorAll("label")).find(l => (l.innerText || "").includes("Owner WhatsApp"));
      if(ownerWhatsapp){
        (ownerWhatsapp.closest(".form-field") || ownerWhatsapp.parentElement).insertAdjacentElement("beforebegin", field);
      }else{
        const save = Array.from(modal.querySelectorAll("button")).find(b => (b.innerText || "").includes("Save"));
        if(save) save.insertAdjacentElement("beforebegin", field);
      }
    }

    const input = field.querySelector("#settingVishweSqft");
    input.addEventListener("input", function(){
      saveVishweValue(this.value);
      updateVishweReferenceLine();
    });
  }

  function updateVishweReferenceLine(){
    const val = getVishweValue();
    const ref = document.getElementById("referenceList");
    if(!ref) return;

    // top main line
    const first = ref.querySelector(".ref-section");
    if(first){
      let li = Array.from(first.querySelectorAll("li")).find(x => (x.innerText || "").includes("ਵਿਸ਼ਵੇ"));
      if(li) li.innerHTML = "<b>1 ਵਿਸ਼ਵੇ = "+val+" sq ft</b>";
    }

    // separate Vishwe box
    const vbox = ref.querySelector(".vishwe-ref-section");
    if(vbox){
      const title = vbox.querySelector("h4");
      if(title) title.textContent = (typeof currentLang !== "undefined" && currentLang !== "pa") ? "Vishwe" : "ਵਿਸ਼ਵੇ";
      const li = vbox.querySelector("li");
      if(li) li.textContent = "1 ਵਿਸ਼ਵੇ = "+val+" sq ft";
    }
  }

  // Hook existing open/save/reset once, without repeated observers
  const oldOpen = window.openOwnerSettings;
  if(typeof oldOpen === "function"){
    window.openOwnerSettings = function(){
      const res = oldOpen.apply(this, arguments);
      setTimeout(function(){
        addFieldToOwnerModal();
        const input = document.getElementById("settingVishweSqft");
        if(input) input.value = getVishweValue();
      }, 100);
      return res;
    };
  }

  const oldSave = window.saveSettings;
  if(typeof oldSave === "function"){
    window.saveSettings = function(){
      const input = document.getElementById("settingVishweSqft");
      if(input) saveVishweValue(input.value);
      const res = oldSave.apply(this, arguments);
      setTimeout(updateVishweReferenceLine, 100);
      return res;
    };
  }

  const oldReset = window.resetSettings;
  if(typeof oldReset === "function"){
    window.resetSettings = function(){
      const res = oldReset.apply(this, arguments);
      saveVishweValue(DEFAULT_VISHWE);
      setTimeout(function(){
        const input = document.getElementById("settingVishweSqft");
        if(input) input.value = DEFAULT_VISHWE;
        updateVishweReferenceLine();
      }, 100);
      return res;
    };
  }

  document.addEventListener("DOMContentLoaded", function(){
    ensureOwnerSettingsButton();
    updateVishweReferenceLine();
    setTimeout(ensureOwnerSettingsButton, 400);
    setTimeout(updateVishweReferenceLine, 600);
  });
})();


// ======================================================
// Zameen Minti Project v63 - Owner Settings 1 Vishwe Sq Ft Field
// Reliable visible field inside Owner Settings modal.
// ======================================================
(function(){
  const DEFAULT_VISHWE_SQFT = (window.ZM_VISHWE_SQFT || 453.75);

  function readVishweSqft(){
    try{
      const settings = JSON.parse(localStorage.getItem("zmSettings") || "{}");
      const v = parseFloat(settings.vishweSqft || localStorage.getItem("zmVishweSqft") || DEFAULT_VISHWE_SQFT);
      return isFinite(v) && v > 0 ? v : DEFAULT_VISHWE_SQFT;
    }catch(e){
      const v = parseFloat(localStorage.getItem("zmVishweSqft") || DEFAULT_VISHWE_SQFT);
      return isFinite(v) && v > 0 ? v : DEFAULT_VISHWE_SQFT;
    }
  }

  function saveVishweSqft(v){
    const val = parseFloat(v);
    const finalVal = isFinite(val) && val > 0 ? val : DEFAULT_VISHWE_SQFT;
    localStorage.setItem("zmVishweSqft", String(finalVal));
    try{
      const settings = JSON.parse(localStorage.getItem("zmSettings") || "{}");
      settings.vishweSqft = finalVal;
      localStorage.setItem("zmSettings", JSON.stringify(settings));
    }catch(e){}
    window.ZM_VISHWE_SQFT = finalVal;
    return finalVal;
  }

  window.getVishweSqft = readVishweSqft;
  window.setVishweSqft = saveVishweSqft;
  window.ZM_VISHWE_SQFT = readVishweSqft();

  function ownerModalContainer(){
    return Array.from(document.querySelectorAll(".modal-content, .modal, body > div"))
      .find(el => {
        const t = el.innerText || "";
        return t.includes("Owner Settings") && t.includes("1 Karam Feet") && t.includes("Save Settings");
      });
  }

  function insertVishweField(){
    const modal = ownerModalContainer();
    if(!modal) return false;

    let existing = modal.querySelector("#settingVishweSqft");
    if(existing){
      existing.value = readVishweSqft();
      return true;
    }

    const karamInput = modal.querySelector("#settingKaramFeet");
    const field = document.createElement("div");
    field.className = "form-field v61-vishwe-owner-field";
    field.innerHTML = `
      <label>1 Vishwe Sq Ft</label>
      <input id="settingVishweSqft" type="number" step="0.01" min="0" value="${readVishweSqft()}">
    `;

    if(karamInput){
      const karamField = karamInput.closest(".form-field") || karamInput.parentElement;
      karamField.insertAdjacentElement("afterend", field);
    }else{
      const whatsappLabel = Array.from(modal.querySelectorAll("label"))
        .find(l => (l.innerText || "").includes("Owner WhatsApp"));
      if(whatsappLabel){
        (whatsappLabel.closest(".form-field") || whatsappLabel.parentElement).insertAdjacentElement("beforebegin", field);
      }else{
        modal.appendChild(field);
      }
    }

    const input = field.querySelector("#settingVishweSqft");
    input.addEventListener("input", function(){
      saveVishweSqft(this.value);
      updateVishweReferencesV61();
    });

    return true;
  }

  function updateVishweReferencesV61(){
    const val = readVishweSqft();
    const ref = document.getElementById("referenceList");
    if(!ref) return;

    // top Sq Ft box line
    const top = ref.querySelector(".ref-section");
    if(top){
      let line = Array.from(top.querySelectorAll("li")).find(li => (li.innerText || "").includes("ਵਿਸ਼ਵੇ"));
      if(line) line.innerHTML = "<b>1 ਵਿਸ਼ਵੇ = " + val + " sq ft</b>";
    }

    // separate Vishwe box
    const vbox = ref.querySelector(".vishwe-ref-section");
    if(vbox){
      const li = vbox.querySelector("li");
      if(li) li.textContent = "1 ਵਿਸ਼ਵੇ = " + val + " sq ft";
    }
  }

  function hookSaveReset(){
    const modal = ownerModalContainer();
    if(!modal) return;
    modal.querySelectorAll("button").forEach(btn => {
      const t = btn.innerText || "";
      if(t.includes("Save Settings") && !btn.dataset.v61VishweSave){
        btn.dataset.v61VishweSave = "1";
        btn.addEventListener("click", function(){
          const input = modal.querySelector("#settingVishweSqft");
          if(input) saveVishweSqft(input.value);
          setTimeout(updateVishweReferencesV61, 100);
        }, true);
      }
      if(t.includes("Reset Default") && !btn.dataset.v61VishweReset){
        btn.dataset.v61VishweReset = "1";
        btn.addEventListener("click", function(){
          saveVishweSqft(DEFAULT_VISHWE_SQFT);
          setTimeout(function(){
            const input = modal.querySelector("#settingVishweSqft");
            if(input) input.value = DEFAULT_VISHWE_SQFT;
            updateVishweReferencesV61();
          }, 100);
        }, true);
      }
    });
  }

  // Keep original owner settings, but after it opens, insert field.
  const oldOpenOwnerSettings = window.openOwnerSettings;
  if(typeof oldOpenOwnerSettings === "function"){
    window.openOwnerSettings = function(){
      const result = oldOpenOwnerSettings.apply(this, arguments);
      setTimeout(function(){
        insertVishweField();
        hookSaveReset();
      }, 80);
      setTimeout(function(){
        insertVishweField();
        hookSaveReset();
      }, 250);
      return result;
    };
  }

  document.addEventListener("DOMContentLoaded", function(){
    updateVishweReferencesV61();
    document.addEventListener("click", function(){
      setTimeout(function(){
        insertVishweField();
        hookSaveReset();
      }, 120);
    }, true);
  });
})();


// ======================================================
// Zameen Minti Project v63 - Vishwe Owner Field Layout Fix
// Keep field same size as other Owner Settings fields.
// ======================================================
(function(){
  function fixVishweFieldLayoutV62(){
    const input = document.getElementById("settingVishweSqft");
    if(!input) return;

    const field = input.closest(".form-field") || input.parentElement;
    if(!field) return;

    field.classList.add("v62-vishwe-owner-field");
    field.style.gridColumn = "auto";
    field.style.width = "100%";

    const label = field.querySelector("label");
    if(label) label.textContent = "1 Vishwe Sq Ft";

    const modal = field.closest(".modal-content, .modal") || document.body;
    const karam = modal.querySelector("#settingKaramFeet");
    if(karam){
      const karamField = karam.closest(".form-field") || karam.parentElement;
      if(karamField && field.previousElementSibling !== karamField){
        karamField.insertAdjacentElement("afterend", field);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(fixVishweFieldLayoutV62, 150);
    document.addEventListener("click", function(){
      setTimeout(fixVishweFieldLayoutV62, 150);
      setTimeout(fixVishweFieldLayoutV62, 400);
    }, true);
  });
})();


// ======================================================
// Zameen Minti Project v63 - Actual Vishwe Field Size Fix
// Small layout-only fix: make 1 Vishwe Sq Ft same size as other fields.
// ======================================================
(function(){
  function fixVishweFieldV63(){
    const input = document.getElementById("settingVishweSqft");
    if(!input) return;

    const field = input.closest(".form-field") || input.parentElement;
    const modal = input.closest(".modal-content, .modal");
    if(!field || !modal) return;

    field.classList.add("v63-vishwe-field-fixed");

    // Move after 1 Karam Feet field if possible.
    const karamInput = modal.querySelector("#settingKaramFeet");
    if(karamInput){
      const karamField = karamInput.closest(".form-field") || karamInput.parentElement;
      if(karamField && karamField.nextElementSibling !== field){
        karamField.insertAdjacentElement("afterend", field);
      }
    }

    // Force exact visual size like other half-width fields.
    field.style.gridColumn = "auto";
    field.style.width = "calc(50% - 10px)";
    field.style.maxWidth = "calc(50% - 10px)";
    field.style.display = "inline-block";
    field.style.verticalAlign = "top";
    field.style.marginRight = "16px";

    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    const label = field.querySelector("label");
    if(label) label.textContent = "1 Vishwe Sq Ft";
  }

  document.addEventListener("DOMContentLoaded", function(){
    setTimeout(fixVishweFieldV63, 100);
    document.addEventListener("click", function(){
      setTimeout(fixVishweFieldV63, 80);
      setTimeout(fixVishweFieldV63, 250);
    }, true);
  });
})();
