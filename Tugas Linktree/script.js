fetch("posts_clean.json")
  .then((response) => response.json())
  .then((data) => renderCarouselsFromPosts(data, "#carouselContainer"))
  .catch((err) => console.error("Failed to load JSON:", err));



window.onload = loadProducts;
