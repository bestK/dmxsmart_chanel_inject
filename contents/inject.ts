// @plasmo-inject-css
// 创建一个新的 script 元素
const script = document.createElement('script');
script.setAttribute('type', 'module');
// const blob = new Blob([injectCode], { type: 'text/javascript' });
// script.src = URL.createObjectURL(blob);

script.src = chrome.runtime.getURL('contents/xhr.js');

// 等待 document 准备好
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectScript);
} else {
    injectScript();
}

function injectScript() {
    const target = document.head || document.documentElement;
    target.appendChild(script);
    script.onload = function () {
        script.remove();
        URL.revokeObjectURL(script.src);
    };
}
