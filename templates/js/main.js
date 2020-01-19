// Sticky menu background
window.addEventListener("scroll", function() {
  if (window.scrollY > 150) {
    document.querySelector("#menu-section").style.opacity = 0.7;
  } else {
    document.querySelector("#menu-section").style.opacity = 1;
  }
});

// Smooth Scrolling
// $("#navbar a, .btn").on("click", function(even) {
// if (this.hash !== "") {
// event.preventDefault();
// const hash = this.hash;
// $("html, body").animate(
// {
// scrollTop: $(hash).offset().top - 100
// },
// 800
// );
// }
// });
