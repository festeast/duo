import { createServer } from 'vite'
import { createRequire } from 'module'
const { chromium } = createRequire(import.meta.url)(process.env.PWPATH)
const server = await createServer({ root: '/home/user/duo', server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { Cat } = await server.ssrLoadModule('/src/components/Cat.tsx')
const React = await import('react'); const { renderToStaticMarkup } = await import('react-dom/server')
const chars = process.argv[3].split(',')
const items = [{head:'crown'},{head:'tophat'},{head:'fez'},{head:'bow'},{head:'flower'},{head:'headphones'},{face:'glasses'},{face:'shades'},{neck:'scarf'},{neck:'bell'},{neck:'bowtie'}]
const els = chars.map(c => React.createElement('div',{key:c,style:{display:'flex',gap:4}}, items.map((it,i)=>React.createElement('div',{key:i,style:{height:190,overflow:'hidden'}},React.createElement(Cat,{look:{fur:'ginger',eyes:'green',char:c,...it},size:280,mood:'normal'})))))
const html = renderToStaticMarkup(React.createElement(React.Fragment,null,els))
await server.close()
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 3000, height: 200*chars.length+20 } })
await p.goto('http://localhost:4173/'); await p.evaluate(h=>{document.body.innerHTML=h;document.body.style.cssText='margin:0;background:#FFF6EA'},html)
await p.waitForTimeout(1500); await p.screenshot({ path: process.argv[2] }); await b.close()
