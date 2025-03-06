import {
  createTicketCallback,
  deleteTicketCallback,
  demoCallback,
  getPage,
  getState,
  loginCallback,
  setCustomState,
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
var intents;
var currentIntentIdx = 1;
var callNextCallBack;
var setSendBtnText;
var enablesendbtn;
var disablesendbtn;
var tid,
  title,
  desc,
  demoDetails = {};
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
  function parseJWT(token) {
    try {
      const base64Url = token.split(".")[1]; // Get payload part
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Fix encoding
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid JWT Token", error);
      return null;
    }
  }

  function loadJwtToken() {
    token = localStorage.getItem("token");

    if (token != null) {
      const data = parseJWT(token);
      const currentTime = Math.floor(Date.now() / 1000); // to invalidate token after expiry
      if (data["exp"] < currentTime) {
        token = null;
        localStorage.removeItem("token");
      }
    }
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
  //----------------------------------------------------------- Function to disable send button--------------------------------------------------
  disablesendbtn = () => {
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5"; // Optional: make it look disabled
    sendBtn.innerText = "Loading..."; // Optional: change button text
  };
  //----------------------------------------------------------- Function to enable send button-----------------------------------------------
  enablesendbtn = () => {
    sendBtn.disabled = false;
    sendBtn.style.opacity = "1"; // Restore opacity
    sendBtn.innerText = "Send"; // Restore button text
  };
  //-------------------------------------------------------------------display message-----------------------------------------------------
  displayMessage = (message, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender);
    messageElement.textContent = message;

    const dateElement = document.createElement("span");
    dateElement.className = sender == "bot" ? "date-bot" : "date-user";
    let date = new Date();
    dateElement.innerHTML = date.toISOString().split("T")[0];
    messages.appendChild(messageElement);
    messages.appendChild(dateElement);
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
    "Hi there! ✨ Looking for ticket options or want to book a demo? You'll need to log in first. Have a question? No worries-just ask!",
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
  const actionOnResponseType = async (type, params) => {
    if (type == "login") {
      displayLoadingSpinner();
      await loginCallback(params);
      hideLoadingSpinner();
    } else if (type == "ticket-creation") {
      // console.log(type);
      if (!isUserLoggedIn()) {
        intents = [
          { type: "login", parameters: { email: params["email"] } },
          ...intents,
        ];
        actionOnResponseType("login", params);
      } else {
        displayLoadingSpinner();
        await createTicketCallback(params);
        hideLoadingSpinner();
      }
    } else if (type == "ticket-updation") {
      if (!isUserLoggedIn()) {
        intents = [
          { type: "login", parameters: { email: params["email"] } },
          ...intents,
        ];
        actionOnResponseType("login", params);
      } else {
        displayLoadingSpinner();
        updateTicketCallback(params);
        hideLoadingSpinner();
      }
    } else if (type == "ticket-deletion") {
      if (!isUserLoggedIn()) {
        intents = [
          { type: "login", parameters: { email: params["email"] } },
          ...intents,
        ];
        actionOnResponseType("login", params);
      } else {
        displayLoadingSpinner();
        deleteTicketCallback(params);
        hideLoadingSpinner();
      }
    } else if (type == "ticket-status-check") {
      if (!isUserLoggedIn()) {
        intents = [
          { type: "login", parameters: { email: params["email"] } },
          ...intents,
        ];
        actionOnResponseType("login", params);
      } else {
        displayLoadingSpinner();
        statusCheckCallback(params);
        hideLoadingSpinner();
      }
    } else if (type == "ticket-options") {
      displayTicketOptions();
    } else if (type == "book-demo") {
      if (!isUserLoggedIn()) {
        intents = [
          { type: "login", parameters: { email: params["email"] } },
          ...intents,
        ];
        actionOnResponseType("login", params);
      } else {
        displayLoadingSpinner();
        await demoCallback(isUserLoggedIn(), params);
        hideLoadingSpinner();
      }
    }
  };
  // Function to send the user message to the API using AJAX
  async function sendMessageToAPI(message) {
    displayLoadingSpinner();
    disablesendbtn();
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
        enablesendbtn();
        // Handle successful response from the API
        console.log(response);
        var type = response.intents[0].type;

        if (type && type != "general-information") {
          // Handle login, ticket, demo related queries
          // console.log(response['intents'][0]['parameters']);
          hideLoadingSpinner();
          // response.intents.forEach(async (i) => {
          //   await actionOnResponseType(i.type, i.parameters);
          // });
          intents = response.intents;
          actionOnResponseType(
            response.intents[0].type,
            response.intents[0].parameters
          );
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
        enablesendbtn();
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
    messages.scrollTop = messages.scrollHeight;
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

  //---------------------------------------------------function to call the functions to facilitate login first functionality-----------------------------------

  const callCustomEventsAfterLogin = () => {
    $("#login").trigger("createTicketAfterLogin");
    $("#login").trigger("statusCheckAfterLogin");
    $("#login").trigger("updateTicketAfterLogin");
    $("#login").trigger("deleteTicketAfterLogin");
    $("#login").trigger("bookDemoAfterLogin");
  };

  //-----------------------------------------------------function to call next callback according to the next intent--------------------------------------------

  callNextCallBack = async () => {
    if (!intents || currentIntentIdx >= intents.length) {
      currentIntentIdx = 1;
      return;
    }
    console.log(intents[currentIntentIdx].type);
    console.log(currentIntentIdx);

    switch (intents[currentIntentIdx].type) {
      case "login":
        displayLoadingSpinner();
        // have to do currentIntentId++ here so that the below function calls this function with no updation in cuurentintentidx
        await loginCallback(intents[currentIntentIdx++].parameters);
        hideLoadingSpinner();
        break;
      case "ticket-creation":
        displayLoadingSpinner();
        // currentIntentIdx++;
        await createTicketCallback(intents[currentIntentIdx++].parameters);
        hideLoadingSpinner();
        break;
      case "ticket-updation":
        displayLoadingSpinner();
        await updateTicketCallback(intents[currentIntentIdx++].parameters);
        hideLoadingSpinner();
        break;
      case "ticket-deletion":
        displayLoadingSpinner();
        await deleteTicketCallback(intents[currentIntentIdx++].parameters);
        hideLoadingSpinner();
        break;
      case "ticket-status-check":
        displayLoadingSpinner();
        // currentIntentIdx++;
        await statusCheckCallback(intents[currentIntentIdx++].parameters);
        hideLoadingSpinner();
        break;
      case "ticket-options":
        displayTicketOptions();
        break;
      case "book-demo":
        await demoCallback(
          isUserLoggedIn(),
          intents[currentIntentIdx++].parameters
        );
        break;
      default: //general-information
        break;
    }
  };

  //------------------------------------------------------------set send-btn text----------------------------------------------
  setSendBtnText = (text) => {
    // console.log(text);
    $("#send-btn").html(text);
  };

  //--------------------------------------------------------------centralized call-back function for send-btn's on click-------------------------------------------

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
        loadJwtToken();
        const result = await VerifyOtp(input, token);
        // console.log("OTP Verification Result:", result);

        if (result === 1) {
          displayMessage("OTP verified successfully!", "bot");
          page = "chat";
          setPage("chat");
          callCustomEventsAfterLogin(); // calls updateticket function
          callNextCallBack(); //simultanously calls next callback i.e idx=1 status check and hence only status check works
        } else {
          displayMessage("Wrong OTP!! Enter Otp Again", "bot");
          setPage("login");
          setState("otp");
        }
        // displayMessage("Otp verified!!", "bot");

        // setTimeout(() => {
        //   $("#chat").trigger("click");
        // }, 3000);
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
        title = null;
        desc = null;
        page = "chat";
        setPage("chat");
        $("#send-btn").html("Send");
        callNextCallBack();
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
        callNextCallBack();
        // setTimeout(()=> {
        //   $("#ticket").trigger("click");
        // }, 1000);
      }
    } else if (page == "ticket-update") {
      // console.log(setCustomState());

      // if(setCustomState()){
      //   $("#send-btn").val("Update Ticket");
      // }
      // setCustomState();
      state = getState();
      // var id, t, d;
      if (state == "id") {
        tid = input;
        displayMessage(tid, "user");
        // displayMessage("Enter Ticket Title:", "bot");
        // state = "title";
        // setState("title");
        setCustomState();
      } else if (state == "title") {
        title = input;
        displayMessage(title, "user");
        // displayMessage("Enter Ticket Description:", "bot");
        // state = "desc";
        // setState("desc");
        setCustomState();
      } else if (state == "desc") {
        desc = input;
        displayMessage(desc, "user");
        // $("#send-btn").html("Update Ticket");
        // state = "callApi";
        // setState("callApi");
        setCustomState();
      } else if (state == "callApi") {
        // console.log(title);
        displayLoadingSpinner();
        var x = await updateTicket(tid, title, desc, isUserLoggedIn(), token);
        hideLoadingSpinner();
        if (x == -1) {
          displayMessage(
            // "Ticket Updated!!(redirecting to ticket options...)",
            "Ticket doesn't exist or some internal error",
            "bot"
          );
        } else {
          displayMessage(
            // "Ticket Updated!!(redirecting to ticket options...)",
            "Ticket Updated!! You can write query below",
            "bot"
          );
        }
        title = null;
        desc = null;
        tid = null;
        page = "chat";
        setPage("chat");
        $("#send-btn").html("Send");
        callNextCallBack();
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
        // displayMessage("Ticket Deleted!! You can write query below", "bot");
        page = "chat";
        setPage("chat");
        callNextCallBack();
        // setTimeout(() => {
        //   $("#ticket").trigger("click");
        // }, 3000);
      }
    } else if (page == "demo") {
      // setCustomState(2);
      state = getState();
      if (state == "name") {
        demoDetails["name"] = input;
        displayMessage(input, "user");
        // userInput.value = "";
        // displayMessage("Enter your email:", "bot");
        // state = "email";
        // setState("email");
        setCustomState();
      } else if (state == "email") {
        demoDetails["email"] = input;
        displayMessage(input, "user");
        // userInput.value = "";
        // displayMessage(
        //   "Enter your preferred date and time (YYYY-MM-DDTHH:mm:ss):",
        //   "bot"
        // );
        // state = "datetime";
        // setState("datetime");
        setCustomState();
      } else if (state == "datetime") {
        let selectedDateTime = $("#dateTimePicker").val();

        if (!selectedDateTime) {
          // displayMessage("Please select a date and time before proceeding.", "bot");
          // setCustomState();
          alert("Select Date and time");
          // return; //  Prevents execution until the user selects a date
        } else {
          demoDetails["preferredDateTime"] = selectedDateTime;
          displayMessage(selectedDateTime, "user");
          setCustomState();
        }

        //  Store the selected date

        //  Update state  chatbot moves forward
        // state = "callApi";
        // setState("callApi");
        // setSendBtnText("Book Demo");
      } else if (state == "callApi") {
        // console.log(demoDetails);
        demoDetails["email"] = parseJWT(token)['email'];
        displayLoadingSpinner();
        await bookDemo(demoDetails);
        hideLoadingSpinner();
        demoDetails = {};
        $("#send-btn").html("Send");
        page = "chat";
        setPage("chat");
        callNextCallBack();
        // setTimeout(() => {
        //   $("#ticket").trigger("click");
        // }, 3000);
      }
    }
  });
});
const setTitle = (t) => (title = t);
const setDesc = (d) => (desc = d);
const setId = (i) => (tid = i);
const setDemoDetails = (dd) => (demoDetails = dd);
const getTitle = () => {
  return title;
};
const getDesc = () => {
  return desc;
};
const getId = () => {
  return tid;
};
const getDemoDetails = () => {
  return demoDetails;
};
const getIntent = () => {
  return intents;
};
const setIntent = (i) => {
  intents = i;
};
export {
  displayMessage,
  setDemoDetails,
  setDesc,
  setId,
  setTitle,
  callNextCallBack,
  getDemoDetails,
  getDesc,
  getId,
  getTitle,
  setSendBtnText,
  disablesendbtn,
  enablesendbtn,
  getIntent,
  setIntent,
};
//onclick -> send btn -> page = ticket -> state = "Enter id" or "Enter email" => centralized or only one onclick of send btn
