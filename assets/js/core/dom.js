// js/core/dom.js
export const $ = (selector, parent = document) => parent.querySelector(selector);
export const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

export const safeAddEvent = (element, event, handler) => {
    if (!element) return false;
    element.addEventListener(event, handler);
    return true;
};

export const safeRemoveEvent = (element, event, handler) => {
    if (!element) return false;
    element.removeEventListener(event, handler);
    return true;
};

export const elementExists = (selector) => $(selector) !== null;

export const addClass = (element, className) => {
    if (element) element.classList.add(className);
};

export const removeClass = (element, className) => {
    if (element) element.classList.remove(className);
};

export const toggleClass = (element, className, force) => {
    if (element) element.classList.toggle(className, force);
};