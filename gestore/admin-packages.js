document.addEventListener('DOMContentLoaded', () => {
  const message=document.getElementById('package-message');
  const request=document.getElementById('package-request');
  if(!message || !request) return;
  async function refresh() {
    try {
      const releases=await window.SentieriSupabase.packageReleases();
      const latest=releases.find(item=>item.edition===document.getElementById('package-edition').value);
      const labels={requested:'In attesa di generazione e verifica',ready:'Disponibile per i telefoni',failed:'Generazione non riuscita'};
      message.textContent=latest ? `${labels[latest.status]} · ${new Date(latest.requested_at).toLocaleString('it-IT')}` : 'Nessuna richiesta per questa edizione.';
    } catch(error) {message.textContent=error.message;}
  }
  request.addEventListener('click',async()=>{
    request.disabled=true;
    try {await window.SentieriSupabase.requestTerritorialPackage(document.getElementById('package-edition').value);await refresh();}
    catch(error){message.textContent=error.message;}
    finally{request.disabled=false;}
  });
  document.getElementById('package-refresh').addEventListener('click',refresh);
});
