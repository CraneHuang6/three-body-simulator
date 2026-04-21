# 三体模拟器前端增强设计文档

## 设计概述

本设计覆盖三个前端功能增强，全部在现有方案一（最小侵入式改动）框架内实现：

1. **全局 BGM 音量控制** — 在观演模式与模拟器模式的顶部工具栏添加音量滑块。
2. **模拟器自动重置** — 当所有天体因碰撞全部消失后，自动重建仿真并恢复播放。
3. **首页标题精简** — 将长句标题替换为短句标语，并微调排版。

## 1. BGM 音量控制

### 1.1 数据流

```
App.jsx
├── bgmVolume: number          // 新增 state，默认 0.55
├── setBgmVolume: function     // 新增 setter
│
├── LoopingBgm                 // 新增 volume prop
│   └── audio.volume = volume  // useEffect 同步
│
├── StoryMode                  // 新增 volume + onVolumeChange props
│   └── VolumeControl
│
└── SimulatorMode              // 新增 volume + onVolumeChange props
    └── VolumeControl
```

### 1.2 组件接口

```jsx
// src/components/VolumeControl.jsx
export function VolumeControl({ value, onChange })
// value: 0..1
// onChange: (value) => void
```

### 1.3 交互细节

- **图标点击**：图标作为一个 toggle，点击时如果 `value > 0`，记录当前值并设为 `0`；再次点击时恢复到记录的值。
- **滑块**：`input[type="range"]`，`min=0`，`max=1`，`step=0.01`。使用 `styles.css` 中已定义的自定义滑块样式。
- **布局**：`VolumeControl` 为 `inline-flex`，`gap: 8px`，`align-items: center`。放在 `.toolbar-actions` 的最左侧，在所有其他按钮之前。

### 1.4 样式

- 图标尺寸 `18px`，颜色 `var(--muted)`，hover 时 `var(--text)`。
- 滑块宽度 `80px`，thumb 缩小为 `10px`，track 高 `3px`。

## 2. 模拟器自动重置

### 2.1 检测与触发

在 `SimulatorMode` 的渲染逻辑中，每次 `snapshot` 更新后检查：

```js
const allDestroyed = snapshot.every(b => !b.alive);
```

触发条件：
1. `allDestroyed === true`
2. `playing === true`（播放中才自动重建）
3. `autoResetCounter` 未在最近 `1.5s` 内变化（防抖，防止连续触发）

### 2.2 重建机制

`cache` 的 `useMemo` 依赖数组增加 `autoResetCounter`：

```js
const cache = React.useMemo(() => createSimulationCache(...), [
  physicsKey,
  simulatorState.simConfig.duration,
  simulatorState.simConfig.noStarCollisions,
  simulatorState.simConfig.simSpeed,
  autoResetCounter, // 新增
]);
```

当自动重置触发时：
1. `setPlaying(false)` — 暂停。
2. `setAutoResetCounter(c => c + 1)` — 强制 `useMemo` 重新计算 `cache`。
3. `setSimTime(0)` — 时间归零。
4. `setPlaying(true)` — 在短暂延迟（约 300ms）后自动恢复播放。

### 2.3 用户提示

在 canvas 中央显示一个半透明覆盖层，文案：

> 漫长的时间后，生命和文明将重新启动，再次开启在三体世界中命运莫测地进化……

- 字体：`var(--font-hud)`，`16px`，`color: var(--text)`，`text-align: center`。
- 背景：`rgba(5, 6, 11, 0.72)`，backdrop-filter blur `12px`。
- 显示时机：`autoResetCounter` 变化时立即显示。
- 淡出：`1.5s` 后 opacity 过渡到 `0`，transition `800ms ease`。
- 完全隐藏：`transitionend` 后移除 DOM（用 `isVisible` state + setTimeout 控制）。

### 2.4 边界情况

| 场景 | 行为 |
|------|------|
| 用户手动「重置参数」 | 正常重置，不显示自动重置提示 |
| 用户手动「重置时间」 | 正常重置，不显示自动重置提示 |
| 用户已暂停，天体全灭 | 不自动重建，保持暂停状态 |
| 连续快速重建（极端参数） | 防抖机制确保间隔 ≥1.5s |

## 3. 首页标题排版

### 3.1 文案变更

当前：

```html
<h1>既能观看三体八大天象，也能进入模拟器手动调参</h1>
```

新文案：

```html
<h1>三体世界 · 八大天象 · 实时模拟</h1>
```

### 3.2 样式调整

`.home-copy h1` 的变更：

| 属性 | 原值 | 新值 | 原因 |
|------|------|------|------|
| max-width | 11ch | 18ch | 短句不需要过紧约束 |
| letter-spacing | -0.03em | 0.04em | 字少时适当拉开 |
| line-height | 0.94 | 1.05 | 多点呼吸感 |
| margin-bottom | 18px | 24px | 与下方段落更均衡 |

`.home-copy .eyebrow` 增加 `margin-bottom: 8px`，让 eyebrow 与标题的呼吸感更均匀。

## 4. 依赖与影响面

| 文件 | 变更类型 |
|------|----------|
| `src/App.jsx` | 新增 `bgmVolume` state，修改 props 传递 |
| `src/components/LoopingBgm.jsx` | 新增 `volume` prop，同步到 audio 元素 |
| `src/components/VolumeControl.jsx` | **新建** |
| `src/modes/SimulatorMode.jsx` | 新增 `autoResetCounter`、提示覆盖层、接收 volume props |
| `src/modes/StoryScene.jsx` | 接收 volume props |
| `src/styles.css` | 新增 `VolumeControl` 样式、调整 `.home-copy h1` 样式 |

## 5. 验收标准

1. **音量控制**：
   - 观演模式和模拟器模式的工具栏都有音量图标和滑块。
   - 滑块拖动时 BGM 音量实时变化。
   - 点击图标可静音/恢复。
   - 切换模式后音量保持（App 级 state）。

2. **自动重置**：
   - 在模拟器中设置极端参数（如大质量恒星近距离），等待碰撞发生后所有天体消失。
   - 画面中央出现提示文案，随后仿真自动重建并恢复播放。
   - 暂停状态下天体全灭不会自动重建。

3. **首页标题**：
   - 首页显示「三体世界 · 八大天象 · 实时模拟」。
   - 标题行高、字距、下边距符合设计规范。

4. **回归测试**：
   - `npm test` 全部通过。
