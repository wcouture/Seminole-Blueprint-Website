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
    dots: false,
    navText: [
        '<img src="images/left-arrow-white.png" class="owl-nav-button"/>',
        '<img src="images/right-arrow-white.png" class="owl-nav-button"/>'
    ],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 2
        },
        768: {
            items: 3
        },
        1000: {
            items: 3
        }
    }
});
