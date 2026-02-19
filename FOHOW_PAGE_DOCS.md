# Fohow Page Documentation

## Overview
The Fohow Bioenergy Massage page is located at `/fohow`. It is implemented as a separate component `src/components/FohowPage.jsx`.

## Editing Content
To edit the text content of the page, open `src/components/FohowPage.jsx`.

### Translations
The page currently uses a local translation object within the component for convenience. 
Look for the `localT` function and the `translations` object inside it.

```javascript
const translations = {
    'Fohow Description': {
        en: 'English text...',
        es: 'Spanish text...',
        // ...
    },
    // ...
};
```

To update the text, simply modify the strings for the corresponding language code.

### Benefits List
The list of benefits is defined in the `benefits` array:

```javascript
const benefits = [
    "Detoxification of blood",
    "Improvement of blood circulation",
    // ...
];
```

These keys are passed to the global translation function `t()`. If these unique strings are not found in the global translation context (`src/context/LanguageContext.jsx`), they will be displayed as is. To add translations for them, add them to `LanguageContext.jsx`.

## Design & Styling
The page uses inline styles and standard CSS variables defined in `src/styles/index.css`.
- **Colors**: Uses `var(--color-bg-primary)`, `var(--color-text-primary)`, `var(--color-accent)`, `var(--color-nature-green)`.
- **Layout**: Uses CSS Flexbox and Grid.
- **Animations**: Uses `framer-motion` for entrance animations.

### Changing the Hero Image
Find the `motion.div` with the background image URL and replace it:

```javascript
background: 'url(https://your-new-image-url.com) center/cover',
```

## Navigation
- The page can be accessed via the "Learn More" button in the Fohow section of the main page.
- The "Back to Home" button in the top navigation returns the user to the main page.
- The "Book Session" button redirects to the main page's booking section with a scroll parameter.

## Adding/Removing Sections
The page is built with modular sections (Hero, Grid, Info Card). You can reorder or remove these `motion.section` or `div` blocks as needed.
