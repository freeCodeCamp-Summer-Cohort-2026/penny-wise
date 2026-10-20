import { X } from 'lucide-react';

function PopUp({ showPopUp, closePopUp, children }) {
  if (!showPopUp) {
    return null;
  }

  return (
    <div className='popup-overlay' onClick={closePopUp}>
      <div
        className='PopUp'
        role='dialog'
        aria-modal='true'
        aria-label='Image upload'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          onClick={closePopUp}
          aria-label='Close'
          className='popup-close'
        >
          <X aria-hidden='true' size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default PopUp;
