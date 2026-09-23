window.PORTFOLIO_VIEWS.contact = (site) => {
    const { text, lines, esc, icon, gmail, safeURL, image } = window.P;
    return `
        <div class="contact-layout">
            <div class="contact-intro">
                <div class="page-heading reveal">
                    <p class="eyebrow">
                        <span class="tiny-line">
                        </span> ${esc(text("contact.eyebrow"))}</p>
                    <h1 tabindex="-1">${lines("contact.title")}<br>
                        <em>${esc(text("contact.accent"))}</em>
                        <span class="contact-star" aria-hidden="true">${icon('star')}</span>
                    </h1>
                    <p>${lines("contact.intro")}</p>
                </div>
                <div class="contact-person reveal">
                    <img src="${esc(image(site.avatar))}" alt="" width="48" height="48">
                    <div>
                        <strong>${esc(text("contact.person"))}</strong>
                        <span>
                            <i class="status-dot ${site.available ? '' : 'unavailable'}">
                            </i>${esc(site.available ? site.availability : text('home.unavailable'))}</span>
                    </div>
                </div>
                <div class="social-list reveal">${site.socials.filter((s) => safeURL(s.url)).map((social) => `
        <a href="${esc(safeURL(social.url))}" target="_blank" rel="noopener noreferrer" class="social-link">${icon(social.icon)}<span>${esc(social.name)}</span>${icon('arrow-up')}</a>
    `).join('')}</div>
            </div>
            <div class="contact-card reveal">
                <div class="contact-card-top">
                    <span class="contact-envelope">${icon('mail')}</span>
                    <span class="eyebrow">${esc(text("contact.card"))}</span>
                </div>
                <div class="email-row">
                    <a id="email-link" href="${esc(gmail())}" target="_blank" rel="noopener noreferrer">${esc(site.email)}</a>
                    <button type="button" class="icon-button" data-action="copy-email" aria-label="${esc(text("contact.copyEmail"))}">${icon('copy')}</button>
                </div>
                <div class="contact-divider">
                </div>
                <form id="contact-form">
                    <label class="form-label" for="project-type">${esc(text("contact.type"))}</label>
                    <div class="select-wrap">
                        <select id="project-type" name="project-type">${site.contactTypes.map((type) => `
        <option value="${esc(type)}">${esc(type)}</option>
    `).join('')}</select>
                    </div>
                    <label class="form-label" for="project-brief">${esc(text("contact.brief"))} <span>${esc(text("contact.optional"))}</span>
                    </label><textarea id="project-brief" name="project-brief" rows="3" maxlength="2000" placeholder="${esc(text("contact.placeholder"))}"></textarea><button type="submit" class="button button-primary contact-submit">${esc(text("contact.submit"))} ${icon('arrow-up')}</button>
                    <p class="form-note">${esc(text("contact.note"))}</p>
                    <p id="compose-fallback" class="compose-fallback" hidden>${esc(text("contact.blocked"))} <a href="${esc(gmail())}" target="_blank" rel="noopener noreferrer">${esc(text("contact.fallback"))}</a>
                    </p>
                </form>
                <div class="contact-card-footer">
                    <span>${icon('pin')} ${esc(site.location)}</span>
                    <a href="mailto:${esc(site.email)}">${esc(text("contact.other"))} ${icon('arrow-up')}</a>
                </div>
            </div>
        </div>
    `;
};
