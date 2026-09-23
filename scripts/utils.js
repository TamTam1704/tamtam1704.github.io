/* Shared helpers. Content strings are escaped before being inserted into the page. */
(() => {
    'use strict';
    const paths = {
        search: `
        <circle cx="10.5" cy="10.5" r="6.5"/>
        <path d="m16 16 5 5"/>
    `,
        lab: `
        <path d="M9 3h6M10 3v7L4 19a1.3 1.3 0 0 0 1 2h14a1.3 1.3 0 0 0 1-2l-6-9V3M7 15h10"/>
    `,
        bookmark: `
        <path d="M6 3h12v18l-6-4-6 4Z"/>
    `,
        book: `
        <path d="M12 5v16M12 5C8 2 4 3 2 4v15c3-1 6-1 10 2 4-3 7-3 10-2V4c-2-1-6-2-10 1Z"/>
    `,
        list: `
        <path d="M8 5h13M8 12h13M8 19h13M3 5h.1M3 12h.1M3 19h.1"/>
    `,
        clock: `
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l3 2"/>
    `,
        code: `
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>
    `,
        'arrow-up': `
        <path d="M7 17 17 7M6 7h11v11"/>
    `,
        arrow: `
        <path d="M4 12h15m-6-6 6 6-6 6"/>
    `,
        close: `
        <path d="m6 6 12 12M18 6 6 18"/>
    `,
        home: `
        <path d="m3 10 9-7 9 7v10H3Z"/>
        <path d="M9 20v-7h6v7"/>
    `,
        grid: `
        <rect x="3" y="3" width="7" height="7" rx="2"/>
        <rect x="14" y="3" width="7" height="7" rx="2"/>
        <rect x="3" y="14" width="7" height="7" rx="2"/>
        <rect x="14" y="14" width="7" height="7" rx="2"/>
    `,
        person: `
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21v-2a8 8 0 0 1 16 0v2"/>
    `,
        mail: `
        <rect x="3" y="5" width="18" height="14" rx="3"/>
        <path d="m4 7 8 6 8-6"/>
    `,
        play: `
        <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke-linejoin="round"/>
    `,
        pause: `
        <path d="M8 5v14M16 5v14" stroke-width="4"/>
    `,
        sliders: `
        <path d="M4 7h9m4 0h3M4 17h3m4 0h9"/>
        <circle cx="15" cy="7" r="2"/>
        <circle cx="9" cy="17" r="2"/>
    `,
        copy: `
        <rect x="8" y="8" width="12" height="12" rx="3"/>
        <path d="M15 4H7a3 3 0 0 0-3 3v8"/>
    `,
        check: `
        <path d="m5 12 4 4L19 6"/>
    `,
        refresh: `
        <path d="M20 7v5h-5M4 17v-5h5"/>
        <path d="M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1"/>
    `,
        film: `
        <rect x="3" y="4" width="18" height="16" rx="3"/>
        <path d="M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/>
    `,
        star: `
        <path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10C11 16 8 13 2 12 8 11 11 8 12 2Z" fill="currentColor" stroke="none"/>
    `,
        spark: `
        <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" stroke-width="4"/>
        <circle cx="12" cy="12" r="3.5" fill="currentColor"/>
    `,
        sun: `
        <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5M8.2 2.8l7.6 18.4M2.8 8.2l18.4 7.6M2.8 15.8l18.4-7.6M8.2 21.2l7.6-18.4"/>
    `,
        linkedin: `
        <path d="M5 9v11M10 20V9m0 5a5 5 0 0 1 10 0v6" stroke-width="3"/>
        <circle cx="5" cy="4" r="1.6" fill="currentColor" stroke="none"/>
    `,
        behance: `
        <path d="M3 5h5a3.5 3.5 0 0 1 0 7H3m5 0a3.5 3.5 0 0 1 0 7H3V5m11 9h8a4 4 0 0 0-8 0v1a4 4 0 0 0 7 3M15 7h6"/>
    `,
        instagram: `
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    `,
        pin: `
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/>
        <circle cx="12" cy="10" r="2"/>
    `,
        globe: `
        <circle cx="12" cy="12" r="9"/>
        <ellipse cx="12" cy="12" rx="4" ry="9"/>
        <path d="M3 12h18"/>
    `,
        capcut: `
        <path d="M4 5h16v4L4 19h16v-4L4 5Zm0 4 16 10M4 5v4m16 6v4" stroke-width="2.3"/>
    `,
        blender: `
        <path d="m4 5 8 5M2 10h10M7 3l10 7" stroke-width="2.6"/>
        <ellipse cx="14" cy="14" rx="8" ry="6" stroke-width="2.8"/>
        <circle cx="14" cy="14" r="2.5" fill="currentColor" stroke="none"/>
    `,
        unity: `
        <path d="m12 2 9 5v10l-9 5-9-5V7Z"/>
        <path d="m3 7 9 5 9-5M12 12v10M12 2v5m9 10-4-2M3 17l4-2" stroke-width="2.5"/>
    `,
        grok: `
        <path d="m5 19 15-15M15 4a8 8 0 1 0 5 9M8 17l3 3 9-3 1-9" stroke-width="2.4"/>
    `,
        plus: `
        <path d="M12 5v14M5 12h14"/>
    `,
        download: `
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>
    `,
        trash: `
        <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>
    `,
        camera: `
        <path d="M8 5h8l2 3h3v12H3V8h3Z"/>
        <circle cx="12" cy="13" r="4"/>
    `,
        music: `
        <path d="M9 18V5l11-2v13M9 9l11-2"/>
        <ellipse cx="6" cy="18" rx="3" ry="2"/>
        <ellipse cx="17" cy="16" rx="3" ry="2"/>
    `
    };
    const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
    const icon = (name, className = '') => `
        <svg class="icon ${esc(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.star}</svg>
    `;
    const safeURL = (value, allowLocal = false) => {
        if (typeof value !== 'string' || !value.trim()) {
            return '';
        }
        try {
            const url = new URL(value, document.baseURI);
            if (['http:', 'https:'].includes(url.protocol)) {
                return value;
            }
            if (allowLocal && url.protocol === 'file:' && !/^[a-z]+:/i.test(value)) {
                return value;
            }
        }
        catch (_) {
        }
        return '';
    };
    const storedImage = (value) => /^data:image\/(?:webp|png|jpeg|gif|svg\+xml);base64,[a-zA-Z0-9+/=]+$/.test(value || '') ? value : (safeURL(value, true) || 'assets/hero.webp');
    // Uploaded draft assets are resolved only in the editor or an explicit draft preview.
    const image = (value) => storedImage(window.PORTFOLIO_ASSETS?.[value] || value);
    const text = (key, values = {}) => {
        const result = key.split('.').reduce((node, part) => node?.[part], window.PORTFOLIO_SITE.copy);
        return String(result ?? key).replace(/\{(\w+)\}/g, (token, name) => Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token);
    };
    const lines = (key, values = {}) => esc(text(key, values)).split('\n').join(`
        <br>
    `);
    const categoryLabel = (category) => {
        const keys = {
            'All Work': 'all',
            Motion: 'motion',
            '3D': 'threeD',
            Story: 'story',
            Design: 'design',
            Ads: 'ads',
            Social: 'social'
        };
        return keys[category] ? text('projects.' + keys[category]) : category;
    };
    const topicLabel = (topic) => topic === 'All Notes' ? text('lab.all') : topic;
    const isGallery = (project) => project.mediaType === 'gallery' || project.category === 'Design';
    const galleryImages = (project) => {
        const entries = Array.isArray(project.images) ? project.images : [];
        const images = entries.map((item) => typeof item === 'string' ? {
            src: item,
            alt: '',
            caption: ''
        } : item)
            .filter((item) => item && typeof item.src === 'string' && item.src.trim());
        return images.length ? images : [
            {
                src: project.cover || 'assets/hero.webp',
                alt: project.title,
                caption: ''
            }
        ];
    };
    const color = (value, fallback = '#d5f66b') => /^#[0-9a-f]{3,8}$/i.test(value || '') ? value : fallback;
    const position = (value) => /^[\d.%-]+%?\s+(?:[\d.%-]+%?|center|top|bottom)$/.test(value || '') ? value : '50% 50%';
    const gmail = (subject = text('contact.defaultSubject', {
        name: window.PORTFOLIO_SITE.name
    }), body = '') => `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(window.PORTFOLIO_SITE.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const videoInfo = (source) => {
        const safe = safeURL(source, true);
        if (!safe) {
            return null;
        }
        try {
            const url = new URL(safe, document.baseURI);
            const host = url.hostname.replace(/^www\./, '');
            if ([
                "youtube.com",
                "m.youtube.com",
                "youtube-nocookie.com",
                "youtu.be"
            ].includes(host)) {
                const id = host === 'youtu.be' ? url.pathname.split('/')[1] : (url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop());
                if (/^[a-zA-Z0-9_-]{11}$/.test(id || '')) {
                    return {
                        type: 'youtube',
                        id,
                        url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`,
                        original: safe
                    };
                }
                return null;
            }
            if (host === 'vimeo.com' || host === 'player.vimeo.com') {
                const parts = url.pathname.split('/').filter(Boolean);
                const id = parts.find((p) => /^\d+$/.test(p));
                const hash = url.searchParams.get('h') || parts[parts.indexOf(id) + 1];
                if (id) {
                    return {
                        type: 'vimeo',
                        url: `https://player.vimeo.com/video/${id}?autoplay=1${hash && /^[a-zA-Z0-9]+$/.test(hash) ? `&h=${hash}` : ''}`,
                        original: safe
                    };
                }
                return null;
            }
            if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) {
                return {
                    type: 'file',
                    url: safe,
                    original: safe
                };
            }
        }
        catch (_) {
        }
        return null;
    };
    const tags = (items, className = 'tag') => (Array.isArray(items) ? items : []).map((t) => `
        <span class="${className}">${esc(t)}</span>
    `).join('');
    const tool = (item) => `
        <div class="tool-tile">
            <span class="tool-mark" style="--tool-color:${color(item.color)};--tool-bg:${color(item.background, '#252b35')}">${item.icon ? `
        <img src="${esc(image(item.icon))}" alt="" loading="lazy" width="30" height="30">
    ` : (paths[item.mark] ? icon(item.mark) : esc(item.mark))}</span>
            <span>${esc(item.name)}</span>
        </div>
    `;
    const categories = [
        "All Work",
        "Motion",
        "3D",
        "Story",
        "Design",
        "Ads",
        "Social"
    ];
    const inCategory = (project, category) => category === 'All Work' || ((category !== 'Design' || isGallery(project)) && (project.category === category || (project.categories || []).includes(category)));
    window.P = {
        text,
        lines,
        categoryLabel,
        topicLabel,
        isGallery,
        galleryImages,
        categories,
        inCategory,
        esc,
        icon,
        safeURL,
        image,
        color,
        position,
        gmail,
        videoInfo,
        tags,
        tool
    };
    window.PORTFOLIO_VIEWS = {};
})();
