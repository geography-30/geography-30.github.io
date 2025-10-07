/* ads.js — AdinPlay helpers */
window.aiptag = window.aiptag || { cmd: { display: [], player: [] } };

/* Refresh both banner slots */
window.reloadAds = function reloadAds(){
  try {
    console.log('[AdinPlay] refresh banners');
    if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
      window.aiptag.cmd.display.push(function() {
        try { aipDisplayTag.display('fine-arts-lol_970x250'); } catch(e){ console.warn('970x250 display error', e); }
        try { aipDisplayTag.display('fine-arts-lol_300x250'); } catch(e){ console.warn('300x250 display error', e); }
      });
    }
  } catch (err) {
    console.warn('reloadAds failed', err);
  }
};

/* Optional: preroll integration. If AdinPlay player exists, run preroll and resolve when finished. */
window.show_preroll = function show_preroll(){
  return new Promise(function(resolve){
    try{
      var finished = false;
      function done(){ if(!finished){ finished = true; resolve(); } }
      if (window.aiptag && window.aiptag.adplayer && typeof window.aiptag.adplayer.startPreRoll === 'function'){
        window.aiptag.adplayer.startPreRoll({ AIP_COMPLETE: done, AIP_REMOVE: done, AIP_ERROR: done });
        return;
      }
      if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.player){
        window.aiptag.cmd.player.push(function(){
          try{
            if (window.aiptag.adplayer && typeof window.aiptag.adplayer.startPreRoll === 'function'){
              window.aiptag.adplayer.startPreRoll({ AIP_COMPLETE: done, AIP_REMOVE: done, AIP_ERROR: done });
            } else {
              done();
            }
          }catch(e){ console.warn('preroll start failed', e); done(); }
        });
        return;
      }
      done();
    }catch(e){
      console.warn('show_preroll error', e); resolve();
    }
  });
};

/* Auto display initial banners on load */
(function initDisplay(){
  try{
    if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display){
      window.aiptag.cmd.display.push(function() {
        try { aipDisplayTag.display('fine-arts-lol_970x250'); } catch(e){}
        try { aipDisplayTag.display('fine-arts-lol_300x250'); } catch(e){}
      });
    }
  }catch(e){}
})();