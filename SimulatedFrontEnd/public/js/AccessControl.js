function check(allowed_user){
    //console.log('Access Control detected. Binding event handling logic.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $(document).ready(function () {
        const baseUrl = 'https://3.215.154.74:5000';
        var token = localStorage.getItem('token');
        var userID =localStorage.getItem("user_id");
        var userRole =localStorage.getItem("role_name"); 
        //console.log(userID)
        //console.log(userRole)
        let webFormData = new FormData();
        webFormData.append('userid', userID);
        webFormData.append('userrole', userRole);
        axios({
            method: 'post',
            url: baseUrl + '/api/controluser/',
            data: webFormData,
            headers: { 'Content-Type': 'multipart/form-data', "Authorization": "Bearer " + token }
        })
            .then(function (response) {
                //Handle success
                console.dir(response);
                //console.log(response)
                //console.log(allowed_user)
                if (response.status == 200 &&(response.data.userrole == allowed_user )) {
                    //console.log("output responce "+ response.data.userrole)
                } else {
                    localStorage.clear();
                    window.location.replace('/home.html');
                }
            })
            .catch(function (response) {
                //Handle error
                console.dir(response);
                localStorage.clear();
                window.location.replace('/home.html');
                new Noty({
                    timeout: '6000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Something went wrong in the access control part',
                }).show();
            });
    });
     //End of checking for $registerFormContainer jQuery object
 }