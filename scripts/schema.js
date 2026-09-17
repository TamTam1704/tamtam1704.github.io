/* Compatibility layer: older Content Studio exports keep working. */
(() => {
  'use strict';
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const defaults = clone({site: window.PORTFOLIO_SITE, projects: window.PORTFOLIO_PROJECTS, lab: window.PORTFOLIO_LAB || []});
  const legacy = {Trailers: 'Story', 'Game ads': 'Ads', 'All work': 'All Work'};
  function normalize(value) {
    const s = value?.site || {};
    const site = {...defaults.site, ...s, theme:{...defaults.site.theme, ...s.theme}, lab:{...defaults.site.lab, ...s.lab}};
    const projects = (Array.isArray(value?.projects) ? value.projects : defaults.projects).map((p) => {
      const candidate = legacy[p.category] || p.category || 'Motion';
      const category = window.P.categories.slice(1).find(c=>c.toLowerCase()===String(candidate).toLowerCase()) || 'Motion';
      return {...p, category, categories: [...new Set([category, ...(Array.isArray(p.categories) ? p.categories : []).map(c => legacy[c] || c)])].filter(c => window.P.categories.includes(c) && c !== 'All Work'), caseStudy:{brief:'',role:'',process:'',outcome:'',...p.caseStudy}, compare:{before:'',after:'',beforeLabel:'Before',afterLabel:'After',...p.compare}};
    });
    const lab = (Array.isArray(value?.lab) ? value.lab : defaults.lab).map(t => ({topic:'Workflow', kind:'Quick tip', summary:'', version:'', visual:'workflow', sample:true, published:true, body:'',steps:[],code:'',sourceTitle:'',sourceURL:'',video:'',downloadURL:'',...t}));
    return {site, projects, lab};
  }
  window.PortfolioSchema = {normalize, defaults};
})();
