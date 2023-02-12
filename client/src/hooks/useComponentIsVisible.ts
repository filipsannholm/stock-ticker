import { useState, useEffect, useRef } from 'react';

interface UseComponentVisibleHook{
    ref: React.MutableRefObject<HTMLDivElement|null>,
    isComponentVisible: boolean,
    setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function useComponentVisible(initialIsVisible: boolean): UseComponentVisibleHook {
    const [isComponentVisible, setIsComponentVisible] = useState<boolean>(initialIsVisible);
    const ref = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (ref.current && !ref.current.contains(target)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, isComponentVisible, setIsComponentVisible };
}