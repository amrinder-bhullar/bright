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
      window.Shopify.routes.root + "cart/add.js/?sections=header",
      formData
    );
  } catch (error) {
    console.log(error);
  }
};

// sends the requ

const getPage = async (page, sectionId) => {
  try {
    return await axios.get(page + "&" + sectionId);
  } catch (error) {
    console.log(error);
  }
};

const sendUpdatedQuantity = (payload) => {
  try {
    return axios.post(window.Shopify.routes.root + `cart/change.js`, payload);
  } catch (error) {
    console.log(error);
  }
};

// update UI element pass the finaldata which will be converted to DomParser, accepts 2 params final data and selector to update

const updateUIelement = (data, selector) => {
  const htmlFromData = new DOMParser().parseFromString(data, "text/html");
  const containerToUpdate = document.querySelector(selector);
  const updatedData = htmlFromData.querySelector(selector);

  if (containerToUpdate && updatedData) {
    containerToUpdate.innerHTML = updatedData.innerHTML;
    return true;
  }
};

// end of helper functions

menuItems.forEach((item, index) => {
  item.addEventListener("mouseover", (e) => {
    // megaMenu.forEach((item) => item.classList.remove("active"));
    megaMenu[index].classList.add("active");

    if (megaMenu[index].getElementsByClassName("childlinks-with-children")[0]) {
      megaMenu[index].classList.add("mega");
    }
  });
  item.addEventListener("mouseleave", (e) => {
    // megaMenu.forEach((item) => item.classList.remove("active"));
    megaMenu[index].classList.remove("active");
    if (megaMenu[index].classList.contains("mega")) {
      megaMenu[index].classList.remove("mega");
    }
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

// console.log(menuItems);

// mobile menu drawer
const mobileMenuButton = document.querySelector(".mobile-menu-icon");
const mobileMenuDrawer = document.querySelector(".mobile-menu-drawer");
const mobileMenuClose = document.querySelector(".mobile-menu-close");
// all the divs with class has-submenu-mobile
const menuItemswithSubmenu = document.querySelectorAll(".has-submenu-mobile");
const childlinksContainer = document.querySelectorAll(".mobile-childlinks");

mobileMenuButton.addEventListener("click", (e) => {
  mobileMenuDrawer.classList.toggle("active");
});

mobileMenuClose.addEventListener("click", (e) => {
  mobileMenuDrawer.classList.remove("active");
});

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

const handleQuantityUpdate = async (key, quantity) => {
  const sectionId = document.querySelector(".cart-page").dataset.section;

  const payload = {
    id: key,
    quantity: quantity,
    sections: "header," + sectionId,
  };

  const sentData = sendUpdatedQuantity(payload);

  sentData.then((data) => {
    updateUIelement(data.data.sections["header"], ".items-in-cart");
    updateUIelement(data.data.sections[sectionId], ".cart-page");
  });
};

addGlobalEventListener("change", ".cart-item-quantity", (e) => {
  let quantity = e.target.value;
  let key = e.target.dataset.variant;
  handleQuantityUpdate(key, +quantity);
});

addGlobalEventListener("click", ".remove-cart-line-item", (e) => {
  e.preventDefault();
  let quantity = 0;
  let key = e.target.dataset.itemkey;
  handleQuantityUpdate(key, +quantity);
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

  debugger;
  pageData.then((data) => {
    const updatePage = updateUIelement(data.data, "." + section.className);

    if (updatePage) {
      window.scrollTo(0, 0);
      window.history.replaceState({}, "", `${page}`);
    }
  });
};

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
  // .then((data) => console.log(data));
};

// adds eventlistener to wishlist btn at the moment it is adding the product to cart on collections page.

addGlobalEventListener("click", ".product-card-wishlist-btn", (e) => {
  let variantID = e.target.parentNode.dataset.variantid;
  handleAddToCartProductCard(variantID);
});

// product page

// new Splide(".splide.product-images-nav-slider", {
//   // rewind: true,
//   pagination: false,
//   perPage: 4,
// }).mount();

// new Splide(".splide.product-main-image-slider", {
//   // rewind: true,
//   type: "loop",
//   pagination: false,
//   perPage: 1,
// }).mount();

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

    console.log(newVariantValues);

    const variantData = JSON.parse(
      document
        .querySelector(".prod-variants")
        .querySelector('[type="application/json"]').textContent
    );

    const currentVariant = variantData.find((variant, index) => {
      const findings = !variant.options;
      // .sort()
      // .map((option, index) => {
      //   return newVariantValues[index] === option;
      // })
      // .includes(false);
      // if (findings) return variant;

      const results = newVariantValues.filter((option) => {
        variant.options.includes(option);
      });

      console.log(results);
    });

    // console.log(findings);

    console.log(currentVariant);
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
