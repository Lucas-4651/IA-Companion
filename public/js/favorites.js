// Remove favorite
document.addEventListener('click', async (e) => {
  if (e.target.closest('.remove-favorite')) {
    const btn = e.target.closest('.remove-favorite');
    const aiId = btn.dataset.aiId;
    
    try {
      const response = await fetch(`/favorites/toggle/${aiId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'removed') {
        btn.closest('.favorite-card').remove();
        
        // If no favorites left, show empty state
        if (document.querySelectorAll('.favorite-card').length === 0) {
          document.querySelector('.favorites-grid').innerHTML = `
            <div class="empty-state">
              <i class="far fa-star"></i>
              <h3>Aucun favori pour le moment</h3>
              <p>Commencez à explorer les IA et ajoutez vos préférées ici</p>
              <a href="/ai" class="btn">Explorer les IA</a>
            </div>
          `;
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Erreur lors de la suppression du favori');
    }
  }
});