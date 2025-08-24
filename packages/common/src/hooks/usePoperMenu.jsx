import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useLayoutEffect,
} from 'react';

//--- HOOK PARA ESTADO Y LÓGICA DE APERTURA (SIN CAMBIOS) ---
let activeMenuCloser = null;
export function usePopperMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;
        if (isOpen) {
            htmlElement.style.overflow = 'hidden';
            bodyElement.style.overflow = 'hidden';
        } else {
            htmlElement.style.overflow = '';
            bodyElement.style.overflow = '';
        }
        return () => {
            htmlElement.style.overflow = '';
            bodyElement.style.overflow = '';
        };
    }, [isOpen]);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
        activeMenuCloser = null;
    }, []);

    const openMenu = useCallback(() => {
        if (activeMenuCloser) activeMenuCloser();
        setIsOpen(true);
        activeMenuCloser = closeMenu;
    }, [closeMenu]);

    const toggle = useCallback(
        (e) => {
            e.stopPropagation();
            isOpen ? closeMenu() : openMenu();
        },
        [isOpen, openMenu, closeMenu]
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                anchorRef.current &&
                !anchorRef.current.contains(event.target)
            ) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeMenu]);

    return { isOpen, toggle, anchorRef, menuRef, closeMenu };
}

//--- HOOK DE POSICIONAMIENTO (MODIFICADO PARA POSICIÓN DEBAJO) ---
export function useMenuPositioner(anchorRef, menuRef, isOpen) {
    const [style, setStyle] = useState({});
    const [placement, setPlacement] = useState('bottom'); // Establecemos la placement inicial como 'bottom'

    useLayoutEffect(() => {
        if (isOpen && anchorRef.current && menuRef.current) {
            // Esperar al siguiente frame para asegurar que el tamaño sea correcto
            requestAnimationFrame(() => {
                const anchorRect = anchorRef.current.getBoundingClientRect();
                const menuRect = menuRef.current.getBoundingClientRect();
                const { innerWidth, innerHeight } = window;
                const gap = 8;

                let left = anchorRect.left;
                let top = anchorRect.bottom + gap + window.scrollY;
                let currentPlacement = 'bottom';

                if (left + menuRect.width > innerWidth) {
                    left = anchorRect.right - menuRect.width;
                    currentPlacement = 'bottom-right';
                }

                if (top + menuRect.height > innerHeight) {
                    top =
                        anchorRect.top - menuRect.height - gap + window.scrollY;
                    currentPlacement = 'top';
                }

                setStyle({
                    top: `${top}px`,
                    left: `${left + window.scrollX}px`,
                });
                setPlacement(currentPlacement);
            });
        }
    }, [isOpen, anchorRef, menuRef]);

    return { style, placement };
}
