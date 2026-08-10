import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import buildConfig from '../config/build.js';

const projectRoot = path.resolve(
  path.dirname(
    fileURLToPath(import.meta.url)
  ),
  '..'
);

const isDist =
  process.argv.includes('--dist');

const outputDir = path.join(
  projectRoot,
  isDist ? 'dist' : 'dev',
  'css'
);

const suffix = isDist ? '' : '.dev';

await fs.mkdir(outputDir, {
  recursive: true,
});

for (const [
  name,
  input,
] of Object.entries(buildConfig.scss)) {
  const output = path.join(
    outputDir,
    `${name}${suffix}.css`
  );

  // SCSS → CSS
  const sassResult = sass.compile(
    input,
    {
      style: isDist
        ? 'compressed'
        : 'expanded',
      sourceMap: true,
      loadPaths: [projectRoot],
    }
  );

  // CSS → Autoprefixer
  const postcssResult = await postcss([
    autoprefixer(),
  ]).process(sassResult.css, {
    from: input,
    to: output,
    map: {
      prev: sassResult.sourceMap,
      inline: false,
      annotation: false,
    },
  });

  await fs.writeFile(
    output,
    postcssResult.css
  );

  if (postcssResult.map) {
    await fs.writeFile(
      `${output}.map`,
      postcssResult.map.toString()
    );
  }

  console.log(
    `✓ ${path.relative(projectRoot, input)} → ${path.relative(projectRoot, output)}`
  );
}
