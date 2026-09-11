const screen = document.querySelector('#screen');
const popup = document.querySelector('#game-popup');
const popupContent = document.querySelector('#popup-content');
const routes = ['home', 'projects', 'about', 'contact'];
const cache = new Map();
let activeRoute = '';

async function loadComponent(route) {
  if (cache.has(route)) return cache.get(route);
  const response = await fetch(`components/${route}.html`);
  if (!response.ok) throw new Error(`Unable to load ${route}`);
  const html = await response.text();
  cache.set(route, html);
  return html;
}

function updateTabs(route) {
  document.querySelectorAll('.game-tab').forEach(tab => {
    const active = tab.dataset.route === route;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-current', active ? 'page' : 'false');
  });
}

async function showRoute(route, pushState = true) {
  if (!routes.includes(route)) route = 'home';
  if (route === activeRoute) return;
  screen.classList.add('is-leaving');
  await new Promise(resolve => setTimeout(resolve, activeRoute ? 180 : 0));
  try {
    screen.innerHTML = await loadComponent(route);
    activeRoute = route;
    updateTabs(route);
    bindRouteButtons();
    if (route === 'projects') initProjects();
    screen.classList.remove('is-leaving');
    screen.classList.add('is-arriving');
    requestAnimationFrame(() => requestAnimationFrame(() => screen.classList.remove('is-arriving')));
    if (pushState) history.pushState({ route }, '', `#${route}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    screen.innerHTML = `<section class="error-view"><h1>Connection interrupted</h1><p>Please refresh and try again.</p></section>`;
    screen.classList.remove('is-leaving');
  }
}

function bindRouteButtons() {
  document.querySelectorAll('[data-route]').forEach(button => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', event => {
      event.preventDefault();
      showRoute(button.dataset.route);
    });
  });
}

function projectCard(project, index) {
  return `<button class="project-card card-enter game-press" style="--delay:${index * 65}ms" data-project-id="${project.id}" data-category="${project.category}">
    <img src="${project.image}" alt="${project.title}" width="640" height="400">
    <span class="project-rarity">${project.category}</span>
    <span class="project-play"><svg><use href="#icon-play"/></svg></span>
    <span class="project-info"><span><strong>${project.title}</strong><small>${project.subtitle}</small></span><i><svg><use href="#icon-arrow"/></svg></i></span>
  </button>`;
}

function initProjects() {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const grid = document.querySelector('#project-grid');
  const count = document.querySelector('#project-count');
  const render = filter => {
    const visible = filter === 'all' ? projects : projects.filter(project => project.category === filter);
    grid.classList.add('is-switching');
    setTimeout(() => {
      grid.innerHTML = visible.map(projectCard).join('');
      count.textContent = String(visible.length).padStart(2, '0');
      grid.classList.remove('is-switching');
      grid.querySelectorAll('[data-project-id]').forEach(card => card.addEventListener('click', () => openProject(card.dataset.projectId)));
    }, 140);
  };
  document.querySelectorAll('[data-filter]').forEach(chip => chip.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('is-active', item === chip));
    render(chip.dataset.filter);
  }));
  render('all');
}

function openProject(id) {
  const project = window.PORTFOLIO_PROJECTS.find(item => item.id === id);
  if (!project) return;
  const action = project.videoUrl
    ? `<a class="game-button yellow game-press" href="${project.videoUrl}" target="_blank" rel="noopener">Watch project <svg><use href="#icon-play"/></svg></a>`
    : `<span class="locked-action">🔒 Add videoUrl in data/projects.js</span>`;
  popupContent.innerHTML = `<img class="popup-image" src="${project.image}" alt="${project.title}">
    <span class="panel-kicker">${project.category} · PROJECT UNLOCKED</span><h2>${project.title}</h2><p>${project.description}</p>
    <div class="tag-list">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>${action}`;
  popup.showModal();
}

document.querySelector('.popup-close').addEventListener('click', () => popup.close());
popup.addEventListener('click', event => { if (event.target === popup) popup.close(); });
window.addEventListener('popstate', event => showRoute(event.state?.route || location.hash.slice(1) || 'home', false));
document.querySelector('#year').textContent = new Date().getFullYear();
bindRouteButtons();

Promise.all(routes.map(loadComponent)).finally(() => {
  document.querySelector('#loading').classList.add('is-done');
  showRoute(location.hash.slice(1) || 'home', false);
});
