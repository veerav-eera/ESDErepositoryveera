let $searchDesignFormContainer = $('#searchDesignFormContainer');
if ($searchDesignFormContainer.length!=0){
    logging.info('\n\nSearch design form detected in user manage submission interface. Binding event handling logic to form elements.');
//If the jQuery object which represents the form element exists,
//the following code will create a method to submit registration details
//to server-side api when the #submitButton element fires the click event.
$('#submitButton').on('click',function(event){
    event.preventDefault();
    let searchInput = $('#searchInput').val();
    
    axios({
        method: 'get',
        url: '/api/user/process-search-design/1/' + searchInput,
        })
        .then(function (response) {
          //Using the following to inspect the response.data data structure
          //before deciding the code which dynamically generates cards.
          //Each card describes a design record.
          //console.dir(response.data);
          const records = response.data.filedata;
          //Find the main container which has the id, dataBlock
          let $dataBlockContainer=$('#dataBlock');
          $dataBlockContainer.empty();
          console.dir($dataBlockContainer);
          for(let index=0;index< records.length;index++){
            let record = records[index];
            logging.info(record.cloudinary_url);
            let $card = $('<div></div>').addClass('card').attr('style','width: 18rem;');
            $card.append($('<img></img>').addClass('card-img-top').addClass('app_thumbnail').attr('src',record.cloudinary_url));
            let $cardBody = $('<div></div>').addClass('card-body');
            $cardBody.append($('<h5></h5>').addClass('card-title').text(record.design_title));
            $cardBody.append($('<p></p>').addClass('card-text').text(record.design_description));
            $card.append($cardBody);
            //After preparing all the necessary HTML elements to describe the file data,
            //I used the code below to insert the main parent element into the div element, dataBlock.
            $dataBlockContainer.append($card);
            $dataBlockContainer.append($('<h5></h5>'));
          }//End of for loop
        }).catch(function (response) {
            //Handle error
            console.dir(response);
            new Noty({
                type:'error',
                layout:'topCenter',
                theme:'sunset',
                text: 'Unable to search',
            }).show();
        });
});
//I have hard code 3 buttons for the manage-submission interface (user role)
//to cut down the JavaScript code for this file.
//If the jQuery object which represents the form element exists,
//the following code will create a method to make a HTTP GET
//to server-side api.
$('#page1Button,page2Button,page3Button').on('click',function(event){
    event.preventDefault();
    let pageNumber = $(event.target).text().trim();
    let searchInput = $('#searchInput').val();
    logging.info(pageNumber);
    axios({
        method: 'get',
        url: '/api/user/process-search-design/' + pageNumber +'/' + searchInput,
        })
        .then(function (response) {
          //Using the following to inspect the response.data data structure
          //before deciding the code which dynamically generates cards.
          //Each card describes a design record.
          //console.dir(response.data);
          const records = response.data.filedata;
          //Find the main container which has the id, dataBlock
          let $dataBlockContainer=$('#dataBlock');
          $dataBlockContainer.empty();
          console.dir($dataBlockContainer);
          for(let index=0;index< records.length;index++){
            let record = records[index];
            logging.info(record.cloudinary_url);
            let $card = $('<div></div>').addClass('card').attr('style','width: 18rem;');
            $card.append($('<img></img>').addClass('card-img-top').addClass('app_thumbnail').attr('src',record.cloudinary_url));
            let $cardBody = $('<div></div>').addClass('card-body');
            $cardBody.append($('<h5></h5>').addClass('card-title').text(record.design_title));
            $cardBody.append($('<p></p>').addClass('card-text').text(record.design_description));
            $card.append($cardBody);
            //After preparing all the necessary HTML elements to describe the file data,
            //I used the code below to insert the main parent element into the div element, dataBlock.
            $dataBlockContainer.append($card);
            $dataBlockContainer.append($('<h5></h5>'));
          }//End of for loop
        })
        .catch(function (response) {
            //Handle error
            console.dir(response);
            new Noty({
                type:'error',
                layout:'topCenter',
                theme:'sunset',
                text: 'Unable to search',
            }).show();
        });
});

}//End of checking for $searchDesignFormContainer jQuery object



