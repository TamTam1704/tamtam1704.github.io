/* Visual shell for the eye experiment. The controller behavior is in scripts/eye-rig.js. */
window.PORTFOLIO_VIEWS.eyeLab = () => {
    const { esc, icon, text } = window.P;
    const slider = (name, key, min, max, value) => `
        <label class="eye-slider" for="eye-${name}">
            <span>${esc(text('eye.' + key))}<output data-eye-output="${name}" for="eye-${name}">${value}</output>
            </span>
            <input id="eye-${name}" data-eye-input="${name}" type="range" min="${min}" max="${max}" value="${value}" step="1">
        </label>
    `;
    return `
        <section class="eye-playground reveal" data-eye-rig aria-labelledby="eye-title">
            <div class="eye-introduction">
                <div>
                    <p class="eyebrow">
                        <span class="status-dot">
                        </span>${esc(text('eye.eyebrow'))}</p>
                    <h2 id="eye-title">${esc(text('eye.title'))} <em>${esc(text('eye.accent'))}</em>
                    </h2>
                </div>
                <p>${esc(text('eye.intro'))}</p>
            </div>
            <div class="eye-workspace">
                <div class="eye-stage" data-eye-stage aria-label="${esc(text('eye.faceLabel'))}">
                    <div class="eye-stage-header">
                        <span>${esc(text('eye.stageLabel'))}</span>
                        <span class="eye-live">
                            <i>
                            </i>${esc(text('eye.live'))}</span>
                    </div>
                    <div class="eye-character" aria-hidden="true">
                        <div class="eye-face">
                            <span class="eye-freckle freckle-left">
                            </span>
                            <span class="eye-freckle freckle-right">
                            </span>
                            <div class="eye-pair">
                                ${['left', 'right'].map((side) => `
        <div class="eye-socket eye-${side}">
            <span class="eye-brow">
            </span>
            <div class="eye-white">
                <span class="eye-pupil">
                    <i class="eye-highlight">
                    </i>
                </span>
                <span class="eye-lid lid-top">
                </span>
                <span class="eye-lid lid-bottom">
                </span>
            </div>
        </div>
    `).join('')}
                            </div>
                            <span class="eye-mouth">
                            </span>
                        </div>
                        <span class="eye-floor-shadow">
                        </span>
                    </div>
                    <div class="eye-stage-footer">
                        <span data-eye-mode>${esc(text('eye.manual'))}</span><code data-eye-coordinates>X +000 / Y +000</code></div>
                </div>
                <div class="eye-controls">
                    <div class="eye-look-control">
                        <div class="eye-controller-heading">
                            <span>${esc(text('eye.joystick'))}</span>${icon('sliders')}</div>
                        <button type="button" class="eye-pad" data-eye-pad aria-label="${esc(text('eye.joystickAria'))}" aria-describedby="eye-pad-help">
                            <span class="eye-pad-axis axis-x" aria-hidden="true">
                            </span>
                            <span class="eye-pad-axis axis-y" aria-hidden="true">
                            </span>
                            <span class="eye-pad-ring" aria-hidden="true">
                            </span>
                            <span class="eye-stick" aria-hidden="true">${icon('plus')}</span>
                        </button>
                        <p id="eye-pad-help" class="eye-control-help">${esc(text('eye.joystickHelp'))}</p>
                        <div class="eye-look-sliders">${slider('x', 'x', -100, 100, 0)}${slider('y', 'y', -100, 100, 0)}</div>
                    </div>
                    <div class="eye-expression-controls">
                        ${slider('left', 'left', 0, 100, 0)}
                        ${slider('right', 'right', 0, 100, 0)}
                        ${slider('expression', 'expression', -100, 100, 0)}
                        <div class="eye-options">
                            <label>
                                <input type="checkbox" data-eye-follow>${esc(text('eye.follow'))}</label>
                            <label>
                                <input type="checkbox" data-eye-auto>${esc(text('eye.autoBlink'))}</label>
                        </div>
                        <div class="eye-action-buttons">
                            <button type="button" class="button button-primary" data-eye-action="blink">${esc(text('eye.blink'))}</button>
                            <button type="button" class="button button-quiet" data-eye-action="left">${esc(text('eye.winkLeft'))}</button>
                            <button type="button" class="button button-quiet" data-eye-action="right">${esc(text('eye.winkRight'))}</button>
                        </div>
                        <button type="button" class="text-button eye-reset" data-eye-action="reset">${icon('refresh')} ${esc(text('eye.reset'))}</button>
                    </div>
                </div>
            </div>
            <p class="eye-footnote" data-eye-note>${esc(text('eye.note'))}</p>
        </section>
    `;
};
