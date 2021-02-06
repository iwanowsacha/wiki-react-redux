import React, { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";

type SnackbarProps = {
    children?: ReactNode,
    isOpen: boolean,
    className?: string,
    message: string
} & typeof defaultProps;

const defaultProps = {
    className: 'text-primary'
}


export function Snackbar(props: SnackbarProps) {
    // const [isActive, setIsActive] = useState(false);
    // const [message, setMessage] = useState('');
    // const [className, setClassName] = useState('');
    // useImperativeHandle(ref, () => ({openSnackbar: openSnackbar}));

    // const openSnackbar = (message: string, className: string, duration: number = 2600) => {
    //     setMessage(message);
    //     setClassName(className);
    //     setIsActive(true);
    //     setTimeout(() => setIsActive(false), duration);
    // }

    return(
        <CSSTransition in={props.isOpen} timeout={300} unmountOnExit classNames="fade-in">
            <div className={`text-center m-2 fixed px-4 py-4 bg-primary text-xl snackbar ${props.className}`}>
                {props.message}
                {props.children &&
                    <div className="flex flex-wrap justify-center my-2">
                        {props.children}
                    </div>
                }
            </div>
        </CSSTransition>
    );
}

Snackbar.defaultProps = defaultProps;