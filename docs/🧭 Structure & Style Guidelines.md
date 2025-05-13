# 🧭 Structure & Style Guidelines

This guide defines best practices for structuring an Angular application using **standalone components**, clean architecture, and consistent naming. It aligns with modern Angular patterns while avoiding legacy practices.

Refer to the [official Angular Style Guide](https://angular.dev/style-guide) for general guidance — but **this doc is authoritative** for this project.

## 📁 Folder & Feature Structure

Organize your code for **feature isolation**, **reusability**, and **clarity**.

```
src/
├── app/
│   ├── core/                 # Global services, interceptors, guards
│   │   ├── interceptors/
│   │   ├── guards/
│   │   └── services/
│
│   ├── shared/               # Cross-feature, reusable elements
│   │   ├── components/       # Buttons, modals, etc.
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── validators/
│   │   └── models/           # Interfaces, enums, types
│
│   ├── pages/                # Route-driven pages (feature-based)
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts   # standalone: true
│   │   │   ├── components/              # Subcomponents
│   │   │   └── services/                # Page-specific logic
│   │   └── user/
│   │       ├── user.component.ts        # standalone: true
│   │       └── components/
│
│   ├── layout/               # Shell components (header/sidebar)
│   ├── routes/               # App-wide routing config

├── main.ts                   # Root bootstrap
├── index.html

├── assets/                   # Static content (SVGs, fonts)
├── environments/             # Environment configs
├── styles/                   # Global SCSS (variables, mixins)

```

---

## 🏷️ File & Component Naming Conventions

Consistency is mandatory across the codebase:

### **Files**

- `kebab-case` for filenames: `user-profile.component.ts`
- Match file name to the primary class/function/component it exports.
- Use `.component`, `.service`, `.directive`, `.pipe`, `.model`, `.guard`, etc.

✅ Example:

```
login-form.component.ts
auth.service.ts
user-role.enum.ts
```

### **Components**

- Use **Pascal Case** for class names.
- Selector should be `feature-element` style: e.g. `app-user-card`.

```
@Component({
  selector: 'app-login-form',
  standalone: true,
  ...
})
export class LoginFormComponent { ... }
```

## 🧾 Angular Template Guidelines

Write templates that are shallow, expressive, and easy to test.

- ✅ Prefer **Angular control flow syntax** (`@if`, `@for`) over `ngIf`, `ngFor`.
- Limit nesting to 3–5 levels — extract to subcomponents if needed.
- Use `<ng-template>` and `<ng-container>` with `ngTemplateOutlet` only when truly reusable.
- Maintain clean formatting: **one attribute per line**.

### 🧩 **Attribute Order (Recommended)**

Maintain a consistent attribute order in your HTML templates to improve readability and avoid chaotic diffs. Follow this exact sequence:

1. **Structural directives** – `@if`, `@for`
2. **Static attributes** – `class`, `id`
3. **Inputs** – `[disabled]`, `[type]`, `[value]`
4. **Bindings** – `[attr.foo]`, `[style.color]`, `[ngClass]`
5. **Events** – `(click)`, `(input)`, `(change)`
6. **Template references** – `#ref`


### ✅ Example

```html
@if (user) {
  <button class="btn btn-primary"
			    id="submitBtn"
			    [disabled]="loading"
			    [attr.aria-label]="'submit'"
			    [style.opacity]="loading ? 0.5 : 1"
			    (click)="submitForm()"
			    #submitRef>
			    Submit
  </button>
}
```

## 🧠 Component Guidelines

Keep components small, focused, and dumb (UI-only) when possible.

- Use `inject()` for dependency injection; no constructor boilerplate.
- Avoid `ngOnInit` unless lifecycle logic is necessary.
- Always mark injected values as `readonly`.
- Business logic **must go into services** — not the component.
- Write **pure methods** when possible (no access to internal state).
- Use Constants/Enums instead of magic strings/numbers.
- Prefer **signals** for state handling.


## 🧪 Testing Expectations

- UI behavior must have **integration tests** using `TestBed`.
- Unit tests are optional unless the service or logic is complex.
- Avoid snapshot tests — write assertions that reflect actual behavior.
- Do not test Angular framework behavior (e.g., don't test `@Input()` binding itself).

## 🎨 Styling Guidelines

Styles must be scoped, predictable, and minimal.

- One SCSS file per component (same name).
- Use `:host` for styling component root, not `div` wrappers.
- Avoid `::ng-deep` unless dealing with third-party component overrides — and document it.
- Use **CSS variables** instead of SCSS ones for runtime theming.
- Max 3 levels deep in selector nesting.

✅ Good:

```scss
:host {
  display: block;
}

.form {
  .form__label { ... }
  .form__input { ... }
}
```
