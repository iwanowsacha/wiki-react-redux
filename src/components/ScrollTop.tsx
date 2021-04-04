import React, { useEffect, useState } from "react";

type ScrollTopProps = {
    className: string;
}

export default function ScrollTop(props: ScrollTopProps) {
    const {className} = props;
    const [isVisible, setIsVisible] = useState(false);

    const handleIsVisible = () => setIsVisible(document.documentElement.scrollTop > 20);

    const handleScrollTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    useEffect(() => {
        document.addEventListener('scroll', handleIsVisible);
        return () => document.removeEventListener('scroll', handleIsVisible);
    }, [])

    return(
        <>
        {isVisible &&
            <button onClick={handleScrollTop} className={`fixed rounded-full mr-2 mb-2 right-0 bottom-0 p-2 material-icons ${className}`}>
                arrow_circle_up
            </button>
        }
        </>
    );
}