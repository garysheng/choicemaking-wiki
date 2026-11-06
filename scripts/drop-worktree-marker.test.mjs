// A freshly minted wiki's HEAD carries no `.freedom-worktree.json`, because Freedom's gate reads the
// marker from HEAD when the file is missing (freedom-dev#546). Deleting it from the tree is not enough.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const script = join(import.meta.dirname, 'drop-worktree-marker.sh')
const git = (cwd, ...a) => execFileSync('git', a, { cwd, encoding: 'utf8' })
const minted = () => {
  const dir = mkdtempSync(join(tmpdir(), 'wiki-mint-'))
  git(dir, 'init', '-q')
  git(dir, 'config', 'user.email', 'test@example.com')
  git(dir, 'config', 'user.name', 'Test')
  writeFileSync(join(dir, '.freedom-worktree.json'), '{"reason":"the template"}\n')
  writeFileSync(join(dir, 'README.md'), '# wiki\n')
  git(dir, 'add', '.')
  git(dir, 'commit', '-q', '-m', 'from the template')
  return dir
}
const inHead = (dir) => { try { git(dir, 'cat-file', '-e', 'HEAD:.freedom-worktree.json'); return true } catch { return false } }

test('the marker is gone from the tree AND from HEAD, and nothing else is committed', () => {
  const dir = minted()
  writeFileSync(join(dir, 'README.md'), '# my wiki\n')   // an init edit the operator commits later
  assert.equal(inHead(dir), true, 'fixture must start with the marker committed')
  execFileSync('bash', [script], { cwd: dir })
  assert.equal(existsSync(join(dir, '.freedom-worktree.json')), false)
  assert.equal(inHead(dir), false)
  assert.equal(git(dir, 'show', '--name-only', '--format=', 'HEAD').trim(), '.freedom-worktree.json')
  assert.match(git(dir, 'status', '--porcelain'), /^ M README\.md$/m)
})

test('outside git, or with no marker committed, it only deletes and never fails', () => {
  const dir = mkdtempSync(join(tmpdir(), 'wiki-nogit-'))
  writeFileSync(join(dir, '.freedom-worktree.json'), '{}\n')
  execFileSync('bash', [script], { cwd: dir })
  assert.equal(existsSync(join(dir, '.freedom-worktree.json')), false)
})
