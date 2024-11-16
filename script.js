window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) { // Adjust 50 to trigger at the desired scroll depth
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default anchor behavior

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            const headerHeight = document.querySelector("header").offsetHeight; // Dynamically get header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            // Reset scroll position before smooth scrolling
            window.scrollTo({
                top: window.pageYOffset, // Current position
                behavior: "auto" // Instantly reset any existing scrolling
            });

            // Smooth scroll to the exact position
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    });
});

