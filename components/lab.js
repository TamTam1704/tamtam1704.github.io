/* Every visual here is lightweight, native UI. Nothing autoplays. */
window.PORTFOLIO_VIEWS.labArt = (type) => {
    const { icon, text, esc } = window.P;
    if (type === 'curves') {
        return `
        <svg viewBox="0 0 240 110" fill="none" aria-hidden="true">
            <path d="M25 90H218M25 90V14" stroke="currentColor" opacity=".15"/>
            <path d="M27 88 213 19" stroke="currentColor" stroke-dasharray="4 5" opacity=".25"/>
            <path d="M27 88C97 88 67 18 213 18" stroke="currentColor" stroke-width="3"/>
            <circle cx="27" cy="88" r="5" fill="currentColor"/>
            <circle cx="213" cy="18" r="5" fill="currentColor"/>
        </svg>
    `;
    }
    if (type === 'loop') {
        return `
        <span class="loop-glyph" aria-hidden="true">&infin;</span>
        <span class="art-caption">${esc(text("lab.loopCaption"))}</span>
    `;
    }
    if (type === 'glow') {
        return `
        <span class="glow-orb" aria-hidden="true">
        </span>
        <span class="art-caption">${esc(text("lab.glowCaption"))}</span>
    `;
    }
    if (type === 'render') {
        return `
        <span class="render-cubes" aria-hidden="true">
            <i>
            </i>
            <i>
            </i>
            <i>
            </i>
        </span>
        <span class="art-caption">${esc(text("lab.renderCaption"))}</span>
    `;
    }
    if (type === 'plugins') {
        return `
        <span class="plugin-stack" aria-hidden="true">
            <i>${icon('plus')}</i>
            <i>${icon('lab')}</i>
            <i>${icon('check')}</i>
        </span>
    `;
    }
    return `
        <span class="workflow-files" aria-hidden="true">
            <i>${esc(text("lab.workflowSource"))}</i>
            <i>${esc(text("lab.workflowComps"))}</i>
            <i>${esc(text("lab.workflowDelivery"))} <b>&check;</b>
            </i>
        </span>
    `;
};
window.PORTFOLIO_VIEWS.labCards = (tips, topic = 'All Notes', query = '', saved = [], onlySaved = false) => {
    const { esc, icon, text } = window.P;
    const raw = query.trim().toLowerCase();
    const needle = raw === 'ae' ? 'after effects' : raw;
    const filtered = tips.filter(t => t.published !== false && (topic === 'All Notes' || t.topic === topic) && (!onlySaved || saved.includes(t.id)) && `${t.title} ${t.topic} ${t.summary} ${t.kind}`.toLowerCase().includes(needle));
    if (!filtered.length) {
        return `
        <div class="empty-state">
            <span class="empty-symbol">${icon('book')}</span>
            <h2>${esc(text(onlySaved ? 'lab.emptySavedTitle' : 'lab.emptyTitle'))}</h2>
            <p>${esc(text(onlySaved ? 'lab.emptySavedBody' : 'lab.emptyBody'))}</p>
            <button class="text-button" type="button" data-action="reset-lab">${esc(text("lab.reset"))} ${icon('arrow')}</button>
        </div>
    `;
    }
    return filtered.map((t, i) => `
        <article class="note-card">
            <a class="note-art art-${esc(t.visual)}" href="#lab/${encodeURIComponent(t.id)}" aria-label="${esc(text('lab.read'))}: ${esc(t.title)}">${window.PORTFOLIO_VIEWS.labArt(t.visual)}<span class="note-number">${String(i + 1).padStart(2, '0')}</span>
            </a>
            <div class="note-copy">
                <div class="note-meta">
                    <span>${esc(t.topic)}</span>
                    <span>${esc(t.kind)}</span>
                </div>
                <h3>
                    <a href="#lab/${encodeURIComponent(t.id)}">${esc(t.title)}</a>
                </h3>
                <p>${esc(t.summary)}</p>
                <div class="note-bottom">
                    <a class="text-link" href="#lab/${encodeURIComponent(t.id)}">${esc(text("lab.read"))} ${icon('arrow-up')}</a>
                    <button type="button" class="save-note" data-save-note="${esc(t.id)}" aria-pressed="${saved.includes(t.id)}" aria-label="${esc(text(saved.includes(t.id) ? 'lab.unsave' : 'lab.save'))} ${esc(t.title)}">${icon('bookmark')}</button>
                </div>
            </div>
        </article>
    `).join('');
};
window.PORTFOLIO_VIEWS.lab = (site, projects, tips) => {
    const { esc, icon, text, lines, topicLabel } = window.P;
    const topics = [
        "All Notes",
        "After Effects",
        "Blender",
        "Workflow",
        "Plugins"
    ];
    const config = site.lab;
    return `
        <div class="page-heading lab-heading reveal">
            <div>
                <p class="eyebrow">
                    <span class="tiny-line">
                    </span>${esc(text('lab.eyebrow'))}</p>
                <h1 tabindex="-1">${esc(config.title)}<br>
                    <em>${esc(config.accent)}</em>
                </h1>
                <p>${esc(config.intro)}</p>
            </div>
            <div class="lab-stamp" aria-hidden="true">${icon('lab')}<span>${lines('lab.stamp')}</span>
            </div>
        </div>
        ${config.showPlayground ? window.PORTFOLIO_VIEWS.eyeLab() : ''}
        <section class="lab-notes" aria-labelledby="notes-heading">
            <div class="notes-heading">
                <div>
                    <p class="eyebrow">${esc(text('lab.notebook'))}</p>
                    <h2 id="notes-heading">${esc(text('lab.notesTitle'))} <em>${esc(text('lab.notesAccent'))}</em>
                    </h2>
                </div>
                <label class="inline-search">
                    <span class="sr-only">${esc(text('lab.searchLabel'))}</span>${icon('search')}<input id="lab-search" type="search" placeholder="${esc(text('lab.searchPlaceholder'))}" maxlength="100" autocomplete="off">
                </label>
            </div>
            <div class="lab-toolbar">
                <div class="filters" role="group" aria-label="${esc(text('lab.filterLabel'))}">
                    ${topics.map((topic, index) => `
        <button type="button" class="filter ${index ? '' : 'is-active'}" data-topic="${esc(topic)}" aria-pressed="${!index}">${esc(topicLabel(topic))}</button>
    `).join('')}
                </div>
                <button type="button" class="saved-filter" data-action="saved-notes" aria-pressed="false">${icon('bookmark')} ${esc(text('lab.saved'))}<span id="saved-count">0</span>
                </button>
            </div>
            <div id="lab-grid" class="lab-grid">${window.PORTFOLIO_VIEWS.labCards(tips)}</div>
            <p id="lab-announcement" class="sr-only" role="status" aria-live="polite">
            </p>
            <p class="lab-editorial-note">${esc(text('lab.editorial'))}</p>
        </section>
    `;
};
