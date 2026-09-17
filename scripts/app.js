/* tamtam. / Static application. No libraries, tracking, background media, or build step.
 * Hash routes work both on GitHub Pages and as local files.
 * Views mount on demand. Interactive animation runs only after a visitor asks for it.
 */
(() => {
  'use strict';
  const {esc, icon, videoInfo, inCategory} = window.P;
  const root=document.documentElement;
  const routes=['home','projects','lab','about','contact'];
  const routeNames={home:'Home',projects:'Projects',lab:'Lab - Tips & Tricks',about:'About',contact:'Contact'};
  const dialogs={project:document.getElementById('project-dialog'),tip:document.getElementById('tip-dialog'),search:document.getElementById('search-dialog'),display:document.getElementById('display-dialog')};
  const prefKey='tam-portfolio-v3-preferences', draftKey='tamtam-portfolio-v4-draft', savedKey='tamtam-lab-bookmarks';
  const isDraft=new URLSearchParams(location.search).get('draft')==='1';
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null');}catch(_){return null;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(_){return false;}};
  let {site,projects,lab}=window.PortfolioSchema.normalize({site:window.PORTFOLIO_SITE,projects:window.PORTFOLIO_PROJECTS,lab:window.PORTFOLIO_LAB});
  let prefs=read(prefKey)||{}, bookmarks=read(savedKey);
  if(typeof prefs!=='object'||Array.isArray(prefs))prefs={};
  if (!Array.isArray(bookmarks)) bookmarks=[];
  let currentView='', currentProject=null, currentTip=null, toastTimer, searchTimer, enterTimer, routeFrame;
  let lastTrigger=null, scrollBeforeLock=0, locked=false;
  const mounted=new Set(), scrollPositions={};
  const projectState={filter:'All Work',query:'',layout:'grid'};
  const labState={topic:'All Notes',query:'',onlySaved:false};
  const motion={curve:'smooth',duration:1200,animations:[],timer:0};
  const curves={smooth:{css:'cubic-bezier(.22, 1, .36, 1)',name:'SMOOTH / EASE OUT',caption:'a softer landing'},snappy:{css:'cubic-bezier(.76, 0, .24, 1)',name:'SNAPPY / EASE IN OUT',caption:'wait, then go'},bounce:{css:'cubic-bezier(.34, 1.56, .64, 1)',name:'BOUNCE / OVERSHOOT',caption:'a little extra energy'}};

  function toast(message) {
    const el=document.getElementById('toast'); clearTimeout(toastTimer);
    el.textContent=message; el.classList.add('is-visible');
    toastTimer=setTimeout(()=>el.classList.remove('is-visible'),3200);
  }
  function scrollToY(y) {
    const prev=root.style.scrollBehavior; root.style.scrollBehavior='auto'; window.scrollTo(0,y); root.style.scrollBehavior=prev;
  }
  function syncLock() {
    const next=Object.values(dialogs).some(d=>d.open);
    if (next && !locked) {
      scrollBeforeLock=scrollY; document.body.style.top=`-${scrollBeforeLock}px`;
      document.body.classList.add('modal-open'); locked=true;
    } else if (!next && locked) {
      document.body.classList.remove('modal-open');document.body.style.top='';locked=false;scrollToY(scrollBeforeLock);
    }
  }
  const fillIcons=(scope=document)=>scope.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon));
  const publishData=()=>{window.PORTFOLIO_SITE=site;window.PORTFOLIO_PROJECTS=projects;window.PORTFOLIO_LAB=lab;};
  function stopMotion() {
    motion.animations.forEach(a=>a.cancel()); motion.animations=[]; clearTimeout(motion.timer);
    document.querySelectorAll('.motion-token').forEach(n=>n.style.removeProperty('transform'));
    document.querySelectorAll('[data-action="play-motion"]').forEach(b=>b.innerHTML=`${icon('play')} Play the difference`);
  }
  function applyPreferences() {
    root.dataset.accent=['lime','ice','lilac'].includes(prefs.accent||site.theme.accent)?(prefs.accent||site.theme.accent):'lime';
    const enabled=(prefs.motion??site.theme.motion)!==false&&!reduceMotion.matches;
    root.dataset.motion=enabled?'on':'off';
    document.querySelectorAll('[data-accent-choice]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.accentChoice===root.dataset.accent)));
    const toggle=document.getElementById('motion-toggle');toggle.checked=enabled;toggle.disabled=reduceMotion.matches;
    document.getElementById('motion-help').textContent=reduceMotion.matches?'Reduced motion is enabled in your device settings.':'Subtle movement, never in the way.';
    document.querySelectorAll('[data-tilt]').forEach(n=>{n.style.removeProperty('--rx');n.style.removeProperty('--ry');});
    if(!enabled)stopMotion();
    document.querySelectorAll('[data-action="play-motion"]').forEach(b=>b.disabled=!enabled);
    const message=document.getElementById('playground-message');
    if(message)message.textContent=enabled?'Browser demo. No plugins. No autoplay.':'Motion is off. Curves can still be explored and copied.';
  }
  function bindTilt(scope) {
    scope.querySelectorAll('[data-tilt]').forEach(card=>{
      let frame=0, point;
      const reset=()=>{cancelAnimationFrame(frame);frame=0;card.style.removeProperty('--rx');card.style.removeProperty('--ry');};
      card.addEventListener('pointermove',e=>{
        if(!pointer.matches||root.dataset.motion==='off'||e.pointerType==='touch')return;
        point={x:e.clientX,y:e.clientY};if(frame)return;
        frame=requestAnimationFrame(()=>{frame=0;const b=card.getBoundingClientRect();card.style.setProperty('--ry',`${((point.x-b.left)/b.width-.5)*3}deg`);card.style.setProperty('--rx',`${((point.y-b.top)/b.height-.5)*-3}deg`);});
      },{passive:true});
      card.addEventListener('pointerleave',reset,{passive:true});card.addEventListener('pointercancel',reset,{passive:true});
    });
  }
  function renderShell() {
    publishData();
    document.getElementById('copyright').textContent=`\u00a9 ${new Date().getFullYear()} ${site.brand || site.name}`;
    document.querySelector('.brand-word').innerHTML=`${esc((site.brand||site.name).replace(/\.$/,''))}<span>.</span>`;
    document.querySelector('.brand').setAttribute('aria-label',`${site.brand||site.name} - Home`);
    document.querySelector('meta[name="description"]').content=site.seo.description;
    document.querySelector('meta[property="og:title"]').content=site.seo.title;
    fillIcons();applyPreferences();document.getElementById('boot-message')?.remove();
  }
  function ensureView(route) {
    if(mounted.has(route))return;
    const el=document.getElementById(`view-${route}`);
    el.innerHTML=window.PORTFOLIO_VIEWS[route](site,projects,lab);
    mounted.add(route);fillIcons(el);bindTilt(el);
    if(route==='projects')updateProjects(false);
    if(route==='lab'){updateLab(false);drawCurve();applyPreferences();}
  }
  function showView(route,initial=false) {
    ensureView(route);
    if(currentView===route)return;
    if(currentView)scrollPositions[currentView]=locked?scrollBeforeLock:scrollY;
    stopMotion();clearTimeout(enterTimer);
    document.querySelectorAll('[data-view]').forEach(v=>{v.hidden=v.dataset.view!==route;v.classList.remove('is-entering');});
    currentView=route;const view=document.getElementById(`view-${route}`);view.classList.add('is-entering');
    document.querySelectorAll('[data-nav]').forEach(n=>{if(n.dataset.nav===route)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');});
    document.getElementById('page-index').innerHTML=`${String(routes.indexOf(route)+1).padStart(2,'0')} <span>/ 05</span>`;
    root.dataset.route=route;
    if(!locked)scrollToY(scrollPositions[route]||0);
    if(!initial&&!Object.values(dialogs).some(d=>d.open))view.querySelector('h1')?.focus({preventScroll:true});
    enterTimer=setTimeout(()=>view.classList.remove('is-entering'),750);
  }
  function cleanupMedia() {
    const c=document.getElementById('project-content');
    c.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});
    c.querySelectorAll('iframe').forEach(f=>f.remove());
  }
  function closeDetails() {
    if(dialogs.project.open){cleanupMedia();dialogs.project.close();}
    if(dialogs.tip.open)dialogs.tip.close();
    currentProject=null;currentTip=null;syncLock();
  }
  function openProject(p) {
    if(dialogs.project.open&&currentProject?.id===p.id)return;
    cleanupMedia();currentProject=p;currentTip=null;
    if(dialogs.tip.open)dialogs.tip.close();
    document.getElementById('project-content').innerHTML=window.PORTFOLIO_VIEWS.projectDetail(p,projects);
    if(!dialogs.project.open)dialogs.project.showModal();
    dialogs.project.scrollTop=0;syncLock();dialogs.project.querySelector('[data-action="close-project"]').focus({preventScroll:true});
    document.title=`${p.title} - ${site.brand||site.name}`;
  }
  function openTip(t) {
    if(dialogs.tip.open&&currentTip?.id===t.id)return;
    if(dialogs.project.open){cleanupMedia();dialogs.project.close();}
    currentTip=t;currentProject=null;
    document.getElementById('tip-content').innerHTML=window.PORTFOLIO_VIEWS.tipDetail(t,bookmarks,lab);
    if(!dialogs.tip.open)dialogs.tip.showModal();
    dialogs.tip.scrollTop=0;syncLock();dialogs.tip.querySelector('[data-action="close-tip"]').focus({preventScroll:true});
    document.title=`${t.title} - ${site.brand||site.name} Lab`;
  }
  function routeNow(initial=false) {
    let raw;try{raw=decodeURIComponent(location.hash.slice(1));}catch(_){raw='home';}
    if(raw==='main'){document.getElementById('main').focus();return;}
    const [requested,id]=(raw||'home').split('/');const route=routes.includes(requested)?requested:'home';
    if(route!==requested)history.replaceState(null,'','#home');
    const hadDetail=dialogs.project.open||dialogs.tip.open;
    const isProject=route==='projects'&&id;const isTip=route==='lab'&&id;const isReel=route==='home'&&id==='reel'&&videoInfo(site.showreel);
    if(!isProject&&!isTip&&!isReel)closeDetails();
    if(dialogs.search.open)dialogs.search.close();if(dialogs.display.open)dialogs.display.close();syncLock();
    showView(route,initial);
    document.title=(route==='home'?site.seo.title:`${routeNames[route]} - ${site.brand||site.name}`)+(isDraft?' [Draft preview]':'');
    if(isProject){const p=projects.find(p=>p.id===id);if(p)openProject(p);else{closeDetails();history.replaceState(null,'','#projects');toast('That project is not available.');}}
    if(isTip){const t=lab.find(t=>t.id===id&&t.published!==false);if(t)openTip(t);else{closeDetails();history.replaceState(null,'','#lab');toast('That note is not available.');}}
    if(isReel)openProject({id:'showreel',title:'A few frames. A whole lot of feeling.',category:'Showreel',subtitle:'Selected work by '+site.name,cover:site.showreelPoster||site.heroImage,video:site.showreel,aspect:'16/9',description:'',tags:[],tools:[],preview:false});
    if(hadDetail&&!dialogs.project.open&&!dialogs.tip.open){
      if(lastTrigger?.isConnected&&lastTrigger.getClientRects().length&&!lastTrigger.closest('[data-view]')?.hidden)lastTrigger.focus({preventScroll:true});
      else document.querySelector(`#view-${route} h1`)?.focus({preventScroll:true});
      lastTrigger=null;
    }
    syncLock();
  }
  function navigateDetail(href,trigger) {
    const active=dialogs.project.open||dialogs.tip.open;
    if(!active){lastTrigger=trigger;history.pushState({portfolioModal:true,returnHash:location.hash||'#home'},'',href);}
    else history.replaceState(history.state,'',href);
    routeNow();
  }
  function closeDetailRoute() {
    if(history.state?.portfolioModal&&history.state?.returnHash)history.back();
    else{history.replaceState(null,'',currentView==='lab'?'#lab':currentView==='home'?'#home':'#projects');routeNow();}
  }
  function updateProjects(animate=true) {
    if(!mounted.has('projects'))return;
    const {filter,query,layout}=projectState;
    document.querySelectorAll('[data-filter]').forEach(n=>{n.classList.toggle('is-active',n.dataset.filter===filter);n.setAttribute('aria-pressed',String(n.dataset.filter===filter));});
    document.querySelectorAll('[data-layout]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.layout===layout)));
    const grid=document.getElementById('project-grid');
    grid.classList.toggle('is-bento',filter==='All Work'&&!query&&projects.length===3&&layout==='grid');
    grid.classList.toggle('is-list',layout==='list');grid.classList.remove('is-filtering');
    grid.innerHTML=window.PORTFOLIO_VIEWS.projectCards(projects,filter,query);
    if(animate&&root.dataset.motion!=='off')grid.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:240,easing:'ease-out'});
    const count=grid.querySelectorAll('.project-card').length;
    document.getElementById('project-results-label').textContent=`${count} ${count===1?'project':'projects'} / ${filter}`;
    document.getElementById('filter-announcement').textContent=`${count} projects shown in ${filter}.`;
  }
  function updateLab(announce=true) {
    if(!mounted.has('lab'))return;
    const {topic,query,onlySaved}=labState;
    const grid=document.getElementById('lab-grid');grid.innerHTML=window.PORTFOLIO_VIEWS.labCards(lab,topic,query,bookmarks,onlySaved);
    document.querySelectorAll('[data-topic]').forEach(n=>{n.classList.toggle('is-active',n.dataset.topic===topic);n.setAttribute('aria-pressed',String(n.dataset.topic===topic));});
    document.querySelector('[data-action="saved-notes"]').setAttribute('aria-pressed',String(onlySaved));
    document.getElementById('saved-count').textContent=bookmarks.filter(id=>lab.some(t=>t.id===id&&t.published!==false)).length;
    if(announce)document.getElementById('lab-announcement').textContent=`${grid.querySelectorAll('.note-card').length} notes shown.`;
  }
  function bookmark(id) {
    const had=bookmarks.includes(id);bookmarks=had?bookmarks.filter(x=>x!==id):[...bookmarks,id];
    const stored=write(savedKey,bookmarks);
    // Update buttons in-place so keyboard focus is not lost on a normal save action.
    document.querySelectorAll('[data-save-note]').forEach(b=>{if(b.dataset.saveNote===id){b.setAttribute('aria-pressed',String(!had));b.setAttribute('aria-label',had?'Save note':'Unsave note');}});
    const c=document.getElementById('saved-count');if(c)c.textContent=bookmarks.filter(x=>lab.some(t=>t.id===x&&t.published!==false)).length;
    if(labState.onlySaved&&had){updateLab();document.querySelector('[data-action="saved-notes"]')?.focus({preventScroll:true});}
    toast(stored?(had?'Removed from saved notes.':'Saved in this browser.'): 'Changed for this visit. Browser storage is unavailable.');
  }
  function playMotion() {
    if(root.dataset.motion==='off'||currentView!=='lab')return;
    stopMotion();
    document.querySelectorAll('.motion-token').forEach((token,i)=>{
      const rail=token.parentElement;const distance=Math.max(0,rail.clientWidth-token.offsetWidth);
      const animation=token.animate([{transform:'translateX(0)'},{transform:`translateX(${distance}px)`}],{duration:motion.duration,easing:i?curves[motion.curve].css:'linear',fill:'forwards'});
      motion.animations.push(animation);
    });
    document.querySelectorAll('[data-action="play-motion"]').forEach(b=>b.innerHTML=`${icon('refresh')} Replay the difference`);
  }
  function drawCurve() {
    const svg=document.querySelector('.bezier-thumb svg');if(!svg)return;
    const v=curves[motion.curve].css.match(/[\d.]+/g).map(Number);
    svg.querySelector('path[stroke-width]').setAttribute('d',`M27 88C${27+186*v[0]} ${88-70*v[1]} ${27+186*v[2]} ${88-70*v[3]} 213 18`);
  }
  function selectCurve(curve) {
    if(!curves[curve])return;stopMotion();motion.curve=curve;
    document.querySelectorAll('[data-curve]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.curve===curve)));
    document.getElementById('curve-name').textContent=curves[curve].name;
    document.getElementById('lane-caption').textContent=curves[curve].caption;
    document.getElementById('curve-code').textContent=curves[curve].css;drawCurve();
  }
  async function copy(text,success) {
    let ok=false;const previous=document.activeElement;
    try{await navigator.clipboard.writeText(text);ok=true;}catch(_){
      const a=document.createElement('textarea');a.value=text;a.readOnly=true;a.style.cssText='position:fixed;left:-9999px;top:0';
      const host=Object.values(dialogs).find(d=>d.open)||document.body;host.append(a);a.select();
      try{ok=document.execCommand('copy');}catch(_){}a.remove();previous?.focus({preventScroll:true});
    }
    toast(ok?success:'Clipboard unavailable. Select and copy the text manually.');
    return ok;
  }
  function playVideo() {
    const media=videoInfo(currentProject?.video);if(!media)return;
    const stage=document.getElementById('media-stage');stage.classList.add('is-playing');
    if(media.type==='file'){
      const v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='metadata';v.src=media.url;v.setAttribute('aria-label',`${currentProject.title} video`);stage.replaceChildren(v);
      v.addEventListener('error',()=>{stage.innerHTML=`<div class="media-error"><p>This video could not be loaded. Check the file path or hosting permissions.</p><a href="${esc(media.original)}" target="_blank" rel="noopener noreferrer">Open the video directly ${icon('arrow-up')}</a></div>`;},{once:true});
      v.play()?.catch(()=>{});v.focus();
    }else{
      const f=document.createElement('iframe');f.title=currentProject.title+' video';f.allow='autoplay; fullscreen; picture-in-picture; encrypted-media';f.referrerPolicy='strict-origin-when-cross-origin';f.allowFullscreen=true;f.src=media.url;stage.replaceChildren(f);dialogs.project.querySelector('[data-action="close-project"]').focus({preventScroll:true});
    }
  }
  function searchResults() {
    const rawQuery=document.getElementById('quick-search').value.toLowerCase().trim();
    const q=rawQuery==='ae'?'after effects':rawQuery;
    const items=[...routes.map(r=>({title:routeNames[r],type:'Page',href:'#'+r,text:routeNames[r],icon:r==='lab'?'lab':'arrow-up'})),...projects.map(p=>({title:p.title,type:p.category,href:'#projects/'+encodeURIComponent(p.id),text:[p.title,p.category,...p.tags||[]].join(' '),icon:'film'})),...lab.filter(t=>t.published!==false).map(t=>({title:t.title,type:t.topic,href:'#lab/'+encodeURIComponent(t.id),text:[t.title,t.topic,t.summary,t.kind].join(' '),icon:'book'}))];
    const filtered=items.filter(i=>i.text.toLowerCase().includes(q)).slice(0,12);
    document.getElementById('search-results').innerHTML=filtered.length?filtered.map(i=>`<a class="search-result" href="${esc(i.href)}">${icon(i.icon)}<span><strong>${esc(i.title)}</strong><small>${esc(i.type)}</small></span>${icon('arrow-up')}</a>`).join(''):'<p class="search-empty">Nothing found. Try a project name, AE, Blender, or a page.</p>';
  }
  function openSearch() {
    if(dialogs.project.open||dialogs.tip.open)return;
    if(dialogs.search.open){document.getElementById('quick-search').focus();return;}
    if(dialogs.display.open)dialogs.display.close();
    document.getElementById('quick-search').value='';searchResults();dialogs.search.showModal();syncLock();document.getElementById('quick-search').focus();
  }
  document.addEventListener('click',e=>{
    const target=e.target.closest('a,button');if(!target)return;
    const href=target.getAttribute('href')||'';
    if(target.classList.contains('skip-link')){e.preventDefault();document.getElementById('main').focus();return;}
    const normal=!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0;
    if(normal&&(href.startsWith('#projects/')||href.startsWith('#lab/')||href==='#home/reel')){
      e.preventDefault();if(dialogs.search.open)dialogs.search.close();syncLock();navigateDetail(href,target);return;
    }
    if(normal&&target.matches('a[href^="#"]')){
      if(dialogs.search.open)dialogs.search.close();if(dialogs.display.open)dialogs.display.close();syncLock();
      if(href===location.hash){e.preventDefault();scrollToY(0);}
    }
    if(target.dataset.filter){projectState.filter=target.dataset.filter;updateProjects();return;}
    if(target.dataset.layout){projectState.layout=target.dataset.layout;updateProjects();return;}
    if(target.dataset.topic){labState.topic=target.dataset.topic;updateLab();return;}
    if(target.dataset.saveNote){bookmark(target.dataset.saveNote);return;}
    if(target.dataset.curve){selectCurve(target.dataset.curve);return;}
    if(target.dataset.accentChoice){prefs.accent=target.dataset.accentChoice;write(prefKey,prefs);applyPreferences();return;}
    switch(target.dataset.action){
      case 'search':openSearch();break;
      case 'close-search':dialogs.search.close();syncLock();break;
      case 'display':dialogs.display.showModal();syncLock();break;
      case 'close-display':dialogs.display.close();syncLock();break;
      case 'reset-display':prefs={};write(prefKey,prefs);applyPreferences();break;
      case 'close-project':case 'close-tip':closeDetailRoute();break;
      case 'play-video':playVideo();break;
      case 'copy-email':copy(site.email,'Email copied. Say hello!');break;
      case 'share':copy(location.protocol==='file:'?'https://tamtam1704.github.io/'+location.hash:location.origin+location.pathname+location.hash,location.protocol==='file:'?'Public link copied. It will work after you publish this version.':'Link copied.');break;
      case 'copy-tip-code':if(currentTip)copy(currentTip.code,'Snippet copied.');break;
      case 'copy-curve':copy(curves[motion.curve].css,'CSS timing curve copied.');break;
      case 'play-motion':playMotion();break;
      case 'saved-notes':labState.onlySaved=!labState.onlySaved;updateLab();break;
      case 'reset-projects':projectState.filter='All Work';projectState.query='';document.getElementById('project-search').value='';updateProjects();document.querySelector('[data-filter="All Work"]').focus({preventScroll:true});break;
      case 'reset-lab':labState.topic='All Notes';labState.query='';labState.onlySaved=false;document.getElementById('lab-search').value='';updateLab();document.querySelector('[data-topic="All Notes"]').focus({preventScroll:true});break;
    }
  });
  document.addEventListener('input',e=>{
    switch(e.target.id){
      case 'project-search':projectState.query=e.target.value;updateProjects(false);break;
      case 'lab-search':labState.query=e.target.value;updateLab();break;
      case 'quick-search':clearTimeout(searchTimer);searchTimer=setTimeout(searchResults,80);break;
      case 'motion-duration':stopMotion();motion.duration=Number(e.target.value);document.getElementById('duration-value').textContent=(motion.duration/1000).toFixed(1)+'s';break;
      case 'compare-slider':document.querySelector('.image-comparison')?.style.setProperty('--split',e.target.value+'%');document.getElementById('compare-value').textContent=e.target.value+'%';break;
    }
  });
  document.getElementById('motion-toggle').addEventListener('change',e=>{prefs.motion=e.target.checked;write(prefKey,prefs);applyPreferences();});
  document.addEventListener('submit',e=>{
    if(e.target.id!=='contact-form')return;e.preventDefault();
    const type=document.getElementById('project-type').value, brief=document.getElementById('project-brief').value.trim();
    const url=window.P.gmail(`${type} - Let's create something`,`Hi ${site.name},\n\nI'd like to talk about a ${type.toLowerCase()} project.\n\n${brief?brief+'\n\n':''}Thanks!`);
    const fallback=document.getElementById('compose-fallback');fallback.querySelector('a').href=url;
    const child=window.open('about:blank','_blank');if(child){child.opener=null;child.location.href=url;fallback.hidden=true;}else fallback.hidden=false;
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
    if(dialogs.search.open&&e.target.id==='quick-search'&&e.key==='ArrowDown'){e.preventDefault();document.querySelector('.search-result')?.focus();}
    if(dialogs.search.open&&e.target.id==='quick-search'&&e.key==='Enter'){e.preventDefault();document.querySelector('.search-result')?.click();}
  });
  Object.entries(dialogs).forEach(([kind,dialog])=>{
    dialog.addEventListener('cancel',e=>{if(kind==='project'||kind==='tip'){e.preventDefault();closeDetailRoute();}});
    dialog.addEventListener('close',()=>{if(kind==='project')cleanupMedia();syncLock();});
    dialog.addEventListener('keydown',e=>{
      if(e.key!=='Tab')return;
      const list=[...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea,select,video[controls],[tabindex]:not([tabindex="-1"])')].filter(n=>n.getClientRects().length);
      const first=list[0],last=list.at(-1);if(!first){e.preventDefault();return;}
      if(e.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){e.preventDefault();first.focus();}
    });
    let startedOutside=false;
    const outside=e=>{const b=dialog.getBoundingClientRect();return e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom;};
    dialog.addEventListener('pointerdown',e=>{startedOutside=e.target===dialog&&outside(e);});
    dialog.addEventListener('click',e=>{if(startedOutside&&e.target===dialog&&outside(e)){if(kind==='project'||kind==='tip')closeDetailRoute();else dialog.close();}startedOutside=false;});
  });
  const queueRoute=()=>{cancelAnimationFrame(routeFrame);routeFrame=requestAnimationFrame(()=>routeNow());};
  addEventListener('hashchange',queueRoute);addEventListener('popstate',queueRoute);
  addEventListener('resize',()=>{if(motion.animations.length)stopMotion();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMotion();document.querySelectorAll('#project-content video').forEach(v=>v.pause());}});
  reduceMotion.addEventListener('change',applyPreferences);
  // Reset a hidden note when a live draft is updated; accept messages only from the editor opener.
  function adoptDraft(draft) {
    if(!draft?.site||!Array.isArray(draft.projects))return false;
    ({site,projects,lab}=window.PortfolioSchema.normalize(draft));return true;
  }
  if(isDraft){
    adoptDraft(read(draftKey)||read('tam-portfolio-v3-draft'));
    const badge=document.createElement('div');badge.className='draft-badge';badge.textContent='LOCAL DRAFT PREVIEW';document.body.append(badge);
    addEventListener('message',e=>{
      if(!window.opener||e.source!==window.opener||e.data?.type!=='TAM_DRAFT_RESPONSE'||(location.protocol!=='file:'&&e.origin!==location.origin))return;
      if(adoptDraft(e.data.draft)){closeDetails();mounted.clear();currentView='';renderShell();routeNow(true);}
    });
    if(window.opener)window.opener.postMessage({type:'TAM_DRAFT_REQUEST'},location.protocol==='file:'?'*':location.origin);
  }
  renderShell();routeNow(true);
  window.TamPortfolio=Object.freeze({version:'4.0.0',get route(){return currentView;},get filter(){return projectState.filter;},get mounted(){return [...mounted];}});
})();
