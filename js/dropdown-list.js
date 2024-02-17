const userMenu = document.querySelector('.user-profile');
const userDropdown = document.querySelector('.user-dropdown');

const bellMenu = document.querySelector('.bell-notification');
const bellDropdown = document.querySelector('.notification-dropdown');

userMenu.addEventListener('click', function (e) {
    userDropdown.classList.toggle('closed');
    bellDropdown.classList.add('closed');
});

bellMenu.addEventListener('click', function (e) {
    bellDropdown.classList.toggle('closed');
    userDropdown.classList.add('closed');
});

document.addEventListener('click', function (e) {
    if (!userMenu.contains(e.target) && !bellMenu.contains(e.target)) {
        userDropdown.classList.add('closed');
        bellDropdown.classList.add('closed');
    }
});
