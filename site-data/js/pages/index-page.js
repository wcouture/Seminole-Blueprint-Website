const vmpImage = document.getElementById("vmp-image");
const vmpLink = document.getElementById("viewmyplans-link");

if (vmpImage && vmpLink) {
  vmpLink.addEventListener("mouseenter", () => {
    vmpImage.src = "/images/monocle-white.png";
  });

  vmpLink.addEventListener("mouseleave", () => {
    vmpImage.src = "/images/monocle.png";
  });
}
