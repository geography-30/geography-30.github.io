(function(){
  const doc = document.documentElement;
  const saved = localStorage.getItem("theme");
  if(saved === "light"){ doc.classList.add("light"); }

  function ensureHeader(){
    const header = document.querySelector(".site-header .inner");
    if(!header) return;
    if(!header.querySelector(".search")){
      const search = document.createElement("div");
      search.className = "search";
      search.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.2-4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/></svg><input placeholder="Search games..." id="q" /><span class="kbd">/</span>';
      header.insertBefore(search, header.firstChild.nextSibling);
      document.addEventListener("keydown", (e)=>{
        if(e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)){ e.preventDefault(); search.querySelector("input").focus(); }
      });
      const input = search.querySelector("input");
      input.addEventListener("input", ()=>{
        const q = input.value.trim().toLowerCase();
        const cards = document.querySelectorAll(".game-card,[data-game],.Project,.Games-item");
        cards.forEach(card=>{
          const text = (card.textContent||"").toLowerCase();
          card.style.display = text.includes(q) ? "" : "none";
        });
      });
    }
    if(!header.querySelector(".theme-toggle")){
      const btn = document.createElement("button");
      btn.className = "button theme-toggle";
      btn.type = "button";
      btn.innerHTML = '<span>Theme</span>';
      btn.onclick = ()=>{
        const isLight = doc.classList.toggle("light");
        localStorage.setItem("theme", isLight ? "light" : "dark");
      };
      const actions = header.querySelector(".header-actions") || header.appendChild(document.createElement("div"));
      actions.classList.add("header-actions");
      actions.appendChild(btn);
    }
  }

  function wrapCardLinks(){
    const root = document;
    root.querySelectorAll(".card-link, .game-card a, [data-game] a").forEach(a=>{
      if(a.dataset._wrapped) return;
      a.dataset._wrapped = "1";
      a.addEventListener("click", function(e){
        const href = this.getAttribute("href");
        if(!href || href.startsWith("#")) return;
        const hasVideoAd = typeof window.show_videoad === "function";
        const hasPreroll = typeof window.show_preroll === "function" || typeof window.show_preroll === "function";
        if(hasVideoAd || hasPreroll){
          e.preventDefault();
          const go = ()=>window.location.href = href;
          try{
            if(hasVideoAd){ window.show_videoad(go); }
            else if(typeof window.show_preroll === "function"){ window.show_preroll(go); }
            else if(typeof window.show_preroll === "function"){ window.show_preroll(go); }
            else { go(); }
          }catch(err){
            console.warn("Pre-roll error:", err);
            go();
          }
        }
      }, true);
    });
  }

  function clampTitles(){
    document.querySelectorAll(".game-title").forEach(el=>{
      const text = el.textContent || "";
      if(text.length > 26){
        el.textContent = text.slice(0, 24) + "…";
      }
    });
  }

  ensureHeader();
  wrapCardLinks();
  clampTitles();

  const obs = new MutationObserver(()=>{
    wrapCardLinks();
    clampTitles();
  });
  obs.observe(document.documentElement, {childList:true, subtree:true});
})();
