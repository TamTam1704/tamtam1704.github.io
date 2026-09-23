/* Small, independent 2D eye rig. No perpetual animation loop and no dependencies. */
(() => {
    'use strict';
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    function mount(container) {
        if (!container) {
            return null;
        }
        const abort = new AbortController();
        const options = {
            signal: abort.signal
        };
        const pad = container.querySelector('[data-eye-pad]');
        const stick = container.querySelector('.eye-stick');
        const stage = container.querySelector('[data-eye-stage]');
        const follow = container.querySelector('[data-eye-follow]');
        const auto = container.querySelector('[data-eye-auto]');
        const state = {
            x: 0,
            y: 0,
            left: 0,
            right: 0,
            expression: 0
        };
        let motionEnabled = document.documentElement.dataset.motion !== 'off';
        let dragId = null;
        let blinkTimer = 0;
        let autoTimer = 0;
        let temporaryBlink = null;
        let destroyed = false;
        const text = window.P.text;
        function draw() {
            if (destroyed) {
                return;
            }
            const radius = Math.hypot(state.x, state.y);
            const x = radius > 100 ? state.x * 100 / radius : state.x;
            const y = radius > 100 ? state.y * 100 / radius : state.y;
            const padDistance = Math.max(0, (pad.clientWidth - stick.offsetWidth) / 2 - 10);
            stick.style.transform = `translate(${x * padDistance / 100}px, ${y * padDistance / 100}px)`;
            for (const side of ['left', 'right']) {
                const socket = container.querySelector('.eye-' + side);
                const white = socket.querySelector('.eye-white');
                const pupil = socket.querySelector('.eye-pupil');
                const rangeX = Math.max(0, (white.clientWidth - pupil.offsetWidth) / 2 - 8);
                const rangeY = Math.max(0, (white.clientHeight - pupil.offsetHeight) / 2 - 10);
                pupil.style.transform = `translate(${x * rangeX / 100}px, ${y * rangeY / 100}px)`;
                socket.style.setProperty('--eye-closed', (temporaryBlink?.[side] ?? state[side]) / 100);
                socket.style.setProperty('--eye-expression', state.expression / 100);
            }
            container.style.setProperty('--eye-expression', state.expression / 100);
            for (const key of Object.keys(state)) {
                const input = container.querySelector(`[data-eye-input="${key}"]`);
                if (input) {
                    input.value = state[key];
                }
                const output = container.querySelector(`[data-eye-output="${key}"]`);
                if (output) {
                    output.textContent = (state[key] > 0 && ['x', 'y', 'expression'].includes(key) ? '+' : '') + Math.round(state[key]);
                }
            }
            const number = (value) => (value < 0 ? '-' : '+') + String(Math.abs(Math.round(value))).padStart(3, '0');
            container.querySelector('[data-eye-coordinates]').textContent = `X ${number(x)} / Y ${number(y)}`;
            container.querySelector('[data-eye-mode]').textContent = text(follow.checked ? 'eye.following' : 'eye.manual');
        }
        function clearBlink() {
            clearTimeout(blinkTimer);
            temporaryBlink = null;
        }
        function blink(side = 'both') {
            clearBlink();
            temporaryBlink = {
                left: side === 'right' ? state.left : 100,
                right: side === 'left' ? state.right : 100
            };
            draw();
            blinkTimer = setTimeout(() => {
                temporaryBlink = null;
                draw();
            }, motionEnabled ? 170 : 100);
        }
        function scheduleBlink() {
            clearTimeout(autoTimer);
            if (!auto.checked || !motionEnabled || destroyed || document.hidden) {
                return;
            }
            autoTimer = setTimeout(() => {
                blink();
                scheduleBlink();
            }, 2500 + Math.random() * 1500);
        }
        function suspend() {
            clearTimeout(autoTimer);
            clearBlink();
            auto.checked = false;
            if (dragId !== null && pad.hasPointerCapture(dragId)) {
                pad.releasePointerCapture(dragId);
            }
            dragId = null;
            draw();
        }
        function setMotion(enabled) {
            motionEnabled = enabled;
            container.dataset.motion = enabled ? 'on' : 'off';
            auto.disabled = !enabled;
            if (!enabled) {
                suspend();
            }
            container.querySelector('[data-eye-note]').textContent = text(enabled ? 'eye.note' : 'eye.reduced');
            draw();
        }
        function pointToLook(event, element) {
            const box = element.getBoundingClientRect();
            const range = element === pad ? Math.max(1, (box.width - stick.offsetWidth) / 2 - 10) : box.width / 2;
            const vertical = element === pad ? range : box.height / 2;
            let x = clamp((event.clientX - box.left - box.width / 2) / range * 100, -100, 100);
            let y = clamp((event.clientY - box.top - box.height / 2) / vertical * 100, -100, 100);
            const length = Math.hypot(x, y);
            if (length > 100) {
                x *= 100 / length;
                y *= 100 / length;
            }
            state.x = Math.round(x);
            state.y = Math.round(y);
            draw();
        }
        pad.addEventListener('pointerdown', (event) => {
            if (event.button !== 0 || dragId !== null) {
                return;
            }
            follow.checked = false;
            dragId = event.pointerId;
            pad.setPointerCapture(dragId);
            pad.focus({
                preventScroll: true
            });
            pointToLook(event, pad);
            event.preventDefault();
        }, options);
        pad.addEventListener('pointermove', (event) => {
            if (event.pointerId === dragId) {
                pointToLook(event, pad);
            }
        }, options);
        const endDrag = (event) => {
            if (event.pointerId !== dragId) {
                return;
            }
            if (pad.hasPointerCapture(dragId)) {
                pad.releasePointerCapture(dragId);
            }
            dragId = null;
        };
        for (const name of ['pointerup', 'pointercancel', 'lostpointercapture'])
            pad.addEventListener(name, endDrag, options);
        pad.addEventListener('keydown', (event) => {
            const step = event.shiftKey ? 20 : 5;
            const directions = {
                ArrowLeft: [-step, 0],
                ArrowRight: [step, 0],
                ArrowUp: [0, -step],
                ArrowDown: [0, step]
            };
            if (event.key === 'Home' || event.key === '0') {
                state.x = 0;
                state.y = 0;
            }
            else if (directions[event.key]) {
                state.x = clamp(state.x + directions[event.key][0], -100, 100);
                state.y = clamp(state.y + directions[event.key][1], -100, 100);
            }
            else {
                return;
            }
            follow.checked = false;
            event.preventDefault();
            draw();
        }, options);
        stage.addEventListener('pointermove', (event) => {
            if (follow.checked) {
                pointToLook(event, stage);
            }
        }, options);
        stage.addEventListener('pointerdown', (event) => {
            if (follow.checked) {
                pointToLook(event, stage);
            }
        }, options);
        container.addEventListener('input', (event) => {
            const input = event.target.closest('[data-eye-input]');
            if (!input) {
                return;
            }
            const key = input.dataset.eyeInput;
            if (!Object.prototype.hasOwnProperty.call(state, key)) {
                return;
            }
            clearBlink();
            state[key] = clamp(Number(input.value) || 0, Number(input.min), Number(input.max));
            if (key === 'x' || key === 'y') {
                follow.checked = false;
            }
            draw();
        }, options);
        follow.addEventListener('change', draw, options);
        auto.addEventListener('change', scheduleBlink, options);
        container.addEventListener('click', (event) => {
            const action = event.target.closest('[data-eye-action]')?.dataset.eyeAction;
            if (action === 'reset') {
                suspend();
                Object.keys(state).forEach((key) => {
                    state[key] = 0;
                });
                follow.checked = false;
                draw();
            }
            else if (action === 'blink') {
                blink();
            }
            else if (action === 'left' || action === 'right') {
                blink(action);
            }
        }, options);
        const resize = new ResizeObserver(draw);
        resize.observe(stage);
        resize.observe(pad);
        setMotion(motionEnabled);
        return {
            setMotion,
            suspend,
            snapshot: () => ({
                ...state,
                auto: auto.checked,
                follow: follow.checked
            }),
            destroy() {
                suspend();
                destroyed = true;
                resize.disconnect();
                abort.abort();
            }
        };
    }
    window.EyePlayground = Object.freeze({
        mount
    });
})();
