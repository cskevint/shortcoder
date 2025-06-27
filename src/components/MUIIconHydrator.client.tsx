import { useEffect, useRef } from 'react';
import * as MuiIcons from '@mui/icons-material';
import { createRoot, Root } from 'react-dom/client';

// Cache roots per span to avoid double createRoot calls
const spanRootMap = new WeakMap<Element, Root>();

export default function MUIIconHydrator({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const iconSpans = ref.current.querySelectorAll<HTMLSpanElement>('.mui-icon[data-icon-name]');
    iconSpans.forEach((span) => {
      const iconName = span.getAttribute('data-icon-name');
      if (iconName && (MuiIcons as any)[iconName]) {
        const IconComponent = (MuiIcons as any)[iconName];
        let root = spanRootMap.get(span);
        if (!root) {
          span.innerHTML = '';
          root = createRoot(span);
          spanRootMap.set(span, root);
        }
        root.render(<IconComponent fontSize="small" />);
      }
    });
  }, [children]);

  return <div ref={ref}>{children}</div>;
}
