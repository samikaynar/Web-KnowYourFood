const inputName = document.getElementById("product-name");
const resultsSection = document.getElementById("results-section");
const resultsContainer = document.getElementById("results-container");
const nameBtn = document.getElementById("name-btn");

nameBtn.addEventListener("click", function() {
  const text = inputName.value.trim();
  if (text.length < 3) {
    alert("Please enter at least 3 characters");
    return;
  }

  const apiKey = prompt("Please enter your OpenAI API key:");
  if (!apiKey) {
    alert("API key is required to analyze products");
    return;
  }
  
  analyzeProduct(text, apiKey);
});


async function analyzeProduct(productName, apiKey) {
  resultsSection.style.display = "block";
  resultsContainer.innerHTML = "<div class='loading'>Analyzing with AI...</div>";

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user', 
          content: `Analyze this food product for health: ${productName}. Give:
          1) Health score from 1 to 10
          2) Main health factors  
          3) Health benefits and risks
          4) Healthier alternatives if needed
          5) Overall recommendation
          Keep it simple and clear.`
        }],
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      const analysis = data.choices[0].message.content;
      showResult(productName, analysis);
    } else {
      showError(data.error?.message || "OpenAI API error - check your API key");
    }
    
  } catch (err) {
    showError("Cannot connect to OpenAI API. Check your internet connection.");
  }
}

function showResult(productName, aiResult) {
  const lines = aiResult.split('\n');
  let htmlContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length > 0) {
      htmlContent += '<p>' + line + '</p>';
    }
  }

  resultsContainer.innerHTML = `
    <div class="result-box">
      <h3>Health Analysis: ${productName}</h3>
      <div class="ai-response">
        ${htmlContent}
      </div>
    </div>
  `;
}


function showError(msg) {
  resultsContainer.innerHTML = `
    <div class="error">
      <p>${msg}</p>
    </div>
  `;
}