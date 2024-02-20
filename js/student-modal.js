const modal = document.querySelector('.modal-student-content');

const btn = document.querySelector('.add-student-btn');

const span = document.querySelector('.exit');
const cancelBtn = document.querySelector('.cancel-btn');

// When the user clicks the button, open the modal
btn.onclick = () => {
    modal.style.display = 'block';
};

span.onclick = () => {
    modal.style.display = 'none';
};

cancelBtn.onclick = () => {
    modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};
