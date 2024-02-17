const userMenu = document.querySelector('.dropbtn');
const userDropdown = document.querySelector('.user-dropdown');

const bellMenu = document.querySelector('.bell');
const bellDropdown = document.querySelector('.notification-dropdown');

userMenu.addEventListener('click', function (e) {
    if (
        window.getComputedStyle(userDropdown).display === 'flex' &&
        !userDropdown.contains(e.target)
    ) {
        userDropdown.style.display = 'none';
    } else {
        userDropdown.style.display = 'flex';
    }
});

bellMenu.addEventListener('click', function (e) {
    if (
        window.getComputedStyle(bellDropdown).display === 'flex' &&
        !bellDropdown.contains(e.target)
    ) {
        bellDropdown.style.display = 'none';
    } else {
        bellDropdown.style.display = 'grid';
    }
});

document.addEventListener('click', function (e) {
    if (!userMenu.contains(e.target) && !bellMenu.contains(e.target)) {
        userDropdown.style.display = 'none';
        bellDropdown.style.display = 'none';
    }
});
