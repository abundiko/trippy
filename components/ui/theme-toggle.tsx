'use client';

import { LuMoon, LuSun } from 'react-icons/lu';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
        >
            {theme === 'dark' ? (
                <LuSun className="h-5 w-5" />
            ) : (
                <LuMoon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
