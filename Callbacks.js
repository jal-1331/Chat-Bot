import { displayMessage } from "./Chatbot.js";
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
const loginCallback = async () => {
  // e.preventDefault();
  // $("#messages").empty();
  displayMessage("Enter Your email", "bot");
  page = "login";
  state = "email";
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

const createTicketCallback = async () => {
  if (!isUserLoggedIn()) {
    $("#login").on("createTicketAfterLogin", async function () {
      page = "ticket-create";
      // setPage("ticket-create");
      state = "title";
      // setState("title");
      await createTicketCallback();
    });
    await loginCallback();
    // $("#login").off("createTicketAfterLogin");
  } else {
    $("#login").unbind("createTicketAfterLogin"); // have to remove the registered custom event whenn onced logged in
    displayMessage("Enter Ticket Title:", "bot");
    page = "ticket-create";
    state = "title";
  }
  // while(!isUserLoggedIn());
};

const statusCheckCallback = async () => {
  if (!isUserLoggedIn()) {
    $("#login").on("statusCheckAfterLogin", async function () {
      page = "ticket-check";
      // setPage("ticket-create");
      state = "id";
      // setState("title");
      await statusCheckCallback();
    });
    await loginCallback();
  } else {
    $("#login").unbind("statusCheckAfterLogin");
    displayMessage("Enter Ticket Id: ", "bot");
    page = "ticket-check";
    state = "id";
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

const deleteTicketCallback = async () => {
  if (!isUserLoggedIn()) {
    $("#login").on("deleteTicketAfterLogin", async function () {
      page = "ticket-delete";
      // setPage("ticket-create");
      state = "id";
      // setState("title");
      await deleteTicketCallback();
    });
    await loginCallback();
  } else {
    $("#login").unbind("deleteTicketAfterLogin");
    displayMessage("Enter Ticket Id:", "bot");
    page = "ticket-delete";
    state = "id";
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
