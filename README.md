# bytebye

Farewell, but not goodbye. I'll see you when I see you.

一个复古像素风的告别小站，部署在 GitHub Pages 上。

## 部署前需要做的事

1. **配置匿名留言功能**：去 [formspree.io](https://formspree.io) 免费注册一个表单，绑定到你的邮箱，把拿到的 form ID 填进 `script.js` 里的 `FORMSPREE_ENDPOINT`（替换 `YOUR_FORM_ID`）。
2. **背景音乐**：把你想用的 mp3 文件放到 `assets/end_of_beginning.mp3`（文件名要一致，或者改 `index.html` 里 `<audio>` 标签的 `src`）。这个仓库本身不包含任何音频文件。

## 本地预览

直接用浏览器打开 `index.html`，或者起个本地服务器：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。
