let $submitDesignFormContainer = $('#submitDesignFormContainer');
if ($submitDesignFormContainer.length != 0) {
    //console.log('Submit design form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit design details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'https://3.215.154.74:5000';
        let userId = localStorage.getItem('user_id');
        let designTitle = $('#designTitleInput').val();
        let designDescription = $('#designDescriptionInput').val();
        let webFormData = new FormData();
        webFormData.append('designTitle', designTitle);
        webFormData.append('designDescription', designDescription);
        // HTML file input, chosen by user
        webFormData.append("file", document.getElementById('fileInput').files[0]);
        axios({
                method: 'post',
                url: baseUrl + '/api/user/process-submission',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data', 'user': userId }
            })
            .then(function(response) {
                Noty.overrideDefaults({
                    callbacks: {
                        onTemplate: function() {
                            if (this.options.type === 'systemresponse') {
                                this.barDom.innerHTML = '<div class="my-custom-template noty_body">';
                                this.barDom.innerHTML += '<div class="noty-header">Message</div>';
                                this.barDom.innerHTML += '<p class="noty-message-body">' + this.options.text + '</p>';
                                this.barDom.innerHTML += '<img src="' + this.options.imageURL + '">';
                                this.barDom.innerHTML += '<div>';
                            }
                        }
                    }
                })

                new Noty({
                    type: 'systemresponse',
                    layout: 'topCenter',
                    timeout: '5000',
                    text: response.data.message,
                    imageURL: response.data.imageURL
                }).show();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to submit design file.',
                }).show();
            });
    });

} //End of checking for $submitDesignFormContainer jQuery object