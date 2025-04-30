const { existsSync, readdirSync, readFileSync, statSync } = require('fs')
const { join, resolve } = require('path')

const DIST = resolve(__dirname, '../dist')

if (!existsSync(DIST)) {
  console.error('❌ dist/ folder not found — did you run `vite build`?')
  process.exit(1)
}

function scan(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st   = statSync(full)
    if (st.isDirectory()) {
      scan(full)
    } else {
      const contents = readFileSync(full, 'utf8')
      if (contents.includes('__DEFINES__')) {
        console.error(`❌ Placeholder __DEFINES__ found in ${full}`)
        process.exit(1)
      }
    }
  }
}

scan(DIST)
console.log('✅  Bundle clean — no __DEFINES__ placeholders found')