const carouselNavButtons = document.querySelectorAll(
  ".carousel-nav-button span"
);
const carouselBodys = document.querySelectorAll(".carousel-body");

carouselNavButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    carouselNavButtons.forEach((button) => button.classList.remove("active"));
    button.classList.add("active");
    carouselBodys.forEach((carousel) => carousel.classList.remove("active"));
    carouselBodys[index].classList.add("active");
  });
});

const productId = document.querySelector(".product-carousel").dataset.productId;
const sectionId =
  document.querySelector(".product-carousel").dataset.sectionRelated;

// console.log(productId, sectionId);

fetch(
  window.Shopify.routes.root +
    `recommendations/products?section_id=${sectionId}&product_id=${productId}&limit=4&intent=related`
)
  .then((response) => response.text())
  .then((data) => {
    updateUIelement(data, "#product-recommendations");
  });

let recentlySeenItems = [];

if ("recently_seen" in localStorage) {
  recentlySeenItems = JSON.parse(localStorage.getItem("recently_seen"));
  if (!recentlySeenItems.includes(`id:${productId}`)) {
    recentlySeenItems = [`id:${productId}`, ...recentlySeenItems];
    if (recentlySeenItems.length > 10) recentlySeenItems.pop();
    localStorage.setItem("recently_seen", JSON.stringify(recentlySeenItems));
  }
} else {
  recentlySeenItems = [`id:${productId}`];
  localStorage.setItem("recently_seen", JSON.stringify(recentlySeenItems));
}

const arrayWithoutCurrentProductID = recentlySeenItems.filter((item) => {
  return item !== `id:${productId}`;
});

const productsIDsForSearch = arrayWithoutCurrentProductID.join(" OR ");

fetch(
  window.Shopify.routes.root +
    `search/?section_id=${sectionId}&type=product&options[unavailable_products]=show&q=${productsIDsForSearch}`
)
  .then((response) => response.text())
  .then((data) => {
    updateUIelement(data, "#recently-visited");
  });
