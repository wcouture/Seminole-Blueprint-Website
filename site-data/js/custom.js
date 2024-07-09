// Get Current Year
function getCurrentYear() {
    var d = new Date();
    var year = d.getFullYear();
    document.querySelector("#displayDateYear").innerText = year;
}
getCurrentYear()

//client section owl carousel
$(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    navText: [
        '<img src="images/left-arrow-tpt.png" class="owl-nav-button"/>',
        '<img src="images/right-arrow-tpt.png" class="owl-nav-button"/>'
    ],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 3
        },
        1000: {
            items: 4
        }
    }
});

var bg_images = [
    "/images/capitol.jpg",
    "/images/wescott-editted.jpg",
    "/images/downtown.jpg",
];

// Google reviews background banner
let review_banner = document.getElementById("client-banner");
if (review_banner) {
    var index = Math.floor(Math.random() * 3)
    review_banner.style = `background: url(${bg_images[index]});background-position: center; background-size: cover;padding: 80px 0px 80px 0px;`
    /*
    setInterval(() => {
        console.log("Changing background")
        index++;
        index %= bg_images.length;
        banner.style = `background: url(${bg_images[index]});background-position: center; background-size: cover;padding: 80px 0px 80px 0px;` 
    }, 10000);
    */
}

$('.bgSwitch').bgswitcher({
        images: bg_images,
        effect: "fade",
        interval: 10000
});