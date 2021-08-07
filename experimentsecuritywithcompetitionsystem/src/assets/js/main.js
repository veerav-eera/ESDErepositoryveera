let albumContainer = document.querySelector("ul#albums");
if (albumContainer != null) {
    albumContainer.querySelectorAll('li').forEach(function(click){
        click.addEventListener("click",function() {
            axios.get('/api/images/'+this.id)
                .then(response => {

                    let images = response.data;

                    let albumsContainer = document.getElementsByClassName('album-container')[0];
                    albumsContainer.innerHTML = '';

                    for (let i in images)
                    {
                        logging.info();

                        let img = document.createElement("img");
                        img.src = images[i].thumbnailUrl;
                        img.alt = "Album Image";
                        img.setAttribute('data-url', images[i].url);

                        let div = document.createElement("div");
                        div.appendChild(img);

                        albumsContainer.appendChild(div);

                    }

                    listenThumbnailClickEvents();


                })
                .catch(function (error) {
                    logging.info(error);
                });
        })
    });
}


function listenThumbnailClickEvents() {
    document.querySelectorAll(".album-container img").forEach(function(click){
        click.addEventListener("click",function(e) {
            logging.info();


            let imageContainer = document.getElementsByClassName('full-image-container')[0];
            imageContainer.innerHTML = '';

            let img = document.createElement("img");
            img.src = e.target.dataset.url;
            img.alt = "Full Size Image";

            imageContainer.appendChild(img);
        })
    });
}



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


