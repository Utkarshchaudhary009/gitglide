---
name: UX/UI Design Mastery
description: A comprehensive guide and checklist for creating industry-grade web interfaces, focusing on core UX principles and UI standards.
---

# UX/UI Design Mastery Skill

This skill provides the essential principles and standards required to build modern, industry-grade web interfaces.

## 5 Most Used Principles in UX (User Experience)

1.  **Jakob's Law (Consistency)**
    - **Principle:** Users spend most of their time on other sites. They prefer your site to work the same way as all the other sites they already know.
    - **Application:** Don't reinvent common patterns (e.g., search bar location, shopping cart icon). Use standard layouts unless breaking them provides significant value.

2.  **Fitts's Law (Accessibility & Touch)**
    - **Principle:** The time to acquire a target is a function of the distance to and size of the target.
    - **Application:** Make interactive elements (buttons, links) large enough to tap/click easily. Place related actions close to each other to reduce travel time.

3.  **Hick's Law (Simplicity)**
    - **Principle:** The time it takes to make a decision increases with the number and complexity of choices.
    - **Application:** Minimize choices. If a form has too many options, break it into steps. Use clear defaults to reduce cognitive load.

4.  **Miller's Law (Chunking)**
    - **Principle:** The average person can only keep 7 (plus or minus 2) items in their working memory.
    - **Application:** Organize content into smaller chunks. For example, break long numbers (like credit cards) into groups, and group related navigation items.

5.  **Aesthetic-Usability Effect (Visuals)**
    - **Principle:** Users often perceive aesthetically pleasing design as design that’s more usable.
    - **Application:** visual design matters. A polished interface builds trust and makes users more tolerant of minor usability issues. Functional is not enough; it must look good too.

## 10 Ways to Make Any UI Industry Standard

1.  **Strict 8pt Grid System**
    - Use multiples of 8px (8, 16, 24, 32, 48, 64) for all spacing, margins, and padding. This creates a subconscious sense of rhythm and consistency.

2.  **Harmonious Typography Scale**
    - Don't pick font sizes randomly. Use a modular scale (e.g., 1.25 ratio).
    - _Example:_ 16px (Base), 20px (h6), 25px (h5), 31.25px (h4)...
    - Ensure line-height is 1.5 for body text and 1.2 for headings.

3.  **Accessible Color Palette (60-30-10 Rule)**
    - **60%** Neutral (Background, text colors).
    - **30%** Secondary (Brand color for non-critical elements).
    - **10%** Accent (Call-to-Action buttons).
    - _Critical:_ Always check contrast ratios (aim for WCAG AA standard or 4.5:1).

4.  **Comprehensive Interactive States**
    - A static button is a dead button. Define visual states for:
      - `Default`
      - `Hover` (slight lift or brightness change)
      - `Active/Pressed` (scale down 0.98 or darken)
      - `Focus` (visible outline for keyboard users)
      - `Disabled` (lower opacity, not cursor-allowed)

5.  **Consistent Iconography**
    - Use a single icon set (e.g., Lucide, Heroicons, Phosphor).
    - Ensure consistent stroke width (usually 1.5px or 2px) and rounded/sharp corners across the entire app.

6.  **Skeleton Loading States**
    - Prevent Layout Shifts (CLS). Never just show a blank space while data loads.
    - Use a "skeleton" (gray pulsing placeholder) that mimics the shape of the content to come.

7.  **Responsive Design First**
    - Don't just hide things on mobile. Design for the smallest screen first.
    - Standard breakpoints:
      - Mobile: < 640px
      - Tablet: 768px
      - Laptop: 1024px
      - Desktop: 1280px+

8.  **Micro-interactions & Motion**
    - Interfaces should feel alive.
    - Add subtle transitions (200ms - 300ms ease-in-out) to all interactive elements (`all 0.2s ease`).
    - Use animation to guide the eye (e.g., a modal sliding in from the bottom on mobile).

9.  **Clear & Helpful Error Handling**
    - Don't just say "Invalid input".
    - Highlight the specific field in red.
    - Provide a helpful message explaining _how_ to fix it (e.g., "Password must contain at least one number").

10. **Whitespace (Breathing Room)**
    - Amateurs clutter; Pros delete.
    - Increase your whitespace. If you think it's enough, double it.
    - Whitespace groups related content (Law of Proximity) and reduces cognitive overload.
