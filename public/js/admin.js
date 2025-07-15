// =================== INIT ===================
console.log("admin.js est chargé !");

// =================== GESTION CLICK GLOBAL ===================
document.addEventListener('click', async (e) => {
  const target = e.target;

  // === Suppression d'IA ===
  const deleteBtn = target.closest('.delete-ai');
  if (deleteBtn) {
    const aiId = deleteBtn.dataset.id;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette IA ?')) {
      try {
        const response = await fetch(`/admin/ai/${aiId}/delete`, { method: 'POST' });
        if (response.ok) {
          deleteBtn.closest('tr').remove();
          showToast('IA supprimée avec succès', 'success');
        } else {
          showToast('Échec de suppression de l\'IA', 'danger');
        }
      } catch {
        showToast('Erreur lors de la suppression', 'danger');
      }
    }
    return;
  }

  // === Mise en vedette d'IA ===
  const featureBtn = target.closest('.feature-ai');
  if (featureBtn) {
    const aiId = featureBtn.dataset.id;
    try {
      const response = await fetch(`/admin/ai/${aiId}/toggle-featured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const result = await response.json();
        const icon = featureBtn.querySelector('i');
        if (result.isFeatured) {
          icon.classList.replace('far', 'fas');
          showToast('IA mise en vedette', 'success');
        } else {
          icon.classList.replace('fas', 'far');
          showToast('IA retirée des vedettes', 'info');
        }
      }
    } catch {
      showToast('Erreur de mise à jour', 'danger');
    }
    return;
  }

  // === Suppression de catégorie ===
  const deleteCatBtn = target.closest('.delete-category');
  if (deleteCatBtn) {
    const category = deleteCatBtn.dataset.category;
    if (confirm(`Supprimer la catégorie "${category}" et tous ses prompts?`)) {
      try {
        const response = await fetch(`/admin/categories/delete/${encodeURIComponent(category)}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          deleteCatBtn.closest('.col-md-3').remove();
          showToast('Catégorie supprimée', 'success');
        } else {
          showToast('Erreur de suppression', 'danger');
        }
      } catch {
        showToast('Erreur serveur', 'danger');
      }
    }
    return;
  }

  // === Import JSON IA ===
  if (target.id === 'submitImport' || target.closest('#submitImport')) {
    await handleJsonImport({
      fileInputId: 'jsonFile',
      overwriteCheckboxId: 'overwriteCheck',
      submitBtnId: 'submitImport',
      endpoint: '/admin/ais/import',
      entityName: 'IA'
    });
    return;
  }

  // === Import JSON Prompts ===
  if (target.id === 'submitPromptImport' || target.closest('#submitPromptImport')) {
    await handleJsonImport({
      fileInputId: 'promptJsonFile',
      overwriteCheckboxId: 'promptOverwriteCheck',
      submitBtnId: 'submitPromptImport',
      endpoint: '/admin/prompts/import',
      entityName: 'Prompt'
    });
    return;
  }

  // === Import JSON Tips ===
  if (target.id === 'submitTipImport' || target.closest('#submitTipImport')) {
    await handleJsonImport({
      fileInputId: 'tipJsonFile',
      overwriteCheckboxId: 'tipOverwriteCheck',
      submitBtnId: 'submitTipImport',
      endpoint: '/admin/tips/import',
      entityName: 'Astuce'
    });
    return;
  }
});

// =================== IMPORT UTILITY ===================
async function handleJsonImport({ fileInputId, overwriteCheckboxId, submitBtnId, endpoint, entityName }) {
  const fileInput = document.getElementById(fileInputId);
  const file = fileInput?.files?.[0];
  const overwriteCheck = document.getElementById(overwriteCheckboxId);
  const overwrite = overwriteCheck?.checked ?? false;

  if (!file) {
    showToast(`Veuillez sélectionner un fichier JSON pour les ${entityName}s`, 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('jsonFile', file);
  formData.append('overwrite', overwrite);

  const submitBtn = document.getElementById(submitBtnId);
  if (!submitBtn) return; // Sécurité
  
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Traitement...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      const msg = `${result.added} ${entityName}(s) ajoutée(s) avec succès! ${
        result.updated > 0 ? `(${result.updated} mise(s) à jour)` : ''
      } ${result.errors > 0 ? `\nErreurs: ${result.errors}` : ''}`;
      
      showToast(msg, 'success');
      location.reload();
    } else {
      throw new Error(result.message || 'Erreur lors de l\'importation');
    }
  } catch (err) {
    console.error('Erreur:', err);
    showToast(`Échec de l'importation: ${err.message}`, 'danger');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// =================== TOAST UTILITY ===================
function showToast(message, type = 'info') {
  // Créer le conteneur s'il n'existe pas
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // Créer le toast
  const toast = document.createElement('div');
  toast.className = `toast show align-items-center text-bg-${type}`;
  toast.role = 'alert';

  const body = document.createElement('div');
  body.className = 'd-flex';

  const toastBody = document.createElement('div');
  toastBody.className = 'toast-body';
  toastBody.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn-close me-2 m-auto';
  closeBtn.dataset.bsDismiss = 'toast';
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  body.appendChild(toastBody);
  body.appendChild(closeBtn);
  toast.appendChild(body);
  toastContainer.appendChild(toast);

  // Suppression automatique après 5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// =================== TOOLTIP INIT ===================
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier que Bootstrap est chargé
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }
});