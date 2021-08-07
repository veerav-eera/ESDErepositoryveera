$('#logoutButton').on('click', function(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.replace('/home.html');
});