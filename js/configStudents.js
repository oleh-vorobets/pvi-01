const maxRows = 4;

(async function getAllStudents() {
    const students = await fetch('../students.json');

    const parsedStudents = await students.json();

    const tableBody = document.querySelector('.student-tbl tbody');

    const studentCount = parsedStudents.length;

    for (let i = 0; i < studentCount; ++i) {
        const student = parsedStudents[i];

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>
            <input type="checkbox" class="checkbox" />
        </td>
        <td>${student.group}</td>
        <td>${student.initials}</td>
        <td>${student.gender}</td>
        <td>${student.birthday}</td>

        <td><div class="status"></div></td>
        <td>
            <button class="edit-student">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                </svg>
            </button>
            <button class="delete-student">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </td>
        `;
        tableBody.appendChild(row);
    }

    if (studentCount < maxRows) {
        for (let i = parsedStudents.length; i < maxRows; i++) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
            <td>
                <input type="checkbox" class="checkbox" />
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>`;
            tableBody.appendChild(emptyRow);
        }
    }

    const modalStudent = document.querySelector('.modal-student-content');
    const modalTitle = document.querySelector('.modal-title');
    const modalWarning = document.querySelector('.modal-warning-content');

    const exitButtons = document.querySelectorAll('.exit');
    const createBtn = document.querySelector('.create-btn');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const editBtns = document.getElementsByClassName('edit-student');
    const addBtn = document.querySelector('.add-student-btn');

    const deleteBtn = document.querySelector(
        '.modal-warning-content .delete-btn'
    );

    deleteBtn.addEventListener('click', () => {
        console.log(lastTriggeredStudent);
        lastTriggeredStudent.remove();

        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td>
                <input type="checkbox" class="checkbox" />
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>`;
        tableBody.appendChild(emptyRow);

        modalWarning.style.display = 'none';
    });

    let lastTriggeredStudent = null;

    Array.from(editBtns).forEach((button) => {
        button.addEventListener('click', function (event) {
            lastTriggeredStudent = event.currentTarget.closest('tr');
            modalTitle.textContent = 'Edit student';
            modalStudent.style.display = 'block';
            createBtn.innerText = 'Save';

            fillInputs(
                lastTriggeredStudent.cells[1].innerText,
                lastTriggeredStudent.cells[2].innerText.split(' ')[0],
                lastTriggeredStudent.cells[2].innerText.split(' ')[1],
                lastTriggeredStudent.cells[3].innerText,
                lastTriggeredStudent.cells[4].innerText
            );
            console.log(lastTriggeredStudent.cells[4].innerText);
        });
    });

    const deleteBtns = document.getElementsByClassName('delete-student');

    Array.from(deleteBtns).forEach((button) => {
        button.addEventListener('click', function (event) {
            lastTriggeredStudent = event.currentTarget.closest('tr');
            const initials = lastTriggeredStudent.cells[2].innerText;

            document.querySelector(
                '.warning-text'
            ).innerText = `Are you sure you want to delete user ${initials}?`;

            modalWarning.style.display = 'block';
        });
    });

    addBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add student';
        modalStudent.style.display = 'block';
        createBtn.innerText = 'Create';
        fillInputs();
        // shadowWindow();
    });

    exitButtons.forEach((exitButton) => {
        exitButton.onclick = () => {
            modalStudent.style.display = 'none';
            modalWarning.style.display = 'none';
        };
    });

    cancelBtns.forEach((cancelBtn) => {
        cancelBtn.onclick = () => {
            modalStudent.style.display = 'none';
            modalWarning.style.display = 'none';
        };
    });

    window.addEventListener(
        'click',
        (event) => {
            if (
                modalStudent.style.display === 'block' &&
                !modalStudent.contains(event.target)
            ) {
                modalStudent.style.display = 'none';
            } else if (
                modalWarning.style.display === 'block' &&
                !modalWarning.contains(event.target)
            ) {
                modalWarning.style.display = 'none';
            }
        },
        true
    );
})();

function fillInputs(
    group = '',
    name = '',
    surname = '',
    gender = '',
    birthday = ''
) {
    document.querySelector('.group--inp').value = group;
    document.querySelector('.first-name--inp').value = name;
    document.querySelector('.last-name--inp').value = surname;
    document.querySelector('.gender--inp').value = gender;
    document.querySelector('.birthday--inp').value = birthday
        .split('.')
        .reverse()
        .join('-');
}
