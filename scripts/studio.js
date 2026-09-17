(() => {
  'use strict';
  const { esc, icon, image } = window.P;
  const key = 'tamtam-portfolio-v4-draft';
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
    return s && hasStrings(s, ['name', 'role', 'location', 'availability', 'heroLine', 'heroAccent', 'intro', 'heroImage', 'avatar', 'heroPosition', 'email']) &&
      s.theme && hasStrings(s.seo, ['title', 'description']) && stringArray(s.specialties) &&
      hasStrings(s.about, ['title', 'accent']) && stringArray(s.about.paragraphs) && s.about.paragraphs.length >= 2 && stringArray(s.about.interests) &&
      hasStrings(s.about.experience, ['company', 'dates', 'role', 'description']) && hasStrings(s.about.education, ['school', 'dates', 'degree', 'description']) &&
      Array.isArray(s.socials) && s.socials.every((item) => hasStrings(item, ['name', 'url', 'icon'])) &&
      Array.isArray(s.tools) && s.tools.every((item) => hasStrings(item, ['name', 'mark', 'color', 'background', 'icon'])) &&
      Array.isArray(value.projects) && value.projects.every((p) => hasStrings(p, ['id', 'title', 'category', 'subtitle', 'cover', 'coverPosition', 'description', 'video', 'aspect', 'link']) && stringArray(p.tags) && stringArray(p.tools) && (!p.categories || stringArray(p.categories))) &&
      (!value.lab || (Array.isArray(value.lab) && value.lab.every(t=>hasStrings(t,['id','title','topic','kind','summary','body']) && stringArray(t.steps))));
  };
  try { const saved = JSON.parse(localStorage.getItem(key) || localStorage.getItem('tam-portfolio-v3-draft') || 'null'); if (validDraft(saved)) draft = window.PortfolioSchema.normalize(saved); } catch (_) { /* Editing and export still work without browser storage. */ }

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
    const body = options.textarea ? `<textarea id="${id}" data-field="${path}" ${options.list ? 'data-list="true"' : ''} ${options.lines ? 'data-lines="true"' : ''} rows="${options.rows || 3}">${esc(options.list ? (Array.isArray(value) ? value.join(', ') : value) : value)}</textarea>` : options.select ? `<select id="${id}" data-field="${path}">${options.select.map((option) => `<option value="${esc(option)}" ${value === option ? 'selected' : ''}>${esc(option)}</option>`).join('')}</select>` : `<input id="${id}" type="${options.type || 'text'}" data-field="${path}" ${options.list ? 'data-list="true"' : ''} value="${esc(options.list ? (Array.isArray(value) ? value.join(', ') : value) : value)}" ${options.placeholder ? `placeholder="${esc(options.placeholder)}"` : ''}>`;
    return `<label class="editor-field ${options.wide ? 'wide' : ''}" for="${id}"><span>${esc(label)}</span>${body}${options.help ? `<small>${esc(options.help)}</small>` : ''}</label>`;
  };
  const check = (label, path) => `<label class="editor-check"><input type="checkbox" data-field="${path}" ${get(path) ? 'checked' : ''}>${esc(label)}</label>`;
  const sectionCard = (title, subtitle, fields) => `<div class="editor-card"><div class="editor-card-heading"><h2>${title}</h2><span>${subtitle}</span></div><div class="field-grid">${fields}</div></div>`;
  function renderContent() {
    document.getElementById('editor-content').innerHTML =
      sectionCard('The introduction', 'HOME',
        field('Your name', 'site.name') + field('Brand word (without final dot)', 'site.brand') + field('Role', 'site.role') + field('Showreel poster', 'site.showreelPoster') + field('Showreel URL (optional)', 'site.showreel', {wide:true,help:'YouTube, Vimeo or a direct MP4/WebM. Leave blank until your real reel is ready. The button stays hidden.'}) +
        field('Headline, first line', 'site.heroLine') + field('Headline, highlighted line', 'site.heroAccent') +
        field('Introduction', 'site.intro', { textarea: true, wide: true }) +
        field('Hero image path', 'site.heroImage', { help: 'Example: assets/hero.webp' }) + field('Avatar image path', 'site.avatar', { help: 'Example: assets/avatar.webp' }) +
        field('Hero crop position', 'site.heroPosition', { help: 'Example: 78% center or 50% 50%' }) + field('Location', 'site.location') +
        field('Availability text', 'site.availability') + check('Available for projects', 'site.available') +
        field('Specialties (separate with commas)', 'site.specialties', { list: true, wide: true })) +
      sectionCard('The person behind the work', 'ABOUT',
        field('Heading', 'site.about.title') + field('Highlighted heading', 'site.about.accent') +
        field('About paragraph 1', 'site.about.paragraphs.0', { textarea: true, wide: true }) + field('About paragraph 2', 'site.about.paragraphs.1', { textarea: true, wide: true }) +
        field('Interests (separate with commas)', 'site.about.interests', { list: true, wide: true })) +
      sectionCard('Experience & education', 'ABOUT',
        field('Company', 'site.about.experience.company') + field('Work dates', 'site.about.experience.dates') +
        field('Job title', 'site.about.experience.role', { wide: true }) + field('Work description', 'site.about.experience.description', { textarea: true, wide: true }) +
        field('School', 'site.about.education.school') + field('Study dates', 'site.about.education.dates') +
        field('Degree', 'site.about.education.degree', { wide: true }) + field('Education description', 'site.about.education.description', { textarea: true, wide: true })) +
      sectionCard('Say hello', 'CONTACT',
        field('Email address', 'site.email', { type: 'email', wide: true }) +
        draft.site.socials.map((social, index) => field(`${social.name} URL`, `site.socials.${index}.url`, { wide: true })).join('')) +
      sectionCard('Browser title & search description', 'METADATA',
        field('Site title', 'site.seo.title', { wide: true }) + field('Description', 'site.seo.description', { textarea: true, wide: true }));
  }
  function renderProjects() {
    document.getElementById('studio-count').textContent = draft.projects.length;
    document.getElementById('editor-projects').innerHTML = `<div class="project-editor-heading"><h2>Your collection <em>(${draft.projects.length})</em></h2><button type="button" data-studio="add-project">${icon('plus')} Add project</button></div>` + draft.projects.map((project, index) => `<div class="editor-card" data-editor-project="${index}"><div class="editor-card-heading"><div class="editor-project-title"><img src="${esc(image(project.cover))}" alt="" width="74" height="45"><div><h2 data-project-heading="${index}">${esc(project.title)}</h2><p>Project ${String(index + 1).padStart(2, '0')}</p></div></div><button type="button" class="icon-button" data-studio="remove-project" data-index="${index}" aria-label="Remove ${esc(project.title)}">${icon('trash')}</button></div><div class="field-grid">${
      field('Title', `projects.${index}.title`) + field('Primary category', `projects.${index}.category`, {select:window.P.categories.slice(1)}) + `<fieldset class="editor-categories wide"><legend>Additional filters</legend>${window.P.categories.slice(1).map(c=>`<label class="editor-check"><input type="checkbox" data-project-category="${index}" value="${esc(c)}" ${(project.categories || []).includes(c) ? 'checked' : ''} ${c===project.category?'disabled title="Primary category is always included"':''}>${esc(c)}</label>`).join('')}</fieldset>` +
      field('URL identifier', `projects.${index}.id`, { help: 'Unique lowercase ID, e.g. flower-sort. No spaces.' }) + field('Subtitle', `projects.${index}.subtitle`) +
      field('Cover image path', `projects.${index}.cover`, { help: 'Example: assets/my-project.webp' }) + field('Cover crop', `projects.${index}.coverPosition`) +
      field('Description', `projects.${index}.description`, { textarea: true, wide: true }) +
      field('Video URL or file path', `projects.${index}.video`, { wide: true, help: 'Direct .mp4/.webm, YouTube or Vimeo. Leave empty for artwork only; no inactive Play button.' }) +
      field('Video aspect ratio', `projects.${index}.aspect`, { select: ['16/9', '9/16', '1/1'] }) +
      field('External project URL (optional)', `projects.${index}.link`) +
      field('Creative focus tags (commas)', `projects.${index}.tags`, { list: true }) +
      field('Tools (commas)', `projects.${index}.tools`, { list: true }) +
      field('The brief (optional)', `projects.${index}.caseStudy.brief`, {textarea:true,wide:true}) + field('Your role (optional)', `projects.${index}.caseStudy.role`, {textarea:true,wide:true}) + field('The approach (optional)', `projects.${index}.caseStudy.process`, {textarea:true,wide:true}) + field('The outcome (optional)', `projects.${index}.caseStudy.outcome`, {textarea:true,wide:true,help:'Use verified outcomes only. Empty sections are not displayed.'}) +
      field('Before image path (optional)', `projects.${index}.compare.before`, {help:'Add BOTH images to enable the comparison slider.'}) + field('After image path (optional)', `projects.${index}.compare.after`) + field('Before label', `projects.${index}.compare.beforeLabel`) + field('After label', `projects.${index}.compare.afterLabel`)
    }</div><div class="project-editor-controls">${check('Preview / sample project', `projects.${index}.preview`)}${check('Featured on Home', `projects.${index}.featured`)}<div class="editor-project-order"><button type="button" data-studio="move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>Move up</button><button type="button" data-studio="move-down" data-index="${index}" ${index === draft.projects.length - 1 ? 'disabled' : ''}>Move down</button></div></div></div>`).join('');
  }

  function renderLab() {
    document.getElementById('editor-lab').innerHTML = sectionCard('Your creative notebook', 'LAB',
      field('Heading', 'site.lab.title') + field('Highlighted heading', 'site.lab.accent') + field('Introduction', 'site.lab.intro', {textarea:true,wide:true}) + check('Show the interactive motion playground', 'site.lab.showPlayground')) +
      `<div class="project-editor-heading"><h2>Your notes <em>(${draft.lab.length})</em></h2><button type="button" data-studio="add-note">${icon('plus')} Add note</button></div><p class="editor-help">Unpublished notes are removed from exported lab.js. Your private draft is kept only in content.json: do not upload that file. Starter examples are marked explicitly; replace them with your own tested work.</p>` +
      draft.lab.map((note,index)=>`<div class="editor-card" data-editor-note="${index}"><div class="editor-card-heading"><div><h2>${esc(note.title)}</h2><span>Note ${String(index+1).padStart(2,'0')}</span></div><button type="button" class="icon-button" data-studio="remove-note" data-index="${index}" aria-label="Remove ${esc(note.title)}">${icon('trash')}</button></div><div class="field-grid">${
        field('Title',`lab.${index}.title`,{wide:true}) + field('URL identifier',`lab.${index}.id`,{help:'Unique lowercase words joined with hyphens.'}) + field('Topic',`lab.${index}.topic`,{select:['After Effects','Blender','Workflow','Plugins']}) + field('Note type',`lab.${index}.kind`) + field('Cover illustration',`lab.${index}.visual`,{select:['curves','loop','glow','render','workflow','plugins']}) + field('Short introduction',`lab.${index}.summary`,{textarea:true,wide:true}) + field('Reference / tested version',`lab.${index}.version`,{wide:true,help:'State what YOU tested. Label documentation references separately.'}) + field('Body (blank line between paragraphs)',`lab.${index}.body`,{textarea:true,wide:true,rows:5}) + field('Steps (one step per line)',`lab.${index}.steps`,{textarea:true,wide:true,lines:true,rows:5}) + field('Copyable code (optional)',`lab.${index}.code`,{textarea:true,wide:true,rows:4}) + field('Source title',`lab.${index}.sourceTitle`) + field('Official source URL',`lab.${index}.sourceURL`) + field('Tutorial video URL (optional)',`lab.${index}.video`) + field('Resource URL (optional)',`lab.${index}.downloadURL`,{help:'Only share resources you own or are licensed to distribute. No paid plugin binaries.'})
      }</div><div class="project-editor-controls">${check('Published',`lab.${index}.published`)}${check('Starter / sample note',`lab.${index}.sample`)}<div class="editor-project-order"><button type="button" data-studio="note-up" data-index="${index}" ${index===0?'disabled':''}>Move up</button><button type="button" data-studio="note-down" data-index="${index}" ${index===draft.lab.length-1?'disabled':''}>Move down</button></div></div></div>`).join('');
  }

  function renderTools() {
    document.getElementById('editor-tools').innerHTML = sectionCard('Set the default mood', 'APPEARANCE', field('Default accent', 'site.theme.accent', { select: ['lime', 'ice', 'lilac'] }) + check('Enable subtle motion', 'site.theme.motion')) + `<div class="editor-card"><div class="editor-card-heading"><h2>The creative loadout</h2><span>10 TOOL SLOTS</span></div><p>Leave the logo path empty to use the included vector or letter mark. Tool names and paths can be changed independently.</p>${draft.site.tools.map((item, index) => `<div class="editor-tool-row"><span>Slot ${String(index + 1).padStart(2, '0')}</span>${field('Tool name', `site.tools.${index}.name`)}${field('Logo path (optional)', `site.tools.${index}.icon`, { placeholder: 'assets/tools/your-logo.svg' })}${field('Color', `site.tools.${index}.color`, { type: 'color' })}</div>`).join('')}</div>`;
  }
  const fillIcons = () => document.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = icon(node.dataset.icon); });
  const render = () => { renderContent(); renderProjects(); renderTools(); renderLab(); fillIcons(); setTab(currentTab); };
  function setTab(tab) {
    currentTab = tab;
    ['content', 'projects', 'lab', 'tools'].forEach((name) => { document.getElementById(`editor-${name}`).hidden = name !== tab; });
    document.querySelectorAll('[data-tab]').forEach((node) => { const active = node.dataset.tab === tab; node.classList.toggle('is-active', active); node.setAttribute('aria-pressed', String(active)); });
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
    } catch (_) { document.getElementById('save-state').textContent = 'Storage unavailable. Export before closing this page.'; }
    if (previewWindow && !previewWindow.closed) previewWindow.postMessage({ type: 'TAM_DRAFT_RESPONSE', draft }, location.protocol === 'file:' ? '*' : location.origin);
  }
  function validate() {
    const seen = new Set();
    for (const project of draft.projects) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) return `Use a lowercase, hyphen-separated URL identifier for "${project.title}".`;
      if (seen.has(project.id)) return `The identifier "${project.id}" is repeated. Give each project a unique ID.`;
      if (!project.title.trim() || !project.category.trim()) return 'Every project needs a title and category.';
      seen.add(project.id);
    }
    for (const note of draft.lab) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.id) || !note.title.trim()) return 'Every note needs a title and a lowercase, hyphen-separated ID.';
      if (seen.has('lab:' + note.id)) return `Duplicate note ID: ${note.id}`;
      seen.add('lab:' + note.id);
    }
    if (!draft.site.name.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.site.email)) return 'Please check your email address.';
    return '';
  }
  function openPreview() {
    const issue = validate();
    if (issue) { toast(issue); return; }
    save();
    previewWindow = window.open(`index.html?draft=1#${currentTab === 'lab' ? 'lab' : currentTab === 'projects' ? 'projects' : currentTab === 'tools' ? 'about' : 'home'}`, 'tam-portfolio-draft');
    if (!previewWindow) toast('Allow popups for this page, then try Preview draft again.');
  }
  window.addEventListener('message', (event) => {
    if (!previewWindow || event.source !== previewWindow || event.data?.type !== 'TAM_DRAFT_REQUEST') return;
    if (location.protocol !== 'file:' && event.origin !== location.origin) return;
    previewWindow.postMessage({ type: 'TAM_DRAFT_RESPONSE', draft }, location.protocol === 'file:' ? '*' : location.origin);
  });

  // Small ZIP writer (stored files, UTF-8 paths). No external dependency or upload.
  function zipFiles(files) {
    const encoder = new TextEncoder();
    const crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[n] = c >>> 0; }
    const crc32 = (bytes) => { let crc = 0xffffffff; for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; };
    const locals = [], centrals = [];
    let offset = 0, centralSize = 0;
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((Math.max(1980, now.getFullYear()) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    for (const file of files) {
      const name = encoder.encode(file.name), bytes = encoder.encode(file.text), crc = crc32(bytes);
      const local = new Uint8Array(30 + name.length), lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
      lv.setUint16(10, dosTime, true); lv.setUint16(12, dosDate, true); lv.setUint32(14, crc, true);
      lv.setUint32(18, bytes.length, true); lv.setUint32(22, bytes.length, true); lv.setUint16(26, name.length, true); local.set(name, 30);
      const central = new Uint8Array(46 + name.length), cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
      cv.setUint16(12, dosTime, true); cv.setUint16(14, dosDate, true); cv.setUint32(16, crc, true);
      cv.setUint32(20, bytes.length, true); cv.setUint32(24, bytes.length, true); cv.setUint16(28, name.length, true); cv.setUint32(42, offset, true); central.set(name, 46);
      locals.push(local, bytes); centrals.push(central); offset += local.length + bytes.length; centralSize += central.length;
    }
    const end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true); ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);
    return new Blob([...locals, ...centrals, end], { type: 'application/zip' });
  }
  function exportUpdate() {
    const issue = validate();
    if (issue) { toast(issue); return; }
    save();
    const encode = (object) => JSON.stringify(object, null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    const files = [
      { name: 'data/site.js', text: `/* Exported from Tam Content Studio. */\nwindow.PORTFOLIO_SITE = ${encode(draft.site)};\n` },
      { name: 'data/projects.js', text: `/* Exported from Tam Content Studio. */\nwindow.PORTFOLIO_PROJECTS = ${encode(draft.projects)};\n` },
      { name: 'data/lab.js', text: `/* Exported from tamtam Content Studio. Published notes only. */\nwindow.PORTFOLIO_LAB = ${encode(draft.lab.filter(t => t.published))};\n` },
      { name: 'content.json', text: JSON.stringify(draft, null, 2) },
      { name: 'READ-ME.txt', text: '1. Back up your current data folder.\n2. Replace data/site.js, data/projects.js and data/lab.js in your website with the exported files.\n3. Add any new image/video files to the paths you entered.\n4. Commit the changed files to your GitHub Pages repository.\n5. content.json can be imported into studio.html to resume editing. Keep content.json offline: it may include unpublished notes. Only upload the three files in data/.\n\nThis update does not include images, videos, or the full website source.\nSearch/social metadata in index.html is static for crawlers; also edit its meta tags after changing your name/domain/description.\n' }
    ];
    const objectURL = URL.createObjectURL(zipFiles(files));
    const a = document.createElement('a'); a.href = objectURL; a.download = 'tamtam-content-update.zip'; a.click();
    setTimeout(() => URL.revokeObjectURL(objectURL), 5000);
    toast('Update exported. Replace the files in your data folder to publish.');
  }

  document.addEventListener('input', (event) => {
    const categoryInput = event.target.closest('[data-project-category]');
    if (categoryInput) {
      const p = draft.projects[Number(categoryInput.dataset.projectCategory)];
      p.categories = Array.from(document.querySelectorAll(`[data-project-category="${categoryInput.dataset.projectCategory}"]:checked`), el=>el.value);
      if (!p.categories.includes(p.category)) p.categories.push(p.category);
      save(); return;
    }
    const input = event.target.closest('[data-field]');
    if (!input) return;
    let value = input.type === 'checkbox' ? input.checked : input.value;
    if (input.dataset.lines) value = value.split('\n').map(item=>item.trim()).filter(Boolean);
    if (input.dataset.list) value = value.split(',').map((item) => item.trim()).filter(Boolean);
    set(input.dataset.field, value);
    const catMatch = input.dataset.field.match(/^projects\.(\d+)\.category$/);
    if (catMatch) {
      const p = draft.projects[Number(catMatch[1])];
      p.categories = [value,...p.categories.filter(c=>c!==value)];
      document.querySelectorAll(`[data-project-category="${catMatch[1]}"]`).forEach(el=>{el.disabled=el.value===value;});
      const box = document.querySelector(`[data-project-category="${catMatch[1]}"][value="${value}"]`);
      if (box) box.checked = true;
    }
    const titleMatch = input.dataset.field.match(/^projects\.(\d+)\.title$/);
    if (titleMatch) document.querySelector(`[data-project-heading="${titleMatch[1]}"]`).textContent = value;
    document.getElementById('save-state').textContent = 'Saving local draft...';
    clearTimeout(saveTimer); saveTimer = setTimeout(save, 350);
  });
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.tab) { setTab(target.dataset.tab); return; }
    const index = Number(target.dataset.index);
    switch (target.dataset.studio) {
      case 'preview': openPreview(); break;
      case 'export': exportUpdate(); break;
      case 'add-project': {
        let n = draft.projects.length + 1; while (draft.projects.some((p) => p.id === `new-project-${n}`)) n++;
        draft.projects.push({ id: `new-project-${n}`, title: 'New project', category: 'Motion', categories:['Motion'], caseStudy:{brief:'',role:'',process:'',outcome:''}, compare:{before:'',after:'',beforeLabel:'Before',afterLabel:'After'}, subtitle: 'A new story starts here.', cover: 'assets/hero.webp', coverPosition: '78% 50%', description: '', tags: [], tools: [], preview: true, featured: false, video: '', aspect: '16/9', link: '' });
        renderProjects(); save();
        document.querySelector('[data-editor-project]:last-child')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'remove-project':
        // Two clicks prevent accidentally losing a filled project.
        if (target.dataset.confirm !== 'true') { target.dataset.confirm = 'true'; target.setAttribute('aria-label', 'Confirm removal'); target.innerHTML = icon('check'); toast('Click the checkmark again to remove this project.'); return; }
        draft.projects.splice(index, 1); renderProjects(); save(); break;
      case 'move-up': if (index > 0) { [draft.projects[index - 1], draft.projects[index]] = [draft.projects[index], draft.projects[index - 1]]; renderProjects(); save(); } break;
      case 'move-down': if (index < draft.projects.length - 1) { [draft.projects[index + 1], draft.projects[index]] = [draft.projects[index], draft.projects[index + 1]]; renderProjects(); save(); } break;
      case 'add-note': {
        let n = draft.lab.length + 1; while(draft.lab.some(t=>t.id===`new-note-${n}`)) n++;
        draft.lab.push({id:`new-note-${n}`,title:'New note',topic:'After Effects',kind:'Quick tip',visual:'curves',summary:'',version:'',body:'',steps:[],code:'',sourceTitle:'',sourceURL:'',video:'',downloadURL:'',sample:true,published:false});
        renderLab(); save(); document.querySelector('[data-editor-note]:last-child')?.scrollIntoView({block:'start'}); break;
      }
      case 'remove-note':
        if(target.dataset.confirm !== 'true'){target.dataset.confirm='true';target.setAttribute('aria-label','Confirm removal');target.innerHTML=icon('check');toast('Click the checkmark again to remove this note.');return;}
        draft.lab.splice(index,1);renderLab();save();break;
      case 'note-up': if(index>0){[draft.lab[index-1],draft.lab[index]]=[draft.lab[index],draft.lab[index-1]];renderLab();save();}break;
      case 'note-down': if(index<draft.lab.length-1){[draft.lab[index+1],draft.lab[index]]=[draft.lab[index],draft.lab[index+1]];renderLab();save();}break;
      case 'reset': document.getElementById('reset-dialog').showModal(); break;
      case 'cancel-reset': document.getElementById('reset-dialog').close(); break;
      case 'confirm-reset': draft = clone(defaults); render(); save(); document.getElementById('reset-dialog').close(); toast('Local draft reset. Your website files were not changed.'); break;
      default: break;
    }
  });
  document.getElementById('import-json').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('This file is too large. Import the exported content.json, not media files.');
      const imported = JSON.parse(await file.text());
      if (!validDraft(imported)) throw new Error('This is not a valid content.json from this portfolio.');
      draft = window.PortfolioSchema.normalize(imported); render(); save(); toast('Content imported into your local draft.');
    } catch (error) { toast(error.message || 'The file could not be imported.'); }
    event.target.value = '';
  });
  render(); save();
  window.TamStudio = Object.freeze({ exportUpdate, zipFiles });
})();
