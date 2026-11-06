#!/usr/bin/env node
// Render every phone mockup in static/mockups/ to static/mockups/img/<slug>.webp, with its provenance recipe.
// The mockups use fake data, and no image model is involved: each image is a Chrome screenshot.
//
//   node scripts/render-mockups.mjs
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

// Real device emulation. Plain headless Chrome will not lay out under about 500 px, which crops a 390 px phone.
const SHOT = process.env.CDP_SHOT ?? join(homedir(), 'Documents/github-repos/garys-supersuit/my-skills/cdp-screenshot/scripts/cdp-shot.mjs')
const SRC = 'static/mockups', OUT = join(SRC, 'img')
const W = 390, H = 844, SCALE = 2, QUALITY = 80
mkdirSync(OUT, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'mockups-'))
const pages = readdirSync(SRC).filter((f) => f.endsWith('.html') && f !== 'index.html')
for (const page of pages) {
  const slug = page.replace(/\.html$/, ''), png = join(work, `${slug}.png`), webp = join(OUT, `${slug}.webp`)
  execFileSync(process.execPath, [SHOT, `file://${resolve(SRC, page)}`, png, String(W), String(H), '1', '0'], { stdio: 'ignore' })
  execFileSync('cwebp', ['-quiet', '-q', String(QUALITY), png, '-o', webp])
  writeFileSync(`${webp}.recipe.json`, `${JSON.stringify({ asset: webp, generator: 'scripts/render-mockups.mjs', generatedAt: new Date().toISOString(), params: { source: join(SRC, page), width: W, height: H, scale: SCALE, quality: QUALITY } }, null, 2)}\n`)
}
rmSync(work, { recursive: true, force: true })
console.log(`rendered ${pages.length} mockups to ${OUT}`)
