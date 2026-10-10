// The showcase's palette, from ?palette=coast. main.tsx imports this first, so
// it runs before the first render; the palette tabs on /showcase reload the
// page with the new choice.
import { PALETTES, selectPalette, type PaletteName } from './components/onganda/onganda-palettes';

const name = new URLSearchParams(location.search).get('palette');
if (name && name in PALETTES) selectPalette(name as PaletteName);
