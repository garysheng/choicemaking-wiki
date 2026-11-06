#!/usr/bin/env node
// Render every phone mockup in static/mockups/ to static/mockups/img/<slug>.webp, with its provenance recipe.
// The mockups use fake data, and no image model is involved: each image is a headless Chrome screenshot.
//
//   node scripts/render-mockups.mjs
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const CHROME = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SRC = 'static/mockups', OUT = join(SRC, 'img')
const W = 390, H = 844, SCALE = 2, QUALITY = 80
mkdirSync(OUT, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'mockups-'))
const pages = readdirSync(SRC).filter((f) => f.endsWith('.html') && f !== 'index.html')
for (const page of pages) {
  const slug = page.replace(/\.html$/, ''), png = join(work, `${slug}.png`), webp = join(OUT, `${slug}.webp`)
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--window-size=${W},${H}`, `--force-device-scale-factor=${SCALE}`,
    `--user-data-dir=${join(work, 'profile')}`, `--screenshot=${png}`, `file://${resolve(SRC, page)}`], { stdio: 'ignore' })
  execFileSync('cwebp', ['-quiet', '-q', String(QUALITY), png, '-o', webp])
  writeFileSync(`${webp}.recipe.json`, `${JSON.stringify({ asset: webp, generator: 'scripts/render-mockups.mjs', generatedAt: new Date().toISOString(), params: { source: join(SRC, page), width: W, height: H, scale: SCALE, quality: QUALITY } }, null, 2)}\n`)
}
rmSync(work, { recursive: true, force: true })
console.log(`rendered ${pages.length} mockups to ${OUT}`)
