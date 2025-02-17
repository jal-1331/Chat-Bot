import { displayMessage, setDesc, setTitle } from "./Chatbot.js";
import { LoginViaOtp } from "./loginService.js";
import { createTicket } from "./ticketService.js";
var page = "chat",
  state = "";

const getPage = () => {
  return page;
};
const setPage = (p) => {
  page = p;
};
const getState = () => {
  return state;
};
const setState = (s) => {
  state = s;
};
function isUserLoggedIn() {
  return localStorage.getItem("token") !== null;
}
const loginCallback = async (params) => {
  if (params["email"] == null) {
    displayMessage("Enter Your email", "bot");
    page = "login";
    state = "email";
  }
  // else if (params["Otp"] == null) {
  //   displayLoadingSpinner();
  //   await LoginViaOtp(input);
  //   hideLoadingSpinner();
  //   displayMessage("Otp sent to your email, enter the otp", "bot");
  //   page = "login";
  //   state = "otp";
  // }
  else {
    // displayLoadingSpinner();
    await LoginViaOtp(params["email"]);
    // hideLoadingSpinner();
    displayMessage("Otp sent to your email, enter the otp", "bot");
    page = "login";
    state = "otp";
  }
  // displayMessage("Enter Your email", "bot");
  // page = "login";
  // state = "email";
  // sendBtn.innerText = "Send Email";
};

const demoCallback = async (loggedIn) => {
  if (loggedIn) {
    // Directly proceed to book the demo
    // askForDemoDetails();
    $("#login").unbind("bookDemoAfterLogin");
    displayMessage("Enter your name:", "bot");
    page = "demo";
    state = "name";
  } else {
    $("#login").on("bookDemoAfterLogin", async function () {
      page = "demo";
      // setPage("ticket-create");
      state = "name";
      // setState("title");
      await demoCallback();
    });
    await loginCallback();
    // Ask the user to log in first
    displayMessage("Please log in first to book a demo.", "bot");
    // $("#login").trigger("click"); // Trigger login process
  }
};

const createTicketCallback = async (params) => {
  if (!isUserLoggedIn()) {
    $("#login").on("createTicketAfterLogin", async function () {
      page = "ticket-create";
      // setPage("ticket-create");
      state = "title";
      // setState("title");
      await createTicketCallback();
    });
    await loginCallback(params);
    // $("#login").off("createTicketAfterLogin");
  } else {
    $("#login").unbind("createTicketAfterLogin"); // have to remove the registered custom event whenn onced logged in
    if (params["ticketTitle"] != null && params["ticketDescription"] != null) {
      setTitle(params["ticketTitle"]);
      setDesc(params["titleDescription"]);
      await createTicket(
        params["ticketTitle"],
        params["ticketDescription"],
        true,
        localStorage.getItem("token")
      );
      displayMessage("Ticket Created!! Check your email for details.", "bot")
      // page = "ticket-create";
      // state = "callApi";
    } else if (params["ticketTitle"] != null) {
      setTitle(params["ticketTitle"]);
      displayMessage("Enter Ticket Description: ", "bot");
      page = "ticket-create";
      state = "desc";
    }
    //doubt:- can llama give null title but not null description
    // else if (params["ticketDescription"] != null) {

    //   setDesc(params["titleDescription"]);
    //   page = "ticket-create";
    //   state = "callApi";
    // }
    else {
      displayMessage("Enter Ticket Title: ", "bot");
      page = "ticket-create";
      state = "title";
    }
    // displayMessage("Enter Ticket Title:", "bot");
    // page = "ticket-create";
    // state = "title";
  }
  // while(!isUserLoggedIn());
};

const statusCheckCallback = async (params) => {
  if (!isUserLoggedIn()) {
    $("#login").on("statusCheckAfterLogin", async function () {
      page = "ticket-check";
      state = "id";
      await statusCheckCallback(params);
    });
    await loginCallback();
  } else {
    $("#login").unbind("statusCheckAfterLogin");

    if (params["ticketId"] != null) {
      setTicketId(params["ticketId"]);
      await checkTicketStatus(params["ticketId"],true, localStorage.getItem("token"));
      displayMessage("Ticket status fetched successfully.", "bot");
    } else {
      displayMessage("Enter Ticket Id: ", "bot");
      page = "ticket-check";
      state = "id";
    }
  }
};


const updateTicketCallback = async () => {
  if (!isUserLoggedIn()) {
    $("#login").on("updateTicketAfterLogin", async function () {
      page = "ticket-update";
      // setPage("ticket-create");
      state = "id";
      // setState("title");
      await updateTicketCallback();
    });
    await loginCallback();
  } else {
    $("#login").unbind("updateTicketAfterLogin");
    displayMessage("Enter Ticket Id:", "bot");
    page = "ticket-update";
    state = "id";
  }
};

const deleteTicketCallback = async (params) => {
  if (!isUserLoggedIn()) {
    $("#login").on("deleteTicketAfterLogin", async function () {
      page = "ticket-delete";
      state = "id";
      await deleteTicketCallback(params);
    });
    await loginCallback();
  } else {
    $("#login").unbind("deleteTicketAfterLogin");

    if (params["ticketId"] != null) {
      setTicketId(params["ticketId"]);
      await deleteTicket(params["ticketId"],true, localStorage.getItem("token"));
      //delete ticket
    } else {
      displayMessage("Enter Ticket Id: ", "bot");
      page = "ticket-delete";
      state = "id";
    }
  }
};

export {
  getPage,
  setPage,
  getState,
  setState,
  loginCallback,
  demoCallback,
  createTicketCallback,
  statusCheckCallback,
  updateTicketCallback,
  deleteTicketCallback,
};
