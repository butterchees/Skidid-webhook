$(document).ready(function () {
    const webhookUrlInput = $("#webhookUrl");
    const validateBtn = $("#validateBtn");
    const errorText = $("#error");
    const initialScreen = $("#initialScreen");
    const mainScreen = $("#mainScreen");
    const loading = $("#loading");
  
    validateBtn.click(async function () {
      const url = webhookUrlInput.val();
      if (!validateWebhookUrl(url)) {
        errorText.text("Invalid webhook URL format. Please try again.");
        return;
      }
  
      loading.show();
      errorText.text("");
  
      try {
        const response = await fetch(url);
        if (response.ok) {
          initialScreen.removeClass("active");
          mainScreen.addClass("active");
        } else {
          errorText.text("Webhook URL is not reachable. Please check the URL.");
        }
      } catch (error) {
        errorText.text("An error occurred while validating the webhook URL.");
      } finally {
        loading.hide();
      }
    });
  
    $(".tablink").click(function () {
      const tab = $(this).data("tab");
      $(".tablink").removeClass("active");
      $(this).addClass("active");
      $(".tabcontent").removeClass("active");
      $(`#${tab}`).addClass("active");
    });
  
    $("#startSpam").click(async function () {
      const message = $("#spamMessage").val();
      const count = $("#spamCount").val();
      const username = $("#username").val(); 
      const avatarUrl = $("#avatarUrl").val(); 
  
      if (!message || !count) {
        $("#spamStatus").text("Please fill in all required fields.");
        return;
      }
  
      $("#spamStatus").text("Spamming...");
  
      for (let i = 0; i < count; i++) {
        await sendWebhookMessage(webhookUrlInput.val(), message, username, avatarUrl);
      }
  
      $("#spamStatus").text("Spamming completed!");
    });
  
    $("#fetchInfo").click(async function () {
      $("#infoStatus").text("Fetching info...");
      try {
        const response = await fetch(webhookUrlInput.val());
        const data = await response.json();
        $("#webhookInfo").html(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        $("#infoStatus").text("Info fetched successfully.");
      } catch (error) {
        $("#infoStatus").text("Failed to fetch webhook info.");
      }
    });
  
    $("#deleteWebhook").click(async function () {
      if (!confirm("Are you sure you want to delete this webhook?")) return;
  
      $("#deleteStatus").text("Deleting webhook...");
      try {
        const response = await fetch(webhookUrlInput.val(), { method: "DELETE" });
        if (response.ok) {
          $("#deleteStatus").text("Webhook deleted successfully.");
          setTimeout(() => window.location.reload(), 2000);
        } else {
          $("#deleteStatus").text("Failed to delete webhook.");
        }
      } catch (error) {
        $("#deleteStatus").text("An error occurred while deleting the webhook.");
      }
    });
  
    function validateWebhookUrl(url) {
      const regex = /https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+/;
      return regex.test(url);
    }
  
    async function sendWebhookMessage(url, message, username, avatarUrl) {
      const payload = { content: message };
  
      if (username) payload.username = username;
      if (avatarUrl) payload.avatar_url = avatarUrl;
  
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  });