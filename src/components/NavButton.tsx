import Button               from '@mui/material/Button';
import { Link }             from 'react-router';
import type { ReactNode }   from 'react';

interface NavButtonProps {
  to: string;
  children: ReactNode;
}

export default function NavButton({ to, children }: NavButtonProps) {
  return (
    <Button
      component={Link}
      to={to}
      variant="text"
      sx={{
        color: '#e0e0e0',
        fontWeight: 'bold',
        textTransform: 'none',
        px: 2,
        py: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          color: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
        }
      }}
    >
      {children}
    </Button>
  );
}