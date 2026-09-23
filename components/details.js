/* Accessible project and note dialogs. All visible copy is editable in Content Studio. */
(() => {
    'use strict';
    const { esc, icon, image, position, videoInfo, safeURL, tags, text, isGallery, galleryImages, categoryLabel } = window.P;
    const paragraphs = (value) => String(value || '').split(/\n\s*\n/).filter(Boolean)
        .map((paragraph) => `
        <p>${esc(paragraph)}</p>
    `).join('');
    function projectMedia(project) {
        if (isGallery(project)) {
            const images = galleryImages(project);
            const first = images[0];
            return `
        <section class="project-gallery" aria-label="${esc(project.title)}">
            <div id="media-stage" class="media-stage gallery-stage">
                <img id="gallery-image" src="${esc(image(first.src))}"
                alt="${esc(first.alt || text('projectDetail.imageAlt', {
                title: project.title,
                index: 1
            }))}">
                ${images.length > 1 ? `
        <button type="button" class="gallery-arrow gallery-prev" data-gallery-step="-1" aria-label="${esc(text('projectDetail.previousImage'))}">${icon('arrow')}</button>
        <button type="button" class="gallery-arrow gallery-next" data-gallery-step="1" aria-label="${esc(text('projectDetail.nextImage'))}">${icon('arrow')}</button>
    ` : ''}
            </div>
            <div class="gallery-caption-row" aria-live="polite" aria-atomic="true">
                <p id="gallery-caption">${esc(first.caption)}</p>
                <span id="gallery-count">${esc(text('projectDetail.imageCount', {
                index: 1,
                count: images.length
            }))}</span>
            </div>
            ${images.length > 1 ? `
        <div class="gallery-thumbnails" role="group" aria-label="${esc(text('projects.gallery'))}">
            ${images.map((entry, index) => `
        <button type="button" data-gallery-index="${index}" aria-pressed="${index === 0}"
        aria-label="${esc(text('projectDetail.imageSelect', {
                index: index + 1
            }))}">
        <img src="${esc(image(entry.src))}" alt="" width="96" height="64" loading="lazy">
        </button>
    `).join('')}
        </div>
    ` : ''}
        </section>
    `;
        }
        const media = videoInfo(project.video);
        return `
        <div id="media-stage" class="media-stage ${media ? 'has-video' : ''} ${project.aspect === '9/16' ? 'portrait' : ''} ${project.aspect === '1/1' ? 'square' : ''}">
            <img src="${esc(image(project.cover))}" alt="${esc(project.title)}"
            style="object-position:${esc(position(project.coverPosition))}" width="960" height="540">
            ${media ? `
        <button class="media-play" type="button" data-action="play-video">${icon('play')} ${esc(text('projectDetail.play'))}</button>
    ` : `
        <span class="media-preview-note">${esc(text('projectDetail.artwork'))}</span>
    `}
        </div>
        ${media ? `
        <div class="media-source-row">
            <p>${esc(text('projectDetail.videoHelp'))}</p>
            <a class="text-link" href="${esc(media.original)}" target="_blank" rel="noopener noreferrer">
                ${esc(text('projectDetail.openVideo'))} ${icon('arrow-up')}
            </a>
        </div>
    ` : ''}
    `;
    }
    window.PORTFOLIO_VIEWS.projectDetail = (project, projects) => {
        const external = safeURL(project.link);
        const index = projects.findIndex((item) => item.id === project.id);
        const next = projects[(index + 1) % projects.length];
        const caseStudy = project.caseStudy || {};
        const comparison = project.compare || {};
        const sections = [
            "brief",
            "role",
            "process",
            "outcome"
        ].filter((key) => caseStudy[key]);
        return `
        <div class="modal-header">
            <p class="eyebrow">${icon(isGallery(project) ? 'grid' : 'film')} ${esc(categoryLabel(project.category))} / ${esc(text(project.preview ? 'projectDetail.sample' : 'projectDetail.details'))}</p>
            <div class="modal-header-actions">
                <button class="icon-button" data-action="share" type="button" aria-label="${esc(text('projectDetail.copy'))}">${icon('copy')}</button>
                <button class="icon-button" data-action="close-project" type="button" aria-label="${esc(text('projectDetail.close'))}">${icon('close')}</button>
            </div>
        </div>
        ${projectMedia(project)}
        <div class="modal-body">
            <div>
                <h2 id="project-title">${esc(project.title)}</h2>
                <p class="modal-subtitle">${esc(project.subtitle)}</p>
                <div class="modal-description">${paragraphs(project.description)}</div>
                ${project.preview ? `
        <p class="preview-disclaimer">${esc(text('projectDetail.sampleNote'))}</p>
    ` : ''}
                ${!isGallery(project) && project.video && !videoInfo(project.video) ? `
        <p class="preview-disclaimer">${esc(text('projectDetail.invalidVideo'))}</p>
    ` : ''}
            </div>
            <aside class="modal-meta">
                <h3>${esc(text('projectDetail.focus'))}</h3>
                <div class="modal-tags">${tags(project.tags)}</div>
                ${project.tools?.length ? `
        <h3>${esc(text('projectDetail.tools'))}</h3>
        <p>${project.tools.map(esc).join(' &middot; ')}</p>
    ` : ''}
                ${external ? `
        <h3>${esc(text('projectDetail.more'))}</h3>
        <a class="text-link" href="${esc(external)}" target="_blank" rel="noopener noreferrer">${esc(text('projectDetail.external'))} ${icon('arrow-up')}</a>
    ` : ''}
            </aside>
        </div>
        ${sections.length ? `
        <section class="case-study" aria-label="${esc(text('projectDetail.behind'))}">
            <p class="eyebrow">${esc(text(project.preview ? 'projectDetail.direction' : 'projectDetail.behind'))}</p>
            <div class="case-grid">${sections.map((key, sectionIndex) => `
        <div>
            <span class="case-index">${String(sectionIndex + 1).padStart(2, '0')}</span>
            <h3>${esc(text('projectDetail.' + key))}</h3>${paragraphs(caseStudy[key])}
        </div>
    `).join('')}
            </div>
        </section>
    ` : ''}
        ${comparison.before && comparison.after ? `
        <section class="comparison-section" aria-labelledby="compare-heading">
            <div class="section-mini-heading">
                <h3 id="compare-heading">${esc(text('projectDetail.compareHeading'))}</h3>
                <span>${esc(text('projectDetail.compareHint'))}</span>
            </div>
            <div class="image-comparison" style="--split:50%">
                <img src="${esc(image(comparison.after))}" alt="${esc(comparison.afterLabel)}" width="960" height="540">
                <img class="comparison-before" src="${esc(image(comparison.before))}" alt="${esc(comparison.beforeLabel)}" width="960" height="540">
                <span class="compare-label before">${esc(comparison.beforeLabel)}</span>
                <span class="compare-label after">${esc(comparison.afterLabel)}</span>
                <span class="comparison-line" aria-hidden="true">
                </span>
            </div>
            <label class="compare-slider-label" for="compare-slider">${esc(text('projectDetail.reveal', {
            label: comparison.beforeLabel
        }))} <output id="compare-value">50%</output>
            </label>
            <input id="compare-slider" type="range" min="0" max="100" value="50" aria-label="${esc(text('projectDetail.compareLabel'))}">
        </section>
    ` : ''}
        <div class="modal-footer">
            <button class="text-button" type="button" data-action="close-project">${esc(text('projectDetail.back'))}</button>
            ${next && projects.length > 1 && index >= 0 ? `
        <a class="text-link" href="#projects/${encodeURIComponent(next.id)}">${esc(text('projectDetail.next', {
            title: next.title
        }))} ${icon('arrow')}</a>
    ` : `
        <a class="text-link" href="#contact">${esc(text('projectDetail.contact'))} ${icon('arrow-up')}</a>
    `}
        </div>
    `;
    };
    window.PORTFOLIO_VIEWS.tipDemo = (tip) => {
        const playing = document.documentElement.dataset.motion !== 'off';
        const hasGif = Boolean(tip.demoGif?.trim());
        return `
        <figure class="tip-demo" data-tip-demo data-playing="${hasGif && playing}">
            <div class="tip-demo-heading">
                <span>${esc(text('tip.demo'))}</span>${hasGif ? `
        <button type="button" class="text-button" data-action="toggle-tip-demo" aria-pressed="${playing}">${icon(playing ? 'pause' : 'play')} ${esc(text(playing ? 'tip.pause' : 'tip.play'))}</button>
    ` : ''}</div>
            <div class="tip-demo-stage">
                ${hasGif ? `
        <img id="tip-demo-image" ${playing || tip.demoPoster ? `src="${esc(image(playing ? tip.demoGif : tip.demoPoster))}"` : 'hidden'}
        alt="${esc(tip.demoAlt || tip.title)}" width="512" height="320">
        <div class="tip-demo-placeholder" ${playing || tip.demoPoster ? 'hidden' : ''}>${icon('play')}<p>${esc(text('tip.paused'))}</p>
        </div>
    ` : `
        <div class="tip-demo-placeholder">${icon('film')}<p>${esc(text('tip.noDemo'))}</p>
        </div>
    `}
            </div>
            ${tip.demoCaption ? `
        <figcaption>${esc(tip.demoCaption)}</figcaption>
    ` : ''}
        </figure>
    `;
    };
    window.PORTFOLIO_VIEWS.tipDetail = (tip, saved, tips) => {
        const source = safeURL(tip.sourceURL);
        const download = safeURL(tip.downloadURL, true);
        const media = videoInfo(tip.video);
        const related = tips.find((item) => item.id !== tip.id && item.topic === tip.topic && item.published !== false)
            || tips.find((item) => item.id !== tip.id && item.published !== false);
        const minutes = Math.max(1, Math.ceil(`${tip.body} ${(tip.steps || []).join(' ')}`.split(/\s+/).length / 180));
        return `
        <div class="modal-header">
            <a class="text-link" href="#lab">${icon('lab')} ${esc(text('tip.lab'))}</a>
            <div class="modal-header-actions">
                <button class="icon-button save-note" type="button" data-save-note="${esc(tip.id)}" aria-pressed="${saved.includes(tip.id)}" aria-label="${esc(text(saved.includes(tip.id) ? 'tip.unsave' : 'tip.save'))}">${icon('bookmark')}</button>
                <button class="icon-button" type="button" data-action="share" aria-label="${esc(text('tip.copy'))}">${icon('copy')}</button>
                <button class="icon-button" type="button" data-action="close-tip" aria-label="${esc(text('tip.close'))}">${icon('close')}</button>
            </div>
        </div>
        <article class="tip-article">
            <header class="tip-heading">
                <p class="eyebrow">${esc(tip.topic)} / ${esc(tip.kind)}</p>
                <h2 id="tip-title">${esc(tip.title)}</h2>
                <p>${esc(tip.summary)}</p>
                <div class="tip-reading-meta">
                    <span>${icon('clock')} ${esc(text('tip.reading', {
            minutes
        }))}</span>${tip.version ? `
        <span>${esc(tip.version)}</span>
    ` : ''}</div>
            </header>
            <div class="reader-grid">
                <div class="reader-body">
                    ${paragraphs(tip.body)}
                    ${tip.steps?.length ? `
        <h3>${esc(text('tip.try'))}</h3>
        <ol class="tip-steps">${tip.steps.map((step) => `
        <li>${esc(step)}</li>
    `).join('')}</ol>
    ` : ''}
                    ${tip.code ? `
        <div class="code-block">
            <div>
                <span>${esc(text('tip.snippet'))}</span>
                <button type="button" class="text-button" data-action="copy-tip-code">${esc(text('tip.copyCode'))} ${icon('copy')}</button>
            </div><pre tabindex="0"><code>${esc(tip.code)}</code></pre></div>
    ` : ''}
                    ${media ? `
        <a class="button button-quiet" href="${esc(media.original)}" target="_blank" rel="noopener noreferrer">${esc(text('tip.original'))} ${icon('arrow-up')}</a>
    ` : ''}
                </div>
                <aside class="reader-aside">
                    ${window.PORTFOLIO_VIEWS.tipDemo(tip)}
                    <p class="eyebrow">${esc(text('tip.more'))}</p>
                    ${source ? `
        <a class="reference-link" href="${esc(source)}" target="_blank" rel="noopener noreferrer">${esc(tip.sourceTitle || text('tip.reference'))} ${icon('arrow-up')}</a>
    ` : `
        <p>${esc(text('tip.addSource'))}</p>
    `}
                    ${download ? `
        <a class="reference-link" href="${esc(download)}" target="_blank" rel="noopener noreferrer">${esc(text('tip.resource'))} ${icon('download')}</a>
    ` : ''}
                    ${tip.sample ? `
        <p class="starter-note">${esc(text('tip.sample'))}</p>
    ` : ''}
                </aside>
            </div>
        </article>
        <div class="modal-footer">
            <button type="button" class="text-button" data-action="close-tip">${esc(text('tip.back'))}</button>
            ${related ? `
        <a class="text-link" href="#lab/${encodeURIComponent(related.id)}">${esc(text('tip.another'))} ${icon('arrow')}</a>
    ` : ''}
        </div>
    `;
    };
})();
