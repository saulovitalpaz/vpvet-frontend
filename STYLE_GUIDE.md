# VPVET Veterinary Management System - Comprehensive Style Guide

## Overview
This style guide documents the consistent design language used across all veterinarian pages in the VPVET system, including Dashboard, Agenda, Pacientes, and Consultas pages. Use this guide to ensure visual consistency when updating the configurations page or building new components.

---

## 1. Typography & Fonts

### Font Family
- **Primary**: `Inter, system-ui, sans-serif`
- Used consistently across all text elements

### Header Typography
- **H1 (Page Titles)**:
  - Size: `18px`
  - Weight: `700` (Bold)
  - Color: `rgb(17, 24, 39)` (Near-black)
  - Line height: Normal
  - Examples: "Bem-vindo de volta, Dr. Saulo", "Agenda de Dr. Saulo", "Pacientes", "Consultas"

- **H2 (Section Titles)**:
  - Size: `18px`
  - Weight: `600` (Semi-bold)
  - Color: `rgb(17, 24, 39)` (Near-black)
  - Examples: "Acesso Rápido", "Lista de Pacientes", "Lista de Consultas", "Agendamentos de Hoje"

- **H3 (Component Titles)**:
  - Size: `16px`
  - Weight: `600` (Semi-bold)
  - Color: `rgb(17, 24, 39)` (Near-black)
  - Examples: "Agenda", "Pacientes", "Consultas", "outubro 2025", "segunda-feira"

### Body Text
- **Primary Body Text**:
  - Size: `12px`
  - Weight: `400` (Normal)
  - Color: `rgb(107, 114, 128)` (Gray-500)
  - Examples: Descriptions, metadata, secondary information

- **Muted/Placeholder Text**:
  - Color: `rgb(107, 114, 128)` (Gray-500)
  - Examples: "Nenhum agendamento para hoje", "Buscar por nome do pet, tutor ou CPF..."

---

## 2. Color Scheme

### Primary Colors
- **Primary Text**: `rgb(17, 24, 39)` (Gray-900) - Near black for primary text
- **Secondary Text**: `rgb(107, 114, 128)` (Gray-500) - Muted gray for secondary text
- **Primary Action/Emerald**: `rgb(4, 120, 87)` (Emerald-600) - Links and primary actions

### Background Colors
- **Main Background**: `rgb(249, 250, 251)` (Gray-50) - Light gray page background
- **Card Background**: `rgb(255, 255, 255)` (White) - Clean white cards
- **Sidebar Background**: `rgb(255, 255, 255)` (White) - Clean white sidebar
- **Transparent Main**: `rgba(0, 0, 0, 0)` - Main content area

### Border Colors
- **Default Borders**: `rgb(229, 231, 235)` (Gray-200) - Light gray borders
- **Card Borders**: `1px solid rgb(229, 231, 235)`
- **Input Borders**: `rgb(229, 231, 235)` (Gray-200)

### Status Colors (from Agenda page)
- **Available Status**: Green background with white text
- **Busy Status**: Red/Orange background with white text
- **Today Indicator**: Light background with emphasized text

---

## 3. Layout & Background

### Page Structure
- **Background**: Light gray (`rgb(249, 250, 251)`) covering entire viewport
- **Sidebar**: Fixed left navigation, white background, clean separation
- **Main Content**: Transparent background with content cards

### Sidebar Navigation
- **Width**: Fixed width (approximately 280px)
- **Background**: White (`rgb(255, 255, 255)`)
- **Border**: Right border `1px solid rgb(229, 231, 235)`
- **Logo Area**: VPVET branding with user avatar

### Content Containers
- **Maximum Width**: Content is contained but responsive
- **Padding**: Consistent spacing around content areas
- **Background**: Cards use white backgrounds on light gray page

---

## 4. Card & Component Styling

### Quick Access Cards (Dashboard)
- **Background**: `rgb(255, 255, 255)` (White)
- **Border**: `1px solid rgb(229, 231, 235)` (Gray-200)
- **Border Radius**: `8px` (Medium rounded corners)
- **Padding**: `16px` (Consistent internal spacing)
- **Shadow**: Subtle box shadow for elevation
- **Hover**: Smooth transitions with subtle effects

### Welcome Section (Dashboard)
- **Background**: Gradient or colored background (emerald variations)
- **Border Radius**: `12px` (More rounded for hero sections)
- **Padding**: Generous padding for visual hierarchy

### Data Cards (Agenda, Pacientes, Consultas)
- **Background**: White
- **Border**: Light gray borders
- **Border Radius**: `8px`
- **Padding**: Consistent 16px padding
- **Header**: Clear separation with title and actions

### Empty States
- **Icon**: Large centered icon (64px+)
- **Title**: Gray-500 text, 14px-16px
- **Description**: Muted gray text, 12px-14px
- **Action Button**: Emerald primary button

---

## 5. Button & Interactive Elements

### Primary Buttons
- **Background**: Emerald (`rgb(4, 120, 87)`)
- **Text Color**: White
- **Border Radius**: `8px`
- **Padding**: `16px` (Generous touch targets)
- **Font Weight**: `500` (Medium)
- **Hover**: Darker emerald with smooth transition
- **Examples**: "Novo Paciente", "Criar Agendamento", "Ver todos"

### Secondary Buttons
- **Background**: Transparent or white
- **Text Color**: Emerald (`rgb(4, 120, 87)`)
- **Border**: `1px solid rgb(229, 231, 235)` (Gray-200)
- **Border Radius**: `8px`
- **Padding**: `16px`
- **Hover**: Light emerald background

### User Dropdown Button
- **Background**: Transparent
- **Border**: `1px solid rgb(229, 231, 235)`
- **Border Radius**: `8px`
- **Padding**: Generous for user info
- **Avatar**: Circular with user initials

### Navigation Items
- **Active State**:
  - Background: Light emerald/colored background
  - Left Border: 4px emerald accent
  - Text Color: Near black
  - Font Weight: `600`
- **Inactive State**:
  - Background: Transparent
  - Text Color: Gray
  - Hover: Light gray background

### Links
- **Color**: `rgb(4, 120, 87)` (Emerald)
- **Text Decoration**: None
- **Hover**: Underline on hover
- **Font Weight**: Normal

---

## 6. Navigation & Sidebar

### Sidebar Structure
- **Logo Section**: VPVET branding with user avatar
- **Main Navigation**:
  - Dashboard (active state highlighting)
  - Agenda
  - Pacientes
  - Consultas
- **Bottom Section**: Configurações and Sair

### Active Navigation Indicators
- **Background**: Light emerald or colored background
- **Left Border**: 4px solid emerald accent
- **Text Weight**: Semi-bold (600)
- **Icon + Text**: Horizontal layout with icons

### Navigation Hover States
- **Background**: Light gray on hover
- **Transitions**: Smooth color transitions

---

## 7. Form Elements

### Search Inputs (Pacientes, Consultas)
- **Background**: White
- **Border**: `1px solid rgb(229, 231, 235)` (Gray-200)
- **Border Radius**: `8px`
- **Padding**: Comfortable padding
- **Placeholder**: Gray-500 text
- **Focus**: Emerald border on focus

### Form Labels
- **Font Size**: 12px-14px
- **Weight**: `500` (Medium)
- **Color**: Gray-700
- **Spacing**: Consistent margin below labels

---

## 8. Mobile Specific

### Responsive Design
- **Sidebar**: Transforms to hamburger menu on mobile
- **Cards**: Stack vertically with proper spacing
- **Typography**: Scales appropriately but maintains hierarchy
- **Touch Targets**: Minimum 44px for mobile accessibility

### Breakpoints
- **Mobile**: < 768px - Single column, collapsed sidebar
- **Tablet**: 768px - 1024px - Adjusted layouts, sidebar may condense
- **Desktop**: > 1024px - Full sidebar, multi-column layouts

### Mobile Navigation
- **Hamburger Menu**: Replaces sidebar on mobile
- **Bottom Navigation**: May appear for key actions
- **Touch-Friendly**: Larger buttons and spacing

---

## 9. Component States & Interactions

### Hover States
- **Cards**: Subtle elevation increase
- **Buttons**: Darker background or color change
- **Links**: Underline appearance
- **Navigation**: Background color change

### Focus States
- **Buttons**: Outline with ring
- **Inputs**: Emerald border focus
- **Interactive Elements**: Clear focus indicators

### Loading States
- **Skeleton Loading**: Gray placeholders for content
- **Spinner Elements**: Consistent loading indicators
- **Disabled States**: Muted colors, reduced opacity

---

## 10. Accessibility Considerations

### Color Contrast
- **Text**: AAA rating for normal text
- **Large Text**: AAA rating for headers
- **Interactive Elements**: Clear contrast for buttons and links

### Keyboard Navigation
- **Focus Indicators**: Clear visible focus states
- **Tab Order**: Logical navigation flow
- **Skip Links**: Available for main content

### Screen Reader Support
- **Semantic HTML**: Proper heading structure
- **ARIA Labels**: Descriptive labels for interactive elements
- **Alternative Text**: Meaningful descriptions for images

---

## 11. Specific Component Patterns

### Calendar/Agenda View
- **Grid Layout**: 7-day week grid
- **Time Slots**: Button-based time selection
- **Status Indicators**: Color-coded availability
- **Today Highlight**: Current day emphasis
- **Navigation**: Month/week navigation controls

### Data Tables (Future Enhancement)
- **Header**: Bold with sorting indicators
- **Rows**: Alternating light backgrounds
- **Actions**: Consistent button styling
- **Pagination**: Standard pagination controls

### Modal/Dialog Patterns
- **Overlay**: Semi-transparent dark background
- **Content**: White card with proper padding
- **Close Button**: Consistent placement and styling

---

## 12. Implementation Guidelines for Configurations Page

### Required Elements
1. **Page Header**: H1 with user name and description
2. **Sidebar Navigation**: Consistent with other pages
3. **Card-Based Layout**: White cards on gray background
4. **Form Sections**: Grouped settings in cards
5. **Primary Actions**: Emerald buttons for main actions
6. **Secondary Actions**: Gray/white buttons for secondary options

### Styling Checklist
- [ ] Use Inter font family throughout
- [ ] Apply consistent color palette (emerald primary, gray scale)
- [ ] Maintain 8px border radius for cards and buttons
- [ ] Use 16px padding for card content
- [ ] Apply proper heading hierarchy (18px H1/H2, 16px H3)
- [ ] Use emerald color for primary actions and links
- [ ] Implement hover states with smooth transitions
- [ ] Ensure responsive design for mobile devices
- [ ] Include proper focus states for accessibility

### Recommended Tailwind Classes
Based on the analysis, here are the key Tailwind classes to use:

```css
/* Layout */
bg-gray-50        /* Page background */
bg-white          /* Card backgrounds */
rounded-lg        /* 8px border radius */
p-4               /* 16px padding */

/* Typography */
font-inter        /* Font family */
text-lg           /* 18px for headers */
font-semibold     /* 600 weight */
font-bold         /* 700 weight */
text-gray-900     /* Primary text */
text-gray-500     /* Secondary text */

/* Colors */
bg-emerald-600    /* Primary buttons */
text-emerald-600  /* Links and primary text */
border-gray-200   /* Default borders */

/* Interactive */
hover:bg-emerald-700    /* Button hover */
transition-colors       /* Smooth transitions */
focus:ring-2            /* Focus states */
```

---

## 13. File References

### Screenshots for Reference
- `dashboard-screenshot.png` - Main dashboard layout and styling
- `agenda-screenshot.png` - Calendar interface and time slot styling
- `pacientes-screenshot.png` - Patient management interface
- `consultas-screenshot.png` - Consultations history interface

### Key Style Sources
- Component libraries and patterns observed across all pages
- Consistent navigation and sidebar implementation
- Unified card and button styling patterns
- Consistent color usage and typography hierarchy

---

## Conclusion

This style guide captures the consistent design language used across the VPVET veterinarian management system. The design emphasizes:

- **Clean, professional appearance** with white cards on light gray backgrounds
- **Emerald accent color** for primary actions and branding
- **Consistent typography** using Inter font with clear hierarchy
- **Rounded corners** (8px) for modern, friendly appearance
- **Responsive design** that works across all device sizes
- **Accessibility** with proper contrast and focus states

When updating the configurations page, follow these guidelines to ensure visual consistency with the rest of the application. The design system is intentionally clean and professional, suitable for a medical/veterinary environment.