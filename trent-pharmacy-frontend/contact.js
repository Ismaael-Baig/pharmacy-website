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

  // On form submit, if valid, send the data via fetch
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitBtn.disabled) {
      alert("Please fill out all required fields before submitting.");
      return;
    }
    
    // Collect form data into an object
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value.trim();
    });
    
    // Merge firstName and lastName into a single "name" field
    data.name = `${data.firstName} ${data.lastName}`;
    // Optionally, you can remove firstName and lastName:
    // delete data.firstName;
    // delete data.lastName;
    
    // Set a default subject if none is provided
    if (!data.subject) {
      data.subject = "New Contact Submission";
    }
    
    console.table(data);  // Debug log

    try {
      const response = await fetch('https://pharmacy-website-backend.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      console.log("Response status:", response.status);
      console.log("Response JSON:", result);
      
      if (response.ok) {
        // Redirect to a confirmation page for successful contact submission
        window.location.href = "contact-success.html";
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("Error sending contact form:", err);
      alert("Something went wrong while sending your message. Please try again later.");
    }
  });
});
