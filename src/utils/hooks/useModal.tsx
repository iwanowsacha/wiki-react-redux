import { useState, useEffect } from 'react';

/**
 * 
 * For modals, id="modal" must be set on an element to close on window click.
 * For context menu, name="context" must be set on an element to close on window click.
 * 
 * @param isContextMenu @type boolean
 * 
 */
export default function useModal(isContextMenu: boolean): [boolean, () => void] {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function toggleModal() {
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        window.addEventListener('click', (event) => {
            if ((event?.target?.id === 'modal' && !isContextMenu) || (event?.target?.name !== 'context' && isContextMenu)) {
                setIsModalOpen(false);
            }
        });
    }, []);

    return [isModalOpen, toggleModal];
}