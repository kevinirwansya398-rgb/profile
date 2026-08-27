document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // ELEMENT
  // ==============================

  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const navLinks = [
    ...document.querySelectorAll("[data-nav]")
  ];

  const sections = [
    ...document.querySelectorAll("main section[id]")
  ];

  const revealElements = [
    ...document.querySelectorAll(".reveal")
  ];


  // ==============================
  // HEADER SCROLL
  // ==============================

  function handleScroll() {

    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 10
    );

  }

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  handleScroll();


  // ==============================
  // MOBILE MENU
  // ==============================

  if (burger && nav) {

    burger.addEventListener("click", () => {

      const isOpen =
        nav.classList.toggle("open");

      burger.classList.toggle(
        "open",
        isOpen
      );

      burger.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });


    // Tutup menu ketika link diklik

    navLinks.forEach((link) => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        burger.classList.remove("open");

        burger.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });


    // Tutup menu ketika klik di luar

    document.addEventListener("click", (event) => {

      if (!nav.classList.contains("open")) {
        return;
      }

      const clickedInsideNav =
        nav.contains(event.target);

      const clickedBurger =
        burger.contains(event.target);

      if (
        !clickedInsideNav &&
        !clickedBurger
      ) {

        nav.classList.remove("open");

        burger.classList.remove("open");

        burger.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });


    // Tutup dengan tombol ESC

    document.addEventListener("keydown", (event) => {

      if (event.key !== "Escape") {
        return;
      }

      nav.classList.remove("open");

      burger.classList.remove("open");

      burger.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  }


  // ==============================
  // ACTIVE NAVIGATION
  // ==============================

  if (
    "IntersectionObserver" in window &&
    sections.length > 0
  ) {

    const navObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            const id =
              entry.target.getAttribute("id");

            navLinks.forEach((link) => {

              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`
              );

            });

          });

        },
        {
          rootMargin:
            "-45% 0px -50% 0px",

          threshold: 0
        }
      );


    sections.forEach((section) => {

      navObserver.observe(section);

    });

  }


  // ==============================
  // SCROLL REVEAL
  // ==============================

  if (
    "IntersectionObserver" in window &&
    revealElements.length > 0
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "in-view"
            );

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach((element) => {

      revealObserver.observe(element);

    });

  } else {

    // Fallback browser lama

    revealElements.forEach((element) => {

      element.classList.add(
        "in-view"
      );

    });

  }


  // ==============================
  // CONSOLE CHECK
  // ==============================

  console.log(
    "MKI Portfolio - JavaScript berhasil dijalankan."
  );

});
