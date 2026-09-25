const contactMapImage = document.getElementById("contact-map-image");

if (contactMapImage) {
  contactMapImage.addEventListener("mouseenter", () => {
    contactMapImage.src = "../images/location-zoomed.png";
  });

  contactMapImage.addEventListener("mouseleave", () => {
    contactMapImage.src = "../images/location.png";
  });
}
