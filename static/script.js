// JavaScript to toggle budget fields based on the selected pricing method

document.addEventListener("DOMContentLoaded", function () {
    const pricingMethod = document.getElementById("pricingMethod");
    const oneTimeGroup = document.getElementById("oneTimeBudgetGroup");
    const monthlyGroup = document.getElementById("monthlyBudgetGroup");
  
    pricingMethod.addEventListener("change", function () {
      const value = pricingMethod.value;
      if (value === "one-time") {
        oneTimeGroup.style.display = "block";
        monthlyGroup.style.display = "none";
      } else if (value === "monthly") {
        monthlyGroup.style.display = "block";
        oneTimeGroup.style.display = "none";
      } else {
        oneTimeGroup.style.display = "none";
        monthlyGroup.style.display = "none";
      }
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    // Redirect nav buttons to the appropriate pages
    const loginBtn = document.querySelector(".nav-btn.login");
    const signupBtn = document.querySelector(".nav-btn.signup");
  
    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        window.location.href = "login.html";
      });
    }
  
    if (signupBtn) {
      signupBtn.addEventListener("click", function () {
        window.location.href = "signup.html";
      });
    }
  });
  document.addEventListener("DOMContentLoaded", function() {
    const menuBtn = document.querySelector(".menu-btn");
    const dropdown = document.querySelector(".dropdown");
  
    // Toggle dropdown on menu button click
    menuBtn.addEventListener("click", function(event) {
      dropdown.classList.toggle("show");
      event.stopPropagation(); // Prevent click from bubbling up to document
    });
  
    // Close dropdown when clicking outside
    document.addEventListener("click", function() {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    });
  });
  document.addEventListener("DOMContentLoaded", function() {
    // Grab elements
    const modalBg = document.getElementById("createListingModal");
    const closeModalBtn = document.querySelector(".close-modal");
    const createListingBtns = document.querySelectorAll(".create-listing-btn");
  
    // Show modal when any "Create Listing" button is clicked
    createListingBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modalBg.classList.add("show");
      });
    });
  
    // Close modal when "X" is clicked
    closeModalBtn.addEventListener("click", () => {
      modalBg.classList.remove("show");
    });
  
    // Optional: close modal if user clicks outside the modal content
    modalBg.addEventListener("click", (event) => {
      // If click is on the background (not the .modal-content itself), close it
      if (event.target === modalBg) {
        modalBg.classList.remove("show");
      }
    });
  
    // Handle form submission (currently just a placeholder)
    const createListingForm = document.getElementById("createListingForm");
    createListingForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // You can collect form data here:
      const softwareName = document.getElementById("softwareName").value;
      const pricingMode = document.getElementById("pricingMode").value;
      const price = document.getElementById("price").value;
      const logoFile = document.getElementById("softwareLogo").files[0];
      const description = document.getElementById("softwareDescription").value;
  
      // For checkboxes:
      const checkboxes = createListingForm.querySelectorAll('input[type="checkbox"]:checked');
      const features = Array.from(checkboxes).map(cb => cb.value);
  
      // TODO: Send this data to your backend or handle it as needed
      console.log("Form Data:", {
        softwareName,
        pricingMode,
        price,
        logoFile,
        features,
        description
      });
  
      // Close modal after submission
      modalBg.classList.remove("show");
      createListingForm.reset();
    });
  });
  // Example: GET a list of software
fetch("http://127.0.0.1:8000/api/software/")
.then((response) => response.json())
.then((data) => {
  console.log("Software data:", data);
  // Insert into your DOM, e.g., create HTML elements for each software item
})
.catch((error) => console.error("Error:", error));

// Example: POST a new software listing
fetch("http://127.0.0.1:8000/api/software/", {
method: "POST",
headers: {
  "Content-Type": "application/json",
  // If you have auth, include a token or session cookie
},
body: JSON.stringify({
  name: "MyNewSoftware",
  description: "A brand new listing",
  industry: "retail",
  // ...
}),
})
.then((res) => res.json())
.then((createdItem) => {
  console.log("Created software:", createdItem);
})
.catch((error) => console.error("Error:", error));



// Once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const pricingMethod = document.getElementById("pricingMethod");
  const oneTimeGroup = document.getElementById("oneTimeBudgetGroup");
  const monthlyGroup = document.getElementById("monthlyBudgetGroup");

  // Show/hide budget fields based on pricing method
  pricingMethod.addEventListener("change", function () {
    const value = pricingMethod.value;
    if (value === "one-time") {
      oneTimeGroup.style.display = "block";
      monthlyGroup.style.display = "none";
    } else if (value === "monthly") {
      monthlyGroup.style.display = "block";
      oneTimeGroup.style.display = "none";
    } else {
      oneTimeGroup.style.display = "none";
      monthlyGroup.style.display = "none";
    }
  });

  // Handle form submission
  const filterForm = document.getElementById("filterForm");
  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect user inputs
    const industry = document.getElementById("industry").value;
    const inventorySize = document.getElementById("inventorySize").value;
    const deploymentMethod = document.getElementById("deploymentMethod").value;
    const deploymentPlatform = document.getElementById("deploymentPlatform").value;
    const pricingMethodValue = document.getElementById("pricingMethod").value;
    const oneTimeBudget = document.getElementById("oneTimeBudget").value;
    const monthlyBudget = document.getElementById("monthlyBudget").value;

    // Collect features
    const checkedFeatures = Array.from(
      filterForm.querySelectorAll('input[name="features"]:checked')
    ).map((checkbox) => checkbox.value.toLowerCase());

    // Filter logic (simple demonstration)
    const filteredResults = mockSoftwareData.filter((software) => {
      // Match industry if selected
      if (industry && software.industry !== industry) return false;

      // Match inventory size if selected
      if (inventorySize && software.inventorySize !== inventorySize) return false;

      // Match deployment method if selected
      if (deploymentMethod && software.deploymentMethod !== deploymentMethod) return false;

      // Match deployment platform if selected
      if (deploymentPlatform && software.deploymentPlatform !== deploymentPlatform) return false;

      // Match pricing method if selected
      if (pricingMethodValue && software.pricingMethod !== pricingMethodValue) return false;

      // If one-time pricing, match oneTimeBudget
      if (pricingMethodValue === "one-time" && oneTimeBudget) {
        if (software.oneTimeBudget !== oneTimeBudget) return false;
      }

      // If monthly pricing, match monthlyBudget
      if (pricingMethodValue === "monthly" && monthlyBudget) {
        if (software.monthlyBudget !== monthlyBudget) return false;
      }

      // Check if all selected features exist in the software's features
      // (optional, or you can do partial matches, etc.)
      for (let feat of checkedFeatures) {
        // If the software's features array doesn't include the selected feature, exclude it
        if (!software.features.map(f => f.toLowerCase()).includes(feat)) {
          return false;
        }
      }

      return true;
    });

    // Display the results
    displayRecommendations(filteredResults);
  });
});

// Function to display recommended items
function displayRecommendations(softwareList) {
  const recommendationList = document.getElementById("recommendation-list");
  recommendationList.innerHTML = ""; // Clear old results

  if (softwareList.length === 0) {
    recommendationList.innerHTML = "<p>No matching software found.</p>";
    return;
  }

  softwareList.forEach((software) => {
    // Create a container for each recommended software
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("recommended-item");

    // Build HTML content
    itemDiv.innerHTML = `
      <div class="recommended-header">
        <img src="${software.logo}" alt="${software.name}" class="software-logo">
        <div>
          <a href="${software.link}" target="_blank" class="software-name">${software.name}</a>
          <p class="software-rating">${software.rating}</p>
        </div>
      </div>
      <p class="software-description">${software.description}</p>
      <p class="software-features"><strong>Key Features:</strong> ${software.features.join(", ")}</p>
    `;

    recommendationList.appendChild(itemDiv);
  });
}
// script.js - Updated to work with the Django backend

// Base API URL and CSRF token handling
const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Get CSRF token from cookie
function getCSRFToken() {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

// Updated headers with CSRF token
function getHeaders(includeAuth = false) {
    const headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
    };
    
    if (includeAuth) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.token) {
            headers["Authorization"] = `Bearer ${user.token}`;
        }
    }
    
    return headers;
}

// Authentication Functions
function registerUser(userData, isVendor = false) {
  const endpoint = isVendor ? "signup/vendor/" : "signup/user/";
  
  return fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(JSON.stringify(data));
        });
      }
      return response.json();
    });
}

function loginUser(email, password) {
    if (!email || !email.includes('@')) {
        return Promise.reject(new Error('Please enter a valid email address'));
    }
    if (!password || password.length < 6) {
        return Promise.reject(new Error('Password must be at least 6 characters long'));
    }

    return fetch(API_BASE_URL + "login/", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    });
}

function logoutUser() {
  // Get authentication token from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  return fetch(API_BASE_URL + "logout/", {
    method: "POST",
    headers: getHeaders(true),
  })
    .then(() => {
      // Clear user data from localStorage
      localStorage.removeItem("user");
    });
}

// Software Listing Functions
function getSoftwareList() {
  return fetch(API_BASE_URL + "software/")
    .then(response => response.json());
}

function searchSoftware(filters) {
    // Convert filters object to URL parameters
    const params = new URLSearchParams();
    
    // Add weights for the weighted search
    params.append('industry_weight', '0.2');
    params.append('size_weight', '0.2');
    params.append('deployment_weight', '0.15');
    params.append('platform_weight', '0.15');
    params.append('pricing_weight', '0.3');
    
    // Add filter criteria
    for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else if (value) {
            params.append(key, value);
        }
    }
    
    return fetch(`${API_BASE_URL}software/search/?${params.toString()}`)
        .then(response => response.json());
}

function createSoftware(softwareData) {
    return fetch(API_BASE_URL + "software/", {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(softwareData),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(JSON.stringify(data));
                });
            }
            return response.json();
        });
}

// Review and Rating Functions
function validateReview(content) {
    if (!content || content.length < 10) {
        throw new Error('Review must be at least 10 characters long');
    }
}

function validateRating(rating) {
    if (!rating || !Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
        throw new Error('Rating must be a number between 1 and 5');
    }
}

function handleApiError(error) {
    if (error.response && error.response.data) {
        return error.response.data.error || error.response.data.detail || 'An error occurred';
    }
    return error.message || 'An error occurred';
}

function submitReview(softwareId, content) {
    try {
        validateReview(content);
        return fetch(API_BASE_URL + `reviews/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({
                software: softwareId,
                content: content
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to submit review');
                });
            }
            return response.json();
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

function submitRating(softwareId, rating) {
    try {
        validateRating(rating);
        return fetch(API_BASE_URL + `software/${softwareId}/rate/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ rating: parseInt(rating) }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to submit rating');
                });
            }
            return response.json();
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

// Add auth check utility
function requireAuth() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
        window.location.href = "login.html";
        throw new Error('Authentication required');
    }
    return user;
}

// Add event listeners for review and rating forms
document.addEventListener("DOMContentLoaded", function() {
    const reviewForm = document.getElementById("reviewForm");
    const ratingForm = document.getElementById("ratingForm");
    
    if (reviewForm) {
        reviewForm.addEventListener("submit", function(event) {
            event.preventDefault();
            try {
                requireAuth();
                const softwareId = this.dataset.softwareId;
                const content = document.getElementById("reviewContent").value;
                
                submitReview(softwareId, content)
                    .then(data => {
                        alert("Review submitted successfully!");
                        location.reload();
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            } catch (error) {
                alert(error.message);
            }
        });
    }
    
    if (ratingForm) {
        ratingForm.addEventListener("submit", function(event) {
            event.preventDefault();
            try {
                requireAuth();
                const softwareId = this.dataset.softwareId;
                const rating = document.querySelector('input[name="rating"]:checked')?.value;
                if (!rating) {
                    throw new Error('Please select a rating');
                }
                
                submitRating(softwareId, rating)
                    .then(data => {
                        alert("Rating submitted successfully!");
                        document.getElementById("averageRating").textContent = data.average_rating.toFixed(1);
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            } catch (error) {
                alert(error.message);
            }
        });
    }
});

// Display functions for software details page
function displaySoftwareDetails(software) {
    document.getElementById('softwareName').textContent = software.name;
    document.getElementById('softwareDescription').textContent = software.description;
    document.getElementById('softwareLogo').src = software.logo;
    updateRatingDisplay(software.average_rating);
}

function updateRatingDisplay(rating) {
    document.getElementById('averageRating').textContent = rating.toFixed(1);
    const starsDisplay = document.getElementById('starsDisplay');
    starsDisplay.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = `fas fa-star ${i < rating ? 'filled' : ''}`;
        starsDisplay.appendChild(star);
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="review-author">${review.user_name}</span>
                <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            <p class="review-content">${review.content}</p>
        `;
        reviewsList.appendChild(reviewElement);
    });
}

// Load software details and reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const softwareId = urlParams.get('id');
    
    if (softwareId) {
        // Set software ID on forms
        document.getElementById('reviewForm').dataset.softwareId = softwareId;
        document.getElementById('ratingForm').dataset.softwareId = softwareId;
        
        // Fetch and display software details
        fetch(`${API_BASE_URL}software/${softwareId}/`)
            .then(response => response.json())
            .then(software => {
                displaySoftwareDetails(software);
                return fetch(`${API_BASE_URL}reviews/?software=${softwareId}`);
            })
            .then(response => response.json())
            .then(reviews => {
                displayReviews(reviews);
            })
            .catch(error => console.error('Error:', error));
    }
});

// Handle form submissions

// 1. User Signup Form
document.addEventListener("DOMContentLoaded", function() {
  const userSignupForm = document.getElementById("userSignupForm");
  
  if (userSignupForm) {
    userSignupForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const userData = {
        user: {
          email: document.getElementById("userEmail").value,
          password: document.getElementById("userPassword").value,
        },
        name: document.getElementById("userName").value,
      };
      
      registerUser(userData)
        .then(data => {
          alert("Registration successful! Please log in.");
          window.location.href = "login.html";
        })
        .catch(error => {
          alert("Registration failed: " + error.message);
        });
    });
  }
  
  // 2. Vendor Signup Form
  const vendorSignupForm = document.getElementById("vendorSignupForm");
  
  if (vendorSignupForm) {
    vendorSignupForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const vendorData = {
        user: {
          email: document.getElementById("vendorEmail").value,
          password: document.getElementById("vendorPassword").value,
        },
        company_name: document.getElementById("vendorCompany").value,
        contact_person: document.getElementById("vendorContact").value,
      };
      
      registerUser(vendorData, true)
        .then(data => {
          alert("Vendor registration successful! Please log in.");
          window.location.href = "login.html";
        })
        .catch(error => {
          alert("Registration failed: " + error.message);
        });
    });
  }
  
  // 3. Login Form
  const loginForm = document.getElementById("loginForm");
  
  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      
      loginUser(email, password)
        .then(data => {
          alert("Login successful!");
          // Redirect based on user type
          if (data.is_vendor) {
            window.location.href = "vendors.html";
          } else {
            window.location.href = "index.html";
          }
        })
        .catch(error => {
          alert("Login failed: " + error.message);
        });
    });
  }
  
  // 4. Filter Form
  const filterForm = document.getElementById("filterForm");
  
  if (filterForm) {
    filterForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const filters = {
            industry: document.getElementById("industry").value,
            inventorySize: document.getElementById("inventorySize").value,
            deploymentMethod: document.getElementById("deploymentMethod").value,
            deploymentPlatform: document.getElementById("deploymentPlatform").value,
            pricingMethod: document.getElementById("pricingMethod").value,
            budget: document.getElementById("pricingMethod").value === "one-time" 
                ? document.getElementById("oneTimeBudget").value 
                : document.getElementById("monthlyBudget").value,
            features: Array.from(
                filterForm.querySelectorAll('input[name="features"]:checked')
            ).map(checkbox => checkbox.value)
        };
        
        searchSoftware(filters)
            .then(data => {
                displayRecommendations(data.results);
            })
            .catch(error => {
                console.error("Search failed:", error);
                alert("Failed to search software. Please try again.");
            });
    });
  }
});
