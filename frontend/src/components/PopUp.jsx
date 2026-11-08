import { X } from 'lucide-react';

function PopUp({ showPopUp, closePopUp, children }) {
  if (!showPopUp) {
    return null;
  }

  return (
    <div className='popup-overlay'>
      <dialog className='PopUp' aria-modal='true' aria-label='Image upload'>
        <button
          type='button'
          onClick={closePopUp}
          aria-label='Close'
          className='popup-close'>
          <X aria-hidden='true' size={18} />
        </button>
        {children}
      </dialog>
    </div>
  );
}

export default PopUp;
