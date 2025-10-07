/* ads.js — AdinPlay helpers (slots: paperio-pro_970x250 & paperio-pro_300x250) */
window.aiptag = window.aiptag || { cmd: { display: [], player: [] } };

/* Refresh banners (both sizes) */
window.reloadAds = function reloadAds(){
  try {
    console.log('[AdinPlay] refresh banners');
    if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
      window.aiptag.cmd.display.push(function() {
        try { aipDisplayTag.display('paperio-pro_970x250'); } catch(e){ console.warn('970x250 display error', e); }
        try { aipDisplayTag.display('paperio-pro_300x250'); } catch(e){ console.warn('300x250 display error', e); }
      });
    }
  } catch (err) {
    console.warn('reloadAds failed', err);
  }
};

/* First paint — display both slots once */
(function(){
  try{
    if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display){
      window.aiptag.cmd.display.push(function() {
        try { aipDisplayTag.display('paperio-pro_970x250'); } catch(e){}
        try { aipDisplayTag.display('paperio-pro_300x250'); } catch(e){}
      });
    }
  }catch(e){}
})();