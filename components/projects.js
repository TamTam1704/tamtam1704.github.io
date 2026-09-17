window.PORTFOLIO_VIEWS.projectCards = (projects, filter = 'All Work', query = '') => {
  const { esc, icon, image, position, videoInfo, inCategory } = window.P;
  const needle = query.toLowerCase().trim();
  const filtered = projects.filter(p => inCategory(p, filter) && `${p.title} ${p.subtitle} ${(p.tags || []).join(' ')} ${(p.categories || []).join(' ')}`.toLowerCase().includes(needle));
  if (!filtered.length) return `<div class="empty-state"><span class="empty-symbol">${icon('film')}</span><h2>No frames here. Yet.</h2><p>${query ? 'Try another search or explore the full collection.' : `New ${esc(filter === 'All Work' ? '' : filter)} work will have a home here.`}</p><button class="text-button" type="button" data-action="reset-projects">Explore all work ${icon('arrow')}</button></div>`;
  return filtered.map((p, i) => {
    const video = Boolean(videoInfo(p.video));
    return `<a href="#projects/${encodeURIComponent(p.id)}" class="project-card ${filter === 'All Work' && !query && i === 0 ? 'project-card-featured' : ''}" aria-label="${video ? 'Watch' : 'View'} ${esc(p.title)}${p.preview ? ', concept preview' : ''}">
      <img class="project-cover" src="${esc(image(p.cover))}" alt="${esc(p.title)} artwork" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async" width="800" height="450" style="object-position:${esc(position(p.coverPosition))}">
      <div class="project-shade" aria-hidden="true"></div>
      <div class="project-card-top"><span class="project-category">${esc(p.category)}</span><span class="project-status">${p.preview ? 'CONCEPT PREVIEW' : video ? 'WATCH PROJECT' : 'PROJECT DETAILS'}</span></div>
      <div class="project-card-bottom"><div><span class="project-index">${String(i + 1).padStart(2,'0')} / ${esc((p.categories || [p.category]).join(' + '))}</span><h2>${esc(p.title)}</h2><p>${esc(p.subtitle)}</p></div><span class="project-open">${icon(video ? 'play' : 'arrow-up')}</span></div>
    </a>`;
  }).join('');
};
window.PORTFOLIO_VIEWS.projects = (site, projects) => {
  const { esc, icon, categories, inCategory } = window.P;
  return `<div class="page-heading projects-heading reveal"><div><p class="eyebrow"><span class="tiny-line"></span> THE CREATIVE COLLECTION</p><h1 tabindex="-1">Made to <em>move you.</em></h1><p>Motion, worlds, stories. Different formats. The same attention to detail.</p></div><div class="collection-count"><strong>${String(projects.length).padStart(2,'0')}</strong><span>SELECTED<br>PROJECTS</span></div></div>
    <div class="project-toolbar reveal"><div class="filters" role="group" aria-label="Filter projects">${categories.map((c,i) => `<button class="filter ${i ? '' : 'is-active'}" type="button" data-filter="${esc(c)}" aria-pressed="${!i}">${esc(c)}<span>${projects.filter(p => inCategory(p,c)).length}</span></button>`).join('')}</div><div class="view-toggle" role="group" aria-label="Project layout"><button type="button" data-layout="grid" aria-label="Gallery view" aria-pressed="true">${icon('grid')}</button><button type="button" data-layout="list" aria-label="List view" aria-pressed="false">${icon('list')}</button></div></div>
    <div class="collection-meta"><p id="project-results-label">${projects.length} projects &middot; Some work lives in more than one category.</p><label class="inline-search"><span class="sr-only">Search projects</span>${icon('search')}<input id="project-search" type="search" placeholder="Find a project" maxlength="100" autocomplete="off"></label></div>
    <div id="project-grid" class="project-grid ${projects.length === 3 ? 'is-bento' : ''} reveal">${window.PORTFOLIO_VIEWS.projectCards(projects)}</div>
    <p id="filter-announcement" class="sr-only" role="status" aria-live="polite"></p>
    <div class="projects-endnote reveal"><p><span class="status-dot"></span> Your next idea belongs here.</p><a class="text-link" href="#contact">Let's make it happen ${icon('arrow-up')}</a></div>`;
};
