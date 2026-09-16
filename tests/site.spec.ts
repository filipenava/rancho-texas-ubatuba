import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('booking sends the selected dates, children and coupon to the real engine', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Data de chegada').fill('2027-05-12');
  await page.getByLabel('Data de saída').fill('2027-05-15');
  await page.locator('.guest-toggle').click();
  await page.getByLabel('Crianças', { exact: true }).selectOption('2');
  await page.getByLabel('Idade da criança 1').selectOption('0');
  await page.getByLabel('Idade da criança 2').selectOption('8');
  await page.getByRole('button', { name: 'Confirmar hóspedes' }).click();
  await page.getByText('Tenho um cupom').click();
  await page.getByLabel('Código promocional').fill('FAMILIA');
  let target = '';
  await page.route('https://book.omnibees.com/**', async (route) => {
    target = route.request().url();
    await route.fulfill({
      contentType: 'text/html',
      body: '<h1>Motor de reservas</h1>',
    });
  });
  await page.getByRole('button', { name: 'Ver disponibilidade' }).click();
  await expect.poll(() => target).toContain('hotelresults');
  const url = new URL(target);
  expect(url.searchParams.get('ag')).toBe('0;8');
  expect(url.searchParams.get('CheckIn')).toBe('12052027');
  expect(url.searchParams.get('CheckOut')).toBe('15052027');
  expect(url.searchParams.get('Code')).toBe('FAMILIA');
  expect(url.searchParams.get('q')).toBe('10889');
});
test('children need explicit ages and checkout follows arrival', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Data de chegada').fill('2027-12-31');
  await expect(page.getByLabel('Data de saída')).toHaveValue('2028-01-01');
  await page.locator('.guest-toggle').click();
  await page.getByLabel('Crianças', { exact: true }).selectOption('1');
  await page.getByRole('button', { name: 'Confirmar hóspedes' }).click();
  await page.getByRole('button', { name: 'Ver disponibilidade' }).click();
  await expect(page.getByLabel('Idade da criança 1')).toBeVisible();
  await expect(page).toHaveURL(/4321\/$/);
});
test('mobile menu, gallery filters and lightbox work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page
    .locator('#main-nav')
    .getByRole('link', { name: 'Galeria' })
    .click();
  await expect(page).toHaveURL(/galeria$/);
  await page.getByRole('button', { name: 'Acomodações', exact: true }).click();
  await expect(page.locator('.gallery-item:visible')).toHaveCount(5);
  await page.locator('.gallery-item:visible').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Próxima foto' }).click();
  await expect(page.locator('.lightbox img')).toHaveAttribute(
    'alt',
    'Suíte Eco Bloco',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('main pages have SEO metadata, valid images and no serious accessibility violations', async ({
  page,
}) => {
  const routes = [
    '/',
    '/acomodacoes',
    '/acomodacoes/suite-duplex',
    '/fazendinha',
    '/natureza',
    '/camping',
    '/casamentos',
    '/galeria',
    '/galeria/acomodacoes',
    '/galeria/aves',
    '/galeria/gastronomia',
    '/contato',
    '/avaliacoes',
    '/blog',
    '/blog/ubatuba-em-familia',
    '/blog/por-que-se-hospedar-no-rancho-texas',
    '/blog/observar-aves-em-ubatuba',
    '/acomodacoes/suite-standard',
    '/privacidade',
  ];
  for (const route of routes) {
    const res = await page.goto(route);
    expect(res?.status(), route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name=description]')).toHaveAttribute(
      'content',
      /.{60,}/,
    );
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://www.ranchotexasubatuba.com.br${route}`,
    );
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      scan.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    await page.setViewportSize({ width: 1280, height: 900 });
  }
});
