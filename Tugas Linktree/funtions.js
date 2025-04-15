function renderCarouselsFromPosts(posts, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return console.error("Container not found!");

  posts.forEach((post, index) => {
    const avatars = post.products.slice(0, 2).map((p) => p.img);
    const extraCount = post.products.length - 2;

    const wrapper = document.createElement("div");
    wrapper.className = "image-card-carousel";

    const avatarHTML = avatars
      .map(
        (img) => `
        <div class="rounded"
          style="
            height: 37px;
            width: 37px;
            background-image: url('${img}');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;">
        </div>
      `
      )
      .join("");

    const extraAvatarHTML =
      extraCount > 0
        ? `
        <div class="rounded d-flex justify-content-center align-items-center position-relative text-center text-white"
          style="
            height: 37px;
            width: 37px;
            background-image: url('${avatars[0]}');
            background-size: cover;
            background-position: center;
            overflow: hidden;">
          <div style="
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1;"></div>
          <p class="m-0" style="z-index: 2;">+${extraCount}</p>
        </div>
      `
        : "";

    wrapper.innerHTML = `
        <div 
          class="thumbnail-link" 
          role="button"
          data-toggle="modal" 
          data-target="#postModal"
          data-post-index="${index}">
          <img src="${post.thumbnail}" alt="${post.title}" />
          <div class="card-overlay" style="padding: 3px">
            <div class="d-flex justify-content-between w-full">
              ${avatarHTML}
              ${extraAvatarHTML}
            </div>
          </div>
        </div>
        <i class="fas fa-ellipsis-v menu-icon"></i>
      `;

    container.appendChild(wrapper);
  });

  // Add event listener to update modal when clicked
  container.addEventListener("click", function (e) {
    const card = e.target.closest(".thumbnail-link");
    console.log(card);

    if (card) {
      const postIndex = card.getAttribute("data-post-index");
      const post = posts[postIndex];
      populatePostModal(post);
    }
  });
}

function populatePostModal(data) {
  // Set title and detail
  document.getElementById("modalTitle").innerText = data.title;
  document.getElementById("modalDetail").innerText =
    "1 Post • " + data.products.length + " Products";

  // Set Instagram embed
  const embed = document.getElementById("modalProductVideo");
  console.log("src:", data.video, embed);

  embed.setAttribute("src", data.video);
  embed.innerHTML = ""; // clear inner content (in case re-used)

  // Refresh Instagram embed
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  }

  // Set product list
  const productList = document.getElementById("modalProductList");
  productList.innerHTML = ""; // clear old products

  (data.products || []).forEach((product) => {
    const texts = product.text;
    const prodTitle = texts[0];
    let target = "";
    let price = "";
    if (texts.length == 3) {
      target = texts[1];
      price = texts[2];
    } else if (texts.length == 2) {
      price = texts[1];
    }
    const productHTML = `
        <a target="_blank" href="${product.href}">
          <div class="col">
            <div class="product-card">
              <img
                src="${product.img}"
                alt="Product"
                class="product-image w-100"
              />
              <div class="product-body">
                <div class="product-title">${prodTitle}</div>
                <div class="product-sub">${target}</div>
                <div class="product-price">${price}</div>
              </div>
            </div>
          </div>
        </a>
      `;
    productList.insertAdjacentHTML("beforeend", productHTML);
  });

  // Show modal
  // $("#postModal").modal("show"
}

// Function to create product box HTML structure
function createProductBox(product, index) {
  // Slice first 4 images from the product data
  const imgs_display = product.products.slice(0, 4);
  console.log(imgs_display);

  // Create product box using template literals
  const productBox = `
    <div data-post-index="${index}" class="product-box text-center mx-0 my-2" data-toggle="modal" data-target="#productModal"
    style="
              border-radius: 15px;
              overflow: hidden;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
              cursor: pointer;
            "
            onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.3)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
    >
      <div class="d-flex justify-content-center">
        ${imgs_display
          .map(
            (image) => `
          <div class="col-3">
            <img src="${image.img}" alt="Product Image" class="product-img" />
          </div>
        `
          )
          .join("")}
      </div>
      <div class="bottom-text">
        <div class="product-title">${product.h2}</div>
        <div class="product-subtitle">${product.products.length} Products</div>
      </div>
    </div>
  `;

  // Convert string to DOM element
  const div = document.createElement("div");
  div.innerHTML = productBox;

  // Attach click event to the product box to show the modal
  const productBoxElement = div.firstElementChild;

  // Add event listener to update modal when clicked
  productBoxElement.addEventListener("click", function (e) {
    const card = e.target.closest(".product-box");
    console.log("card", card);

    if (card) {
      const postIndex = card.getAttribute("data-post-index");
      const post = product;
      populateProductModal(post);
    }
  });

  return productBoxElement;
}

// Function to fetch products from the JSON file and append to productList
function loadProducts() {
  fetch("product_clean.json") // Change to the path of your actual JSON file
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const productList = document.getElementById("productList");

      data.forEach((product, index) => {
        const productBox = createProductBox(product, index);
        productList.appendChild(productBox);
      });
    })
    .catch((error) => {
      console.error("Error loading the products:", error);
    });
}

function populateProductModal(data) {
  console.log("modal product", data);

  // Set title and detail
  document.getElementById("modalTitlePr").innerText = data.h2;
  document.getElementById("modalDetailPr").innerText =
    data.products.length + " Products";

  // Refresh Instagram embed
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  }

  // Set product list
  const productList = document.getElementById("modalProductListPr");
  productList.innerHTML = ""; // clear old products

  (data.products || []).forEach((product) => {
    const texts = product.text;
    const prodTitle = texts[0];
    let tearget = "";
    let price = "";
    if (texts.length == 3) {
      target = texts[1];
      price = texts[2];
    } else if (texts.length == 2) {
      price = texts[1];
    }
    const productHTML = `
        <a target="_blank" href="${product.href}">
          <div class="col">
            <div class="product-card">
              <img
                src="${product.img}"
                alt="Product"
                class="product-image w-100"
              />
              <div class="product-body">
                <div class="product-title">${prodTitle}</div>
                <div class="product-sub">${target}</div>
                <div class="product-price">${price}</div>
              </div>
            </div>
          </div>
        </a>
      `;
    productList.insertAdjacentHTML("beforeend", productHTML);
  });

  // Show modal
  // $("#postModal").modal("show"
}
