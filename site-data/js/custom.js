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
        '<img src="images/left-arrow-white.png" class="owl-nav-button"/>',
        '<img src="images/right-arrow-white.png" class="owl-nav-button"/>'
    ],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 3
        }
    }
});

var bg_images = [
    "/images/capitol.jpg",
    "/images/wescott-editted.jpg",
    "/images/downtown.jpg",
];

$('.bgSwitch').bgswitcher({
        images: bg_images,
        effect: "fade",
        interval: 10000
});