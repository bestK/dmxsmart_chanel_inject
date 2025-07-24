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
                                errorMessage: '请先设置订单的运送方式',
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
