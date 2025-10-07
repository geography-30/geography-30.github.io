document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.createElement('button');
  btn.id='settingsBtn';
  btn.textContent='⚙ Settings';
  btn.style.position='fixed';
  btn.style.top='10px';
  btn.style.right='10px';
  btn.style.zIndex='1000';
  document.body.appendChild(btn);
  btn.onclick=()=>{
    const m=prompt('Choose open mode: modal / page / blank',localStorage.getItem('openMode')||'modal');
    if(m) localStorage.setItem('openMode',m);
  };
  function getGameUrl(card){
    return card.dataset.url||card.dataset.gameUrl||card.dataset.play||card.dataset.href||card.getAttribute('href')||card.querySelector('a')?.href;
  }
  function getGameId(url){
    if(!url) return '';
    return url.split('/').filter(Boolean).pop();
  }
  function openGame(url){
    const mode=localStorage.getItem('openMode')||'modal';
    if(mode==='page'){
      location.href='game.html?id='+getGameId(url);
    }else if(mode==='blank'){
      const w=window.open('about:blank','_blank');
      w.document.write('<iframe src="'+url+'" style="width:100%;height:100%;border:0"></iframe>');
    }else{
      // modal
      let modal=document.getElementById('gameModal');
      if(!modal){
        modal=document.createElement('div');
        modal.id='gameModal';
        modal.style='position:fixed;top:0;left:0;width:100%;height:100%;background:#000c;display:flex;align-items:center;justify-content:center;z-index:2000';
        modal.innerHTML='<div style="width:90%;height:90%;background:#000;position:relative"><button id="closeModal" style="position:absolute;top:5px;right:5px;z-index:10">X</button><iframe id="modalFrame" style="width:100%;height:100%;border:0"></iframe></div>';
        document.body.appendChild(modal);
        modal.querySelector('#closeModal').onclick=()=>modal.remove();
      }
      modal.querySelector('#modalFrame').src=url;
    }
  }
  const selectors=['#grid','.grid','#games','.games','#game-list','.game-list'];
  const container=document.querySelector(selectors.join(','));
  if(container){
    container.addEventListener('click',e=>{
      const card=e.target.closest('a, .game-card, .item');
      if(card){
        e.preventDefault();
        const url=getGameUrl(card);
        if(url) openGame(url);
      }
    });
  }
});