window.PORTFOLIO_VIEWS.about = (site) => {
  const { esc, icon, image, tags, tool } = window.P;
  const { about } = site;
  return `
    <div class="about-layout">
      <div class="profile-column reveal"><div class="profile-photo"><img src="${esc(image(site.avatar))}" alt="Portrait of ${esc(site.name)}" width="1086" height="1448" loading="lazy"><div class="profile-photo-shade" aria-hidden="true"></div><span class="photo-corner-label">THE HUMAN<br>BEHIND THE FRAMES</span><div class="photo-caption"><h2>${esc(site.name)}<span>.</span></h2><span>${esc(site.role)}</span></div></div><div class="profile-note">${icon('star')} Always curious. Always creating.</div><div class="interest-tags">${tags(about.interests, 'interest')}</div></div>
      <div class="about-copy"><div class="page-heading reveal"><p class="eyebrow"><span class="tiny-line"></span> MEET THE CREATOR</p><h1 tabindex="-1">${esc(about.title)}<br><em>${esc(about.accent)}</em></h1></div><div class="about-bio reveal">${about.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div>
      <div class="history-list reveal"><article class="history-card"><div class="history-icon">${icon('film')}</div><div><div class="history-meta"><span>THE EXPERIENCE</span><time>${esc(about.experience.dates)}</time></div><h2>${esc(about.experience.company)}</h2><h3>${esc(about.experience.role)}</h3><p>${esc(about.experience.description)}</p></div></article><article class="history-card"><div class="history-icon">${icon('star')}</div><div><div class="history-meta"><span>THE FOUNDATION</span><time>${esc(about.education.dates)}</time></div><h2>${esc(about.education.school)}</h2><h3>${esc(about.education.degree)}</h3><p>${esc(about.education.description)}</p></div></article></div></div>
    </div>
    <section class="toolbox reveal" aria-labelledby="tools-heading"><div class="toolbox-heading"><p class="eyebrow">MY CREATIVE LOADOUT</p><h2 id="tools-heading">Good ideas.<br>The right <em>tools.</em></h2><p>From the first spark<br>to the final export.</p><a class="text-link" href="#contact">Let's build something ${icon('arrow-up')}</a></div><div class="tools-grid">${site.tools.map(tool).join('')}</div></section>`;
};
