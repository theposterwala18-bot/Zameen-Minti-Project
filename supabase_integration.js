// Zameen Minti Project v63 - Supabase Ready Integration

let zmSupabase = null;
let zmRealtimeChannel = null;

function supabaseConfigured(){
  return window.ZM_SUPABASE_URL &&
    window.ZM_SUPABASE_ANON_KEY &&
    !String(window.ZM_SUPABASE_URL).includes("PASTE_") &&
    !String(window.ZM_SUPABASE_ANON_KEY).includes("PASTE_");
}

function initSupabase(){
  if(!supabaseConfigured()){
    updateSupabaseStatus("Supabase config pending ਹੈ। supabase_config.js ਵਿੱਚ URL ਤੇ anon key paste ਕਰੋ।", false);
    return null;
  }
  if(!window.supabase){
    updateSupabaseStatus("Supabase library load ਨਹੀਂ ਹੋਈ। Internet check ਕਰੋ।", false);
    return null;
  }
  if(!zmSupabase){
    zmSupabase = window.supabase.createClient(window.ZM_SUPABASE_URL, window.ZM_SUPABASE_ANON_KEY);
  }
  updateSupabaseStatus("Supabase ready ਹੈ। Cloud login/chat/reports active ਹੋ ਸਕਦੇ ਹਨ।", true);
  return zmSupabase;
}

function updateSupabaseStatus(text, ok){
  const el = document.getElementById("supabaseStatusText");
  const card = document.getElementById("supabaseStatusCard");
  if(el) el.innerText = text;
  if(card) card.classList.toggle("cloud-ok", !!ok);
}

async function testSupabaseConnection(){
  const sb = initSupabase();
  if(!sb) return alert("Supabase config pending ਹੈ।");

  try{
    const {data, error} = await sb.from("profiles").select("id").limit(1);
    if(error) throw error;
    alert("Supabase connection OK ✅");
    updateSupabaseStatus("Supabase connection OK ✅", true);
  }catch(e){
    alert("Connection/table issue: " + e.message);
    updateSupabaseStatus("Connection/table issue: " + e.message, false);
  }
}

// ---------- Cloud Auth ----------
async function cloudSignupMember(){
  const sb = initSupabase();
  if(!sb) return signupMember(); // local fallback

  const name = document.getElementById("signupName")?.value.trim();
  const mobile = document.getElementById("signupMobile")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();

  if(!name || !email || !password) return alert("Cloud signup ਲਈ Name, Email, Password required ਹਨ।");

  const {data, error} = await sb.auth.signUp({
    email,
    password,
    options:{ data:{ name, mobile } }
  });
  if(error) return alert(error.message);

  const user = data.user;
  if(user){
    await sb.from("profiles").upsert({
      id:user.id,
      name,
      mobile,
      email,
      role:"client",
      plan:"free",
      created_at:new Date().toISOString()
    });
  }
  alert("Signup ਹੋ ਗਿਆ। Email confirmation ਜੇ enabled ਹੈ ਤਾਂ email check ਕਰੋ।");
  await cloudLoadCurrentUser();
  if(typeof closeAuthModal === "function") closeAuthModal();
}

async function cloudLoginMember(){
  const sb = initSupabase();
  if(!sb) return loginMember(); // local fallback

  const identity = document.getElementById("loginIdentity")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  if(!identity || !password) return alert("Email ਅਤੇ password ਭਰੋ।");

  const {data, error} = await sb.auth.signInWithPassword({email:identity, password});
  if(error) return alert(error.message);

  await cloudLoadCurrentUser();
  if(typeof closeAuthModal === "function") closeAuthModal();
}

async function cloudLogout(){
  const sb = initSupabase();
  if(sb) await sb.auth.signOut();
  localStorage.removeItem("zmCurrentMember");
  if(typeof updateTopMemberUI === "function") updateTopMemberUI();
}

async function cloudLoadCurrentUser(){
  const sb = initSupabase();
  if(!sb) return null;

  const {data:{user}} = await sb.auth.getUser();
  if(!user){
    return null;
  }

  let {data:profile} = await sb.from("profiles").select("*").eq("id", user.id).single();
  if(!profile){
    profile = {
      id:user.id,
      name:user.user_metadata?.name || user.email,
      mobile:user.user_metadata?.mobile || "",
      email:user.email,
      role:"client",
      plan:"free"
    };
    await sb.from("profiles").upsert(profile);
  }

  const member = {
    id:profile.id,
    name:profile.name,
    mobile:profile.mobile || "",
    email:profile.email || user.email,
    plan:profile.plan || "free",
    role:profile.role || "client"
  };
  localStorage.setItem("zmCurrentMember", JSON.stringify(member));
  if(typeof updateTopMemberUI === "function") updateTopMemberUI();
  setupRealtimeMessages();
  return member;
}

// ---------- Cloud Chat ----------
async function cloudSendPrivateChat(){
  const sb = initSupabase();
  if(!sb) return sendPrivateChat(); // local fallback

  const member = await cloudLoadCurrentUser();
  if(!member){
    if(typeof openAuthModal === "function") openAuthModal();
    return;
  }

  const input = document.getElementById("privateChatInput");
  const text = input?.value.trim();
  if(!text) return;

  const {error} = await sb.from("messages").insert({
    client_id:member.id,
    sender_id:member.id,
    sender_role:"client",
    message:text,
    read_by_owner:false,
    read_by_client:true
  });
  if(error) return alert(error.message);

  input.value = "";
  await cloudLoadPrivateChat();
}

async function cloudLoadPrivateChat(){
  const sb = initSupabase();
  if(!sb) return loadPrivateChat();

  const member = await cloudLoadCurrentUser();
  if(!member) return;

  const {data, error} = await sb.from("messages")
    .select("*")
    .eq("client_id", member.id)
    .order("created_at", {ascending:true});
  if(error) return alert(error.message);

  const win = document.getElementById("privateChatWindow");
  if(!win) return;
  win.innerHTML = data.length ? data.map(x => `
    <div class="msg ${x.sender_role === "client" ? "client-msg" : "owner-msg"}">
      <div>${x.message}</div>
      <small>${new Date(x.created_at).toLocaleString()}</small>
    </div>
  `).join("") : `<div class="chat-note">ਇਹ ਤੁਹਾਡੀ private cloud chat ਹੈ।</div>`;
  win.scrollTop = win.scrollHeight;
}

async function cloudLoadAdminInbox(){
  const sb = initSupabase();
  if(!sb) return loadAdminInbox();

  const {data:profile} = await sb.from("profiles").select("role").eq("id", (await sb.auth.getUser()).data.user?.id).single();
  if(!profile || profile.role !== "owner") return alert("Owner role required ਹੈ।");

  const {data, error} = await sb.from("messages")
    .select("client_id, message, created_at, read_by_owner, profiles:client_id(name,mobile,email)")
    .order("created_at", {ascending:false});
  if(error) return alert(error.message);

  const grouped = {};
  (data || []).forEach(m => {
    if(!grouped[m.client_id]) grouped[m.client_id] = m;
  });

  const list = document.getElementById("adminChatList");
  if(!list) return;
  const ids = Object.keys(grouped);
  list.innerHTML = ids.length ? ids.map(id => {
    const m = grouped[id];
    const p = m.profiles || {};
    return `<button class="admin-client-row" onclick="cloudSelectAdminChat('${id}')">
      <div class="avatar-circle">${(p.name || "C").charAt(0)}</div>
      <div class="client-row-text">
        <b>${p.name || "Client"}</b>
        <span>${m.message || ""}</span>
        <small>${new Date(m.created_at).toLocaleString()}</small>
      </div>
      ${!m.read_by_owner ? "<em>1</em>" : ""}
    </button>`;
  }).join("") : `<div class="chat-note">ਹਾਲੇ ਕੋਈ cloud message ਨਹੀਂ।</div>`;
}

let cloudSelectedClientId = null;

async function cloudSelectAdminChat(clientId){
  cloudSelectedClientId = clientId;
  const sb = initSupabase();
  const {data:profile} = await sb.from("profiles").select("*").eq("id", clientId).single();
  document.getElementById("adminSelectedClient").innerHTML = `<b>${profile?.name || "Client"}</b><br>${profile?.mobile || ""} ${profile?.email || ""}`;

  const {data} = await sb.from("messages").select("*").eq("client_id", clientId).order("created_at", {ascending:true});
  const win = document.getElementById("adminChatWindow");
  win.innerHTML = (data || []).map(x => `
    <div class="msg ${x.sender_role === "client" ? "client-msg" : "owner-msg"}">
      <div>${x.message}</div>
      <small>${new Date(x.created_at).toLocaleString()}</small>
    </div>
  `).join("");
  win.scrollTop = win.scrollHeight;

  await sb.from("messages").update({read_by_owner:true}).eq("client_id", clientId).eq("sender_role","client");
}

async function cloudSendAdminReply(){
  const sb = initSupabase();
  if(!sb) return sendAdminReply();
  if(!cloudSelectedClientId) return alert("Client select ਕਰੋ।");

  const text = document.getElementById("adminReplyInput")?.value.trim();
  if(!text) return;

  const {data:{user}} = await sb.auth.getUser();
  const {error} = await sb.from("messages").insert({
    client_id:cloudSelectedClientId,
    sender_id:user.id,
    sender_role:"owner",
    message:text,
    read_by_owner:true,
    read_by_client:false
  });
  if(error) return alert(error.message);

  document.getElementById("adminReplyInput").value = "";
  await cloudSelectAdminChat(cloudSelectedClientId);
}

// ---------- Cloud Reports ----------
async function cloudSaveReport(type, data){
  const sb = initSupabase();
  if(!sb) return saveLocalReport(type, data);

  const member = await cloudLoadCurrentUser();
  const payload = {
    client_id: member?.id || null,
    report_type: type,
    report_data: data
  };
  await sb.from("reports").insert(payload);
  saveLocalReport(type, data); // also local backup
}

async function cloudLoadReports(){
  const sb = initSupabase();
  if(!sb) return loadReports();

  const member = await cloudLoadCurrentUser();
  if(!member) return loadReports();

  const {data, error} = await sb.from("reports")
    .select("*")
    .eq("client_id", member.id)
    .order("created_at", {ascending:false});
  if(error) return alert(error.message);

  const list = document.getElementById("reportsList");
  if(!list) return;
  list.innerHTML = data.length ? data.map(r => `
    <div class="saved-report-card">
      <b>${r.report_type}</b>
      <span>${new Date(r.created_at).toLocaleString()}</span>
      <pre>${JSON.stringify(r.report_data, null, 2)}</pre>
    </div>
  `).join("") : `<div class="note-card">ਹਾਲੇ ਕੋਈ cloud report saved ਨਹੀਂ।</div>`;
}

// ---------- Realtime ----------
function setupRealtimeMessages(){
  const sb = initSupabase();
  if(!sb || zmRealtimeChannel) return;

  zmRealtimeChannel = sb.channel("zm_messages")
    .on("postgres_changes", {event:"INSERT", schema:"public", table:"messages"}, payload => {
      if(typeof cloudLoadPrivateChat === "function") cloudLoadPrivateChat();
      if(document.getElementById("adminInboxModal") && !document.getElementById("adminInboxModal").classList.contains("hidden")){
        cloudLoadAdminInbox();
      }
    })
    .subscribe();
}

// ---------- Safe overrides after config ----------
setTimeout(() => {
  if(supabaseConfigured()){
    window.signupMember = cloudSignupMember;
    window.loginMember = cloudLoginMember;
    window.logoutMember = cloudLogout;
    window.sendPrivateChat = cloudSendPrivateChat;
    window.loadPrivateChat = cloudLoadPrivateChat;
    window.loadReports = cloudLoadReports;
    window.loadAdminInbox = cloudLoadAdminInbox;
    window.sendAdminReply = cloudSendAdminReply;
    const oldSave = window.saveLocalReport;
    window.saveLocalReport = function(type, data){
      if(oldSave) oldSave(type, data);
      cloudSaveReport(type, data);
    };
    cloudLoadCurrentUser();
  }else{
    updateSupabaseStatus("Supabase config pending — local demo mode ਚੱਲ ਰਿਹਾ ਹੈ।", false);
  }
}, 1000);
