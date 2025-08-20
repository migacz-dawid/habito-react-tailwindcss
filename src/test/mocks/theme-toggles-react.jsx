import React from 'react'

// named export – tak importuje go Twój kod: `import { Classic } from '@theme-toggles/react'`
export const Classic = ({ onClick, title, className, toggled }) => (
  <button
    data-testid="desktop-theme-toggle"
    onClick={onClick}
    title={title}
    className={className}
    aria-pressed={toggled ? 'true' : 'false'}
  >
    Classic
  </button>
)

// (opcjonalnie) default export – nie jest potrzebny,
// ale jeśli chcesz, może być obiektem z Classic:
export default { Classic }
