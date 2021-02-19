import React from 'react';

type OptionsMenuProps = {
    isIntroduction: boolean;
    position: string;
}

export default function OptionsMenu(props: any) {
    const { isIntroduction, position } = props;
    return(
        <div className={`absolute p-5 bg-primary text-secondary font-bold top-full ${position}`} style={{minWidth: 150}}>
            <button className="mb-2 hover:text-primary block" name="edit" onClick={props.onEditClick}>Edit</button>
            {!isIntroduction &&
                <>
                    <button className="mb-2 hover:text-primary block" name="up">Move Up</button>
                    <button className="mb-2 hover:text-primary block" name="down">Move Down</button>
                    <button className="hover:text-red-500 block" name="delete">Delete</button>
                </>
            }
        </div>
    );
}