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
const loginCallback = () => {
  // e.preventDefault();
  // $("#messages").empty();
  displayMessage("Enter Your email", "bot");
  page = "login";
  state = "email";
  // sendBtn.innerText = "Send Email";
};

const demoCallback = (loggedIn) => {
  if (loggedIn) {
    // Directly proceed to book the demo
    // askForDemoDetails();
    displayMessage("Enter your name:", "bot");
    page = "demo";
    state = "name";
  } else {
    // Ask the user to log in first
    displayMessage("Please log in first to book a demo.", "bot");
    // $("#login").trigger("click"); // Trigger login process
  }
};

const createTicketCallback = () => {
  displayMessage("Enter Ticket Title:", "bot");
  page = "ticket-create";
  state = "title";
};

const statusCheckCallback = () => {
  displayMessage("Enter Ticket Id: ", "bot");
  page = "ticket-check";
  state = "id";
};

const updateTicketCallback = () => {
  displayMessage("Enter Ticket Id:", "bot");
  page = "ticket-update";
  state = "id";
};

const deleteTicketCallback = () => {
  displayMessage("Enter Ticket Id:", "bot");
  page = "ticket-delete";
  state = "id";
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
