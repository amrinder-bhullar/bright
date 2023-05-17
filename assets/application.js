// Put your application javascript here
const menuItems = document.querySelectorAll(".has-submenu");
const megaMenu = document.querySelectorAll(".mega-menu");

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
    let endTime = new Date(2023, 11, 20, 0, 0);
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

if (window.location.pathname === "/cart") {
  const QuantityInputs = document.querySelectorAll(".cart-item-quantity");
  const sectionId = document.querySelector(".cart-page").dataset.section;
  const form = document.querySelector(".cart-total");

  const handleQuantityUpdate = async (key, quantity) => {
    const updateQuantity = () => {
      try {
        axios
          .post(window.location.pathname + `/change.js`, {
            id: key,
            quantity: quantity,
            sections: "header," + sectionId,
          })
          .then((data) => {
            updateHeaderCartQuantity(data.data.sections);
            updateCartPrices(data.data.sections);
            console.log(data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    updateQuantity();

    // try {
    //   const newData = axios
    //     .post(
    //       window.location.pathname + `/update.js`,
    //       `updates[${key}]=${quantity}`
    //     )
    //     .then(() => {
    //       return axios.get(
    //         window.location.pathname + `?sections=${sectionId},header`
    //       );
    //     });

    //   newData.then((data) => {
    //     updateCartPrices(data);
    //     updateHeaderCartQuantity(data);
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    const updateCartPrices = (data) => {
      const html = new DOMParser().parseFromString(
        data[sectionId],
        "text/html"
      );
      const dataForm = html.querySelector(".cart-total");
      const totalItemPrice = document.querySelectorAll(".total-item-price");
      const dataTotalItemPrice = html.querySelectorAll(".total-item-price");
      form.innerHTML = dataForm.innerHTML;

      // console.log(dataTotalItemPrice, totalItemPrice);

      dataTotalItemPrice.forEach((item, index) => {
        totalItemPrice[index].innerHTML = dataTotalItemPrice[index].innerHTML;
      });
    };

    const updateHeaderCartQuantity = (data) => {
      const html = new DOMParser().parseFromString(data["header"], "text/html");

      const dataCartQuantity = html.querySelector(".items-in-cart");
      const cartQuantity = document.querySelector(".items-in-cart");

      cartQuantity.innerHTML = dataCartQuantity.innerHTML;
      console.log(dataCartQuantity.innerHTML, cartQuantity.innerHTML);
    };
  };

  QuantityInputs.forEach((Qinput, index) => {
    Qinput.addEventListener("change", (e) => {
      let quantity = e.target.value;
      let key = e.target.dataset.variant;

      handleQuantityUpdate(key, +quantity);
    });
  });
}
