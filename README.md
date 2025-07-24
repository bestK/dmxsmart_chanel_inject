# DMXSmart Channel Inject

这是一个用于拦截 DMXSmart API 请求的 Chrome 扩展。

## 功能

-   拦截并监控 `https://wms.dmxsmart.com/api/customer/sale/saleorder` 的请求
-   在网页中直接显示请求和响应数据
-   支持实时显示请求状态和响应内容
-   可关闭的悬浮窗显示界面

## 开发设置

1. 安装依赖：

```bash
npm install
```

2. 开发模式：

```bash
npm run dev
```

3. 构建扩展：

```bash
npm run build
```

## 使用方法

1. 在 Chrome 扩展管理页面启用开发者模式
2. 加载已解压的扩展（选择 build 目录）
3. 访问 DMXSmart 网站，扩展会自动监控指定的 API 请求
4. 当检测到目标请求时，会在页面右上角显示一个悬浮窗，展示请求和响应的详细信息
5. 点击悬浮窗右上角的 × 按钮可以关闭显示

## 权限说明

-   `webRequest`: 用于拦截网络请求
-   `storage`: 用于存储拦截到的请求数据
-   `host_permissions`: 允许访问 DMXSmart 域名
