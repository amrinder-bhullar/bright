// Put your application javascript here
const menuItems = document.querySelectorAll(".has-submenu");
const megaMenu = document.querySelectorAll(".mega-menu");

// helper functions

// helps you delegate event listners, instead to adding event listner to element it adds to the document itself and if the selector matches it runs the callback

const addGlobalEventListener = (type, selector, callback) => {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
};

// sends the form data and adds to the cart can be called from anywhere, returns a promise and you can add .then from where you are calling it.

const handleAddToCart = async (formData) => {
  try {
    return axios.post(
      window.Shopify.routes.root + "cart/add.js/?sections=header,cart-mini",
      formData
    );
  } catch (error) {
    console.log(error);
  }
};

// sends the get request to get a new page and return a promise

const getPage = async (page, sectionId) => {
  try {
    return await axios.get(page + "&" + sectionId);
  } catch (error) {
    console.log(error);
  }
};

// accepts payload in order to post request to change.js and returns a promise

const sendUpdatedQuantity = (payload) => {
  try {
    return axios.post(window.Shopify.routes.root + `cart/change.js`, payload);
  } catch (error) {
    console.log(error);
  }
};

// update UI element pass the finaldata which will be converted to DomParser, accepts 2 params final data and selector to update

const updateUIelement = (data, selector, targetSelector = selector) => {
  const htmlFromData = new DOMParser().parseFromString(data, "text/html");
  const containerToUpdate = document.querySelector(selector);
  const updatedData = htmlFromData.querySelector(targetSelector);

  if (containerToUpdate && updatedData) {
    containerToUpdate.innerHTML = updatedData.innerHTML;
    return true;
  }
};

// updates value of hidden input value in form selected_variant

const updateSelectedVariantID = (data, selector) => {
  const htmlFromData = new DOMParser().parseFromString(data, "text/html");
  const valueToUpdate = document.querySelector(selector);
  const updatedData = htmlFromData.querySelector(selector).value;

  if (valueToUpdate && updatedData) {
    valueToUpdate.value = updatedData;
    return true;
  }
};

// Function to show any passed element

const showElement = (
  selectorOfElementToShow,
  buttonSelector,
  enableOverlay = false,
  classToAdd = "active"
) => {
  if (
    selectorOfElementToShow === ".cart-drawer" &&
    window.location.pathname === "/cart"
  ) {
    return;
  }
  const classAdded = addGlobalEventListener(
    "click",
    `${buttonSelector}, ${buttonSelector} *`,
    (e) => {
      e.preventDefault();
      document.querySelector(selectorOfElementToShow).classList.add(classToAdd);
      enableOverlay &&
        document.querySelector(".background-overlay").classList.add("active");
      document.body.style.overflow = "hidden";
      return true;
    }
  );

  document.body.addEventListener("click", (e) => {
    if (
      document
        .querySelector(selectorOfElementToShow)
        .classList.contains("active") &&
      !e.target.matches(
        `${selectorOfElementToShow}, ${selectorOfElementToShow} *`
      )
    ) {
      document
        .querySelector(selectorOfElementToShow)
        .classList.remove("active");
      document.querySelector(".background-overlay").classList.remove("active");
      document.body.style.removeProperty("overflow");
    }
  });

  if (classAdded) return true;
};

const hideElement = (
  selectorOfElementToShow,
  buttonSelector,
  classToRemove = "active"
) => {
  if (!selectorOfElementToShow || !buttonSelector) throw error;
  const classRemoved = addGlobalEventListener(
    "click",
    `${buttonSelector}, ${buttonSelector} *`,
    (e) => {
      e.preventDefault();
      document
        .querySelector(selectorOfElementToShow)
        .classList.remove(classToRemove);
      if (
        document
          .querySelector(".background-overlay")
          .classList.contains("active")
      ) {
        document
          .querySelector(".background-overlay")
          .classList.remove("active");
        document.body.style.removeProperty("overflow");
      }
      return true;
    }
  );

  if (classRemoved) return true;
};

const findClass = (event, classToFind) => {
  let targetElement = event.target;
  let target;

  // Check if the clicked element or any of its ancestors have the specific class
  while (targetElement !== document.documentElement) {
    if (targetElement.classList.contains(classToFind)) {
      // Found the specific class, do something here
      target = targetElement;

      break;
    }
    targetElement = targetElement.parentNode;
  }
  return target;
};

// end of helper functions

menuItems.forEach((item, index) => {
  item.addEventListener("mouseover", (e) => {
    megaMenu[index].classList.add("active");
  });
  item.addEventListener("mouseleave", (e) => {
    megaMenu[index].classList.remove("active");
  });
});

megaMenu.forEach((item) => {
  item.addEventListener("mouseover", (e) => {
    item.classList.add("active");
  });
  item.addEventListener("mouseleave", (e) => {
    item.classList.remove("active");
  });
});

// Mobile Menu

showElement(".mobile-menu-drawer", ".mobile-menu-icon", true);
hideElement(".mobile-menu-drawer", ".mobile-menu-close");

// all the divs with class has-submenu-mobile
const menuItemswithSubmenu = document.querySelectorAll(".has-submenu-mobile");
const childlinksContainer = document.querySelectorAll(".mobile-childlinks");

menuItemswithSubmenu.forEach((item, index) => {
  item.addEventListener("click", (e) => {
    item.classList.toggle("active");
    childlinksContainer[index].classList.toggle("active");
  });
});

if (window.location.pathname === "/") {
  new Splide(".splide.hero", {
    // rewind: true,
    type: "loop",
    pagination: false,
  }).mount();

  // timer
  const timerDiv = document.querySelector(".timer");

  const timer = () => {
    let endTime = new Date(2023, 11, 20);
    let todayDate = new Date();
    let todayTime = todayDate.getTime();
    let remainingTime = endTime - todayTime;
    let oneMin = 60 * 1000;
    let oneHr = 60 * oneMin;
    let oneDay = 24 * oneHr;

    let addZeros = (num) => (num < 10 ? `0${num}` : num);

    if (endTime < todayTime) {
      clearInterval(i);
      timerDiv.innerHTML = `<h3>Offer time has expired</h3>`;
    } else {
      let daysLeft = Math.floor(remainingTime / oneDay);
      let hrsLeft = Math.floor((remainingTime % oneDay) / oneHr);
      let minsLeft = Math.floor((remainingTime % oneHr) / oneMin);
      let secsLeft = Math.floor((remainingTime % oneMin) / 1000);

      // console.log(daysLeft, hrsLeft, minsLeft, secsLeft);
      timerDiv.innerHTML = `${addZeros(daysLeft)} Days : ${addZeros(
        hrsLeft
      )} Hours : ${addZeros(minsLeft)} mins : ${addZeros(secsLeft)} seconds`;
    }
  };

  if (timerDiv !== null) {
    timer();
    let i = setInterval(timer, 1000);
  }

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

  new Splide(".splide.collections-slider", {
    perPage: 4,
    type: "loop",
    pagination: false,
    breakpoints: {
      768: {
        perPage: 3,
      },
      640: {
        perPage: 2,
      },
    },
  }).mount();

  //Testimonials slider

  new Splide(".splide.testimonials-slides", {
    perPage: 1,
    padding: "20%",
    type: "loop",
    pagination: false,
    arrows: false,
    // rewind: true,
  }).mount();

  new Splide(".splide.instagram-latest-posts", {
    perPage: 5,
    gap: "30px",
    // padding: "20px",
    type: "loop",
    pagination: false,
    arrows: false,
    breakpoints: {
      768: {
        perPage: 3,
      },
      640: {
        perPage: 2,
      },
    },
    // rewind: true,
  }).mount();
}

/* cart page logic */

const handleQuantityUpdate = async (key, quantity, sectionId = null) => {
  const sections = sectionId
    ? "header,cart-mini," + sectionId
    : "header,cart-mini";
  const payload = {
    id: key,
    quantity: quantity,
    sections: sections,
  };

  const sentData = sendUpdatedQuantity(payload);

  sentData.then((data) => {
    updateUIelement(data.data.sections["header"], ".items-in-cart");
    updateUIelement(data.data.sections["cart-mini"], ".cart-drawer form");
    if (sectionId) {
      updateUIelement(data.data.sections[sectionId], ".cart-page");
    }
  });
};

addGlobalEventListener("change", ".cart-item-quantity", (e) => {
  const sectionId = document.querySelector(".cart-page").dataset.section;
  let quantity = e.target.value;
  let key = e.target.dataset.variant;
  handleQuantityUpdate(key, +quantity, sectionId);
});

addGlobalEventListener("click", ".remove-cart-line-item", (e) => {
  const sectionId = document.querySelector(".cart-page").dataset.section;
  e.preventDefault();
  let quantity = 0;
  let key = e.target.dataset.itemkey;
  handleQuantityUpdate(key, +quantity, sectionId);
});

addGlobalEventListener("click", ".pagination-nav-item", (e) => {
  e.preventDefault();
  console.log(e.target.href);
  handlePageLinkClick(e.target.href);
});

const handlePageLinkClick = (page) => {
  const section = document.querySelector("[data-section]");
  const sectionId = section.dataset.section;
  const pageData = getPage(page, sectionId);

  pageData.then((data) => {
    const updatePage = updateUIelement(data.data, "." + section.className);

    if (updatePage) {
      window.scrollTo(0, 0);
      window.history.replaceState({}, "", `${page}`);
    }
  });
};

// product-cart Add to Cart

const handleAddToCartProductCard = (variantID) => {
  let formData = {
    items: [
      {
        id: variantID,
        quantity: 1,
      },
    ],
  };

  handleAddToCart(formData).then((response) => {
    updateUIelement(response.data.sections["header"], ".items-in-cart");
  });
};

const addProductToWishlist = (e) => {
  const wishlistBtn = findClass(e, "wishlist-product");
  let productID = wishlistBtn.dataset.productid;
  let wishlistItems;

  if ("wishlist" in localStorage) {
    wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
    if (wishlistItems.includes(`id:${productID}`)) {
      wishlistItems = wishlistItems.filter(
        (item) => item !== `id:${productID}`
      );
      wishlistBtn.classList.remove("active");
    } else {
      wishlistItems = [`id:${productID}`, ...wishlistItems];
      wishlistBtn.classList.add("active");
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  } else {
    localStorage.setItem("wishlist", JSON.stringify([`id:${productID}`]));
  }
};

// adds eventlistener to wishlist btn at the moment it is adding the product to cart on collections page.

addGlobalEventListener(
  "click",
  ".wishlist-product, .wishlist-product *",
  (e) => {
    e.preventDefault();

    addProductToWishlist(e);
  }
);

// check products wishlist when page loads

const checkWishlistedProducts = () => {
  if ("wishlist" in localStorage) {
    wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
    const wishlistButtons = document.querySelectorAll(".product-card-wishlist");

    wishlistButtons.forEach((wishlist) => {
      const productID = wishlist.dataset.productid;
      if (wishlistItems.includes(`id:${productID}`)) {
        console.log("class added to", wishlist);
        wishlist.classList.add("active");
      }
    });
  }
};

const checkWishlistedProduct = () => {
  if ("wishlist" in localStorage) {
    wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
    const wishlistButton = document.querySelector(".wis-button-container");

    const productID = wishlistButton.dataset.productid;
    if (wishlistItems.includes(`id:${productID}`)) {
      // console.log("class added to", wishlistButton);
      wishlistButton.classList.add("active");
      wishlistButton.querySelector(".wis-button-text").innerText =
        "Browse wishlist";
    }
  }
};

const checkWishlitedProductInQuickView = () => {
  if ("wishlist" in localStorage) {
    wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
    const wishlist = document
      .querySelector(".quickview-container")
      .querySelector(".wishlist-product");
    const productID = wishlist.dataset.productid;
    if (wishlistItems.includes(`id:${productID}`)) {
      wishlist.classList.add("active");
      wishlist.querySelector(".wis-button-text").innerText =
        "Browse the Wishlist";
      wishlist.href = "/pages/wishlist";
    }
  }
};

document.addEventListener("DOMContentLoaded", checkWishlistedProducts);
document.addEventListener("DOMContentLoaded", checkWishlistedProduct);

// product page

if (document.querySelector(".splide.product-images-nav-slider")) {
  let productThumbnailsSlider = new Splide(
    ".splide.product-images-nav-slider",
    {
      fixedWidth: 100,
      fixedHeight: 60,
      gap: 10,
      rewind: true,
      pagination: false,
      isNavigation: true,
      breakpoints: {
        600: {
          fixedWidth: 60,
          fixedHeight: 44,
        },
      },
    }
  );

  var productMainSlider = new Splide(".splide.product-main-image-slider", {
    // rewind: true,
    type: "loop",
    pagination: false,
    perPage: 1,
  });

  productMainSlider.sync(productThumbnailsSlider);
  productMainSlider.mount();
  productThumbnailsSlider.mount();
}

document.addEventListener("DOMContentLoaded", function () {
  addGlobalEventListener("click", ".option-value", (e) => {
    const variantValues = [];
    variantValues.push(e.target.dataset.value);
    const optionType = e.target.dataset.swatchType;
    const allVariants = document.querySelectorAll(".option-value.is_selected");

    allVariants.forEach((variant) => {
      if (variant.dataset.swatchType !== optionType) {
        variantValues.push(variant.dataset.value);
      }
    });

    const newVariantValues = variantValues.sort();

    // console.log(newVariantValues);

    const variantData = JSON.parse(
      document
        .querySelector(".prod-variants")
        .querySelector('[type="application/json"]').textContent
    );

    const currentVariant = variantData.find((variant, index) => {
      const findings = !variant.options
        .sort()
        .map((option, index) => {
          return newVariantValues[index] === option;
        })
        .includes(false);
      if (findings) return variant;
    });

    const productUrl = document.querySelector(".prod-variants");
    const updateURL = () => {
      if (!currentVariant) return;
      window.history.replaceState(
        {},
        "",
        `${productUrl.dataset.url}?variant=${currentVariant.id}`
      );
    };

    const updateUI = () => {
      const sectionID = document.querySelector(".product-page");

      const getData = getPage(
        `${productUrl.dataset.url}?variant=${currentVariant.id}`,
        sectionID.dataset.section
      );

      getData
        .then((data) => {
          updateSelectedVariantID(data.data, "input[name='id']");
          updateUIelement(data.data, ".prod-price");
          updateUIelement(data.data, ".prod-variants");
          return true;
        })
        .then((confirm) => {
          if (!confirm) return;
          //once UI is updated it will have a new active class on the selected variant, get that slide
          const activeColorVariant = document.querySelector(
            '[data-swatch-type="Color"].active'
          );

          // get the dataset slide and add + infront to convert it to number by default it's a string, pass it to splideJS inbuilt method, sliderName.go(number of slide)
          productMainSlider.go(+activeColorVariant.dataset.slide);
        });
    };

    if (currentVariant) {
      updateURL();
      updateUI();
    }
  });

  const selectedVariants = () => {};

  const getVariantJSON = () => {
    const variantData = JSON.parse(
      document
        .querySelector(".prod-variants")
        .querySelector('[type="application/json"]').textContent
    );
    return variantData;
  };

  const getSelectedVariant = () => {};
});

addGlobalEventListener(
  "click",
  ".add-to-cart-button, .add-to-cart-button *",
  (e) => {
    e.preventDefault();
    const addToCartButtonSpinner = document.querySelector(".lds-dual-ring");
    const addToCartButton = document.querySelector(".add-to-cart-button");

    let addToCartForm = document.querySelector('form[action$="/cart/add"]');
    let formData = new FormData(addToCartForm);

    addToCartButtonSpinner.classList.add("active");
    addToCartButton.classList.add("waiting");

    handleAddToCart(formData).then((data) => {
      updateUIelement(data.data.sections.header, ".items-in-cart");
      updateUIelement(data.data.sections["cart-mini"], ".cart-drawer form");
      addToCartButtonSpinner.classList.remove("active");
      addToCartButton.classList.remove("waiting");
      document.querySelector(".cart-drawer").classList.add("active");
      document.querySelector(".background-overlay").classList.add("active");
    });
  }
);

const tabs = document.querySelectorAll(".tab-btn");
const tabsContent = document.querySelectorAll(".tab-content");

tabs.forEach((tab, index) => {
  tab.addEventListener("click", (e) => {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tab.classList.add("active");

    tabsContent.forEach((tabContent) => tabContent.classList.remove("active"));

    tabsContent[index].classList.add("active");
  });
});

addGlobalEventListener("click", ".quantity-selector", (e) => {
  e.preventDefault();
  // const quantityInput = document.querySelector(".prod-quantity-input");
  const quantityInput = findClass(e, "prod-quantity").querySelector(
    ".prod-quantity-input"
  );

  if (e.target.matches(".is--plus")) {
    quantityInput.value = +quantityInput.value + 1;
  } else if (e.target.matches(".is--minus")) {
    if (quantityInput.value <= 1) {
    } else {
      quantityInput.value = +quantityInput.value - 1;
    }
  }
});

addGlobalEventListener(
  "click",
  ".cart-mini-quantity-selector, .cart-mini-quantity-selector *",
  (e) => {
    e.preventDefault();
    const quantityInput = findClass(e, "cart-mini-prod-quantity").querySelector(
      ".cart-mini-prod-quantity-input"
    );

    if (e.target.matches(".is--plus")) {
      quantityInput.value = +quantityInput.value + 1;
      handleQuantityUpdate(quantityInput.dataset.key, +quantityInput.value);
    } else if (e.target.matches(".is--minus")) {
      if (quantityInput.value <= 1) {
      } else {
        quantityInput.value = +quantityInput.value - 1;
        handleQuantityUpdate(quantityInput.dataset.key, +quantityInput.value);
      }
    } else if (e.target.matches(".is--delete, .is--delete *")) {
      handleQuantityUpdate(quantityInput.dataset.key, 0);
    }
  }
);

// cart-mini
showElement(".cart-drawer", ".nav-cart-box", true);
showElement(".cart-drawer", ".nav-cart-box-mobile", true);
hideElement(".cart-drawer", ".cart-drawer-close-btn");

// update quantity
addGlobalEventListener("change", ".cart-mini-prod-quantity-input", (e) => {
  let quantity = e.target.value;
  let key = e.target.dataset.key;
  handleQuantityUpdate(key, +quantity);
});

addGlobalEventListener(
  "click",
  ".remove-cart-mini-line-item, .remove-cart-mini-line-item *",
  (e) => {
    e.preventDefault();
    let quantity = 0;
    let key = e.target.dataset.itemkey;
    handleQuantityUpdate(key, +quantity);
  }
);

// when clicked on quickview button display the product

addGlobalEventListener("click", ".quickview, .quickview *", (e) => {
  e.preventDefault();

  let prodUrl = findClass(e, "quickview").dataset.prodUrl;
  const quickViewContainer = document.createElement("div");
  quickViewContainer.classList.add("quickview-container");
  const popups = document.getElementById("popups");
  popups.before(quickViewContainer);

  fetch(`/products/${prodUrl}?section_id=quickview`)
    .then((response) => response.text())
    .then((data) => {
      updateUIelement(data, ".quickview-container");
      addGlobalEventListener(
        "click",
        ".quickview-close, .quickview-close *",
        (e) => {
          document.querySelector(".quickview-container").remove();
          checkWishlistedProducts();
        }
      );
      checkWishlitedProductInQuickView();
    });
});

// quickview add to cart button

addGlobalEventListener(
  "click",
  ".quick-view-add-to-cart-button, .quick-view-add-to-cart-button *",
  (e) => {
    e.preventDefault();
    const addToCartButtonSpinner = document.querySelector(".lds-dual-ring");
    const addToCartButton = document.querySelector(
      ".quick-view-add-to-cart-button"
    );

    let addToCartForm = document.querySelector("#quick-product-form");
    let formData = new FormData(addToCartForm);

    addToCartButtonSpinner.classList.add("active");
    addToCartButton.classList.add("waiting");

    handleAddToCart(formData).then((data) => {
      updateUIelement(data.data.sections.header, ".items-in-cart");
      updateUIelement(data.data.sections["cart-mini"], ".cart-drawer form");
      addToCartButtonSpinner.classList.remove("active");
      addToCartButton.classList.remove("waiting");
      document.querySelector(".quickview-container").remove();
      document.querySelector(".cart-drawer").classList.add("active");
      document.querySelector(".background-overlay").classList.add("active");
    });
  }
);

// quickView variant selector

document.addEventListener("DOMContentLoaded", function () {
  addGlobalEventListener(
    "click",
    ".qv-option-value, .qv-option-value *",
    (e) => {
      const qvInner = findClass(e, "quickview-container");
      const variantValues = [];
      variantValues.push(e.target.dataset.value);
      const optionType = e.target.dataset.swatchType;
      const activeVariants = qvInner.querySelectorAll(
        ".qv-option-value.is_selected"
      );

      activeVariants.forEach((variant) => {
        if (variant.dataset.swatchType !== optionType) {
          variantValues.push(variant.dataset.value);
        }
      });

      const newVariantValues = variantValues.sort();

      const variantData = JSON.parse(
        qvInner.querySelector('[type="application/json"]').textContent
      );

      const currentVariant = variantData.find((variant, index) => {
        const findings = !variant.options
          .sort()
          .map((option, index) => {
            return newVariantValues[index] === option;
          })
          .includes(false);
        if (findings) return variant;
      });

      const updateUI = () => {
        const productUrl = qvInner.querySelector(".prod-variants");

        const qvUpdateSelectedVariantID = (data, selector) => {
          const htmlFromData = new DOMParser().parseFromString(
            data,
            "text/html"
          );
          const valueToUpdate = qvInner.querySelector(selector);
          const updatedData = htmlFromData.querySelector(selector).value;

          if (valueToUpdate && updatedData) {
            valueToUpdate.value = updatedData;
            return true;
          }
        };

        const qvUpdateUIelement = (
          data,
          selector,
          targetSelector = selector
        ) => {
          const htmlFromData = new DOMParser().parseFromString(
            data,
            "text/html"
          );
          const containerToUpdate = qvInner.querySelector(selector);
          const updatedData = htmlFromData.querySelector(targetSelector);

          if (containerToUpdate && updatedData) {
            containerToUpdate.innerHTML = updatedData.innerHTML;
            return true;
          }
        };

        const getData = fetch(
          `${productUrl.dataset.url}?variant=${currentVariant.id}&section_id=quickview`
        );

        getData
          .then((res) => res.text())
          .then((data) => {
            qvUpdateSelectedVariantID(data, "input[name='id']");
            qvUpdateUIelement(data, ".prod-price");
            qvUpdateUIelement(data, ".prod-variants");
          });
      };

      if (currentVariant) {
        updateUI();
      }
    }
  );

  const selectedVariants = () => {};

  const getSelectedVariant = () => {};
});
