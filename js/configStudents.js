// пагінація
const maxRows = 4;
const maxPages = 6;
let currentPage = +document.querySelector('.pag-page-link--current').innerText;
let maxId = 0;
let lastTriggeredStudent = null;

const tableBody = document.querySelector('.student-tbl--body');
const modalStudent = document.querySelector('.modal-student-content');
const modalTitle = document.querySelector('.modal-title');
const modalWarning = document.querySelector('.modal-warning-content');

const exitButtons = document.querySelectorAll('.exit');
const cancelBtns = document.querySelectorAll('.cancel-btn');

const createOrEditBtn = document.querySelector('.create-btn');
const addBtn = document.querySelector('.add-student-btn');
const deleteBtn = document.querySelector('.modal-warning-content .delete-btn');

const pageNumberButtons = document.querySelectorAll('.pag-page-link');
const pageArrowButtons = document.querySelectorAll('.pag-btn');

window.addEventListener('load', async () => {
    if (navigator.serviceWorker) {
        try {
            const reg = await navigator.serviceWorker.register('../sw.js');
            console.log('Service worker register success', reg);
        } catch (err) {
            console.log('Service worker register failed', err);
        }
    }

    await configStudentsPage();
});

async function configStudentsPage() {
    const students = await fetch('../students.json');

    let parsedStudents = await students.json();

    fillTable(parsedStudents);

    deleteBtn.addEventListener('click', () => {
        parsedStudents = parsedStudents.filter(
            (student) => student.id !== +lastTriggeredStudent.cells[7].innerText
        );
        fillTable(parsedStudents);
        modalWarning.style.display = 'none';
    });

    addBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add student';
        createOrEditBtn.innerText = 'Create';
        fillInputs();
        modalStudent.style.display = 'block';
    });

    createOrEditBtn.addEventListener('click', () => {
        if (createOrEditBtn.innerText === 'Create') {
            ++maxId;
            const newStudent = {
                id: maxId,
                initials:
                    document.querySelector('.first-name--inp').value +
                    ' ' +
                    document.querySelector('.last-name--inp').value,
                group: document.querySelector('.group--inp').value,
                gender: document.querySelector('.gender--inp').value[0],
                birthday: document
                    .querySelector('.birthday--inp')
                    .value.split('-')
                    .reverse()
                    .join('.'),
            };
            parsedStudents.push(newStudent);
        } else {
            const editedStudent = {
                id: +lastTriggeredStudent.cells[7].innerText,
                initials:
                    document.querySelector('.first-name--inp').value +
                    ' ' +
                    document.querySelector('.last-name--inp').value,
                group: document.querySelector('.group--inp').value,
                gender: document.querySelector('.gender--inp').value[0],
                birthday: document
                    .querySelector('.birthday--inp')
                    .value.split('-')
                    .reverse()
                    .join('.'),
            };
            parsedStudents = parsedStudents.map((student) => {
                if (student.id === editedStudent.id) return editedStudent;
                return student;
            });
        }
        fillTable(parsedStudents);
        modalStudent.style.display = 'none';
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

    pageNumberButtons.forEach((pageBtn) => {
        pageBtn.onclick = () => {
            document
                .querySelector('.pag-page-link--current')
                .classList.remove('pag-page-link--current');

            pageBtn.classList.add('pag-page-link--current');
            currentPage = +pageBtn.innerText;
            fillTable(parsedStudents);
        };
    });

    pageArrowButtons.forEach((pageArrowBtn) => {
        pageArrowBtn.onclick = () => {
            if (pageArrowBtn.classList.contains('pag-btn-left')) {
                if (currentPage === 1) return;
                --currentPage;
                document
                    .querySelector('.pag-page-link--current')
                    .classList.remove('pag-page-link--current');

                pageNumberButtons.forEach((btn) => {
                    if (+btn.innerText === currentPage) {
                        btn.classList.add('pag-page-link--current');
                    }
                });
            } else {
                if (currentPage === maxPages) return;
                ++currentPage;
                document
                    .querySelector('.pag-page-link--current')
                    .classList.remove('pag-page-link--current');

                pageNumberButtons.forEach((btn) => {
                    if (+btn.innerText === currentPage) {
                        btn.classList.add('pag-page-link--current');
                    }
                });
            }
            fillTable(parsedStudents);
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
}

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

function fillTable(studentsArray) {
    tableBody.innerHTML = '';
    const row = document.createElement('tr');

    row.innerHTML = ` <tr>
                        <th>
                            <input
                                type="checkbox"
                                class="checkbox select-all"
                                onClick="toggle(this)"
                            />
                        </th>
                        <th>Group</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Birthday</th>
                        <th>Status</th>
                        <th>Options</th>
                    </tr>`;
    tableBody.appendChild(row);

    for (let i = 0; i < maxRows; ++i) {
        const student = studentsArray[(currentPage - 1) * maxRows + i];

        const row = document.createElement('tr');

        if (student && maxId < student.id) {
            maxId = student.id;
        }

        if (!student) {
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
        } else {
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
        <td class="closed student-id">${student.id}</td>
        `;
            tableBody.appendChild(row);
        }
    }
    setTableBtnEvents();
}

function setTableBtnEvents() {
    const editBtns = document.getElementsByClassName('edit-student');
    const deleteBtns = document.getElementsByClassName('delete-student');

    Array.from(editBtns).forEach((button) => {
        button.addEventListener('click', function (event) {
            lastTriggeredStudent = event.currentTarget.closest('tr');
            modalTitle.textContent = 'Edit student';
            createOrEditBtn.innerText = 'Save';
            fillInputs(
                lastTriggeredStudent.cells[1].innerText,
                lastTriggeredStudent.cells[2].innerText.split(' ')[0],
                lastTriggeredStudent.cells[2].innerText.split(' ')[1],
                lastTriggeredStudent.cells[3].innerText,
                lastTriggeredStudent.cells[4].innerText
            );
            modalStudent.style.display = 'block';
        });
    });

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
}
