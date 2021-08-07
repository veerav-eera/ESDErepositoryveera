let $loginFormContainer = $('#loginFormContainer');
if ($loginFormContainer.length != 0) {
    logging.info('\n\nLogin form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
        webFormData.append('email', email);
        webFormData.append('password', password);
        axios({
                method: 'post',
                url: '/api/user/login',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                //Inspect the object structure of the response object.
                //logging.info('\n\nInspecting the respsone object returned from the login web api');
                //console.dir(response);

                if (response.data.role_name == 'user') {
                    window.location.replace('/user/manage-submission');
                    alert('redirect to manage submission for user');
                    return;
                }
                if (response.data.role_name == 'admin') {
                    window.location.replace('/admin/manage-submission');
                    return;
                }
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to login. Check your email and password',
                }).show();

            });
    });

} //End of checking for $loginFormContainer jQuery object