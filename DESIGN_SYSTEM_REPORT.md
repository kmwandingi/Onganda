# Onganda Design System Status

Onganda has one design language, one package boundary, and two build outputs.

## Source of truth

- `DESIGN_SYSTEM.md` defines the language and component patterns. §4 Color Roles and §5 Controls are the enforceable rules.
- `DESIGN_GUIDELINES.md` defines implementation rules.
- `onganda-roles.ts` carries the colour policy in code: `roles()`, `ALPHA`, `accentInk`, `statusFor()`, `onColor()`, `SYSTEM_COLOR`, `CHART_SERIES`, `COLOR_POLICY`.
- `README.md` defines installation, supported imports, and contribution policy.
- `CHANGELOG.md` records releases and migrations.

## What is enforced

A colour or control rule that nothing checks is a suggestion. `npm run check:design`
runs two guards over all 21 design-system modules.

`check:tokens` catches lexical drift: generic Tailwind colours, off-palette hex
and `rgba()`, `oklch`, system colours bound to a surface or border, raw `STATUS`
reads, and rounded geometry. It **parses the sanctioned palette from
`onganda-colors.ts` at run time** rather than holding a copy, so it cannot
disagree with the tokens it guards.

`check:contrast` recomputes the 68 ratios behind `DESIGN_SYSTEM.md` §4 from the
role source and fails on a regression. Every role value is measured, not chosen
by eye. Run `npm run check:contrast -- --table` for the full table.

Exceptions are declared in the file with a reason, and apply to the next line:

```tsx
// onganda-allow: rounded-geometry — native map control, not a brand surface
```

Neither guard can tell that a correctly-tokenised colour is on the wrong
element. Nine Playwright tests in `tests/browser/control-standards.spec.ts`
cover the runtime half — button recipes in both modes, focus rings, the invalid
state, checked controls, rounded geometry, and the inverse-surface hover.

Both guards ship with the package. A consumer project runs the same gate with
`npx onganda-check src/`.

The `/showcase` **Control Standards** section renders every sanctioned control in
every state beside the colour role that governs it, and carries its own
light/dark switch so the dark role set is reviewable. A control that is not
there does not exist yet.

## Package boundary

Use `@onganda/design-system` for the stable foundation. New code should import larger features through `/charts`, `/editors`, `/ai`, or `/sites`.

The package root retains all version 1.x exports for compatibility. A breaking change requires a major release and a migration note.

Never import from `src/components/onganda/` in a consumer project.

## Build outputs

`npm run build` creates:

- `dist/showcase` for the reference site.
- `dist/package` for the published package.

The outputs are independent. Building one does not remove the other.

## Validation

`npm run check` runs linting, the token and contrast guards, type-checking, both builds, and a clean consumer installation that also exercises the shipped `onganda-check` binary.

`npm run test:browser` checks the public routes, mobile navigation, keyboard access, console errors, and horizontal overflow.
