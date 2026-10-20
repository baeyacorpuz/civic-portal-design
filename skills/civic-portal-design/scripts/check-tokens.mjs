#!/usr/bin/env node
// Checks a project against the civic-portal-design token rules.
//
//   node check-tokens.mjs [src-dir] [css-file]     (defaults: src, src/index.css)
//
// 1. Components use semantic utilities only: no arbitrary hex classes (bg-[#123456]),
//    no oklch()/rgb()/hsl() and no hex colors in inline styles.
// 2. Every color token in :root is redefined in .dark (except --chart-*) and mapped
//    in @theme inline as --color-<name>.
// A line is skipped when it or the line above contains `tokens-allow` (for third-party
// brand marks such as a Facebook logo tile). Say why next to it.
// Exits 1 and lists every problem when a rule is broken.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const srcDir = resolve(process.argv[2] ?? 'src')
const cssFile = resolve(process.argv[3] ?? join(srcDir, 'index.css'))
const problems = []

// translucent white/black (bg-white/10) is allowed; only literal colors are flagged
const rawColor = [
  { re: /\[#[0-9a-fA-F]{3,8}\]/g, why: 'arbitrary hex class' },
  { re: /\b(?:oklch|oklab|rgba?|hsla?)\(/g, why: 'raw color function' },
  { re: /\b(?:color|background|backgroundColor|fill|stroke|borderColor)\s*:\s*["'`]#[0-9a-fA-F]{3,8}\b/g, why: 'hex color in inline style' },
]

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.(tsx|jsx|ts|js)$/.test(name) && !/\.d\.ts$/.test(name)) checkComponent(path)
  }
}

function checkComponent(path) {
  const lines = readFileSync(path, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes('tokens-allow') || lines[i - 1]?.includes('tokens-allow')) return
    for (const { re, why } of rawColor) {
      re.lastIndex = 0
      if (re.test(line)) problems.push(`${relative(process.cwd(), path)}:${i + 1}  ${why}: ${line.trim().slice(0, 100)}`)
    }
  })
}

function block(css, selector) {
  const start = css.search(selector)
  if (start === -1) return null
  const open = css.indexOf('{', start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  return null
}

const vars = (text) => new Set([...(text ?? '').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))

function checkTokens() {
  const css = readFileSync(cssFile, 'utf8')
  const root = block(css, /:root\s*\{/)
  const dark = block(css, /\.dark\s*\{/)
  const theme = block(css, /@theme\s+inline\s*\{/)
  if (!root || !dark || !theme) {
    problems.push(`${cssFile}: expected :root, .dark and @theme inline blocks`)
    return
  }
  const rootVars = [...vars(root)].filter((v) => v !== '--radius')
  const darkVars = vars(dark)
  const themeVars = vars(theme)
  for (const v of rootVars) {
    if (!v.startsWith('--chart-') && !darkVars.has(v)) problems.push(`${v} is in :root but not in .dark`)
    if (!themeVars.has(`--color-${v.slice(2)}`)) problems.push(`${v} has no --color-${v.slice(2)} mapping in @theme inline`)
  }
  for (const v of darkVars) {
    if (!rootVars.includes(v)) problems.push(`${v} is in .dark but not in :root`)
  }
}

walk(srcDir)
checkTokens()

if (problems.length) {
  console.error(`civic-portal-design: ${problems.length} problem(s)\n`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log('civic-portal-design: tokens and components look good')
