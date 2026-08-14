import fs from 'node:fs';
import path from 'node:path';

import pkg from '../package.json' with { type: 'json' };

const templatePath = path.join(import.meta.dirname, '../README.template.md');
const readmePath = path.join(import.meta.dirname, '../README.md');

const template = fs.readFileSync(templatePath, 'utf8');

const readme = template.replaceAll('{{VERSION}}', pkg.version);

fs.writeFileSync(readmePath, readme);

console.log(`README.md generated for version ${pkg.version}`);
