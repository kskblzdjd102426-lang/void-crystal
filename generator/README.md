# 🏗️ 3D 网页生成器 + 教学指南

用一条命令生成带 proximity 交互、程序化几何、GPU 着色器的 3D 产品展示页。

---

## ⚡ 快速开始（30 秒出页面）

```bash
cd generator

# 生成一个霓虹风格的页面
node generate.js --preset neon --out 我的页面.html

# 生成暗黑风格
node generate.js --preset dark --out 暗黑风.html

# 生成水晶风格（默认）
node generate.js --preset crystal --out 水晶风.html
```

生成后双击 HTML 文件直接浏览器打开，不需要服务器。

---

## 🎨 三种预设风格对比

| | crystal | neon | dark |
|---|---|---|---|
| 几何体 | 二十面体(水晶) | TorusKnot(扭结) | 球体(有机) |
| 色调 | 暗蓝 → 金色 | 暗紫 → 品红 | 纯黑 → 白色 |
| 粒子 | 400+250 | 600+350 | 200+150 |
| 风格 | 高端科技感 | 赛博朋克 | 极简黑白 |
| 交互强度 | 中等 | 强烈 | 微妙 |

---

## 📝 怎么创建你自己的风格

最简方法：复制一个预设改几个关键值。

```bash
# 1. 复制一个预设
cp presets/crystal.json presets/my-style.json

# 2. 用任意编辑器打开 my-style.json，改颜色和文案
# 3. 生成
node generate.js --preset my-style.json --out 我的网站.html
```

---

## 🎛️ 配置参数完全说明

所有参数都在 JSON 配置文件里。下面是每一个参数的含义和怎么改。

### colors（颜色 —— 最重要）

```json
"colors": {
  "background": "#06060e",     // 网页背景色（深色最好看）
  "baseGeometry": "#15153a",   // 几何体基础色（远离鼠标时的颜色）
  "proximityGlow": "#ffb347",  // 鼠标靠近时的发光色（核心视觉！）
  "edgeAccent": "#64b5f6",     // 边缘轮廓光色
  "particle": "#aaddff",       // 粒子颜色
  "ring1": "#ffb347",          // 装饰环 1 颜色
  "ring2": "#64b5f6",          // 装饰环 2 颜色
  "ring3": "#ff6688"           // 装饰环 3 颜色
}
```

> **改风格最快的方式：只改 `proximityGlow` 和 `baseGeometry`，其他保持默认。**

颜色参考：
- 科技感：`#00ffff` (青) + `#003355` (暗蓝)
- 奢华感：`#ffd700` (金) + `#1a1a2e` (深蓝)
- 科技红：`#ff3366` (玫红) + `#1a0010` (深红)
- 极简：`#ffffff` (白) + `#111111` (深灰)

### geometry（几何体 —— 换形状）

```json
"geometry": {
  "type": "icosahedron",   // 形状类型
  "radius": 1.5,           // 大小
  "detail": 80,            // 细分度（20=低面数 120=高面数，越大越光滑但越吃配置）
  "noiseStrength": 0.45,   // 噪声强度（0=完美几何，0.5=很扭曲，1=面目全非）
  "noiseOctaves": 5        // 噪声层数（3=简单纹理，6=非常丰富）
}
```

可选的 `type`：
- `icosahedron` — 二十面体（水晶感）
- `sphere` — 球体（有机感）
- `torusKnot` — 扭结环（科幻感）
- `box` — 立方体（不建议，看着会比较奇怪）

### lights（灯光）

控制场景氛围。三个灯：主光(暖)、补光(冷)、轮廓光(背光)。

```json
"lights": {
  "keyColor": "#ffb347",     // 主光颜色
  "keyIntensity": 40,        // 主光亮度（30~80）
  "fillColor": "#4488ff",    // 补光颜色
  "fillIntensity": 20,       // 补光亮度
  "rimColor": "#ff4488",     // 轮廓光颜色
  "rimIntensity": 15         // 轮廓光亮度
}
```

### particles（粒子系统）

```json
"particles": {
  "orbitCount": 400,    // 轨道粒子数（0=不加，600=很多）
  "ambientCount": 250,  // 漂浮粒子数
  "wireRings": 3        // 装饰线框环（0~3）
}
```

> 粒子越多越好看，但手机/低配电脑会卡。手机端建议 orbitCount 不超过 200。

### proximity（鼠标交互强度）

```json
"proximity": {
  "radius": 1.6,           // 鼠标影响范围（1=小范围, 3=整个物体都受影响）
  "strength": 0.22,        // 变形强度（0=不变形, 0.5=鼓得厉害）
  "particleAttraction": 0.35  // 粒子吸引力（0=不动, 0.6=疯狂吸）
}
```

### camera（相机 / 视角）

```json
"camera": {
  "defaultZoom": 7,       // 默认距离
  "minZoom": 3.5,         // 最近
  "maxZoom": 12,          // 最远
  "rotationSpeed": 0.005, // 旋转灵敏度
  "inertia": 3.5          // 惯性（数字越大停得越快）
}
```

### ui（网页文字）

```json
"ui": {
  "logoBefore": "VOID",
  "logoAccent": "CRYSTAL",   // LOGO 的高亮部分
  "badge": "全新发布",
  "heading": "Void Crystal X1",
  "description": "产品描述文字",
  "stats": [
    { "value": "64K", "label": "顶点密度" },
    { "value": "0.3ms", "label": "着色延迟" }
  ],
  "ctaText": "探索更多 →"
}
```

---

## 🔧 高级：在 template.html 里直接改

配置文件只能改参数。如果你想改**行为**（比如换一种粒子运动方式、加一个新 3D 物体、改 shader 算法），就需要改 `template.html`。

### 模板文件结构

打开 `template.html`，搜索这些关键词定位到对应区域：

| 搜索关键词 | 对应区域 | 做什么 |
|---|---|---|
| `🎛️  JS 配置区` | CONFIG 对象 | 改默认参数值 |
| `🌊 3D 噪声函数` | hash3D/noise3D/fbm | 改噪声算法、花纹 |
| `🎨 GPU 着色器` | vertexShader/fragmentShader | 改 proximity 变形逻辑、颜色混合 |
| `🏗️ 构建几何体` | createBaseGeometry() | 换几何体类型、加自定义形状 |
| `✨ 粒子系统` | 轨道粒子/环境粒子 | 改粒子运动、数量、颜色 |
| `🖱️ 鼠标交互` | pointerdown/move/up | 改旋转、缩放行为 |
| `🔄 动画循环` | animate() | 改每帧更新的逻辑 |

### 常见需求：怎么在模板里添加新 3D 物体

找到 `🏗️ 构建几何体` 区域，在 `mainGroup.add(mainMesh)` 之后添加：

```javascript
// 添加一个简单的球体卫星
const satGeo = new THREE.SphereGeometry(0.15, 32, 32);
const satMat = new THREE.MeshStandardMaterial({
  color: CONFIG.colors.ring1,
  emissive: CONFIG.colors.ring1,
  emissiveIntensity: 0.5,
  roughness: 0.3,
  metalness: 0.8,
});
const satellite = new THREE.Mesh(satGeo, satMat);
satellite.position.set(2.5, 0, 0);  // 放在右边
mainGroup.add(satellite);
```

然后在 `animate()` 里让它旋转：

```javascript
satellite.position.x = Math.cos(time * 1.5) * 2.5;
satellite.position.z = Math.sin(time * 1.5) * 2.5;
```

### 常见需求：怎么改 shader

找到 `🔥 PROXIMITY 颜色混合` 注释处，改这一行：

```glsl
// 原版：proximity 区域变成 uColor2
vec3 base = mix(uColor1, uColor2, proximity);

// 改成：proximity 区域变成彩虹色
vec3 rainbow = 0.5 + 0.5 * cos(6.28 * (vWorldPos.x * 0.3 + uTime * 0.1) + vec3(0,2,4));
vec3 base = mix(uColor1, rainbow, proximity);
```

---

## 🚀 部署到域名

### 方法 1：GitHub Pages（推荐）

```bash
# 1. 把生成的 HTML 复制到仓库
cp output.html ../index.html

# 2. 推送
cd ..
git add index.html && git commit -m "更新页面" && git push
```

### 方法 2：Netlify Drop

打开 [app.netlify.com/drop](https://app.netlify.com/drop)，直接把生成的 HTML 拖进去。

### 方法 3：腾讯云 COS

在腾讯云控制台 → 对象存储 COS → 创建存储桶 → 开启静态网站托管 → 上传 HTML 文件。

---

## 📦 文件清单

```
procedural-showcase/
├── index.html              ← 原始页面（已部署到 kskblzdjd.cc）
├── generator/
│   ├── generate.js         ← 生成器脚本
│   ├── template.html       ← 模板（想深入改就改这个）
│   ├── README.md           ← 本文档
│   └── presets/
│       ├── crystal.json    ← 水晶风格预设
│       ├── neon.json       ← 霓虹风格预设
│       └── dark.json       ← 暗黑极简预设
```

---

## 🎯 学习路径建议

1. **先玩生成器**：改 preset JSON 里的颜色和文案，生成 5-10 个不同风格的页面，感受参数的影响
2. **再看模板**：打开 template.html，搜索关键注释，看懂每一段在干什么
3. **改 shader**：找到 `vertexShader` 里的 `infl = pow(infl, 2.5)`，把 2.5 改成 1.0 或 5.0，看效果变化
4. **加物体**：按上面「添加新 3D 物体」的方法，加一个旋转的文字或 logo
5. **自己的项目**：复制 presets/crystal.json，全部改成你自己的值，生成最终页面，部署
