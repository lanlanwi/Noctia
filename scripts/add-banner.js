import fs from 'node:fs';
import { globSync } from 'glob';
import pkg from '../package.json' with { type: 'json' };
import meta from '../.metadata.json' with { type: 'json' };

const date = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();

const banner = `/*!
 * ${pkg.name}
 * Version: ${pkg.version}
 * Copyright (c) ${year} ${pkg.author}
 * Created: ${meta.created}
 * Last Updated: ${date}
 * Licensed under the ${pkg.license} License
 */

`;

const files = globSync('{dist,dev}/**/*.{js,css}');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  fs.writeFileSync(file, banner + content);
}
