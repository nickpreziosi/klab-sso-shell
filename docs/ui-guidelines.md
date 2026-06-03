# UI Guidelines

## Styling

- Prefer inline Tailwind classes over inline styles, custom CSS, or dynamically generated class strings unless there is a clear technical reason.
- Use default `@k-lab/components` styles whenever possible. Avoid overriding component styles unless the design requires it.
- Keep custom styling minimal, predictable, and easy to scan.
- Avoid one-off visual treatments that do not align with the shared design system.

## Design Tokens

- Use variables from `globals.css`.
- Do not hard code colors, hex values, font sizes, border radii, or shadows unless explicitly necessary.
- Use semantic tokens where possible, such as `background`, `foreground`, `muted`, `border`, `success`, `warning`, `destructive`, etc.
- Prefer existing theme values over introducing new tokens.

## Padding / Spacing

- Use Tailwind’s default (4px) spacing scale to maintain visual consistency and rhythm.
- Prefer standard spacing values such as `gap-4`, `p-2`, `px-6`, `py-8`, etc.
- Avoid arbitrary spacing values unless required for a specific layout.
- Use consistent spacing between similar elements across pages.

## RTL Support

- Use logical direction classes such as `start`, `end`, `ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, and `text-end`.
- Avoid directional classes such as `left`, `right`, `ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, and `text-right` unless the layout is intentionally direction-specific.
- Avoid absolute positioning based on `left` or `right` when logical alternatives can be used.

## Components

- Use shared components from `@k-lab/components` before creating new local components.
- Do not duplicate existing components with minor visual differences.
- Keep component APIs simple and consistent with existing patterns.
- Prefer composition over adding excessive component props.
- Reusable UI patterns should be promoted into the component library.

## Layout

- Use a consistent page structure (e.g. page header, actions, filters, content, etc.).
- Keep primary actions visually prominent and easy to find.
- Avoid overcrowding elements and pages.
- Prefer responsive grid and flex layouts over fixed-width layouts.
- Ensure layouts work across desktop, tablet, and mobile devices.

## States

- Every data-driven view should include loading, empty, error, and success states.
- Use skeleton loaders for cards, charts, and other dynamic content to minimize layout shift and improve perceived performance.
- Use loading spinners for large data tables or operations where rendering a skeleton is impractical.
- Empty states should clearly explain the situation and provide next steps when applicable.
- Avoid displaying incomplete or broken layouts while data is loading.

## Forms

- Prefer using the @k-lab/components FloatingLabelInput over html inputs or @k-lab/components Inputs
- Use shared form components and validation patterns.
- Required fields should be clearly indicated.
- Error messages should explain how the user can resolve the issue.
- Avoid unnecessarily complex multi-column forms, especially on smaller screens.

## Tables

- Use shared DataTable patterns whenever possible.
- Keep table actions and behaviors consistent across products.
- Avoid excessive column density.
- Use search, filters (best placed in accordion), and pagination controls where appropriate.
- Ensure loading, empty, and error states are handled consistently.

## Accessibility

- Use semantic HTML whenever possible.
- All interactive elements must be keyboard accessible.
- Do not rely solely on color to communicate meaning.
- Include appropriate ARIA attributes and accessible labels for interactive elements, especially icon-only buttons, form controls, dialogs, and navigation components.

## Icons

- Use lucide icons consistently across applications.
- Icons should support content or actions, not serve as unnecessary decoration.
- Maintain consistent icon sizing throughout the application.

## Copy

- Use clear, concise, and user-friendly language.
- Avoid exposing backend or technical terminology in user-facing interfaces.
- Maintain consistent terminology across products.
- Button labels should clearly describe the action being performed.

## Responsiveness

- Design responsive behavior intentionally rather than as an afterthought.
- Avoid fixed pixel widths unless absolutely necessary.
- Test tables, dialogs, navigation, filters, and cards at common breakpoints.
- Ensure dialogs, dropdowns, and menus remain usable on mobile devices.
- Prefer container queries where applicable, as available component width may vary based on sidebar state and surrounding layout, regardless of viewport size.

## Code Quality

- Keep JSX readable and easy to scan.
- Avoid deeply nested conditional rendering.
- Extract repeated UI into reusable components.
- Separate presentation logic from data-fetching and business logic where practical.
- Use clear, consistent, and descriptive naming for components, props, hooks, and state.