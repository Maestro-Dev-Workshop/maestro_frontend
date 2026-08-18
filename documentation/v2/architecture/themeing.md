# V2 Theme System

## Overview

The V2 application provides a reactive theme system supporting three user-selectable theme modes:

* `light`
* `dark`
* `system`

Theme management is centralized in `ThemeService`.

The service is responsible for:

* Maintaining the user's selected theme preference.
* Persisting the selected preference in `localStorage`.
* Resolving the effective application theme.
* Applying the appropriate theme to the document root.
* Exposing reactive theme state to consuming components.

The theme system uses Angular Signals so that components can react to theme changes without manually subscribing to observables.

---

## Theme Modes

The available theme modes are defined as:

```ts
export type ThemeMode = 'light' | 'dark' | 'system';
```

### Light

The application explicitly uses the light theme.

```text
theme = light
effectiveTheme = light
```

### Dark

The application explicitly uses the dark theme.

```text
theme = dark
effectiveTheme = dark
```

### System

The application follows the operating system's color scheme preference.

```text
theme = system
effectiveTheme = light | dark
```

The effective value depends on the operating system preference at the time the theme is resolved.

---

## Theme Preference vs. Effective Theme

The theme system maintains two related concepts.

### Theme Preference

`theme` represents the value selected by the user.

```ts
readonly theme = signal<ThemeMode>('light');
```

It can contain:

```text
light
dark
system
```

This value should be used when the application needs to know **what preference the user selected**.

For example:

```ts
const preference = this.themeService.theme();
```

If the user selected System:

```ts
preference === 'system';
```

---

### Effective Theme

`effectiveTheme` represents the actual theme currently being applied by the application.

```ts
readonly effectiveTheme = signal<'light' | 'dark'>('light');
```

It can only contain:

```text
light
dark
```

The effective theme is resolved as follows:

| Theme Preference | System Preference | Effective Theme |
| ---------------- | ----------------- | --------------- |
| `light`          | Light             | `light`         |
| `light`          | Dark              | `light`         |
| `dark`           | Light             | `dark`          |
| `dark`           | Dark              | `dark`          |
| `system`         | Light             | `light`         |
| `system`         | Dark              | `dark`          |

Components that need to determine the actual theme being rendered should use `effectiveTheme`.

---

## ThemeService

`ThemeService` is provided at the root level:

```ts
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // ...
}
```

This ensures that the application has a single theme state shared across components.

### Public State

#### `theme`

```ts
readonly theme = signal<ThemeMode>('light');
```

Represents the user's selected theme preference.

#### `effectiveTheme`

```ts
readonly effectiveTheme = signal<'light' | 'dark'>('light');
```

Represents the resolved theme currently being used by the application.

---

## Theme Initialization

The theme is initialized using the `init()` method.

The service first checks `localStorage` for a previously saved preference.

```ts
const saved = localStorage.getItem(this.storageKey) as ThemeMode | null;
const mode: ThemeMode = saved ?? 'light';
```

If no preference has been saved, the application defaults to `light`.

The selected mode is then applied to the application.

```ts
this.theme.set(mode);
this.applyTheme(mode);
```

The application should call `ThemeService.init()` during application initialization.

---

## Theme Persistence

The selected theme preference is persisted using the following storage key:

```text
maestro-theme
```

When the user changes the theme:

```ts
setTheme(mode: ThemeMode)
```

the new preference is stored in `localStorage`.

This allows the user's selection to persist between application sessions.

---

## Applying the Theme

The application represents dark mode using the `dark` class on the document root:

```html
<html class="dark">
```

`ThemeService` is responsible for adding or removing this class.

The general behaviour is:

```text
Light
  ↓
Remove "dark" class

Dark
  ↓
Add "dark" class

System
  ↓
Check operating system preference
  ↓
Resolve to light or dark
  ↓
Apply corresponding theme
```

Theme application should remain centralized in `ThemeService` rather than being implemented independently by individual components.

---

## Consuming Theme State

Components should select the appropriate signal based on what they need.

### When the user preference is required

Use:

```ts
this.themeService.theme();
```

This returns:

```text
light
dark
system
```

### When the actual active theme is required

Use:

```ts
this.themeService.effectiveTheme();
```

This returns:

```text
light
dark
```

For example, a component selecting theme-specific assets should use:

```ts
const theme = this.themeService.effectiveTheme();
```

It should not independently resolve `system` using `window.matchMedia()`.

---

## Reactive Theme Usage

Angular Signals are used to allow theme-dependent components to react to changes.

For example:

```ts
readonly particleOptions = computed(() => {
  const theme = this.themeService.effectiveTheme();

  return {
    // Theme-dependent configuration
  };
});
```

The `computed()` value depends on `effectiveTheme`.

When the effective theme changes, Angular recalculates the computed value.

This allows theme-dependent configuration to remain synchronized with the application's theme state.

---

## Theme-Specific Assets

Theme-specific resources should follow a consistent directory structure.

For example:

```text
/images/
├── light/
│   └── auth-bg-particles/
│       ├── particle-1.svg
│       ├── particle-2.svg
│       └── ...
│
└── dark/
    └── auth-bg-particles/
        ├── particle-1.svg
        ├── particle-2.svg
        └── ...
```

Components can construct the resource path using `effectiveTheme`.

Example:

```ts
const theme = this.themeService.effectiveTheme();

const path = `/images/${theme}/auth-bg-particles/particle-1.svg`;
```

This keeps the component independent of how the theme was selected.

The component only needs to know whether the active theme is `light` or `dark`.

---

## Example: Authentication Background

The authentication background uses theme-specific particle assets.

The component should obtain the active theme from:

```ts
this.themeService.effectiveTheme();
```

and use it when constructing particle asset paths:

```ts
src: `/images/${theme}/auth-bg-particles/particle-${index + 1}.svg`
```

The component should not contain logic such as:

```ts
if (theme === 'system') {
  // Resolve system preference
}
```

Theme resolution belongs to `ThemeService`.

---

## Toggle Behaviour

The `toggleTheme()` method switches between explicit light and dark modes.

```ts
toggleTheme() {
  const current = this.theme();
  const next = current === 'dark' ? 'light' : 'dark';

  this.setTheme(next);
}
```

The toggle is intentionally limited to `light` and `dark`.

If the current preference is `system`, calling `toggleTheme()` switches to `dark` when the current preference is not `dark`.

---

## Design Principles

The theme implementation follows these principles:

1. **Centralized theme management**
   Theme resolution and DOM manipulation belong in `ThemeService`.

2. **Reactive state**
   Angular Signals provide reactive theme state to consuming components.

3. **Separation of preference and state**
   The selected preference is separate from the effective application theme.

4. **No duplicated theme resolution**
   Components should not independently resolve the `system` preference.

5. **Theme-independent components**
   Components should consume the resolved theme rather than depending on the implementation details of `ThemeService`.

6. **Consistent asset structure**
   Theme-specific assets should use predictable `light` and `dark` directories.

---

## Future Considerations

The current `system` implementation resolves the operating system preference when the theme is applied.

If the operating system preference changes while the application is running, the application may require additional handling to automatically update `effectiveTheme`.

A future implementation can listen to:

```ts
window.matchMedia('(prefers-color-scheme: dark)')
```

and update `effectiveTheme` when the system preference changes.

This should remain an implementation detail of `ThemeService` and should not be handled individually by consuming components.