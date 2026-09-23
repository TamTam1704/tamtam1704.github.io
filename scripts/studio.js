(() => {
    'use strict';
    const { esc, icon, image } = window.P;
    const key = 'tamtam-portfolio-v22-draft';
    const defaults = window.PortfolioSchema.normalize(window.PortfolioSchema.defaults);
    const clone = (value) => JSON.parse(JSON.stringify(value));
    let draft = clone(defaults);
    let previewWindow = null;
    let saveTimer = 0;
    let toastTimer = 0;
    let currentTab = 'content';
    const validDraft = (value) => {
        const s = value?.site;
        const hasStrings = (object, keys) => object && keys.every((name) => typeof object[name] === 'string');
        const stringArray = (array) => Array.isArray(array) && array.every((item) => typeof item === 'string');
        return s && hasStrings(s, [
            "name",
            "role",
            "location",
            "availability",
            "heroLine",
            "heroAccent",
            "intro",
            "heroImage",
            "avatar",
            "heroPosition",
            "email"
        ]) &&
            s.theme && hasStrings(s.seo, ['title', 'description']) && stringArray(s.specialties) &&
            hasStrings(s.about, ['title', 'accent']) && stringArray(s.about.paragraphs) && s.about.paragraphs.length >= 1 && stringArray(s.about.interests) &&
            hasStrings(s.about.experience, [
                "company",
                "dates",
                "role",
                "description"
            ]) && hasStrings(s.about.education, [
            "school",
            "dates",
            "degree",
            "description"
        ]) &&
            Array.isArray(s.socials) && s.socials.every((item) => hasStrings(item, ['name', 'url', 'icon'])) &&
            Array.isArray(s.tools) && s.tools.every((item) => hasStrings(item, [
            "name",
            "mark",
            "color",
            "background",
            "icon"
        ])) &&
            Array.isArray(value.projects) && value.projects.every((p) => hasStrings(p, [
            "id",
            "title",
            "category",
            "subtitle",
            "cover",
            "coverPosition",
            "description",
            "video",
            "aspect",
            "link"
        ]) && stringArray(p.tags) && stringArray(p.tools) && (!p.categories || stringArray(p.categories))) &&
            (!value.lab || (Array.isArray(value.lab) && value.lab.every(t => hasStrings(t, [
                "id",
                "title",
                "topic",
                "kind",
                "summary",
                "body"
            ]) && stringArray(t.steps))));
    };
    try {
        const saved = JSON.parse(localStorage.getItem(key) || 'null');
        if (validDraft(saved)) {
            draft = window.PortfolioSchema.normalize(saved);
        }
    }
    catch (_) {
    }
    const get = (path) => path.split('.').reduce((value, part) => value?.[part], draft);
    const set = (path, value) => {
        const parts = path.split('.');
        const prop = parts.pop();
        const parent = parts.reduce((node, part) => node[part], draft);
        parent[prop] = value;
    };
    const field = (label, path, options = {}) => {
        const raw = get(path) ?? '';
        const value = options.lines && Array.isArray(raw) ? raw.join('\n') : raw;
        const id = `field-${path.replace(/\./g, '-')}`;
        const body = options.textarea ? `
        <textarea id="${id}" data-field="${path}" ${options.list ? 'data-list="true"' : ''} ${options.lines ? 'data-lines="true"' : ''} rows="${options.rows || 3}">${esc(options.list ? (Array.isArray(value) ? value.join(', ') : value) : value)}</textarea>
    ` : options.select ? `
        <select id="${id}" data-field="${path}">${options.select.map((option) => `
        <option value="${esc(option)}" ${value === option ? 'selected' : ''}>${esc(option)}</option>
    `).join('')}</select>
    ` : `
        <input id="${id}" type="${options.type || 'text'}" data-field="${path}" ${options.list ? 'data-list="true"' : ''} value="${esc(options.list ? (Array.isArray(value) ? value.join(', ') : value) : value)}" ${options.placeholder ? `placeholder="${esc(options.placeholder)}"` : ''}>
    `;
        return `
        <label class="editor-field ${options.wide ? 'wide' : ''}" for="${id}">
            <span>${esc(label)}</span>${body}${options.help ? `
        <small>${esc(options.help)}</small>
    ` : ''}</label>
    `;
    };
    const check = (label, path) => `
        <label class="editor-check">
            <input type="checkbox" data-field="${path}" ${get(path) ? 'checked' : ''}>${esc(label)}</label>
    `;
    const sectionCard = (title, subtitle, fields) => `
        <div class="editor-card">
            <div class="editor-card-heading">
                <h2>${title}</h2>
                <span>${subtitle}</span>
            </div>
            <div class="field-grid">${fields}</div>
        </div>
    `;
    // A media input accepts a relative path, a direct image URL, or a local upload.
    const mediaField = (label, path, options = {}) => `
        <div class="editor-media-field ${options.wide ? 'wide' : ''}">
            ${field(label, path, {
        ...options,
        wide: false
    })}
            <div class="editor-media-actions">
                <label class="upload-media">${icon('plus')} Choose file
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-upload-for="${path}">
                </label>
                ${get(path) ? `
        <img class="editor-media-preview" src="${esc(image(get(path)))}" alt="Media preview" loading="lazy">
    ` : ''}
            </div>
        </div>
    `;
    function renderContent() {
        const paragraphs = draft.site.about.paragraphs.join('\n\n');
        document.getElementById('editor-content').innerHTML =
            sectionCard('The introduction', 'HOME', field('Your name', 'site.name') + field('Brand word (without final dot)', 'site.brand') +
                field('Role', 'site.role') + field('Location', 'site.location') +
                field('Headline, first line', 'site.heroLine') + field('Headline, highlighted line', 'site.heroAccent') +
                field('Introduction', 'site.intro', {
                    textarea: true,
                    wide: true
                }) +
                mediaField('Hero image', 'site.heroImage', {
                    help: 'Relative asset path, direct image URL, or Choose file.'
                }) +
                mediaField('Avatar image', 'site.avatar') +
                field('Hero crop position', 'site.heroPosition', {
                    help: 'Example: 78% center or 50% 50%'
                }) +
                field('Availability text', 'site.availability') + check('Available for projects', 'site.available') +
                field('Specialties (commas)', 'site.specialties', {
                    list: true,
                    wide: true
                }) +
                field('Showreel URL (optional)', 'site.showreel', {
                    wide: true,
                    help: 'YouTube, Vimeo, or a direct MP4/WebM. Leave blank to hide the reel button.'
                }) +
                mediaField('Showreel poster', 'site.showreelPoster', {
                    wide: true
                })) +
                sectionCard('The person behind the work', 'ABOUT', field('Heading', 'site.about.title') + field('Highlighted heading', 'site.about.accent') + `
        <label class="editor-field wide" for="about-paragraphs">
            <span>About paragraphs (blank line between paragraphs)</span><textarea id="about-paragraphs" data-field="site.about.paragraphs" data-paragraphs="true" rows="6">${esc(paragraphs)}</textarea></label>
    ` +
                    field('Interests (commas)', 'site.about.interests', {
                        list: true,
                        wide: true
                    })) +
                sectionCard('Experience & education', 'ABOUT', field('Company', 'site.about.experience.company') + field('Work dates', 'site.about.experience.dates') +
                    field('Job title', 'site.about.experience.role', {
                        wide: true
                    }) + field('Work description', 'site.about.experience.description', {
                    textarea: true,
                    wide: true
                }) +
                    field('School', 'site.about.education.school') + field('Study dates', 'site.about.education.dates') +
                    field('Degree', 'site.about.education.degree', {
                        wide: true
                    }) + field('Education description', 'site.about.education.description', {
                    textarea: true,
                    wide: true
                })) +
                sectionCard('Contact & social links', 'CONTACT', field('Email address', 'site.email', {
                    type: 'email',
                    wide: true
                }) +
                    field('Project types (one option per line)', 'site.contactTypes', {
                        textarea: true,
                        lines: true,
                        wide: true
                    }) +
                    draft.site.socials.map((social, index) => `
        <div class="editor-social-row wide">
            ${field('Social name', `site.socials.${index}.name`)}
            ${field('Description / label', `site.socials.${index}.label`)}
            ${field('URL', `site.socials.${index}.url`, {
                        wide: true
                    })}
            ${field('Icon', `site.socials.${index}.icon`, {
                        select: [
                            "linkedin",
                            "behance",
                            "instagram",
                            "globe",
                            "film",
                            "mail"
                        ]
                    })}
            <button type="button" class="text-button" data-studio="remove-social" data-index="${index}">Remove link</button>
        </div>
    `).join('') + `
        <button type="button" class="text-button" data-studio="add-social">${icon('plus')} Add social link</button>
    `) +
                sectionCard('Browser title & sharing', 'METADATA', field('Site title', 'site.seo.title', {
                    wide: true
                }) + field('Description', 'site.seo.description', {
                    textarea: true,
                    wide: true
                }) +
                    field('Published site URL', 'site.seo.url', {
                        wide: true,
                        help: 'Used for copied links and sharing. Example: https://your-name.github.io/'
                    }) +
                    mediaField('Social preview image', 'site.seo.socialImage', {
                        wide: true
                    })) + `
        <p class="editor-help">Navigation, buttons, section headings, empty states, and the eye controller labels are in <strong>Text & labels</strong>. Text is treated as plain text, not HTML.</p>
    `;
    }
    function renderProjects() {
        const opened = new Set(Array.from(document.querySelectorAll('[data-project-id][open]'), (node) => node.dataset.projectId));
        document.getElementById('studio-count').textContent = draft.projects.length;
        document.getElementById('editor-projects').innerHTML = `
        <div class="project-editor-heading">
            <h2>Your collection <em>(${draft.projects.length})</em>
            </h2>
            <button type="button" data-studio="add-project">${icon('plus')} Add project</button>
        </div>
        <p class="editor-help">Expand a project to edit it. Video slots accept a normal YouTube link. Design is always an image gallery. Choose file embeds your selected image in the local draft and includes it in the exported update.</p>
    ` +
            draft.projects.map((project, index) => `
        <details class="editor-card editor-fold" data-editor-project="${index}" data-project-id="${esc(project.id)}" ${opened.has(project.id) || (!opened.size && index === 0) ? 'open' : ''}>
            <summary class="editor-card-heading">
                <div class="editor-project-title">
                    <img src="${esc(image(project.cover))}" alt="" width="74" height="45">
                    <div>
                        <h2 data-project-heading="${index}">${esc(project.title)}</h2>
                        <p>${esc(project.category)} / ${project.mediaType === 'gallery' ? 'IMAGE GALLERY' : 'VIDEO'}</p>
                    </div>
                </div>
                <span class="fold-indicator">EDIT +</span>
            </summary>
            <div class="field-grid">
                ${field('Title', `projects.${index}.title`)}
                ${field('Primary category', `projects.${index}.category`, {
                select: window.P.categories.slice(1)
            })}
                <fieldset class="editor-categories wide">
                    <legend>Additional filters</legend>
                    ${window.P.categories.slice(1).filter((category) => category !== 'Design' || project.mediaType === 'gallery').map((category) => `
        <label class="editor-check">
            <input type="checkbox" data-project-category="${index}" value="${esc(category)}" ${(project.categories || []).includes(category) ? 'checked' : ''} ${category === project.category ? 'disabled' : ''}>${esc(category)}</label>
    `).join('')}
                </fieldset>
                ${field('URL identifier', `projects.${index}.id`, {
                help: 'Unique lowercase ID, e.g. flower-sort. Use hyphens, not spaces.'
            })}
                ${field('Subtitle', `projects.${index}.subtitle`)}
                ${mediaField('Cover image', `projects.${index}.cover`, {
                help: 'Card thumbnail and the video poster. This is separate from the gallery images.'
            })}
                ${field('Cover crop', `projects.${index}.coverPosition`)}
                ${field('Description', `projects.${index}.description`, {
                textarea: true,
                wide: true
            })}
                ${project.category === 'Design' ? `
        <p class="editor-help wide">Design uses images. No video player is rendered for this category.</p>
    ` : field('Media type', `projects.${index}.mediaType`, {
                select: ['video', 'gallery'],
                wide: true
            })}
                ${project.mediaType === 'video' ? `
              ${field('YouTube / video URL', `projects.${index}.video`, {
                wide: true,
                placeholder: 'https://youtu.be/0Nb1wj0NeP8',
                help: 'Paste a normal YouTube URL. Short, watch, embed, and Shorts links are supported; no API key needed.'
            })}
              ${field('Video aspect ratio', `projects.${index}.aspect`, {
                select: ['16/9', '9/16', '1/1']
            })}` : `
        <div class="editor-gallery wide">
            <h3>Gallery images</h3>
            <p>First image opens first. Captions and alt text are optional; descriptive alt text is recommended.</p>
            ${project.images.map((entry, imageIndex) => `
        <div class="editor-gallery-row">
            ${mediaField(`Image ${imageIndex + 1}`, `projects.${index}.images.${imageIndex}.src`, {
                wide: true
            })}
            ${field('Alternative text', `projects.${index}.images.${imageIndex}.alt`)}
            ${field('Caption', `projects.${index}.images.${imageIndex}.caption`)}
            <div class="editor-gallery-actions wide">
                <button type="button" class="text-button" data-studio="gallery-up" data-project="${index}" data-index="${imageIndex}" ${imageIndex === 0 ? 'disabled' : ''}>Move earlier</button>
                <button type="button" class="text-button" data-studio="gallery-down" data-project="${index}" data-index="${imageIndex}" ${imageIndex === project.images.length - 1 ? 'disabled' : ''}>Move later</button>
                <button type="button" class="text-button" data-studio="gallery-remove" data-project="${index}" data-index="${imageIndex}">Remove image</button>
            </div>
        </div>
    `).join('')}
            <button type="button" class="text-button" data-studio="gallery-add" data-project="${index}">${icon('plus')} Add image</button>
        </div>
    `}
                ${field('External project URL (optional)', `projects.${index}.link`, {
                wide: true
            })}
                ${field('Creative focus tags (commas)', `projects.${index}.tags`, {
                list: true
            })}
                ${field('Tools (commas)', `projects.${index}.tools`, {
                list: true
            })}
                ${field('The brief (optional)', `projects.${index}.caseStudy.brief`, {
                textarea: true,
                wide: true
            })}
                ${field('Your role (optional)', `projects.${index}.caseStudy.role`, {
                textarea: true,
                wide: true
            })}
                ${field('The approach (optional)', `projects.${index}.caseStudy.process`, {
                textarea: true,
                wide: true
            })}
                ${field('The outcome (optional)', `projects.${index}.caseStudy.outcome`, {
                textarea: true,
                wide: true,
                help: 'Only publish verified outcomes. Empty sections are hidden.'
            })}
                ${mediaField('Before image (optional)', `projects.${index}.compare.before`)}
                ${mediaField('After image (optional)', `projects.${index}.compare.after`)}
                ${field('Before label', `projects.${index}.compare.beforeLabel`)}
                ${field('After label', `projects.${index}.compare.afterLabel`)}
            </div>
            <div class="project-editor-controls">
                ${check('Sample project', `projects.${index}.preview`)}${check('Featured on Home', `projects.${index}.featured`)}
                <div class="editor-project-order">
                    <button type="button" data-studio="move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>Move up</button>
                    <button type="button" data-studio="move-down" data-index="${index}" ${index === draft.projects.length - 1 ? 'disabled' : ''}>Move down</button>
                    <button type="button" data-studio="remove-project" data-index="${index}" aria-label="Remove ${esc(project.title)}">${icon('trash')}</button>
                </div>
            </div>
        </details>
    `).join('');
    }
    function renderLab() {
        const opened = new Set(Array.from(document.querySelectorAll('[data-note-id][open]'), (node) => node.dataset.noteId));
        document.getElementById('editor-lab').innerHTML = sectionCard('Your creative notebook', 'LAB', field('Heading', 'site.lab.title') + field('Highlighted heading', 'site.lab.accent') +
            field('Introduction', 'site.lab.intro', {
                textarea: true,
                wide: true
            }) +
            check('Show the interactive eye controller', 'site.lab.showPlayground')) + `
        <div class="project-editor-heading">
            <h2>Your notes <em>(${draft.lab.length})</em>
            </h2>
            <button type="button" data-studio="add-note">${icon('plus')} Add note</button>
        </div>
        <p class="editor-help">GIFs appear beside the note on desktop and above the text on mobile. Add a still poster for Pause GIF and reduced motion. Unpublished notes are removed from public lab.js; content.json is a private backup.</p>
    ` +
            draft.lab.map((note, index) => `
        <details class="editor-card editor-fold" data-editor-note="${index}" data-note-id="${esc(note.id)}" ${opened.has(note.id) || (!opened.size && index === 0) ? 'open' : ''}>
            <summary class="editor-card-heading">
                <div>
                    <h2>${esc(note.title)}</h2>
                    <span>${esc(note.topic)} / ${note.published ? 'PUBLISHED' : 'LOCAL DRAFT'}</span>
                </div>
                <span class="fold-indicator">EDIT +</span>
            </summary>
            <div class="field-grid">
                ${field('Title', `lab.${index}.title`, {
                wide: true
            })}
                ${field('URL identifier', `lab.${index}.id`, {
                help: 'Unique lowercase words joined with hyphens.'
            })}
                ${field('Topic', `lab.${index}.topic`, {
                select: [
                    "After Effects",
                    "Blender",
                    "Workflow",
                    "Plugins"
                ]
            })}
                ${field('Note type', `lab.${index}.kind`)}
                ${field('Decorative card illustration', `lab.${index}.visual`, {
                select: [
                    "curves",
                    "loop",
                    "glow",
                    "render",
                    "workflow",
                    "plugins"
                ]
            })}
                ${field('Short introduction', `lab.${index}.summary`, {
                textarea: true,
                wide: true
            })}
                ${mediaField('GIF demo (direct .gif URL or file)', `lab.${index}.demoGif`, {
                wide: true,
                help: 'Use the direct image URL, not a Giphy page link. Or choose a local GIF file.'
            })}
                ${mediaField('Still poster for the GIF', `lab.${index}.demoPoster`, {
                wide: true,
                help: 'PNG/JPG/WebP shown while paused. Optional; without it a text placeholder is shown.'
            })}
                ${field('Demo alt text', `lab.${index}.demoAlt`, {
                wide: true
            })}
                ${field('Demo caption', `lab.${index}.demoCaption`, {
                textarea: true,
                wide: true
            })}
                ${field('Reference / tested version', `lab.${index}.version`, {
                wide: true
            })}
                ${field('Body (blank line between paragraphs)', `lab.${index}.body`, {
                textarea: true,
                wide: true,
                rows: 6
            })}
                ${field('Steps (one per line)', `lab.${index}.steps`, {
                textarea: true,
                lines: true,
                wide: true,
                rows: 5
            })}
                ${field('Copyable code (optional)', `lab.${index}.code`, {
                textarea: true,
                wide: true,
                rows: 5
            })}
                ${field('Source title', `lab.${index}.sourceTitle`)}${field('Official source URL', `lab.${index}.sourceURL`)}
                ${field('Tutorial video URL (optional)', `lab.${index}.video`)}
                ${field('Resource URL (optional)', `lab.${index}.downloadURL`, {
                help: 'Only share resources you own or are licensed to distribute.'
            })}
            </div>
            <div class="project-editor-controls">
                ${check('Published', `lab.${index}.published`)}${check('Starter / sample note', `lab.${index}.sample`)}
                <div class="editor-project-order">
                    <button type="button" data-studio="note-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>Move up</button>
                    <button type="button" data-studio="note-down" data-index="${index}" ${index === draft.lab.length - 1 ? 'disabled' : ''}>Move down</button>
                    <button type="button" data-studio="remove-note" data-index="${index}" aria-label="Remove ${esc(note.title)}">${icon('trash')}</button>
                </div>
            </div>
        </details>
    `).join('');
    }
    function renderTools() {
        document.getElementById('editor-tools').innerHTML = sectionCard('Set the default mood', 'APPEARANCE', field('Default accent', 'site.theme.accent', {
            select: ['lime', 'ice', 'lilac']
        }) + check('Enable subtle motion', 'site.theme.motion')) + `
        <div class="project-editor-heading">
            <h2>Your toolkit</h2>
            <button type="button" data-studio="add-tool">${icon('plus')} Add tool</button>
        </div>
    ` +
            draft.site.tools.map((item, index) => sectionCard(esc(item.name), `TOOL ${index + 1}`, field('Tool name', `site.tools.${index}.name`) + field('Fallback mark / icon name', `site.tools.${index}.mark`) +
                mediaField('Logo (optional)', `site.tools.${index}.icon`, {
                    wide: true
                }) +
                field('Icon color', `site.tools.${index}.color`, {
                    type: 'color'
                }) + field('Background color', `site.tools.${index}.background`, {
                type: 'color'
            }) + `
        <button type="button" class="text-button" data-studio="remove-tool" data-index="${index}">Remove tool</button>
    `)).join('');
    }
    function renderCopy() {
        document.getElementById('editor-copy').innerHTML = `
        <div class="project-editor-heading">
            <h2>Every little word.</h2>
        </div>
        <p class="editor-help">Edit navigation, headings, buttons, controller labels, and messages. Keep tokens such as {count}, {title}, {name}, and {category}: the website fills them in. Line breaks are supported where the original text uses them.</p>
        <label class="editor-field copy-search">
            <span>Find a label</span>
            <input type="search" id="copy-search" placeholder="Search text, section, or key...">
        </label>
    ` +
            Object.entries(draft.site.copy).map(([group, values]) => `
        <details class="editor-card editor-fold copy-group" data-copy-group="${esc(group)}">
            <summary class="editor-card-heading">
                <h2>${esc(group.replace(/([A-Z])/g, ' $1'))}</h2>
                <span>${Object.keys(values).length} LABELS</span>
            </summary>
            <div class="field-grid">
                ${Object.keys(values).map((name) => `
        <div class="copy-entry wide" data-copy-search="${esc((group + ' ' + name + ' ' + values[name]).toLowerCase())}">${field(name.replace(/([A-Z])/g, ' $1'), `site.copy.${group}.${name}`, {
                textarea: values[name].length > 85 || values[name].includes('\n'),
                wide: true,
                help: `site.copy.${group}.${name}`
            })}</div>
    `).join('')}
            </div>
        </details>
    `).join('');
    }
    const fillIcons = () => document.querySelectorAll('[data-icon]').forEach((node) => {
        node.innerHTML = icon(node.dataset.icon);
    });
    const render = () => {
        window.PORTFOLIO_ASSETS = draft.assets;
        window.PORTFOLIO_SITE = draft.site;
        renderContent();
        renderProjects();
        renderTools();
        renderLab();
        renderCopy();
        fillIcons();
        setTab(currentTab);
    };
    function setTab(tab) {
        currentTab = tab;
        [
            "content",
            "projects",
            "lab",
            "tools",
            "copy"
        ].forEach((name) => {
            document.getElementById(`editor-${name}`).hidden = name !== tab;
        });
        document.querySelectorAll('[data-tab]').forEach((node) => {
            const active = node.dataset.tab === tab;
            node.classList.toggle('is-active', active);
            node.setAttribute('aria-pressed', String(active));
        });
    }
    const toast = (message) => {
        const node = document.getElementById('toast');
        clearTimeout(toastTimer);
        node.textContent = message;
        node.classList.add('is-visible');
        toastTimer = setTimeout(() => node.classList.remove('is-visible'), 3800);
    };
    function save() {
        try {
            localStorage.setItem(key, JSON.stringify(draft));
            document.getElementById('save-state').textContent = 'Draft saved in this browser.';
        }
        catch (_) {
            document.getElementById('save-state').textContent = 'Storage unavailable. Export before closing this page.';
        }
        if (previewWindow && !previewWindow.closed) {
            previewWindow.postMessage({
                type: 'TAM_DRAFT_RESPONSE',
                draft
            }, location.protocol === 'file:' ? '*' : location.origin);
        }
    }
    function validate() {
        const seen = new Set();
        for (const project of draft.projects) {
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) {
                return `Use a lowercase, hyphen-separated URL identifier for "${project.title}".`;
            }
            if (seen.has(project.id)) {
                return `The identifier "${project.id}" is repeated. Give each project a unique ID.`;
            }
            if (!project.title.trim() || !project.category.trim()) {
                return 'Every project needs a title and category.';
            }
            seen.add(project.id);
        }
        for (const note of draft.lab) {
            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.id) || !note.title.trim()) {
                return 'Every note needs a title and a lowercase, hyphen-separated ID.';
            }
            if (seen.has('lab:' + note.id)) {
                return `Duplicate note ID: ${note.id}`;
            }
            seen.add('lab:' + note.id);
        }
        if (!draft.site.name.trim()) {
            return 'Please enter your name.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.site.email)) {
            return 'Please check your email address.';
        }
        return '';
    }
    function openPreview() {
        const issue = validate();
        if (issue) {
            toast(issue);
            return;
        }
        save();
        previewWindow = window.open(`index.html?draft=1#${currentTab === 'lab' ? 'lab' : currentTab === 'projects' ? 'projects' : currentTab === 'tools' ? 'about' : 'home'}`, 'tam-portfolio-draft');
        if (!previewWindow) {
            toast('Allow popups for this page, then try Preview draft again.');
        }
    }
    window.addEventListener('message', (event) => {
        if (!previewWindow || event.source !== previewWindow || event.data?.type !== 'TAM_DRAFT_REQUEST') {
            return;
        }
        if (location.protocol !== 'file:' && event.origin !== location.origin) {
            return;
        }
        previewWindow.postMessage({
            type: 'TAM_DRAFT_RESPONSE',
            draft
        }, location.protocol === 'file:' ? '*' : location.origin);
    });
    // Small ZIP writer (stored files, UTF-8 paths). No external dependency or upload.
    function zipFiles(files) {
        const encoder = new TextEncoder();
        const crcTable = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++)
                c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            crcTable[n] = c >>> 0;
        }
        const crc32 = (bytes) => {
            let crc = 0xffffffff;
            for (const byte of bytes)
                crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
            return (crc ^ 0xffffffff) >>> 0;
        };
        const locals = [], centrals = [];
        let offset = 0, centralSize = 0;
        const now = new Date();
        const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
        const dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
        for (const file of files) {
            const name = encoder.encode(file.name), bytes = file.bytes || encoder.encode(file.text || ''), crc = crc32(bytes);
            const local = new Uint8Array(30 + name.length), lv = new DataView(local.buffer);
            lv.setUint32(0, 0x04034b50, true);
            lv.setUint16(4, 20, true);
            lv.setUint16(6, 0x0800, true);
            lv.setUint16(10, dosTime, true);
            lv.setUint16(12, dosDate, true);
            lv.setUint32(14, crc, true);
            lv.setUint32(18, bytes.length, true);
            lv.setUint32(22, bytes.length, true);
            lv.setUint16(26, name.length, true);
            local.set(name, 30);
            const central = new Uint8Array(46 + name.length), cv = new DataView(central.buffer);
            cv.setUint32(0, 0x02014b50, true);
            cv.setUint16(4, 20, true);
            cv.setUint16(6, 20, true);
            cv.setUint16(8, 0x0800, true);
            cv.setUint16(12, dosTime, true);
            cv.setUint16(14, dosDate, true);
            cv.setUint32(16, crc, true);
            cv.setUint32(20, bytes.length, true);
            cv.setUint32(24, bytes.length, true);
            cv.setUint16(28, name.length, true);
            cv.setUint32(42, offset, true);
            central.set(name, 46);
            locals.push(local, bytes);
            centrals.push(central);
            offset += local.length + bytes.length;
            centralSize += central.length;
        }
        const end = new Uint8Array(22), ev = new DataView(end.buffer);
        ev.setUint32(0, 0x06054b50, true);
        ev.setUint16(8, files.length, true);
        ev.setUint16(10, files.length, true);
        ev.setUint32(12, centralSize, true);
        ev.setUint32(16, offset, true);
        return new Blob([...locals, ...centrals, end], {
            type: 'application/zip'
        });
    }
    function exportUpdate() {
        const issue = validate();
        if (issue) {
            toast(issue);
            return;
        }
        save();
        const encode = (object) => JSON.stringify(object, null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
        const files = [
            {
                name: 'data/site.js',
                text: `/* Exported from Tam Content Studio. */\nwindow.PORTFOLIO_SITE = ${encode(draft.site)};\n`
            },
            {
                name: 'data/projects.js',
                text: `/* Exported from Tam Content Studio. */\nwindow.PORTFOLIO_PROJECTS = ${encode(draft.projects)};\n`
            },
            {
                name: 'data/lab.js',
                text: `/* Exported from tamtam Content Studio. Published notes only. */\nwindow.PORTFOLIO_LAB = ${encode(draft.lab.filter(t => t.published))};\n`
            },
            {
                name: 'content.json',
                text: JSON.stringify(draft, null, 2)
            },
            {
                name: 'READ-ME.txt',
                text: '1. Back up your current data folder.\n2. Replace data/site.js, data/projects.js and data/lab.js in your website with the exported files.\n3. Add any new image/video files to the paths you entered.\n4. Commit the changed files to your GitHub Pages repository.\n5. content.json can be imported into studio.html to resume editing. Keep content.json offline: it may include unpublished notes. Upload the three files in data/ and any exported assets/uploads/ files. Keep content.json offline.\n\nNew images or GIFs chosen in Studio are included in assets/uploads/. Existing media and the full website source are not duplicated in this update.\nSearch/social metadata in index.html is static for crawlers; also edit its meta tags after changing your name/domain/description.\n'
            }
        ];
        // Include only uploaded assets referenced by public content; never leak unpublished-note uploads.
        const used = new Set();
        const collect = (value) => {
            if (typeof value === 'string' && Object.prototype.hasOwnProperty.call(draft.assets, value)) {
                used.add(value);
            }
            else if (Array.isArray(value)) {
                value.forEach(collect);
            }
            else if (value && typeof value === 'object') {
                Object.values(value).forEach(collect);
            }
        };
        collect({
            site: draft.site,
            projects: draft.projects,
            lab: draft.lab.filter((note) => note.published)
        });
        for (const path of used) {
            const payload = draft.assets[path].split(',')[1];
            files.push({
                name: path,
                bytes: Uint8Array.from(atob(payload), (char) => char.charCodeAt(0))
            });
        }
        const objectURL = URL.createObjectURL(zipFiles(files));
        const a = document.createElement('a');
        a.href = objectURL;
        a.download = 'tamtam-content-update.zip';
        a.click();
        setTimeout(() => URL.revokeObjectURL(objectURL), 5000);
        toast('Update exported. Replace the files in your data folder to publish.');
    }
    document.addEventListener('input', (event) => {
        if (event.target.id === 'copy-search') {
            const query = event.target.value.trim().toLowerCase();
            document.querySelectorAll('.copy-group').forEach((group) => {
                let matched = 0;
                group.querySelectorAll('.copy-entry').forEach((entry) => {
                    entry.hidden = !entry.dataset.copySearch.includes(query);
                    if (!entry.hidden) {
                        matched++;
                    }
                });
                group.hidden = !matched;
                if (query && matched) {
                    group.open = true;
                }
            });
            return;
        }
        const categoryInput = event.target.closest('[data-project-category]');
        if (categoryInput) {
            const p = draft.projects[Number(categoryInput.dataset.projectCategory)];
            p.categories = Array.from(document.querySelectorAll(`[data-project-category="${categoryInput.dataset.projectCategory}"]:checked`), el => el.value);
            if (!p.categories.includes(p.category)) {
                p.categories.push(p.category);
            }
            save();
            return;
        }
        const input = event.target.closest('[data-field]');
        if (!input) {
            return;
        }
        let value = input.type === 'checkbox' ? input.checked : input.value;
        if (input.dataset.paragraphs) {
            value = value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
        }
        if (input.dataset.lines) {
            value = value.split('\n').map(item => item.trim()).filter(Boolean);
        }
        if (input.dataset.list) {
            value = value.split(',').map((item) => item.trim()).filter(Boolean);
        }
        set(input.dataset.field, value);
        const catMatch = input.dataset.field.match(/^projects\.(\d+)\.category$/);
        if (catMatch) {
            const p = draft.projects[Number(catMatch[1])];
            p.categories = [value, ...p.categories.filter(c => c !== value)];
            document.querySelectorAll(`[data-project-category="${catMatch[1]}"]`).forEach(el => {
                el.disabled = el.value === value;
            });
            const box = document.querySelector(`[data-project-category="${catMatch[1]}"][value="${value}"]`);
            if (box) {
                box.checked = true;
            }
            if (value === 'Design') {
                p.mediaType = 'gallery';
            }
            renderProjects();
        }
        const mediaMatch = input.dataset.field.match(/^projects\.(\d+)\.mediaType$/);
        if (mediaMatch) {
            const project = draft.projects[Number(mediaMatch[1])];
            if (project.category === 'Design') {
                project.mediaType = 'gallery';
            }
            if (project.mediaType === 'video') {
                project.categories = project.categories.filter((category) => category !== 'Design');
            }
            renderProjects();
        }
        const titleMatch = input.dataset.field.match(/^projects\.(\d+)\.title$/);
        if (titleMatch) {
            document.querySelector(`[data-project-heading="${titleMatch[1]}"]`).textContent = value;
        }
        document.getElementById('save-state').textContent = 'Saving local draft...';
        clearTimeout(saveTimer);
        saveTimer = setTimeout(save, 350);
    });
    document.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) {
            return;
        }
        if (target.dataset.tab) {
            setTab(target.dataset.tab);
            return;
        }
        const index = Number(target.dataset.index);
        switch (target.dataset.studio) {
            case 'preview':
                openPreview();
                break;
            case 'export':
                exportUpdate();
                break;
            case 'add-project': {
                let n = draft.projects.length + 1;
                while (draft.projects.some((p) => p.id === `new-project-${n}`))
                    n++;
                draft.projects.push({
                    mediaType: 'video',
                    images: [],
                    id: `new-project-${n}`,
                    title: 'New project',
                    category: 'Motion',
                    categories: ['Motion'],
                    caseStudy: {
                        brief: '',
                        role: '',
                        process: '',
                        outcome: ''
                    },
                    compare: {
                        before: '',
                        after: '',
                        beforeLabel: 'Before',
                        afterLabel: 'After'
                    },
                    subtitle: 'A new story starts here.',
                    cover: 'assets/hero.webp',
                    coverPosition: '78% 50%',
                    description: '',
                    tags: [],
                    tools: [],
                    preview: true,
                    featured: false,
                    video: '',
                    aspect: '16/9',
                    link: ''
                });
                renderProjects();
                save();
                document.querySelector('[data-editor-project]:last-child')?.setAttribute('open', '');
                document.querySelector('[data-editor-project]:last-child')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                break;
            }
            case 'remove-project':
                // Two clicks prevent accidentally losing a filled project.
                if (target.dataset.confirm !== 'true') {
                    target.dataset.confirm = 'true';
                    target.setAttribute('aria-label', 'Confirm removal');
                    target.innerHTML = icon('check');
                    toast('Click the checkmark again to remove this project.');
                    return;
                }
                draft.projects.splice(index, 1);
                renderProjects();
                save();
                break;
            case 'move-up':
                if (index > 0) {
                    [draft.projects[index - 1], draft.projects[index]] = [draft.projects[index], draft.projects[index - 1]];
                    renderProjects();
                    save();
                }
                break;
            case 'move-down':
                if (index < draft.projects.length - 1) {
                    [draft.projects[index + 1], draft.projects[index]] = [draft.projects[index], draft.projects[index + 1]];
                    renderProjects();
                    save();
                }
                break;
            case 'add-note': {
                let n = draft.lab.length + 1;
                while (draft.lab.some(t => t.id === `new-note-${n}`))
                    n++;
                draft.lab.push({
                    demoGif: '',
                    demoPoster: '',
                    demoAlt: '',
                    demoCaption: '',
                    id: `new-note-${n}`,
                    title: 'New note',
                    topic: 'After Effects',
                    kind: 'Quick tip',
                    visual: 'curves',
                    summary: '',
                    version: '',
                    body: '',
                    steps: [],
                    code: '',
                    sourceTitle: '',
                    sourceURL: '',
                    video: '',
                    downloadURL: '',
                    sample: true,
                    published: false
                });
                renderLab();
                save();
                document.querySelector('[data-editor-note]:last-child')?.setAttribute('open', '');
                document.querySelector('[data-editor-note]:last-child')?.scrollIntoView({
                    block: 'start'
                });
                break;
            }
            case 'remove-note':
                if (target.dataset.confirm !== 'true') {
                    target.dataset.confirm = 'true';
                    target.setAttribute('aria-label', 'Confirm removal');
                    target.innerHTML = icon('check');
                    toast('Click the checkmark again to remove this note.');
                    return;
                }
                draft.lab.splice(index, 1);
                renderLab();
                save();
                break;
            case 'note-up':
                if (index > 0) {
                    [draft.lab[index - 1], draft.lab[index]] = [draft.lab[index], draft.lab[index - 1]];
                    renderLab();
                    save();
                }
                break;
            case 'note-down':
                if (index < draft.lab.length - 1) {
                    [draft.lab[index + 1], draft.lab[index]] = [draft.lab[index], draft.lab[index + 1]];
                    renderLab();
                    save();
                }
                break;
            case 'gallery-add': {
                const project = draft.projects[Number(target.dataset.project)];
                project.images.push({
                    src: '',
                    alt: '',
                    caption: ''
                });
                renderProjects();
                save();
                break;
            }
            case 'gallery-remove': {
                draft.projects[Number(target.dataset.project)].images.splice(index, 1);
                renderProjects();
                save();
                break;
            }
            case 'gallery-up':
            case 'gallery-down': {
                const entries = draft.projects[Number(target.dataset.project)].images;
                const next = index + (target.dataset.studio === 'gallery-up' ? -1 : 1);
                if (next >= 0 && next < entries.length) {
                    [entries[index], entries[next]] = [entries[next], entries[index]];
                    renderProjects();
                    save();
                }
                break;
            }
            case 'add-social':
                draft.site.socials.push({
                    name: 'Website',
                    label: '',
                    url: '',
                    icon: 'globe'
                });
                renderContent();
                save();
                break;
            case 'remove-social':
                draft.site.socials.splice(index, 1);
                renderContent();
                save();
                break;
            case 'add-tool':
                draft.site.tools.push({
                    name: 'New tool',
                    mark: 'T',
                    color: '#d5f66b',
                    background: '#263320',
                    icon: ''
                });
                renderTools();
                save();
                break;
            case 'remove-tool':
                draft.site.tools.splice(index, 1);
                renderTools();
                save();
                break;
            case 'reset':
                document.getElementById('reset-dialog').showModal();
                break;
            case 'cancel-reset':
                document.getElementById('reset-dialog').close();
                break;
            case 'confirm-reset':
                draft = clone(defaults);
                render();
                save();
                document.getElementById('reset-dialog').close();
                toast('Local draft reset. Your website files were not changed.');
                break;
            default: break;
        }
    });
    document.addEventListener('change', async (event) => {
        const input = event.target.closest('[data-upload-for]');
        if (!input) {
            return;
        }
        const file = input.files?.[0];
        if (!file) {
            return;
        }
        try {
            const allowed = {
                'image/png': 'png',
                'image/jpeg': 'jpg',
                'image/webp': 'webp',
                'image/gif': 'gif'
            };
            if (!allowed[file.type]) {
                throw new Error('Choose a PNG, JPG, WebP, or GIF image.');
            }
            if (file.size > 8 * 1024 * 1024) {
                throw new Error('Use an image under 8 MB. Optimize large GIFs first.');
            }
            const used = Object.values(draft.assets).reduce((total, value) => total + value.length * 0.75, 0);
            if (used + file.size > 24 * 1024 * 1024) {
                throw new Error('This draft already holds many uploads. Export it before adding more; use an asset path for large media.');
            }
            const data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('The file could not be read.'));
                reader.readAsDataURL(file);
            });
            const stem = file.name.replace(/\.[^.]+$/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 45) || 'image';
            const path = 'assets/uploads/' + stem + '-' + Date.now().toString(36) + '.' + allowed[file.type];
            draft.assets[path] = data;
            set(input.dataset.uploadFor, path);
            render();
            save();
            toast('Media added to this draft. Export update includes the selected file.');
        }
        catch (error) {
            toast(error.message || 'The image could not be added.');
        }
    });
    addEventListener('pagehide', () => {
        clearTimeout(saveTimer);
        save();
    });
    document.getElementById('import-json').addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        try {
            if (file.size > 40 * 1024 * 1024) {
                throw new Error('This file is too large. Import the exported content.json, not media files.');
            }
            const imported = JSON.parse(await file.text());
            if (!validDraft(imported)) {
                throw new Error('This is not a valid content.json from this portfolio.');
            }
            draft = window.PortfolioSchema.normalize(imported);
            render();
            save();
            toast('Content imported into your local draft.');
        }
        catch (error) {
            toast(error.message || 'The file could not be imported.');
        }
        event.target.value = '';
    });
    render();
    save();
    window.TamStudio = Object.freeze({
        exportUpdate,
        zipFiles,
        getDraft: () => clone(draft)
    });
})();
