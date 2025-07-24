var e,t;"function"==typeof(e=globalThis.define)&&(t=e,e=null),function(t,n,o,r,s){var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a="function"==typeof i[r]&&i[r],d=a.cache||{},u="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(e,n){if(!d[e]){if(!t[e]){var o="function"==typeof i[r]&&i[r];if(!n&&o)return o(e,!0);if(a)return a(e,!0);if(u&&"string"==typeof e)return u(e);var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}c.resolve=function(n){var o=t[e][1][n];return null!=o?o:n},c.cache={};var p=d[e]=new l.Module(e);t[e][0].call(p.exports,c,p,p.exports,this)}return d[e].exports;function c(e){var t=c.resolve(e);return!1===t?{}:l(t)}}l.isParcelRequire=!0,l.Module=function(e){this.id=e,this.bundle=l,this.exports={}},l.modules=t,l.cache=d,l.parent=a,l.register=function(e,n){t[e]=[function(e,t){t.exports=n},{}]},Object.defineProperty(l,"root",{get:function(){return i[r]}}),i[r]=l;for(var p=0;p<n.length;p++)l(n[p]);if(o){var c=l(o);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof e&&e.amd?e(function(){return c}):s&&(this[s]=c)}}({ds1Bn:[function(e,t,n){console.log("inject.ts");let o=`
const originalXHR = window.XMLHttpRequest;

window.XMLHttpRequest = function () {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;

    xhr.open = function () {
        xhr._method = arguments[0];
        xhr._url = arguments[1];
        return originalOpen.apply(this, arguments);
    };

    xhr.send = function (body) {
        xhr._requestBody = body;
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                const url = xhr._url;

                if (url.includes('/api/customer/sale/saleorder/getPlatformShipChannel')) {
                    // console.log('requestBody:', requestBody);
                    const orderShipMap = getOrderShipMap();
                    console.log('orderShipMap:', orderShipMap);

                    const { saleOrderIds } = JSON.parse(xhr._requestBody);

                    for (const orderId of saleOrderIds) {
                        const shipChannel = orderShipMap[orderId];
                        if (!shipChannel) {
                            const fakeResponse = {
                                success: false,
                                errorCode: 400,
                                errorMessage: '\u8bf7\u5148\u8bbe\u7f6e\u8ba2\u5355\u7684\u8fd0\u9001\u65b9\u5f0f',
                            };

                            Object.defineProperty(xhr, 'responseText', {
                                get: () => JSON.stringify(fakeResponse),
                            });

                            Object.defineProperty(xhr, 'response', {
                                get: () => JSON.stringify(fakeResponse),
                            });
                        } else {
                            const { data } = JSON.parse(xhr.responseText);
                            const usps = '604496950030336';
                            const gofo = '611054816309248';

                            const shipChannelId = shipChannel.toLowerCase().includes('usps') ? usps : gofo;

                            const shipChannels = data.filter(item => item.channelId === shipChannelId);

                            const fakeResponse = {
                                success: true,
                                data: shipChannels,
                            };

                            Object.defineProperty(xhr, 'responseText', {
                                get: () => JSON.stringify(fakeResponse),
                            });

                            Object.defineProperty(xhr, 'response', {
                                get: () => JSON.stringify(fakeResponse),
                            });
                        }
                    }
                }

                window.postMessage(
                    {
                        type: 'XHR_RESPONSE',
                        data: {
                            url: xhr._url,
                            method: xhr._method,
                            status: this.status,
                            responseBody: JSON.parse(this.responseText),
                            requestBody: JSON.parse(xhr._requestBody),
                        },
                    },
                    '*',
                );
            }
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };
        return originalSend.apply(this, arguments);
    };

    return xhr;
};

console.log('XMLHttpRequest has been patched');

function getOrderShipMap() {
    return JSON.parse(localStorage.getItem('orderShipMap') || '{}');
}


`,r=document.createElement("script");r.setAttribute("type","module");let s=new Blob([o],{type:"text/javascript"});function i(){let e=document.head||document.documentElement;e.appendChild(r),r.onload=function(){r.remove(),URL.revokeObjectURL(r.src)}}r.src=URL.createObjectURL(s),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",i):i()},{}]},["ds1Bn"],"ds1Bn","parcelRequire7f77"),globalThis.define=t;