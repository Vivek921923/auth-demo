document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("aadhar")
    .addEventListener("keypress", function (event) {
      if (
        event.key === "Enter" &&
        !document.getElementById("sendBtn").disabled
      ) {
        event.preventDefault(); // Prevent default form submission
        document.getElementById("sendBtn").click();
      }
    });

  document.getElementById("otp").addEventListener("keypress", function (event) {
    if (
      event.key === "Enter" &&
      !document.getElementById("submitBtn").disabled
    ) {
      event.preventDefault();
      document.getElementById("submitBtn").click();
    }
  });
});

let debounceTimer;
function validateInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    document.getElementById("sendBtn").disabled = !/^\d{4} \d{4} \d{4}$/.test(
      document.getElementById("aadhar").value.trim()
    );
    document.getElementById("submitBtn").disabled = !/^\d{6}$/.test(
      document.getElementById("otp").value.trim()
    );
  }, 300);
}

function formatAadhar(event) {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length > 12) value = value.slice(0, 12);
  event.target.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function showMessage(id, text, isSuccess = true) {
  const messageDiv = document.getElementById(id);
  messageDiv.textContent = text;
  messageDiv.className = `message ${isSuccess ? "success" : "error"}`;
  messageDiv.style.display = "block";
}

async function sendOtp() {
  const aadhar = document.getElementById("aadhar").value.replace(/\s/g, "");
  document.getElementById("loading").style.display = "block";

  try {
    const response = await fetch(
      `http://localhost:8081/AuthOtp?uid=${aadhar}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseText = await response.text();

    if (responseText.includes('ret="y"')) {
      showMessage("message", "OTP Sent Successfully", true);
    } else {
      const errMatch = responseText.match(/err="([^"]*)"/);
      if (errMatch && errMatch[1]) {
        showMessage(
          "message",
          "Failed to send OTP: " + `Error: ${errMatch[1]}`,
          false
        );
      } else {
        showMessage(
          "message",
          "Failed to send OTP: " + "No error details found.",
          false
        );
      }
    }
  } catch (error) {
    showMessage("message", "Error sending OTP: " + error.message, false);
  }

  document.getElementById("loading").style.display = "none";
}

async function submitForm() {
  const aadhar = document.getElementById("aadhar").value.replace(/\s/g, "");
  const otp = document.getElementById("otp").value.trim();
  document.getElementById("loading").style.display = "block";

  try {
    const authResponse = await fetch(
      `http://localhost:8081/AuthDemo?uid=${aadhar}&Otp=${otp}`,
      { method: "GET" }
    );
    const authText = await authResponse.json();

    // ✅ Ensure eKYC Request is always displayed
    document.getElementById("requestBox").style.display = "block";
    document.getElementById("requestMessage").textContent =
      authText.requestedXml;

    document.getElementById("responseBox").style.display = "block";
    document.getElementById("responseMessage").textContent =
      authText.responseXml;

    const ekycStatus = document.getElementById("ekycStatusMessage");
    let errorCode = "Unknown Error";

    const errorMatch = authText.responseXml.match(/err="([^"]*)"/);
    if (errorMatch && errorMatch[1]) {
      errorCode = errorMatch[1];

      // ✅ Show eKYC Failed message
      ekycStatus.textContent = `Authentication Failed: Error: ${errorCode}`;
      ekycStatus.style.color = "#721c24";
      ekycStatus.style.fontSize = "18px";
      ekycStatus.style.marginBottom = "2px";
      ekycStatus.style.background = "#f8d7da";
      ekycStatus.style.display = "block";
    } else {
      // ✅ Show Success Message
      ekycStatus.textContent = "Authentication Successful!";
      ekycStatus.style.color = "#155724";
      ekycStatus.style.fontSize = "18px";
      ekycStatus.style.background = "#d4edda";
      ekycStatus.style.display = "block";
    }
  } catch (error) {
    alert("Error: " + error.message);

    // ✅ Ensure eKYC Request is shown even if an error occurs
    document.getElementById("requestBox").style.display = "block";
    document.getElementById("requestMessage").textContent =
      "Failed to fetch request data.";
  }

  document.getElementById("loading").style.display = "none";
}
