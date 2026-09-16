import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('initial load and mobile scrolling do not download video files',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const requests:string[]=[];page.on('request',r=>{if(r.url().includes('.mp4'))requests.push(r.url());});
  await page.goto('/');await page.waitForLoadState('networkidle');
  expect(requests).toEqual([]);
  const film=page.locator('[data-film]').first();await film.scrollIntoViewIfNeeded();await page.mouse.wheel(0,20);await page.waitForTimeout(350);
  expect(requests).toEqual([]);
  await film.getByRole('button').click();
  await expect(film).toHaveAttribute('data-playing','true');
  await expect.poll(()=>film.locator('video').evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  expect(requests.some(r=>r.includes('fazendinha-640.mp4'))).toBe(true);
  await film.getByRole('button',{name:/Pausar vídeo/}).click();
  await expect(film.locator('video')).toHaveJSProperty('paused',true);
  await film.getByRole('button',{name:/Reproduzir vídeo/}).click();
  await expect(film).toHaveAttribute('data-playing','true');
  await page.evaluate(()=>window.scrollTo(0,0));
  await expect(film.locator('video')).toHaveJSProperty('paused',true);
});

test('desktop playback starts in view and respects an explicit pause',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto('/');
  const film=page.locator('[data-film]').first();await expect(film.locator('video')).not.toHaveAttribute('src');
  await page.mouse.wheel(0,800);await expect(film).toHaveAttribute('data-playing','true');
  await expect(film.locator('video')).toHaveAttribute('src','/videos/fazendinha-960.mp4');
  await film.getByRole('button',{name:/Pausar vídeo/}).click();await page.mouse.wheel(0,30);
  await expect(film.locator('video')).toHaveJSProperty('paused',true);
});

for(const mode of ['reduced-motion','save-data'])test(`${mode} prevents automatic downloads`,async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  if(mode==='reduced-motion')await page.emulateMedia({reducedMotion:'reduce'});
  else await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'4g'}}));
  await page.goto('/');await page.mouse.wheel(0,800);const film=page.locator('[data-film]').first();
  await film.scrollIntoViewIfNeeded();await page.waitForTimeout(350);
  await expect(film.locator('video')).not.toHaveAttribute('src');
  await film.getByRole('button').click();await expect(film).toHaveAttribute('data-playing','true');
  if(mode==='reduced-motion')expect(await film.locator('.film-poster').evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
});

test('failed playback preserves a useful poster and allows a retry',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.route('**/*.mp4',r=>r.abort());await page.goto('/videos/fazendinha-em-familia');
  const film=page.locator('[data-film]');await film.getByRole('button').click();await expect(film.getByRole('status')).toContainText('não carregou');
  await expect(film.getByRole('button')).toHaveAccessibleName(/Tentar reproduzir/);await expect(film).toHaveAttribute('data-started','false');
});

test('watch pages expose video metadata, descriptions and accessible controls',async({page})=>{
  for(const route of ['/videos/fazendinha-em-familia','/videos/paisagens-de-ubatuba']){
    await page.goto(route);await expect(page.locator('h1')).toHaveCount(1);
    const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();const schema=schemas.map(s=>JSON.parse(s)).find(s=>s['@type']==='VideoObject');
    expect(schema.contentUrl).toMatch(/https:\/\/www.ranchotexasubatuba.com.br\/videos\/.+\.mp4/);expect(schema.description.length).toBeGreaterThan(60);
    if(route.includes('fazendinha'))expect(schema.uploadDate).toBe('2026-05-01T12:19:46.342000+00:00');
    expect((await page.request.get(new URL(schema.contentUrl).pathname)).ok()).toBe(true);
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
    await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
