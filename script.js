/* script.js - Interaction Logic */

// 1. SCROLL REVEAL ANIMATION
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.hero, h2').forEach(el => {
  el.classList.add('hidden');
  observer.observe(el);
});


// Helper to apply reveal + 3D effects to any cards (including ones added later)
function enhanceCards(scope = document) {
  const cards = scope.querySelectorAll('.card');

  cards.forEach(card => {
    if (card.dataset.enhanced === 'true') return;
    card.dataset.enhanced = 'true';

    card.classList.add('hidden');
    observer.observe(card);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Multipliers determine how "extreme" the tilt is
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;

      // Apply the transformation
      // scale3d makes it pop "toward" you slightly
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Move the "Glare"
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Reset when mouse leaves
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });

    if (card.classList.contains('clickable')) {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `
          translateY(-6px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  });
}

// Apply immediately for any cards already in DOM
enhanceCards();

// Shared helper to fetch data and build clickable cards into a grid
function loadCards({ url, gridId, getHref, getInnerHTML }) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  fetch(url)
    .then(res => res.json())
    .then(items => {
      if (!Array.isArray(items)) return;

      items.forEach(item => {
        const card = document.createElement('a');
        card.className = 'card clickable';
        card.href = getHref(item);
        card.innerHTML = getInnerHTML(item);
        grid.appendChild(card);
      });

      enhanceCards(grid);
    })
    .catch(err => {
      console.error(`loadCards failed for ${url}`, err);
    });
}

// Expose so dynamically added cards (e.g., blog/projects lists) can opt-in
window.enhanceCards = enhanceCards;
window.loadCards = loadCards;

// Utility: derive slug from current path (handles /foo/ and /foo/index.html)
function getSlugFromPath(pathname = window.location.pathname) {
  const parts = pathname.split('/').filter(Boolean);
  let slug = parts[parts.length - 1] || '';
  if (slug === 'index.html') {
    slug = parts[parts.length - 2] || '';
  }
  return slug;
}

// Utility: hydrate a blog post from index.json + markdown file
function loadBlogPost({
  indexUrl = '/posts/blog/index.json',
  markdownRoot = '/posts/blog/',
  titleEl = '#post-title',
  dateEl = '#post-date',
  contentEl = '#post-content',
  navEl = '#post-nav',
  excerptEl = '#post-excerpt',
  metaDescriptionSelector = 'meta[name=\"description\"]'
} = {}) {
  const slug = getSlugFromPath();
  const titleNode = document.querySelector(titleEl);
  const dateNode = document.querySelector(dateEl);
  const contentNode = document.querySelector(contentEl);
  const navNode = document.querySelector(navEl);
  const excerptNode = document.querySelector(excerptEl);

  fetch(indexUrl)
    .then(res => res.json())
    .then(posts => {
      const index = posts.findIndex(p => p.slug === slug);
      const post = posts[index];

      if (!post) {
        if (contentNode) {
          contentNode.innerHTML = '<p style=\"opacity:0.7;\">Post not found.</p>';
        }
        return;
      }

      document.title = `${post.title} | Tyler Walker`;
      if (titleNode) titleNode.textContent = post.title;
      if (dateNode) dateNode.textContent = post.date;
      if (excerptNode) excerptNode.textContent = post.excerpt || '';

      const metaDesc = document.querySelector(metaDescriptionSelector);
      if (metaDesc && post.excerpt) {
        metaDesc.setAttribute('content', post.excerpt);
      }

      fetch(`${markdownRoot}${slug}.md`)
        .then(res => res.text())
        .then(md => {
          if (contentNode) {
            contentNode.innerHTML = marked.parse(md);
          }
        })
        .catch(() => {
          if (contentNode) {
            contentNode.innerHTML = '<p style=\"opacity:0.7;\">Unable to load this post right now.</p>';
          }
        });

      if (navNode) {
        navNode.innerHTML = '';
        if (index > 0) {
          const prev = posts[index - 1];
          navNode.innerHTML += `<a href=\"/blog/${prev.slug}/\">← ${prev.title}</a>`;
        } else {
          navNode.innerHTML += '<span></span>';
        }

        if (index < posts.length - 1) {
          const next = posts[index + 1];
          navNode.innerHTML += `<a href=\"/blog/${next.slug}/\">${next.title} →</a>`;
        }
      }
    })
    .catch(() => {
      if (contentNode) {
        contentNode.innerHTML = '<p style=\"opacity:0.7;\">Unable to load this post right now.</p>';
      }
    });
}

window.loadBlogPost = loadBlogPost;
