/* Project data lives in data/projects.js. Design projects open an image gallery. */
window.PORTFOLIO_VIEWS.projectCards = (projects, filter = 'All Work', query = '') => {
    const { esc, icon, image, position, videoInfo, inCategory, isGallery, text, categoryLabel } = window.P;
    const needle = query.toLowerCase().trim();
    const filtered = projects.filter((p) => inCategory(p, filter)
        && `${p.title} ${p.subtitle} ${(p.tags || []).join(' ')} ${(p.categories || []).join(' ')}`.toLowerCase().includes(needle));
    if (!filtered.length) {
        return `
        <div class="empty-state">
            <span class="empty-symbol">${icon('film')}</span>
            <h2>${esc(text('projects.emptyTitle'))}</h2>
            <p>${esc(query ? text('projects.emptySearch') : text('projects.emptyCategory', {
            category: filter === 'All Work' ? '' : categoryLabel(filter)
        }))}</p>
            <button class="text-button" type="button" data-action="reset-projects">
                ${esc(text('projects.reset'))} ${icon('arrow')}
            </button>
        </div>
    `;
    }
    return filtered.map((project, index) => {
        const video = !isGallery(project) && Boolean(videoInfo(project.video));
        const label = project.preview ? text('projects.sample') : text(video ? 'projects.video' : 'projects.gallery');
        return `
        <a href="#projects/${encodeURIComponent(project.id)}"
        class="project-card"
        aria-label="${esc(text(video ? 'projects.watch' : 'projects.view'))} ${esc(project.title)}">
        <img class="project-cover" src="${esc(image(project.cover))}" alt="${esc(project.title)}"
        loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async" width="800" height="450"
        style="object-position:${esc(position(project.coverPosition))}">
        <div class="project-shade" aria-hidden="true">
        </div>
        <div class="project-card-top">
            <span class="project-category">${esc(categoryLabel(project.category))}</span>
            <span class="project-status">${esc(label)}</span>
        </div>
        <div class="project-card-bottom">
            <div>
                <span class="project-index">${String(index + 1).padStart(2, '0')} / ${esc((project.categories || [project.category]).map(categoryLabel).join(' + '))}</span>
                <h2>${esc(project.title)}</h2>
                <p>${esc(project.subtitle)}</p>
            </div>
            <span class="project-open">${icon(video ? 'play' : 'grid')}</span>
        </div>
        </a>
    `;
    }).join('');
};
window.PORTFOLIO_VIEWS.projects = (site, projects) => {
    const { esc, icon, categories, inCategory, text, lines, categoryLabel } = window.P;
    return `
        <div class="page-heading projects-heading reveal">
            <div>
                <p class="eyebrow">
                    <span class="tiny-line">
                    </span>${esc(text('projects.eyebrow'))}</p>
                <h1 tabindex="-1">${esc(text('projects.title'))} <em>${esc(text('projects.accent'))}</em>
                </h1>
                <p>${esc(text('projects.intro'))}</p>
            </div>
            <div class="collection-count">
                <strong>${String(projects.length).padStart(2, '0')}</strong>
                <span>${lines('projects.countLabel')}</span>
            </div>
        </div>
        <div class="project-toolbar reveal">
            <div class="filters" role="group" aria-label="${esc(text('projects.filterLabel'))}">
                ${categories.map((category, index) => `
        <button class="filter ${index ? '' : 'is-active'}" type="button" data-filter="${esc(category)}" aria-pressed="${!index}">
            ${esc(categoryLabel(category))}<span>${projects.filter((project) => inCategory(project, category)).length}</span>
        </button>
    `).join('')}
            </div>
            <div class="view-toggle" role="group" aria-label="${esc(text('projects.layoutLabel'))}">
                <button type="button" data-layout="grid" aria-label="${esc(text('projects.grid'))}" aria-pressed="true">${icon('grid')}</button>
                <button type="button" data-layout="list" aria-label="${esc(text('projects.list'))}" aria-pressed="false">${icon('list')}</button>
            </div>
        </div>
        <div class="collection-meta">
            <p id="project-results-label">${esc(text('projects.results', {
        count: projects.length,
        category: categoryLabel('All Work')
    }))}</p>
            <label class="inline-search">
                <span class="sr-only">${esc(text('projects.searchLabel'))}</span>${icon('search')}
                <input id="project-search" type="search" placeholder="${esc(text('projects.searchPlaceholder'))}" maxlength="100" autocomplete="off">
            </label>
        </div>
        <div id="project-grid" class="project-grid reveal">${window.PORTFOLIO_VIEWS.projectCards(projects)}</div>
        <p id="filter-announcement" class="sr-only" role="status" aria-live="polite">
        </p>
        <div class="projects-endnote reveal">
            <p>
                <span class="status-dot">
                </span>${esc(text('projects.endnote'))}</p>
            <a class="text-link" href="#contact">${esc(text('projects.contact'))} ${icon('arrow-up')}</a>
        </div>
    `;
};
