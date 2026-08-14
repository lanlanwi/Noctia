import * as esbuild from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import buildConfig from '../config/build.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const isDist = process.argv.includes('--dist');

const outputDir = path.join(projectRoot, isDist ? 'dist' : 'dev', 'js');

const suffix = isDist ? '' : '.dev';

await fs.mkdir(outputDir, {
  recursive: true,
});

for (const [name, input] of Object.entries(buildConfig.ts)) {
  const output = path.join(outputDir, `${name}${suffix}.js`);

  await esbuild.build({
    entryPoints: [input],
    outfile: output,

    bundle: true,
    minify: isDist,
    sourcemap: true,

    format: 'esm',
    platform: 'neutral',
    target: 'es2018',

    legalComments: 'none',
  });

  console.log(`✓ ${path.relative(projectRoot, input)} → ${path.relative(projectRoot, output)}`);
}
