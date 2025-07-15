// Toggle favorite
document.addEventListener('click', async (e) => {
  if (e.target.closest('.favorite-btn')) {
    const btn = e.target.closest('.favorite-btn');
    const aiId = btn.dataset.aiId;
    
    try {
      const response = await fetch(`/favorites/toggle/${aiId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'added') {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-star"></i>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-star"></i>';
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Erreur lors de la mise à jour des favoris');
    }
  }
});

// Prompt generator
document.getElementById('prompt-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const category = document.getElementById('category').value;
  const difficulty = document.getElementById('difficulty').value;
  
  try {
    const response = await fetch('/prompts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, difficulty })
    });
    
    const result = await response.json();
    
    if (result.error) {
      document.getElementById('generated-prompt').textContent = result.error;
      return;
    }
    
    document.getElementById('generated-prompt').textContent = result.content;
  } catch (error) {
    console.error('Error generating prompt:', error);
    document.getElementById('generated-prompt').textContent = 'Erreur lors de la génération du prompt';
  }
});

// Copy prompt
document.getElementById('copy-prompt')?.addEventListener('click', () => {
  const promptText = document.getElementById('generated-prompt').textContent;
  navigator.clipboard.writeText(promptText)
    .then(() => {
      alert('Prompt copié dans le presse-papiers !');
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
    });
});