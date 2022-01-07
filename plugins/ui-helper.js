export default (ctx, inject) => {
  inject('uiHelper', {
    scrollTo: function (elementId) {
      document.getElementById(elementId).scrollIntoView({ behavior: "smooth" });
    },
  })
}
