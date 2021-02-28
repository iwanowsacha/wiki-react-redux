import React, { useEffect } from 'react';
import useModal from '../../utils/hooks/useModal';

type OptionsMenuProps = {
  menuPosition: string;
  buttonClassNames?: string;
  onEditClick?: () => void;
  onMoveClick?: (direction: string) => void;
  onDeleteClick?: () => void;
};

export default function OptionsMenu(props: OptionsMenuProps) {
  const {
    onEditClick,
    onMoveClick,
    onDeleteClick,
    buttonClassNames = '',
    menuPosition,
  } = props;
  const [isContextMenuOpen, toggleContextMenu] = useModal(true);

  const handleOptionsMenuClick = () => {
    toggleContextMenu();
  };

  // Avoid updating state on component unmount
  useEffect(() => {
    return function cleanup() {
      toggleContextMenu();
    };
  }, []);

  return (
    <>
      <button
        name="context"
        className={`material-icons text-primary ${buttonClassNames}`}
        onClick={handleOptionsMenuClick}
      >
        more_vert
      </button>
      {isContextMenuOpen && (
        <div className="relative" style={{ zIndex: 99 }}>
          <div
            className={`absolute p-5 bg-primary text-secondary font-bold top-full ${menuPosition}`}
            style={{ minWidth: 150 }}
          >
            {onEditClick && (
              <button
                className="mb-2 hover:text-primary block"
                onClick={onEditClick}
              >
                Edit
              </button>
            )}
            {onMoveClick && (
              <>
                <button
                  className="mb-2 hover:text-primary block"
                  onClick={() => onMoveClick('up')}
                >
                  Move Up
                </button>
                <button
                  className="mb-2 hover:text-primary block"
                  onClick={() => onMoveClick('down')}
                >
                  Move Down
                </button>
              </>
            )}
            {onDeleteClick && (
              <button
                className="hover:text-red-500 block"
                onClick={onDeleteClick}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
