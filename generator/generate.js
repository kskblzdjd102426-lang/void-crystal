#!/usr/bin/env node

/**
 * 🏗️ 3D Showcase Generator
 * 把 template.html + preset.json → 生成完整网页
 *
 * 用法:
 *   node generate.js                          # 默认生成 crystal 风格
 *   node generate.js --preset neon            # 使用 presets/neon.json
 *   node generate.js --preset dark --out my-page.html
 *   node generate.js --preset custom.json     # 用你自己的配置
 *
 * 最简单的方式: 复制 presets/crystal.json 改几个值，然后:
 *   node generate.js --preset my-config.json --out 我的页面.html
 */

const fs = require('fs');
const path = require('path');

// ── 解析命令行参数 ──
const args = process.argv.slice(2);
const getArg = (name, def) => {
  const idx = args.indexOf('--' + name);
  return idx >= 0 ? args[idx + 1] : def;
};

const presetName = getArg('preset', 'crystal');
const outFile    = getArg('out', 'output.html');

// ── 加载 preset ──
let preset;
const presetPath = presetName.endsWith('.json')
  ? (path.isAbsolute(presetName) ? presetName : path.resolve(presetName))
  : path.join(__dirname, 'presets', presetName + '.json');

if (!fs.existsSync(presetPath)) {
  console.error(`❌ Preset 不存在: ${presetPath}`);
  console.error('\n可用的预设:');
  fs.readdirSync(path.join(__dirname, 'presets')).forEach(f => {
    console.error(`  - ${f.replace('.json', '')}`);
  });
  process.exit(1);
}

preset = JSON.parse(fs.readFileSync(presetPath, 'utf-8'));

// ── 加载模板 ──
const templatePath = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

// ── 占位符替换 ──
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r}, ${g}, ${b}`;
}

// 统计数据 HTML
const statsHtml = (preset.ui?.stats || ['64K', '0.3ms', '∞'].map((v, i) => {
  const labels = ['顶点密度', '着色延迟', '几何变体'];
  return { value: v, label: labels[i] || '' };
})).map(s =>
  `<div class="stat"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`
).join('\n');

const replacements = {
  TITLE:       preset.meta?.title || '3D Showcase',
  CSS_BG:      preset.colors?.background || '#06060e',
  CSS_ACCENT:  preset.colors?.proximityGlow || '#ffb347',
  CSS_ACCENT_DIM: `rgba(${hexToRgb(preset.colors?.proximityGlow || '#ffb347')}, 0.5)`,
  CSS_TEXT:    'rgba(255,255,255,0.85)',
  CSS_TEXT_DIM: 'rgba(255,255,255,0.5)',
  CSS_BADGE_BG: `rgba(${hexToRgb(preset.colors?.proximityGlow || '#ffb347')}, 0.1)`,
  CSS_BADGE_BORDER: `rgba(${hexToRgb(preset.colors?.proximityGlow || '#ffb347')}, 0.2)`,
  CSS_ACCENT_SHADOW: `rgba(${hexToRgb(preset.colors?.proximityGlow || '#ffb347')}, 0.3)`,
  CSS_PROXIMITY_RING: `rgba(${hexToRgb(preset.colors?.proximityGlow || '#ffb347')}, 0.2)`,
  CSS_PROXIMITY_GLOW: `rgba(${hexToRgb(preset.colors?.proximityGlow || '#ffb347')}, 0.08)`,

  LOGO_BEFORE: preset.ui?.logoBefore || 'VOID',
  LOGO_ACCENT: preset.ui?.logoAccent || 'CRYSTAL',
  BADGE_TEXT:  preset.ui?.badge || '全新发布',
  HEADING:     preset.ui?.heading || '产品名称',
  DESCRIPTION: preset.ui?.description || '产品描述文字，介绍核心功能和亮点。',
  STATS_HTML:  statsHtml,
  CTA_TEXT:    preset.ui?.ctaText || '了解更多 →',

  GEO_TYPE:    preset.geometry?.type || 'icosahedron',
  GEO_RADIUS:  preset.geometry?.radius || 1.5,
  GEO_DETAIL:  preset.geometry?.detail || 80,
  GEO_NOISE:   preset.geometry?.noiseStrength || 0.45,
  GEO_OCTAVES: preset.geometry?.noiseOctaves || 5,

  COLOR_BASE:       preset.colors?.baseGeometry || '#15153a',
  COLOR_PROXIMITY:  preset.colors?.proximityGlow || '#ffb347',
  COLOR_EDGE:       preset.colors?.edgeAccent || '#64b5f6',
  COLOR_PARTICLE:   preset.colors?.particle || '#aaddff',
  COLOR_RING1:      preset.colors?.ring1 || '#ffb347',
  COLOR_RING2:      preset.colors?.ring2 || '#64b5f6',
  COLOR_RING3:      preset.colors?.ring3 || '#ff6688',

  LIGHT_KEY:      preset.lights?.keyColor || '#ffb347',
  LIGHT_KEY_INT:  preset.lights?.keyIntensity || 40,
  LIGHT_FILL:     preset.lights?.fillColor || '#4488ff',
  LIGHT_FILL_INT: preset.lights?.fillIntensity || 20,
  LIGHT_RIM:      preset.lights?.rimColor || '#ff4488',
  LIGHT_RIM_INT:  preset.lights?.rimIntensity || 15,

  PARTICLE_ORBIT:   preset.particles?.orbitCount ?? 400,
  PARTICLE_AMBIENT: preset.particles?.ambientCount ?? 250,
  PARTICLE_RINGS:   preset.particles?.wireRings ?? 3,

  PROX_RADIUS:   preset.proximity?.radius ?? 1.6,
  PROX_STRENGTH: preset.proximity?.strength ?? 0.22,
  PROX_PARTICLE: preset.proximity?.particleAttraction ?? 0.35,

  CAM_ZOOM:       preset.camera?.defaultZoom ?? 7,
  CAM_MIN_ZOOM:   preset.camera?.minZoom ?? 3.5,
  CAM_MAX_ZOOM:   preset.camera?.maxZoom ?? 12,
  CAM_ROT_SPEED:  preset.camera?.rotationSpeed ?? 0.005,
  CAM_INERTIA:    preset.camera?.inertia ?? 3.5,
};

let result = template;
Object.entries(replacements).forEach(([key, value]) => {
  result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
});

// ── 写入 ──
const outPath = path.resolve(outFile);
fs.writeFileSync(outPath, result, 'utf-8');

console.log(`✅ 已生成: ${outPath}`);
console.log(`   预设: ${presetName}`);
console.log(`   几何: ${replacements.GEO_TYPE} (r=${replacements.GEO_RADIUS}, noise=${replacements.GEO_NOISE})`);
console.log(`   颜色: ${replacements.COLOR_BASE} → ${replacements.COLOR_PROXIMITY}`);
console.log(`   粒子: ${replacements.PARTICLE_ORBIT} 轨道 + ${replacements.PARTICLE_AMBIENT} 环境`);
console.log(`\n🌐 双击该文件在浏览器中打开，或部署到你的域名。`);
