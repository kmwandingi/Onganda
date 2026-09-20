import type { Page } from '@playwright/test';

const TILE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" fill="#E8E1CF"/>
    <path d="M0 50H256M0 128H256M0 206H256M50 0V256M128 0V256M206 0V256" stroke="#6A4B2E" stroke-width="1" opacity="0.16"/>
    <path d="M-20 190L54 118L112 144L170 72L276 110" fill="none" stroke="#D9791F" stroke-width="3" opacity="0.35"/>
    <path d="M28 30L82 78L146 48L224 92" fill="none" stroke="#8F3E21" stroke-width="2" opacity="0.25"/>
  </svg>
`;

export const stubMapTiles = (page: Page) =>
  page.route('https://tile.openstreetmap.org/**', route =>
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: TILE_SVG,
    })
  );
