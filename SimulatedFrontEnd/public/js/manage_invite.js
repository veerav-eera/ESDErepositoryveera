let $manageInviteFormContainer = $('#manageInviteFormContainer');
if ($manageInviteFormContainer.length != 0) {
    //console.log('Manage invite form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'https://3.215.154.74:5000';
        let fullName = $('#fullNameInput').val();
        let email = $('#emailInput').val();
        let userId = localStorage.getItem('user_id');
        let webFormData = new FormData();
        webFormData.append('recipientName', fullName);
        webFormData.append('recipientEmail', email);
        axios({
                method: 'post',
                url: baseUrl + '/api/user/processInvitation',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data', 'user': userId }
            })
            .then(function(response) {
                //Handle success
                console.dir(response);
                new Noty({
                    type: 'success',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'bootstrap-v4',
                    text: 'An email invitation is sent to ' + fullName + '<br />A cc email is sent to you.'
                }).show();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    timeout: '6000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to send email invitation.',
                }).show();
            });
    });

} //End of checking for $manageInviteFormContainer jQuery object