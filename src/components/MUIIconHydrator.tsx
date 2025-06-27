import { useEffect, useRef } from 'react';
import * as MuiIcons from '@mui/icons-material';

export default function MUIIconHydrator({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const iconSpans = ref.current.querySelectorAll<HTMLSpanElement>('.mui-icon[data-icon-name]');
    iconSpans.forEach((span) => {
      const iconName = span.getAttribute('data-icon-name');
      if (iconName && (MuiIcons as any)[iconName]) {
        const IconComponent = (MuiIcons as any)[iconName];
        // Clear the span and render the icon
        span.innerHTML = '';
        // Render the icon as a React element into the span
        // @ts-ignore
        import('react-dom').then(ReactDOM => {
          ReactDOM.render(<IconComponent fontSize="small" />, span);
        });
      }
    });
  }, [children]);

  return <div ref={ref}>{children}</div>;
}
