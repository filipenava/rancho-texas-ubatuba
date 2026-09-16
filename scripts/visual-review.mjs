import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch();
const page=await browser.newPage();
const issues=[];
page.on('pageerror',e=>issues.push(e.message));
page.on('response',r=>{if(r.status()>=400)issues.push(`${r.status()} ${r.url()}`);});
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4321');await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`research/${name}-top.png`});
  await page.locator('img[loading=lazy]').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
  await page.waitForFunction(()=>[...document.images].every(img=>img.complete));
  await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(70);}
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(150);
  await page.screenshot({path:`research/${name}-full.png`,fullPage:true});
  const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(img=>!img.naturalWidth).map(img=>img.src));
  issues.push(...broken);
}
const pages=['/','/acomodacoes','/acomodacoes/suite-duplex','/acomodacoes/suite-eco-bloco','/acomodacoes/suite-da-roca','/acomodacoes/suite-standard','/acomodacoes/suite-casa-rosa','/fazendinha','/natureza','/camping','/casamentos','/galeria','/galeria/acomodacoes','/galeria/natureza','/galeria/fazendinha','/galeria/lazer','/galeria/gastronomia','/galeria/camping','/galeria/aves','/galeria/casamentos','/contato','/avaliacoes','/blog','/blog/ubatuba-em-familia','/blog/o-que-levar-para-acampar-em-ubatuba','/blog/observar-aves-em-ubatuba','/blog/por-que-se-hospedar-no-rancho-texas','/privacidade'];
const paths=new Set();
for(const route of pages){await page.goto(`http://127.0.0.1:4321${route}`);for(const href of await page.locator('a[href^="/"]').evaluateAll(as=>as.map(a=>a.getAttribute('href'))))paths.add(href);}
for(const href of paths){const response=await page.request.get(`http://127.0.0.1:4321${href.split('#')[0]}`);if(response.status()!==200)issues.push(`${response.status()} link ${href}`);}
await fs.writeFile('research/visual-review.json',JSON.stringify({issues,internalLinks:paths.size,pages:pages.length},null,2));
console.log(JSON.stringify({issues,internalLinks:paths.size,pages:pages.length}));
await browser.close();
