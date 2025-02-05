import {
  createTicketCallback,
  deleteTicketCallback,
  demoCallback,
  getPage,
  getState,
  loginCallback,
  setPage,
  setState,
  statusCheckCallback,
  updateTicketCallback,
} from "./Callbacks.js";
import { LoginViaOtp, VerifyOtp } from "./loginService.js";
import {
  createTicket,
  checkTicketStatus,
  updateTicket,
  deleteTicket,
} from "./ticketService.js";

var displayMessage;
document.addEventListener("DOMContentLoaded", function () {
  // Button to toggle chatbot visibility

  //-----------------------------------------------variables declarationn--------------------------------------------------------
  const toggleBtn = document.getElementById("chatbot-toggle-btn");
  const chatbotContainer = document.getElementById("chatbot-container");
  const minimizeBtn = document.getElementById("chatbot-minimize-btn");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const messages = document.getElementById("messages");
  const toggleBtnIcon = $("#chatbot-toggle-btn img");
  const ticketOptions = $("#ticket-options");

  var conversations = [];
  var isChatOpened = false;
  var currentChatId = null;
  //   var email = "";
  //   var otp = "";
  var token = null;
  var page = getPage();
  var state = getState();
  var apiBaseUrl = "https://localhost:7127/api";
  function loadJwtToken() {
    token = localStorage.getItem("token");
  }
  loadJwtToken();

  function isJwtExpired(tkn) {
    console.log(tkn);

    if (tkn === null) {
      // console.log("jkfn");

      return false;
    }
    const payloadBase64 = tkn.split(".")[1]; // Extract the payload part of the token
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode the base64 payload into JSON
    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    // console.log(decodedPayload);

    return decodedPayload.exp < currentTime; // Compare expiration time with the current time
  }

  if (isJwtExpired(token)) {
    token = null;
    localStorage.removeItem("token");
  }
  function isUserLoggedIn() {
    return localStorage.getItem("token") !== null;
  }
  //-------------------------------------------------------------------display message-----------------------------------------------------
  displayMessage = (message, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);
    messageElement.textContent = message;
    
    // const dateElement = document.createElement('span');
    // dateElement.className = "date";
    // dateElement.innerHTML = "2025-2-4";
    messages.appendChild(messageElement);
    // messages.appendChild(dateElement);
    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
  };
  // --------------------------------------------------------------intiall greeting----------------------------------------------------------------
  const displayInitialOptions = () => {
    var initialOption = $("<div>", {
      id: "initial-options",
    });
    var ticketOptions = $("<span>", {
      id: "ticketOptions",
      class: "ticket-action",
      text: "Ticket Options",
    });
    var login = $("<span>", {
      id: "login",
      class: "ticket-action",
      text: "Login",
    });
    var bookDemo = $("<span>", {
      id: "demo",
      class: "ticket-action",
      text: "Book a Demo",
    });
    initialOption.append(login);
    initialOption.append(ticketOptions);
    initialOption.append(bookDemo);
    // ticketOptions.append(deleteTicket);
    // ticketOptions.append(hr);
    $("#messages").append(initialOption);
  };
  displayMessage(
    "Hello! How can i help you? Select any or write your query here...",
    "bot"
  );
  displayInitialOptions();

  // -------------------------------------------------Loading animation functions------------------------------------------------------------------

  // Show the loading spinner
  function displayLoadingSpinner() {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("loading-container");

    const loadingCircle = document.createElement("div");
    loadingCircle.classList.add("spinner");

    messageContainer.appendChild(loadingCircle);
    messages.appendChild(messageContainer);

    // Scroll to the bottom of the messages container to show the loading spinner
    messages.scrollTop = messages.scrollHeight;
  }

  // Hide the loading spinner
  function hideLoadingSpinner() {
    const loadingContainer = document.querySelector(".loading-container");
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  //--------------------------------------------Execution on send button clicking--------------------------------------------

  // $("#send-btn").click(function (e) {
  //   e.preventDefault();
  //   // userInput.focus();
  //   var input = userInput.value.trim();

  //   if ($(this).html() == "Send Email") {
  //     displayMessage(input, "user");
  //     LoginViaOtp(input);
  //     //   email = input;
  //     sendBtn.innerText = "Send Otp";
  //     userInput.value = "";
  //     displayMessage("Enter Your Otp", "bot");
  //   } else if ($(this).html() == "Send Otp") {
  //     // otp = userInput.value.trim();
  //     displayMessage(input, "user");
  //     otp = input;
  //     var res = VerifyOtp(input);
  //     //   otp = res;
  //     userInput.value = "";
  //     sendBtn.innerText = "Send";
  //     createNewChat();
  //     //   displayMessage("Logged in successfully!!", "bot");
  //   } else if ($(this).html() == "Send") {
  //     displayMessage(input, "user");
  //     userInput.value = ""; // Clear input field
  //     sendMessageToAPI(input);
  //   }
  // });

  //----------------------------------------------------Functoins for Login----------------------------------------------------
  $(document).on("click", "#login", loginCallback);
  // Event listener to toggle chatbot visibility

  // const LoginViaOtp = async (email) => {
  //   var tkn = "";
  //   await $.ajax({
  //     type: "GET",
  //     url: apiBaseUrl + "/Auth/LoginViaOtp?toEmail=" + email,
  //     // data: "data",
  //     //   contentType: "application/json",
  //     success: function (response) {
  //       // console.log(response);
  //       tkn = response.toString();
  //       localStorage.setItem("token", tkn);
  //       token = tkn;
  //       // console.log(tkn);

  //       return tkn;
  //     },
  //     error: function (e) {
  //       console.log(e);
  //     },
  //   });
  // };

  // const VerifyOtp = async (otp) => {
  //   var res = "";

  //   await $.ajax({
  //     type: "GET",
  //     url: apiBaseUrl + "/Auth/VerifyOtp?otp=" + otp,
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //     // data: "data",
  //     //   contentType: "application/json",
  //     success: function (response) {
  //       console.log(response);
  //       // displayMessage("Login successfull", "bot");
  //       // token = response;
  //       res = response;
  //     },
  //   });
  //   return res;
  // };

  //-------------------------------------------------Functions for Chatbot opening-closing-------------------------------------------

  toggleBtn.addEventListener("click", function () {
    chatbotContainer.classList.toggle("hidden");
    if (isChatOpened) {
      toggleBtnIcon.attr(
        "src",
        // "https://img.icons8.com/ios-filled/100/FFFFFF/message-bot.png"
        "robot.png"
      );
      isChatOpened = false;
    } else {
      toggleBtnIcon.attr(
        "src",
        "https://img.icons8.com/ios-filled/100/FFFFFF/cancel.png"
      );
      isChatOpened = true;
    }
  });

  // Event listener to minimize chatbot
  minimizeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    toggleBtnIcon.attr(
      "src",
      // "https://img.icons8.com/ios-filled/100/4caf50/message-bot.png"
      "robot.png"
    );
    isChatOpened = false;
  });

  //--------------------------------------------------Function related to chat and it's messages-----------------------------------------------------

  const createNewChat = async () => {
    // const token = localStorage.getItem("authToken");
    // loadJwtToken();
    await $.ajax({
      type: "GET",
      url: apiBaseUrl + "/Chat/new",
      headers: {
        Authorization: "Bearer " + token,
      },
      dataType: "json",
      success: async function (response) {
        currentChatId = response["id"];
        console.log(currentChatId);

        // console.log(response);

        // loadChatMessages(currentChatId);
        state = "question"; // Transition to question state
        // await loadChatsByUser();
      },
      error: async function (e) {
        console.log(e);

        displayMessage("Failed to create a new chat. Please try again.", "bot");
      },
    });
  };

  async function loadChatMessages(chatId) {
    // const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
    // loadJwtToken();
    if (!token) {
      displayMessage("bot", "You need to log in first.");
      return;
    }

    await $.ajax({
      url: apiBaseUrl + `/Chat?id=${chatId}`,
      type: "GET",
      headers: {
        Authorization: "Bearer " + token, // Include the token in the header
      },
      success: async function (response) {
        $("#messages").empty();
        response.messages.forEach((msg) => {
          console.log(msg);

          const senderClass = msg.senderType === "Bot" ? "bot" : "user";
          displayMessage(msg.content, senderClass);
        });
      },
      error: async function () {
        displayMessage("Failed to load chat messages.", "bot");
      },
    });
  }

  $("#chat").click(function (e) {
    e.preventDefault();
    // console.log("jfjj");
    page = "chat";
    $("#messages").empty();
    $("#send-btn").html("Send");
  });

  //-----------------------------------------------------------------function related to answer generation--------------------------------------------------------

  // Function to do action accroding to the response type
  const actionOnResponseType = async (type) => {
    if (type == "login") {
      loginCallback();
    } else if (type == "ticket-creation") {
      // console.log(type);
      createTicketCallback();
    } else if (type == "ticket-updation") {
      updateTicketCallback();
    } else if (type == "ticket-deletion") {
      deleteTicketCallback();
    } else if (type == "ticket-status-check") {
      statusCheckCallback();
    } else if (type == "ticket-options") {
      displayTicketOptions();
    } else if (type == "book-demo") {
      demoCallback(isUserLoggedIn());
    }
  };
  // Function to send the user message to the API using AJAX
  async function sendMessageToAPI(message) {
    displayLoadingSpinner();
    // Check if the user is logged in (you can change this condition to your actual login check)
    // loadJwtToken();
    const apiUrl = isUserLoggedIn()
      ? apiBaseUrl + "/Message/GenerateAnswer"
      : apiBaseUrl + "/Message/GenerateAnswerWithoutLogin";

    if (currentChatId == null && isUserLoggedIn() == true) {
      await createNewChat();
    }
    await $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json",
      data:
        currentChatId == null
          ? JSON.stringify({ content: message, conversations: conversations })
          : JSON.stringify({
              content: message,
              chatId: currentChatId,
              conversations: conversations,
            }),
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (response) {
        hideLoadingSpinner();
        // Handle successful response from the API
        console.log(response);
        var type = response.messageType.split(" ")[1];

        if (type && type != "general-information") {
          // Handle ticket-related or status-related message types
          // displayTicketOptions();
          actionOnResponseType(type);
        } else {
          conversations.push({
            user: message,
            bot: response.content,
          });
          displayMessage(response.content, "bot");
        }
      },
      error: function (error) {
        // Handle any errors
        console.log("Error:", error);
        hideLoadingSpinner();
        displayMessage("There was an error. Please try again later.", "bot");
      },
    });
  }

  //-----------------------------------------------function for displaying the message-----------------------------------------------

  // Function to display the message in the chat window

  //---------------------------------------------------------------Function related to Demo booking------------------------------------

  $("#demo").click(function (e) {
    e.preventDefault();
    demoCallback(isUserLoggedIn());
  });

  // Function to ask for demo booking details
  function askForDemoDetails() {
    let demoDetails = {};

    displayMessage("Enter your name:", "bot");
    let step = "name";

    $("#send-btn")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        let input = userInput.value.trim();

        if (step === "name") {
          demoDetails.name = input;
          displayMessage(input, "user");
          userInput.value = "";
          displayMessage("Enter your email:", "bot");
          step = "email";
        } else if (step === "email") {
          demoDetails.email = input;
          displayMessage(input, "user");
          userInput.value = "";
          displayMessage(
            "Enter your preferred date and time (YYYY-MM-DDTHH:mm:ss):",
            "bot"
          );
          step = "datetime";
        } else if (step === "datetime") {
          demoDetails.preferredDateTime = input;
          displayMessage(input, "user");
          userInput.value = "";
          // Call the Book Demo API
          bookDemo(demoDetails);
          step = null;
        }
      });
  }

  // Function to call the Book Demo API
  async function bookDemo(demoDetails) {
    const token = localStorage.getItem("token"); // Retrieve token if available

    await $.ajax({
      type: "POST",
      url: apiBaseUrl + "/Demo/Book",
      contentType: "application/json",
      data: JSON.stringify(demoDetails),
      success: function (response) {
        console.log(response);

        displayMessage(
          "Demo booked successfully! Thank you. Ask your questions..",
          "bot"
        );
      },
      error: function (error) {
        console.error("Error booking demo:", error);
        displayMessage("Failed to book demo. Please try again later.", "bot");
      },
    });
  }

  //-------------------------------------------------------------------------------------------------------
  // Mock function to check if the user is logged in
  

  //------------------------------------------------------Functions related to Ticket-----------------------------------------------

  //-------------------------------------------onclick function for showing ticket ui-------------------------------

  $(document).on("click", "#ticketOptions", function () {
    displayTicketOptions();
  });
  function displayTicketOptions() {
    // e.preventDefault();
    sendBtn.innerText = "Send";
    // console.log("edhdbe");

    displayMessage("Select an option for the Ticket: ", "bot");
    var ticketOptions = $("<div>", {
      id: "ticket-options",
    });
    var createTicket = $("<span>", {
      id: "create-ticket",
      class: "ticket-action",
      text: "Create",
    });
    var statusTicket = $("<span>", {
      id: "status-check",
      class: "ticket-action",
      text: "Check",
    });
    var updateTicket = $("<span>", {
      id: "update-ticket",
      class: "ticket-action",
      text: "Update",
    });
    var deleteTicket = $("<span>", {
      id: "delete-ticket",
      class: "ticket-action",
      text: "Delete",
    });
    ticketOptions.append(createTicket);
    ticketOptions.append(statusTicket);
    ticketOptions.append(updateTicket);
    ticketOptions.append(deleteTicket);
    // ticketOptions.append(hr);
    $("#messages").append(ticketOptions);
    page = "ticket-options";
  }
  //----------------------------------------------------------onclick create new ticket--------------------------------------
  $(document).on("click", "#create-ticket", createTicketCallback);
  //--------------------------------------------------onclick check ticket status---------------------------------------------
  $(document).on("click", "#status-check", statusCheckCallback);

  //--------------------------------------------------onclick update ticket---------------------------------------------------
  $(document).on("click", "#update-ticket", updateTicketCallback);

  //----------------------------------------------------------------onClick delete ticket-----------------------------------------------------------
  $(document).on("click", "#delete-ticket", deleteTicketCallback);

  //--------------------------------------------------------------centralized call-back function for send-btn's on click-------------------------------------------

  var tid,
    title,
    desc,
    demoDetails = {};
  $("#send-btn").click(async function (e) {
    e.preventDefault();
    // var $sendbtn = $("#send-btn");
    page = getPage();
    state = getState();
    // console.log(page);
    // console.log(state);

    var input = userInput.value.trim();
    userInput.value = "";
    userInput.focus();
    if (page == "chat") {
      displayMessage(input, "user");
      await sendMessageToAPI(input);
    } else if (page == "login") {
      // var email, otp;
      if (state == "email") {
        // email = input;
        displayMessage(input, "user");
        displayLoadingSpinner();
        await LoginViaOtp(input);
        hideLoadingSpinner();
        displayMessage("Otp sent to your email, enter the otp", "bot");
        state = "otp";
        setState("otp");
      } else if (state == "otp") {
        // otp = input;
        displayMessage(input, "user");
        await VerifyOtp(input, token);
        displayMessage("Otp verified!! You can write query below", "bot");
        loadJwtToken();
        // setTimeout(() => {
        //   $("#chat").trigger("click");
        // }, 3000);
        page = "chat";
        setPage("chat");
      }
    } else if (page == "ticket-create") {
      if (state == "title") {
        title = input;
        displayMessage(title, "user");
        displayMessage("Enter Ticket Description", "bot");
        state = "desc";
        setState("desc");
      } else if (state == "desc") {
        desc = input;
        displayMessage(desc, "user");
        $("#send-btn").html("Create Ticket");
        state = "callApi";
        setState("callApi");
      } else if ((state = "callApi")) {
        displayLoadingSpinner();
        await createTicket(title, desc, isUserLoggedIn(), token);
        hideLoadingSpinner();
        displayMessage("Ticket Created!!You can write query below", "bot");
        page = "chat";
        setPage("chat");
        $("#send-btn").html("Send");
        // setTimeout(() => {
        //   $("#ticket").trigger("click");
        // }, 3000);
      }
    } else if (page == "ticket-check") {
      if (state == "id") {
        displayMessage(input, "user");
        displayLoadingSpinner();
        await checkTicketStatus(parseInt(input), isUserLoggedIn(), token);
        hideLoadingSpinner();
        page = "chat";
        setPage("chat");
        // setTimeout(()=> {
        //   $("#ticket").trigger("click");
        // }, 1000);
      }
    } else if (page == "ticket-update") {
      // var id, t, d;
      if (state == "id") {
        tid = input;
        displayMessage(tid, "user");
        displayMessage("Enter Ticket Title:", "bot");
        state = "title";
        setState("title");
      } else if (state == "title") {
        title = input;
        displayMessage(title, "user");
        displayMessage("Enter Ticket Description:", "bot");
        state = "desc";
        setState("desc");
      } else if (state == "desc") {
        desc = input;
        displayMessage(desc, "user");
        $("#send-btn").html("Update Ticket");
        state = "callApi";
        setState("callApi");
      } else if (state == "callApi") {
        console.log(title);
        displayLoadingSpinner();
        await updateTicket(tid, title, desc, isUserLoggedIn(), token);
        hideLoadingSpinner();
        displayMessage(
          // "Ticket Updated!!(redirecting to ticket options...)",
          "Ticket Updated!! You can write query below",
          "bot"
        );
        page = "chat";
        setPage("chat");
        $("#send-btn").html("Send");
        // setTimeout(() => {
        //   $("#ticket").trigger("click");
        // }, 3000);
        //state==blank if want to do noting on click of send button
      }
    } else if (page == "ticket-delete") {
      if (state == "id") {
        displayMessage(input, "user");
        displayLoadingSpinner();
        await deleteTicket(input, isUserLoggedIn(), token);
        hideLoadingSpinner();
        displayMessage("Ticket Deleted!! You can write query below", "bot");
        page = "chat";
        setPage("chat");
        // setTimeout(() => {
        //   $("#ticket").trigger("click");
        // }, 3000);
      }
    } else if (page == "demo") {
      if (state === "name") {
        demoDetails.name = input;
        displayMessage(input, "user");
        userInput.value = "";
        displayMessage("Enter your email:", "bot");
        state = "email";
        setState("email");
      } else if (state === "email") {
        demoDetails.email = input;
        displayMessage(input, "user");
        userInput.value = "";
        displayMessage(
          "Enter your preferred date and time (YYYY-MM-DDTHH:mm:ss):",
          "bot"
        );
        state = "datetime";
        setState("datetime");
      } else if (state === "datetime") {
        demoDetails.preferredDateTime = input;
        displayMessage(input, "user");
        // userInput.value = "";
        $("#send-btn").html("Book Demo");
        // Call the Book Demo API
        state = "callApi";
        setState("callApi");
        // step = null;
      } else if (state == "callApi") {
        console.log(demoDetails);
        displayLoadingSpinner();
        await bookDemo(demoDetails);
        hideLoadingSpinner();
        $("#send-btn").html("Send");
        page = "chat";
        setPage("chat");
        // setTimeout(() => {
        //   $("#ticket").trigger("click");
        // }, 3000);
      }
    }
  });
});
export { displayMessage };
//onclick -> send btn -> page = ticket -> state = "Enter id" or "Enter email" => centralized or only one onclick of send btn
