# VC CRM UI Design System Rules

## Design Principle

Build a simple white CRM with premium spacing, soft visual depth, and clear action hierarchy.

The design must support heavy business data without feeling crowded.

## Color System

Use a white-first design.

```css
:root {
  --app-bg: #F8FAFC;
  --surface: #FFFFFF;
  --surface-muted: #F1F5F9;
  --border: #E5E7EB;
  --border-strong: #CBD5E1;

  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;

  --primary: #2563EB;
  --primary-hover: #1D4ED8;
  --navy: #0F2A43;

  --success: #16A34A;
  --warning: #D97706;
  --danger: #DC2626;
  --info: #0284C7;

  --radius-card: 18px;
  --radius-control: 12px;

  --shadow-soft: 0 10px 30px rgba(15, 23, 42, 0.06);
  --shadow-floating: 0 20px 50px rgba(15, 23, 42, 0.14);
}
```

## Typography

Use a clear sans-serif stack.

Recommended:
- Inter
- Geist
- system-ui

Rules:
- Page title: 24 to 30px
- Section title: 18 to 20px
- Body: 14px
- Table text: 13 to 14px
- Helper text: 12px
- Avoid tiny unreadable text

## Spacing

Use an 8px spacing system.

Rules:
- Page padding desktop: 24px to 32px
- Page padding mobile: 16px
- Card padding: 20px to 24px
- Table cell padding: 12px to 16px
- Form field gap: 16px
- Section gap: 24px

## Layout Width

Do not stretch every page edge-to-edge.

Recommended:
- Dashboard max width: 1440px
- List pages max width: 1480px
- Detail pages max width: 1320px
- Settings pages max width: 1180px

## 2D + 3D Balance

Use mostly 2D clean components with subtle 3D depth.

Allowed:
- Soft card shadows
- Light hover elevation
- Floating slideovers
- Layered KPI cards
- Subtle gradient only inside hero cards or metric cards

Not allowed:
- Heavy glassmorphism
- Neon colors
- Dark-only dashboards
- Overuse of gradients
- Excessive animations
- 3D objects that reduce readability

## Component Shape

Rules:
- Cards: 18px radius
- Buttons: 10 to 12px radius
- Inputs: 10 to 12px radius
- Badges: rounded-full or 8px
- Slideovers: 24px left radius on desktop

## Button Hierarchy

Use only:
- Primary
- Secondary
- Ghost
- Destructive

Rules:
- One primary action per page
- Secondary actions in dropdown when possible
- Do not show 5 buttons in a row
- Table row actions should be inside a menu

## Tables

Rules:
- 6 to 8 visible columns
- No all-field tables
- Sticky header for long tables
- Row hover state
- Row click opens detail
- Actions in right dropdown
- Filters are collapsible
- Saved views optional
- Bulk actions appear only after row selection

## Forms

Rules:
- Use slideover for create/edit
- Use full page only for complex builders
- Group fields into sections
- Required fields first
- Advanced fields collapsed
- Inline validation
- Sticky footer with Cancel and Save

## Detail Pages

Rules:
- Use tabs
- No long dump pages
- Put important summary at top
- Related data inside tabs
- Audit log tab only for authorized users

## Dashboard

Rules:
- No chart overload
- KPIs first
- Action queue visible
- Recent activity visible
- Sales pipeline clear
- Staff augmentation status clear

## Empty States

Every empty state must answer:
- What is missing
- Why it matters
- What to do next

## Loading States

Use skeletons matching final layout.
Do not show blank pages.

## Error States

Use clear recovery actions:
- Retry
- Go back
- Contact admin
- Check filters
