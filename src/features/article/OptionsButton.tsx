import React, { useEffect } from 'react';
import useModal from '../../utils/hooks/useModal';
import OptionsMenu from './OptionsMenu';

type OptionsButtonProp = {
    isIntroduction: boolean;
    buttonClassNames: string;
    menuClassNames: string;
}


//@TODO - Figure out useEffect clean up for unmount
export default function OptionsButton(props: any) {
    const { isIntroduction, buttonClassNames, menuClassNames } = props;
    const [isContextMenuOpen, toggleContextMenu] = useModal(true);

    const handleOptionsMenuClick = () => {
        toggleContextMenu();
    }

    return(
        <>
            <button name="context" className={`material-icons text-primary ${buttonClassNames}`} onClick={handleOptionsMenuClick}>more_vert</button>
            {isContextMenuOpen &&
                <div className="relative" style={{zIndex: 99}}>
                    <OptionsMenu onEditClick={props.editClick} isIntroduction={isIntroduction} position={menuClassNames}/>
                </div>
            }
        </>
    );
}