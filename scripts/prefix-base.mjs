/**
 * Prefixa os caminhos absolutos do site gerado com um subdiretório.
 *
 * O GitHub Pages serve projeto em `usuario.github.io/repositorio/`, e o site usa
 * caminhos como `/acomodacoes` e `/images/foo.webp`. O `base` do Astro resolve
 * os assets que ele mesmo processa, mas não toca em href e src escritos à mão.
 *
 * A reescrita acontece depois do build, sobre o HTML pronto, em vez de mexer no
 * código-fonte: assim a build do domínio próprio continua idêntica e sem risco.
 *
 *   node scripts/prefix-base.mjs rancho-texas-ubatuba
 */
import fs from 'node:fs';
import path from 'node:path';

const raw = process.argv[2];
if (!raw) {
  console.error('uso: node scripts/prefix-base.mjs <subdiretorio>');
  process.exit(1);
}
const base = '/' + raw.replace(/^\/+|\/+$/g, '');
const dist = 'dist';

/** Atributos que carregam um caminho único do próprio site. */
const SINGLE = ['href', 'src', 'poster', 'data-photo', 'data-small', 'data-large'];
/** Atributos com lista de caminhos separados por vírgula. */
const LISTS = ['srcset', 'imagesrcset'];

/** `//cdn...` é protocol-relative e `/base/...` já foi reescrito. */
function skip(value) {
  return value.startsWith('//') || value.startsWith(base + '/') || value === base;
}

let hits = 0;
let touched = 0;

function rewrite(file) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;

  for (const attr of SINGLE) {
    after = after.replace(
      new RegExp('(\\s' + attr + '=")(/[^"]*)(")', 'g'),
      (whole, open, value, close) => {
        if (skip(value)) return whole;
        hits++;
        return open + base + value + close;
      },
    );
  }

  for (const attr of LISTS) {
    after = after.replace(
      new RegExp('(\\s' + attr + '=")([^"]*)(")', 'g'),
      (whole, open, value, close) => {
        if (!value.includes('/')) return whole;
        const parts = value.split(',').map((part) => {
          const item = part.trim();
          if (!item.startsWith('/') || skip(item)) return item;
          hits++;
          return base + item;
        });
        return open + parts.join(', ') + close;
      },
    );
  }

  // O CSS vai embutido em <style>, e as fontes entram por url(/_astro/...).
  // Sem isto o Pages devolve 404 nas fontes e o site cai na fonte do sistema.
  after = after.replace(/url\(([^)]+)\)/g, (whole, inner) => {
    const quote = inner[0] === '"' || inner[0] === "'" ? inner[0] : '';
    const value = quote ? inner.slice(1, -1) : inner;
    if (!value.startsWith('/') || skip(value)) return whole;
    hits++;
    return 'url(' + quote + base + value + quote + ')';
  });

  if (after !== before) {
    fs.writeFileSync(file, after);
    touched++;
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|css)$/.test(entry.name)) rewrite(full);
  }
}

walk(dist);

// Sem isto o Pages roda Jekyll e ignora a pasta `_astro`, derrubando CSS e JS.
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

console.log(`base "${base}" aplicada em ${hits} caminhos, ${touched} arquivos`);
