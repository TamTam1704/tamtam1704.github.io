/* Normalize old and new exports without erasing user content. */
(() => {
    'use strict';
    const clone = (value) => JSON.parse(JSON.stringify(value));
    const defaults = clone({
        site: window.PORTFOLIO_SITE,
        projects: window.PORTFOLIO_PROJECTS,
        lab: window.PORTFOLIO_LAB || [],
        assets: {}
    });
    const legacy = {
        Trailers: 'Story',
        'Game ads': 'Ads',
        'All work': 'All Work'
    };
    const blockedKeys = new Set(['__proto__', 'constructor', 'prototype']);
    function merge(defaultValue, incoming) {
        if (Array.isArray(defaultValue)) {
            return clone(Array.isArray(incoming) ? incoming : defaultValue);
        }
        if (defaultValue && typeof defaultValue === 'object') {
            const output = clone(defaultValue);
            if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
                return output;
            }
            for (const key of Object.keys(incoming)) {
                if (blockedKeys.has(key)) {
                    continue;
                }
                output[key] = key in defaultValue ? merge(defaultValue[key], incoming[key]) : clone(incoming[key]);
            }
            return output;
        }
        return typeof incoming === typeof defaultValue ? incoming : defaultValue;
    }
    function normalize(value) {
        const site = merge(defaults.site, value?.site);
        const projects = (Array.isArray(value?.projects) ? value.projects : defaults.projects).map((p) => {
            const candidate = legacy[p.category] || p.category || 'Motion';
            const category = window.P.categories.slice(1).find((c) => c.toLowerCase() === String(candidate).toLowerCase()) || 'Motion';
            const mediaType = category === 'Design' || p.mediaType === 'gallery' ? 'gallery' : 'video';
            const categories = [...new Set([category, ...(Array.isArray(p.categories) ? p.categories : []).map((c) => legacy[c] || c)])]
                .filter((c) => window.P.categories.includes(c) && c !== 'All Work' && (c !== 'Design' || mediaType === 'gallery'));
            return {
                video: '',
                cover: 'assets/hero.webp',
                coverPosition: '50% 50%',
                aspect: '16/9',
                description: '',
                subtitle: '',
                tags: [],
                tools: [],
                link: '',
                preview: true,
                featured: false,
                ...p,
                category,
                categories,
                mediaType,
                images: (Array.isArray(p.images) ? p.images : []).map((item) => typeof item === 'string' ? {
                    src: item,
                    alt: '',
                    caption: ''
                } : {
                    src: '',
                    alt: '',
                    caption: '',
                    ...item
                }),
                caseStudy: {
                    brief: '',
                    role: '',
                    process: '',
                    outcome: '',
                    ...p.caseStudy
                },
                compare: {
                    before: '',
                    after: '',
                    beforeLabel: 'Before',
                    afterLabel: 'After',
                    ...p.compare
                }
            };
        });
        const lab = (Array.isArray(value?.lab) ? value.lab : defaults.lab).map((t) => ({
            topic: 'Workflow',
            kind: 'Quick tip',
            summary: '',
            version: '',
            visual: 'workflow',
            sample: true,
            published: true,
            body: '',
            steps: [],
            code: '',
            sourceTitle: '',
            sourceURL: '',
            video: '',
            downloadURL: '',
            demoGif: '',
            demoPoster: '',
            demoAlt: '',
            demoCaption: '',
            ...t
        }));
        const assets = {};
        for (const [path, data] of Object.entries(value?.assets || {})) {
            if (/^assets\/uploads\/[a-z0-9._-]+\.(png|jpe?g|webp|gif)$/.test(path)
                && typeof data === 'string'
                && /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(data)) {
                assets[path] = data;
            }
        }
        return {
            site,
            projects,
            lab,
            assets
        };
    }
    window.PortfolioSchema = {
        normalize,
        defaults
    };
})();
