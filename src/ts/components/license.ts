import { throwIf } from '../internal';

const YEAR = new Date().getFullYear();

export function applyLicense(
  elm: HTMLParagraphElement
) {
  throwIf(
    !(
      elm instanceof
      HTMLParagraphElement
    ),
    'applyLicense: Expected an HTMLParagraphElement.'
  );

  const holder = elm.dataset.license;
  if (!holder) return;

  const copyright = `© ${YEAR} ${holder}.`;

  const statement =
    elm.dataset.statement;

  if (!statement) {
    elm.textContent = copyright;
  } else if (statement === 'all') {
    elm.textContent = `${copyright} All rights reserved.`;
  } else {
    elm.textContent = `${copyright} ${statement}`;
  }
}

export function initLicense(
  root: ParentNode = document
) {
  const licenseElms =
    root.querySelectorAll<HTMLParagraphElement>(
      'p[data-license]'
    );

  licenseElms.forEach((elm) => {
    applyLicense(elm);
  });
}
