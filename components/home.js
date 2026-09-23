window.PORTFOLIO_VIEWS.home = (site, projects) => {
    const { text, lines, esc, icon, image, position, tags, videoInfo } = window.P;
    const selected = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 3);
    return `
        <div class="home-hero">
            <div class="hero-copy">
                <div class="hero-eyebrow reveal">
                    <span class="tiny-line">
                    </span>
                    <span>${esc(site.role)}</span>
                </div>
                <h1 class="hero-title reveal" tabindex="-1">${esc(site.heroLine)}<br>
                    <em>${esc(site.heroAccent)}</em>
                    <span class="title-period" aria-hidden="true">${icon('star')}</span>
                </h1>
                <p class="hero-description reveal">${esc(site.intro)}</p>
                <div class="hero-actions reveal">
                    <a href="#projects" class="button button-primary">${esc(text("home.explore"))} ${icon('arrow-up')}</a>
                    ${videoInfo(site.showreel) ? `
        <a href="#home/reel" class="button button-quiet">${esc(text("home.reel"))} ${icon('play')}</a>
    ` : `
        <a href="#about" class="button button-quiet">${esc(text("home.creator"))} ${icon('arrow')}</a>
    `}
                </div>
                <div class="hero-specialties reveal">${tags(site.specialties, 'specialty')}</div>
                <div class="availability reveal">
                    <span class="status-dot ${site.available ? '' : 'unavailable'}">
                    </span>
                    <span>${esc(site.available ? site.availability : text('home.unavailable'))}</span>
                    <span class="availability-location">${icon('globe')}${esc(site.location)}</span>
                </div>
            </div>
            <div class="hero-art reveal">
                <div class="orbit-label orbit-label-top" aria-hidden="true">
                    <span class="orbit-tool">Ae</span>
                    <span>${lines("home.orbit")}</span>
                </div>
                <div class="creator-card" data-tilt>
                    <img class="creator-image" src="${esc(image(site.heroImage))}" alt="${esc(text("home.artAlt"))}" width="1672" height="941" fetchpriority="high" style="object-position:${esc(position(site.heroPosition))}">
                    <div class="creator-shade" aria-hidden="true">
                    </div>
                    <div class="creator-topline">
                        <span class="glass-chip">${icon('star')} ${esc(text("home.mode"))}</span>
                        <span class="frame-number">01 <i>/</i> 01</span>
                    </div>
                    <div class="creator-caption">
                        <span class="eyebrow">${esc(text("home.artEyebrow"))}</span>
                        <div>
                            <p>${lines("home.artCaption")}</p>
                            <a href="#projects" class="round-link" aria-label="${esc(text("projects.reset"))}">${icon('arrow-up')}</a>
                        </div>
                    </div>
                    <div class="card-corner corner-tl" aria-hidden="true">
                    </div>
                    <div class="card-corner corner-br" aria-hidden="true">
                    </div>
                </div>
                <div class="orbit-spark" aria-hidden="true">${icon('star')}</div>
                <a class="timeline-card" href="#lab" aria-label="${esc(text("home.labAria"))}">
                    <div class="timeline-top">
                        <span>${icon('film')} ${esc(text("home.labFile"))}</span>
                        <span>${esc(text("home.labTag"))}</span>
                    </div>
                    <div class="timeline-ruler">
                    </div>
                    <div class="timeline-tracks">
                        <div class="track track-one">
                            <i>
                            </i>
                            <i>
                            </i>
                            <i>
                            </i>
                            <i>
                            </i>
                        </div>
                        <div class="track track-two">
                            <i>
                            </i>
                            <i>
                            </i>
                            <i>
                            </i>
                        </div>
                        <span class="playhead">
                        </span>
                    </div>
                    <span class="timeline-invite">${esc(text("home.labInvite"))} ${icon('arrow-up')}</span>
                </a>
            </div>
        </div>
        <div class="home-shelf reveal">
            <div class="shelf-heading">
                <span class="eyebrow">${esc(text("home.shelf"))}</span>
                <a href="#projects">${esc(text("home.selected"))} ${icon('arrow-up')}</a>
            </div>
            <div class="frame-shelf">${selected.map((project, index) => `
        <a href="#projects/${encodeURIComponent(project.id)}" class="mini-project">
            <div class="mini-cover">
                <img src="${esc(image(project.cover))}" alt="" width="160" height="100" loading="lazy" style="object-position:${esc(position(project.coverPosition))}">
            </div>
            <div class="mini-info">
                <span class="mini-category">${String(index + 1).padStart(2, '0')} / ${esc(project.category)}</span>
                <strong>${esc(project.title)}</strong>
            </div>${icon('arrow-up', 'mini-arrow')}
        </a>
    `).join('')}</div>
        </div>
        <a href="#lab" class="lab-invitation reveal">
            <span class="invitation-icon">${icon('lab')}</span>
            <span>
                <strong>${esc(text("home.inviteTitle"))}</strong>
                <span>${esc(text("home.inviteText"))}</span>
            </span>
            <span class="invitation-action">${esc(text("home.inviteAction"))} ${icon('arrow-up')}</span>
        </a>
    `;
};
