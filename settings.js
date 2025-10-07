document.getElementById('settingsBtn').onclick=function(){
  const m=prompt('Choose open mode: modal / page / blank',localStorage.getItem('openMode')||'modal');
  if(m) localStorage.setItem('openMode',m);
};