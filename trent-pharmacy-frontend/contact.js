document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const requiredFields = form.querySelectorAll("[required]");
    const submitBtn = form.querySelector(".contact-submit-btn");
  
    // Ensure the submit button is disabled initially
    submitBtn.disabled = true;
  
    // Function to check if all required fields are filled
    function checkRequiredFields() {
      let allFilled = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          allFilled = false;
        }
      });
      submitBtn.disabled = !allFilled;
    }
  
    // Add input event listener to required fields
    requiredFields.forEach(field => {
      field.addEventListener("input", checkRequiredFields);
    });
  
    // Final check on form submit
    form.addEventListener("submit", (e) => {
      if (submitBtn.disabled) {
        e.preventDefault();
        alert("Please fill out all required fields before submitting.");
      }
    });
  });
  