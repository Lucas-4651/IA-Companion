// ======================= STAR RATING SYSTEM =======================

// Initialise le rating (click sur une étoile)
document.addEventListener('click', (e) => {
  const starClicked = e.target;
  if (!isStarClick(starClicked)) return;

  const stars = [...starClicked.parentElement.querySelectorAll('.fa-star')];
  const rating = parseInt(starClicked.dataset.rating, 10);
  updateStarDisplay(stars, rating);
});

function isStarClick(target) {
  return target.classList.contains('fa-star') &&
         target.parentElement?.classList.contains('stars');
}

function updateStarDisplay(stars, rating) {
  stars.forEach((star, index) => {
    star.classList.toggle('fas', index < rating);
    star.classList.toggle('far', index >= rating);
  });
}

// ======================= COMMENT SUBMISSION =======================

document.getElementById('comment-form')?.addEventListener('submit', handleCommentSubmit);

async function handleCommentSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const content = form.querySelector('textarea').value.trim();
  const aiId = window.location.pathname.split('/')[2];
  const rating = form.querySelectorAll('.fa-star.fas').length;

  if (rating === 0) {
    alert('Veuillez sélectionner une note');
    return;
  }

  try {
    const averageRating = await submitRating(aiId, rating);
    updateGlobalRatingDisplay(averageRating);

    const newComment = await submitComment(aiId, content);
    appendCommentToList(newComment, rating, content);

    resetForm(form);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    alert('Erreur lors de l\'ajout du commentaire');
  }
}

// ======================= FETCH HELPERS =======================

async function submitRating(aiId, value) {
  const res = await fetchJSON('/comments/rate', { aiId, value });
  return res;
}

async function submitComment(aiId, content) {
  const res = await fetchJSON('/comments/add', { aiId, content });
  return res;
}

async function fetchJSON(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
  return res.json();
}

// ======================= DOM UPDATES =======================

function updateGlobalRatingDisplay({ averageRating, ratingsCount }) {
  const starContainer = document.querySelector('.ai-rating .stars');
  const countSpan = document.querySelector('.ai-rating span');

  if (!starContainer || !countSpan) return;

  starContainer.innerHTML = '';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('i');
    if (i <= Math.floor(averageRating)) {
      star.className = 'fas fa-star';
    } else if (i - 0.5 <= averageRating) {
      star.className = 'fas fa-star-half-alt';
    } else {
      star.className = 'far fa-star';
    }
    starContainer.appendChild(star);
  }

  countSpan.textContent = `(${ratingsCount} avis)`;
}

function appendCommentToList({ User }, rating, content) {
  const container = document.getElementById('comments-container');
  if (!container) return;

  const comment = document.createElement('div');
  comment.className = 'comment';
  comment.innerHTML = `
    <div class="user-info">
      <strong>${User.username}</strong>
      <div class="rating">${'<i class="fas fa-star"></i>'.repeat(rating)}</div>
    </div>
    <p>${content}</p>
    <small>À l'instant</small>
  `;

  container.prepend(comment);
}

function resetForm(form) {
  form.reset();
  form.querySelectorAll('.fa-star').forEach(star => {
    star.classList.remove('fas');
    star.classList.add('far');
  });
}