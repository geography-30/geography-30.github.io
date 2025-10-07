(function(){
  const $ = (id)=>document.getElementById(id);
  const qs = (sel)=>document.querySelector(sel);
  const els = {
    q: $('q'), cats: $('cats'), grid: $('grid'), empty: $('empty'),
    modal: $('modal'), frame: $('frame'), close: $('close'), reload: $('reload'), full: $('full'),
    settings: $('settings'), settingsBtn: $('settingsBtn'), settingsClose: $('settingsClose'),
    cloakEnabled: $('cloakEnabled'), cloakTitle: $('cloakTitle'), cloakIcon: $('cloakIcon'),
    cloakPresetClassroom: $('cloakPresetClassroom'), cloakPresetDocs: $('cloakPresetDocs'),
    aboutBlankDefault: $('aboutBlankDefault'), panicUrl: $('panicUrl'),
    favicon: qs('link#site-favicon')
  };
  const on = (el,ev,fn)=>{ if(el && el.addEventListener) el.addEventListener(ev,fn); };
  if ($('y')) $('y').textContent = new Date().getFullYear();

  const state = { games:[], q:'', cat:'all' };
  const conf = loadConf();
  function loadConf(){ try{ return Object.assign({cloakEnabled:false,cloakTitle:'',cloakIcon:'',aboutBlankDefault:false,panicUrl:''}, JSON.parse(localStorage.getItem('settings')||'{}')); }catch(e){ return {cloakEnabled:false,cloakTitle:'',cloakIcon:'',aboutBlankDefault:false,panicUrl:''}; } }
  function saveConf(){ localStorage.setItem('settings', JSON.stringify(conf)); }

  const ORIGINAL = { title: document.title, iconHref: (els.favicon||{}).href || '' };
  function applyCloak(){ if (conf.cloakEnabled){ if (conf.cloakTitle) document.title = conf.cloakTitle; if (conf.cloakIcon && els.favicon){ els.favicon.href = conf.cloakIcon; } } else { document.title = ORIGINAL.title; if (els.favicon){ els.favicon.href = ORIGINAL.iconHref || 'assets/favicon.png'; } } }
  function syncSettingsUI(){ if(!els.settings) return; els.cloakEnabled.checked = !!conf.cloakEnabled; els.cloakTitle.value = conf.cloakTitle || ''; els.cloakIcon.value = conf.cloakIcon || ''; els.aboutBlankDefault.checked = !!conf.aboutBlankDefault; els.panicUrl.value = conf.panicUrl || ''; }
  syncSettingsUI(); applyCloak();

  on(els.cloakEnabled,'change',()=>{ conf.cloakEnabled = !!els.cloakEnabled.checked; saveConf(); applyCloak(); });
  on(els.cloakTitle,'input',()=>{ conf.cloakTitle = els.cloakTitle.value || ''; saveConf(); applyCloak(); });
  on(els.cloakIcon,'input',()=>{ conf.cloakIcon = els.cloakIcon.value || ''; saveConf(); applyCloak(); });
  on(els.aboutBlankDefault,'change',()=>{ conf.aboutBlankDefault = !!els.aboutBlankDefault.checked; saveConf(); });
  on(els.panicUrl,'input',()=>{ conf.panicUrl = els.panicUrl.value || ''; saveConf(); });

  on(els.cloakPresetClassroom,'click',()=>{
    conf.cloakEnabled = true; conf.cloakTitle = 'Google Classroom'; conf.cloakIcon = 'https://ssl.gstatic.com/classroom/favicon.ico';
    saveConf(); syncSettingsUI(); applyCloak();
  });
  on(els.cloakPresetDocs,'click',()=>{
    conf.cloakEnabled = true; conf.cloakTitle = 'Google Docs'; conf.cloakIcon = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    saveConf(); syncSettingsUI(); applyCloak();
  });

  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && conf.panicUrl){ try { location.href = conf.panicUrl; } catch(err){} } });
  on(els.settingsBtn, 'click', ()=>{ if(els.settings){ els.settings.classList.add('open'); els.settings.setAttribute('aria-hidden','false'); } });
  on(els.settingsClose, 'click', ()=>{ if(els.settings){ els.settings.classList.remove('open'); els.settings.setAttribute('aria-hidden','true'); } });

  function resolv(path){
    if(!path) return '';
    if(/^https?:\/\//i.test(path)) return path;
    if(path.startsWith('/')) return location.origin + path;
    const base = location.href.replace(/[#?].*$/,'').replace(/\/[^/]*$/,'/');
    return base + path;
  }
  function ensureFileOrFolder(u){ if (!/^https?:\/\//i.test(u) && /\/$/.test(u)) return u + 'index.html'; return u; }
  function normCats(g){
    const c = g.categories || g.category || g.tags || g.genre || g.genres || g.cat || [];
    if (Array.isArray(c)) return c;
    if (typeof c === 'string') return c.split(',').map(s=>s.trim()).filter(Boolean);
    return [];
  }
  function nameOf(g){ return g.label || g.title || g.name || g.game_name || g.display || 'Game'; }
  function urlOf(g){ return g.game_url || g.url || g.href || g.link || g.path || g.play || g.file || g.play_url || g.gameroot || ''; }
  function imgOf(g, url){
    const img = g.game_image_icon || g.image || g.icon || g.thumb || g.cover || g.img || g.picture;
    if (img) return resolv(img);
    if (g.gameroot && g.game){
      const root = g.gameroot.endsWith('/') ? g.gameroot : (g.gameroot + '/');
      return resolv(root + g.game);
    }
    if (url) return resolv(url.replace(/\/$/,'') + '/splash.png');
    return 'assets/cover.png';
  }

  async function fetchList(){
    for(const u of ['games.json','/games.json','assets/games.json','data/games.json','/assets/games.json','/data/games.json']){
      try{ const r = await fetch(u,{cache:'no-store'}); if(r.ok){ const j = await r.json(); if(Array.isArray(j)) return j; } }catch(e){}
    }
    return null;
  }

  function buildCats(){
    const s = new Set(); (state.games||[]).forEach(g=>normCats(g).forEach(c=>s.add(c)));
    const arr = ['all', ...Array.from(s).sort((a,b)=>a.localeCompare(b))];
    const bar = $('cats'); bar.innerHTML='';
    arr.forEach(c=>{
      const b = document.createElement('button');
      b.className = 'badge'; b.textContent = c; b.dataset.cat = c;
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.badge').forEach(x=>x.classList.toggle('active', x.dataset.cat===c));
        state.cat = c; render();
      });
      if (c==='all') b.classList.add('active');
      bar.appendChild(b);
    });
  }

  function render(){
    const q = (state.q||'').trim().toLowerCase();
    const items = (state.games||[]).filter(g=>{
      const label = (nameOf(g)||'').toLowerCase();
      const cats = normCats(g).map(x=>x.toLowerCase());
      const matchQ = !q || label.includes(q) || cats.some(x=>x.includes(q));
      const matchC = state.cat==='all' || cats.includes((state.cat||'').toLowerCase());
      return matchQ && matchC;
    });

    const grid = $('grid');
    const empty = $('empty');
    grid.innerHTML='';
    empty.style.display = items.length? 'none':'block';

    for(const g of items){
      const label = nameOf(g);
      const raw = urlOf(g);
      const url = ensureFileOrFolder(resolv(raw));
      const img = imgOf(g, raw);
      const catFirst = (normCats(g)[0] || '');

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb-wrap">
          <img class="thumb" loading="lazy" src="${img}" alt="${label}" onerror="this.onerror=null;this.src='assets/cover.png'">
          ${catFirst ? `<div class="cat-badge">${catFirst}</div>` : ''}
        </div>
        <div class="body"><div class="title">${label}</div></div>`;

      const imgEl = card.querySelector('.thumb');
      if (imgEl) imgEl.addEventListener('click',()=>{
        if (conf.aboutBlankDefault) {
          const w = window.open('about:blank','_blank');
          if (!w) { alert('Popup blocked. Disable popup blocker or turn off About:Blank in Settings.'); return; }
          const doc = w.document;
          doc.open();
          doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>Loading…</title><style>html,body{margin:0;height:100%;background:#000}iframe{border:0;width:100%;height:100%}</style></head><body><iframe src="${url}" allow="autoplay; fullscreen"></iframe></body></html>`);
          doc.close();
        } else {
          openPlayer(url);
        }
      });

      grid.appendChild(card);
    }
  }

  function openPlayer(u){
    if(!u) return;
    els.frame.src = u;
    els.modal.classList.add('open');
    els.modal.setAttribute('aria-hidden','false');
  }
  function closePlayer(){
    els.modal.classList.remove('open');
    els.modal.setAttribute('aria-hidden','true');
    els.frame.src = 'about:blank';
  }
  on(els.close,'click',closePlayer);
  on(els.reload,'click',()=>{ if(els.frame) els.frame.src = els.frame.src; });
  on(els.full,'click',()=>{ const f = els.frame; if(f && f.requestFullscreen) f.requestFullscreen(); });

  on($('q'),'input',e=>{ state.q = (e.target && e.target.value) || ''; render(); });

  (async ()=>{
    const list = await fetchList();
    if (!list) { $('empty').style.display='block'; return; }
    state.games = list;
    buildCats(); render();
  })();
})();