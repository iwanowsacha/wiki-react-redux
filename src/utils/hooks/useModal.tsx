import { useState, useEffect } from 'react';

export default function useModal(): [boolean, () => void] {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function toggleModal() {
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        window.addEventListener('click', (event) => {
            if (event?.target?.id === 'modal') {
                setIsModalOpen(false);
            }
        });
    }, []);

    return [isModalOpen, toggleModal];
}