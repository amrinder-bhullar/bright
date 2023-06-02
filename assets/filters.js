showElement(".filter-drawer", ".filter-button", true);
hideElement(".filter-drawer", ".filter-close-btn");

addGlobalEventListener(
  "click",
  ".single-filter-value, .single-filter-value *",
  (e) => {
    e.preventDefault();

    let url = findClass(e, "single-filter-value");
    url = url.href;

    handlePageLinkClick(url);
    document.querySelector(".filter-drawer").classList.remove("active");
    document.querySelector(".background-overlay").classList.remove("active");
    document.body.style.removeProperty("overflow");
  }
);

addGlobalEventListener(
  "click",
  ".active-filters__remove-filter, .active-filters__remove-filter *",
  (e) => {
    e.preventDefault();

    let url = findClass(e, "active-filters__remove-filter");
    url = url.href;

    handlePageLinkClick(url);
  }
);
