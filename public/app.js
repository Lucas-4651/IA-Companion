// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ SW enregistré :', reg))
      .catch(err => console.error('❌ SW échec :', err));
  });
}

// Invite d’installation (optionnel)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  // Tu peux afficher un bouton ici si tu veux
});

// Exemple de bouton caché dans l’interface :
// document.getElementById('installBtn').addEventListener('click', async () => {
//   if (deferredPrompt) {
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     console.log(outcome);  // accepted / dismissed
//     deferredPrompt = null;
//   }
// });
