# Okaanda (Namibia AI Systems Lab) - System Prompt

You are working in the Okaanda project repository. This project has a very strict and specific design system.

## CRITICAL INSTRUCTION BEFORE WRITING ANY CODE
Before you make any changes to UI, styling, components, or layout, you MUST:
1. Read the `DESIGN_GUIDELINES.md` file located in the root of this project.
2. Read the available exports in `src/components/generated/okaanda-design-system.ts`.
3. Read the available tokens in `src/components/generated/okaanda-tokens.ts` when adding or changing design data.

## Hard Rules
1. **Never use standard Tailwind colors** (e.g., `text-blue-500`, `bg-red-500`, `border-gray-200`). You must use the semantic colors provided by the Okaanda design system (e.g., Millet Clay, Char Black, Ochre Orange).
2. **Never hardcode new hex values** in component files. Always import from `@/components/generated/okaanda-design-system` or add a named semantic token first. Existing generated files still contain legacy approved palette literals; do not copy that pattern.
3. **Respect the Pixel vs. Type dichotomy**: Icons, diagrams, and brand elements must be pixelated (stepped corners, dither, basket-weave textures). Typography and reading interfaces must be clean sans-serif (Inter/Arial).
4. **Oshiwambo First**: Respect the naming hierarchy. Use the Oshiwambo names for systems (Okaanda, Oshini, Ombiga, Etiti, Oshitoo) first, followed by English translations if necessary.

Failure to follow these rules will result in visual regressions and break the cultural and architectural alignment of the project.
