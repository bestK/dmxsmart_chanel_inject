import { useEffect, useState } from 'react';

// 呼吸灯样式
const pulseStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'red',
    zIndex: 999999,
    animation: 'pulse 1.5s ease-in-out infinite',
} as const;

// 创建动画样式
const createPulseAnimation = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
            }
            
            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
            }
            
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
            }
        }
    `;
    document.head.appendChild(style);
};

// 检查是否是目标域名
const isTargetDomain = () => {
    return window.location.hostname === 'wms.dmxsmart.com';
};

// 监听 XHR 响应
window.addEventListener('message', function (event) {
    if (event.data.type === 'XHR_RESPONSE') {
        const { url, responseBody, requestBody } = event.data.data;
        if (url) {
            try {
                const pathname = new URL('https://wms.dmxsmart.com' + url).pathname;

                if (pathname === '/api/customer/sale/saleorder/list') {
                    console.log('event.data:', event.data);

                    const { data } = responseBody;

                    const orderShipMap = new Map<string, string>();
                    data.forEach((order: any) => {
                        orderShipMap.set(order.id, order.shipwayName);
                    });

                    console.log('content.tsx onMessage orderShipMap:', orderShipMap);

                    setOrderShipMap(orderShipMap);
                } else if (pathname === '/api/customer/sale/saleorder/getPlatformShipChannel') {
                    console.log('event.data:', event.data);
                    const { data } = responseBody;
                }
            } catch (e) {
                console.log('url:', url);
                console.error(e);
            }
        }
    }
});

function setOrderShipMap(orderShipMap: Map<string, string>) {
    // 先用获取到已经缓存的再合并然后缓存到 localStorage
    const cacheOrderShipMap = getOrderShipMap();
    // 将对象转换为 [key, value] 数组并确保类型正确
    const entries = Object.entries(cacheOrderShipMap).map(([key, value]) => [key, String(value)]) as [string, string][];
    const mergedOrderShipMap = new Map<string, string>(entries);

    orderShipMap.forEach((value, key) => {
        mergedOrderShipMap.set(key, value);
    });
    localStorage.setItem('orderShipMap', JSON.stringify(Object.fromEntries(mergedOrderShipMap)));
}

function getOrderShipMap() {
    return JSON.parse(localStorage.getItem('orderShipMap') || '{}');
}

function ContentScript() {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        // 检查域名并设置显示状态
        setShouldShow(isTargetDomain());

        if (isTargetDomain()) {
            // 只在目标域名下创建动画样式
            createPulseAnimation();
        }
    }, []);

    if (!shouldShow) return null;

    return <div style={pulseStyle} title="已启用自动物流方式" />;
}

export default ContentScript;
