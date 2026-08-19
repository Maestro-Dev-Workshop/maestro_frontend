# ADR-001: Separate Theme Preference from Effective Theme

## Status

Accepted

## Date

2026-08-18

## Context

The V2 application supports three theme preferences:

```ts
export type ThemeMode = 'light' | 'dark' | 'system';
```

The existing theme state represents the preference selected by the user.

For example:

```ts
theme() === 'dark';
```

indicates that the user explicitly selected dark mode.

However, when the user selects:

```ts
theme() === 'system';
```

the value no longer identifies the actual theme currently being rendered.

The application must resolve the system preference using the operating system's color scheme:

```ts
window.matchMedia('(prefers-color-scheme: dark)')
```

This creates a distinction between:

* the user's selected preference; and
* the actual theme currently applied to the application.

This distinction became important for theme-dependent components such as the authentication background.

The authentication background contains separate assets for light and dark themes:

```text
/images/light/auth-bg-particles/
/images/dark/auth-bg-particles/
```

The component needs to determine which directory to use.

Using `theme()` directly is insufficient because it can return:

```text
system
```

while the application is actually rendering using either the light or dark theme.

---

## Decision

Introduce a separate `effectiveTheme` signal in `ThemeService`.

```ts
readonly theme = signal<ThemeMode>('light');

readonly effectiveTheme = signal<'light' | 'dark'>('light');
```

The two signals have distinct responsibilities.

### `theme`

Represents the user's selected preference.

```text
light
dark
system
```

### `effectiveTheme`

Represents the resolved theme currently used by the application.

```text
light
dark
```

`ThemeService` is responsible for resolving the user's preference.

The resolution rules are:

```text
theme = light
    ↓
effectiveTheme = light

theme = dark
    ↓
effectiveTheme = dark

theme = system
    ↓
check operating system preference
    ↓
effectiveTheme = light | dark
```

Theme-dependent components should consume `effectiveTheme` rather than implementing their own theme resolution.

---

## Rationale

The primary reason for this decision is to maintain a single source of truth for theme resolution.

Without `effectiveTheme`, every component requiring the actual active theme would need to implement logic similar to:

```ts
if (theme === 'system') {
  const prefersDark =
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Resolve theme
}
```

This would result in duplicated logic across the application.

By placing the resolution inside `ThemeService`, components only need to consume:

```ts
this.themeService.effectiveTheme();
```

This provides a simple contract:

> Components that need the actual active theme receive either `light` or `dark`.

The component does not need to know whether the user selected `light`, `dark`, or `system`.

---

## Alternatives Considered

### 1. Use `theme` for everything

#### Description

Use the existing `theme` signal throughout the application.

```ts
const theme = this.themeService.theme();
```

#### Rejected

The value can be `system`, which is not sufficient when a component needs to determine the actual active theme.

For example:

```text
theme = system
OS = dark
```

The application is dark, but:

```ts
theme() === 'system'
```

A component cannot use this value directly to select a dark asset.

---

### 2. Resolve `system` in each component

#### Description

Allow each theme-dependent component to determine the effective theme independently.

Example:

```ts
const theme = this.themeService.theme();

if (theme === 'system') {
  // Check matchMedia
}
```

#### Rejected

This duplicates theme resolution logic and creates unnecessary coupling between components and the browser's `matchMedia` API.

It also increases the risk of inconsistent theme behaviour between components.

For example, two components could implement slightly different system-theme resolution logic.

---

### 3. Use the DOM `dark` class as the source of truth

#### Description

Determine the active theme by inspecting:

```ts
document.documentElement.classList.contains('dark');
```

#### Rejected

The DOM class represents a visual implementation detail rather than the application's theme state.

Using it as an API for theme-dependent components would couple components to the current DOM implementation.

It also does not provide a reactive Angular state mechanism.

---

### 4. Use CSS only

#### Description

Allow CSS to handle all theme differences using the `dark` class and CSS variables.

#### Rejected for resource selection

CSS is appropriate for visual styling but does not solve all theme-dependent resource requirements.

The authentication particle background needs to select different SVG files:

```text
/images/light/auth-bg-particles/
/images/dark/auth-bg-particles/
```

The component therefore needs access to the resolved theme.

---

### 5. Introduce `effectiveTheme`

#### Description

Resolve the user's preference inside `ThemeService` and expose the result as a reactive signal.

```ts
effectiveTheme = signal<'light' | 'dark'>('light');
```

#### Accepted

This approach provides:

* A single source of truth.
* Centralized theme resolution.
* Reactive state.
* Clear separation between user preference and active theme.
* Simpler theme-dependent components.
* Reduced duplication.

---

## Consequences

### Positive Consequences

#### Centralized theme resolution

`ThemeService` owns the logic for resolving:

```text
light
dark
system
```

into:

```text
light
dark
```

#### Simpler components

Components only need to consume:

```ts
this.themeService.effectiveTheme();
```

when they need the active theme.

They do not need to understand the `system` preference.

#### Reactive updates

Because `effectiveTheme` is an Angular Signal, dependent components can react to theme changes.

For example:

```ts
readonly particleOptions = computed(() => {
  const theme = this.themeService.effectiveTheme();

  // Build configuration
});
```

#### Consistent behaviour

All components use the same theme resolution rules.

#### Better separation of concerns

`ThemeService` handles theme management while consuming components remain responsible for rendering their own content.

---

### Negative Consequences

#### Additional state

The service maintains both:

```ts
theme
effectiveTheme
```

This introduces additional state that must remain synchronized.

#### Increased responsibility of ThemeService

`ThemeService` is responsible for both storing the user's preference and resolving the active theme.

This is intentional because theme resolution is a shared application concern.

#### System preference changes require additional handling

The initial implementation resolves the system preference when the theme is applied.

If the operating system changes from light to dark mode while the application is running, additional handling is required if the application should immediately react to that change.

This can be addressed by listening to changes from:

```ts
window.matchMedia('(prefers-color-scheme: dark)')
```

in a future enhancement.

---

## Implementation Contract

The following contract should be maintained:

### `theme`

Use when the application needs to know:

> What preference did the user select?

```ts
this.themeService.theme();
```

Possible values:

```text
light
dark
system
```

### `effectiveTheme`

Use when the application needs to know:

> What theme should I currently render or load resources for?

```ts
this.themeService.effectiveTheme();
```

Possible values:

```text
light
dark
```

Components should not independently resolve `system`.

---

## Example

For the authentication particle background:

```ts
readonly particleOptions = computed(() => {
  const theme = this.themeService.effectiveTheme();

  return {
    particles: {
      shape: {
        type: 'image',
        options: {
          image: Array.from({ length: 15 }, (_, index) => ({
            src: `/images/${theme}/auth-bg-particles/particle-${index + 1}.svg`,
            width: 100,
            height: 100,
          })),
        },
      },
    },
  };
});
```

The component does not need to know whether the user selected:

```text
light
dark
system
```

It only consumes the resolved theme:

```text
light
dark
```

---

## Decision Summary

The V2 theme system separates **theme preference** from **effective theme**.

```text
User Preference
      │
      ▼
    theme
      │
      │ resolve "system"
      ▼
effectiveTheme
      │
      ▼
Theme-dependent components
```

This design keeps theme resolution centralized, provides reactive theme state, and prevents individual components from duplicating system-theme detection logic.

The decision is considered accepted for V2.
