import React, { useEffect } from 'react';
import useModal from '../../utils/hooks/useModal';

type OptionsMenuProps = {
    isIntroduction: boolean;
    position: string;
}

export default function OptionsMenu(props: any) {
    const { isIntroduction, buttonClassNames, menuPosition } = props;
    const [isContextMenuOpen, toggleContextMenu] = useModal(true);

    const handleOptionsMenuClick = () => {
        toggleContextMenu();
    }

    // Avoid updating state on component unmount
    useEffect(() => {
        return function cleanup() {
            toggleContextMenu();
        }
    }, []);

    return(
        <>
            <button name="context" className={`material-icons text-primary ${buttonClassNames}`} onClick={handleOptionsMenuClick}>more_vert</button>
            {isContextMenuOpen &&
                <div className="relative" style={{zIndex: 99}}>
                    <div className={`absolute p-5 bg-primary text-secondary font-bold top-full ${menuPosition}`} style={{minWidth: 150}}>
                        <button className="mb-2 hover:text-primary block" name="edit" onClick={props.onEditClick}>Edit</button>
                        {!isIntroduction &&
                            <>
                                <button className="mb-2 hover:text-primary block" name="up">Move Up</button>
                                <button className="mb-2 hover:text-primary block" name="down">Move Down</button>
                                <button className="hover:text-red-500 block" name="delete">Delete</button>
                            </>
                        }
                    </div>
                </div>
            }
        </>
    );
}