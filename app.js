const mainCategories = document.getElementById("mainCategories");
const sidebar = document.getElementById("sidebar");
const menuBar = document.getElementById("menuBar");
const menuList = document.getElementById("menuList");

// Toggle sidebar visibility when clicking the menu bar
menuBar.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// Close menu if you click outside it
document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target) && !menuBar.contains(event.target)) {
    sidebar.classList.add("hidden");
  }
});

// Fetch and display categories
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then((res) => res.json())
  .then((data) => {
    const categories = data.categories;
    mainCategories.innerHTML = "";
    menuList.innerHTML = "";

    mainCategories.className =
      "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6";

    categories.forEach((category) => {
      // Category Cards (Main)
      mainCategories.innerHTML += `
        <div class="relative bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 cursor-pointer"
             onclick="loadMealsByCategory('${category.strCategory}')">
          <span class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-2 font-semibold rounded-full shadow-md">
            ${category.strCategory}
          </span>
          <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full h-48 object-cover">
        </div>
      `;

      // Sidebar Menu Item
      menuList.innerHTML += `
        <li class="hover:bg-orange-100 rounded px-2 py-1 cursor-pointer"
            onclick="loadMealsByCategory('${category.strCategory}');
                     sidebar.classList.add('hidden');">
          ${category.strCategory}
        </li>
      `;
    });
  })
  .catch((err) => console.log("Error loading categories:", err));


// Function to search meal by name
function searchMeal(query) {
  if (!query.trim()) return;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((res) => res.json())
    .then((data) => {
      const meals = data.meals;
      detailaboutparticularitem.innerHTML = "";

      if (!meals) {
        detailaboutparticularitem.innerHTML = `
          <p class="text-center text-red-500 text-lg col-span-full">No meals found for "${query}"</p>
        `;
        return;
      }

      detailaboutparticularitem.className =
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6";

      meals.forEach((meal) => {
        detailaboutparticularitem.innerHTML += `
          <div class="relative bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition duration-300 cursor-pointer"
               onclick="displayLastItem('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-2 font-semibold rounded-full">
              <h4 class="text-sm font-semibold">${meal.strMeal}</h4>
            </div>
          </div>
        `;
      });
    })
    .catch((err) => console.log("Error fetching meals:", err));
}

// Function to load meals by category
function loadMealsByCategory(categoryName) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
    .then((res) => res.json())
    .then((data) => {
      const meals = data.meals;
      detailaboutparticularitem.innerHTML = "";
      detailaboutparticularitem.className =
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6";

      meals.forEach((meal) => {
        detailaboutparticularitem.innerHTML += `
          <div class="relative bg-white rounded-xl shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
               onclick="displayLastItem('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48">
            <div class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-2 font-semibold rounded-full">
              <h4 class="text-sm font-semibold">${meal.strMeal}</h4>
            </div>
          </div>
        `;
      });
    })
    .catch((err) => console.log("Error loading meals:", err));
}

// Function to load a meal's full details
let detailaboutparticularitem=document.getElementById('detailaboutparticularitem')
function displayLastItem(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      // Get ingredients + measures
      // ✅ Get ingredients
        let ingredients = "";
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          if (ingredient && ingredient.trim() !== "") {
            ingredients += `<li>${ingredient}</li>`;
          }
        }

        // ✅ Get measures
        let measures = "";
        for (let i = 1; i <= 20; i++) {
          const measure = meal[`strMeasure${i}`];
          if (measure && measure.trim() !== "") {
            measures += `<li>${measure}</li>`;
          }
        }


      // Replace the main content with meal details
      detailaboutparticularitem.innerHTML = `
        <div class="bg-white shadow-lg rounded-xl p-6 w-300">
          <button onclick="reloadCategories()" class="bg-orange-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-orange-600">
            ← Back to Categories
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="rounded-lg shadow-md">
            
            <div>
              <h2 class="text-2xl font-bold text-orange-400 mb-2">${meal.strMeal}</h2>
              <p><strong>Category:</strong> ${meal.strCategory}</p>
              <p><strong>Area:</strong> ${meal.strArea}</p>
            </div>
          </div>

          <h3 class="text-xl font-semibold mt-6 mb-2 text-orange-400">Ingredients:</h3>
          <ul class="list-disc pl-5 text-gray-700">${ingredients}</ul>

          <h3 class="text-xl font-semibold mt-6 mb-2 text-orange-400">Measures:</h3>
          <ul class="list-disc pl-5 text-gray-700">${measures}</ul>


          <h3 class="text-xl font-semibold mt-6 mb-2 text-orange-400">Instructions:</h3>
          <p class="text-gray-700 ">${meal.strInstructions}</p>
        </div>
      `;
    })
    .catch((err) => console.log("Error loading meal details:", err));
}


// Go back to the home categories
function reloadCategories() {
  window.location.reload();
}

// Search functionality
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value;
  searchMeal(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value;
    searchMeal(query);
  }
});