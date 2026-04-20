# three-body-anime

《三体》主题的小型动画演示项目，围绕三体世界中的多种典型天象做可视化呈现。

## 目录说明

- `index.html`：当前直接运行入口
- `scene.jsx`：分镜、文案、界面排版
- `simulation.jsx`：场景参数与动力学仿真
- `animations.jsx`：时间轴与动画基础能力
- `tweaks.jsx`：调参面板相关代码

## 本地运行

项目当前是静态页面，直接在项目目录启动一个本地 HTTP 服务即可：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://127.0.0.1:8000/
```

## 说明

- 运行入口依赖页面内联脚本与 CDN 资源
- `preview/` 与 `screenshots/` 为过程产物，当前已加入 `.gitignore`
