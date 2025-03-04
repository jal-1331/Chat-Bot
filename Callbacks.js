import {
  callNextCallBack,
  displayMessage,
  getDemoDetails,
  getDesc,
  getId,
  getIntent,
  getTitle,
  setDemoDetails,
  setDesc,
  setId,
  setIntent,
  setSendBtnText,
  setTitle,
} from "./Chatbot.js";
import { LoginViaOtp } from "./loginService.js";
import {
  checkTicketStatus,
  createTicket,
  deleteTicket,
} from "./ticketService.js";
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
const setCustomState = () => {
  if (page == "ticket-update") {
    if (!getId()) {
      displayMessage("Enter Ticket Id", "bot");
      state = "id";
    } else if (!getTitle()) {
      displayMessage("Enter Ticket Title", "bot");
      state = "title";
    } else if (!getDesc()) {
      displayMessage("Enter Ticket Description", "bot");
      state = "desc";
    }
    if (getId() != null && getDesc() != null && getTitle() != null) {
      state = "callApi";
      // $("#send-btn").val("Update Ticket");
      setSendBtnText("Update Ticket");
    }
  } else if (page == "demo") {
    // var dd = getDemoDetails();
    // console.log(dd);

    // if (!dd) {
    //   dd = {};
    //   state = "name";
    // } else
    // console.log(!getDemoDetails()["name"]);

    if (!getDemoDetails()["name"]) {
      displayMessage("Enter name", "bot");
      state = "name";
    } else if (!getDemoDetails().email) {
      displayMessage("Enter email", "bot");
      state = "email";
    } else if (!getDemoDetails().preferredDateTime) {
      // displayMessage(
      //   "Enter your preferred date and time (YYYY-MM-DDTHH:mm:ss)",
      //   "bot"
      // );
      const dateTimePicker = $("<input>", {
        type: "dateTime-local",
        id: "dateTimePicker"
      });
      $("#messages").append(dateTimePicker);
      messages.scrollTop = messages.scrollHeight;
      state = "datetime";
    } else if (
      getDemoDetails().name != null &&
      getDemoDetails().email != null &&
      getDemoDetails().preferredDateTime != null
    ) {
      state = "callApi";
      setSendBtnText("Book Demo");
    }
  }
};
function isUserLoggedIn() {
  return localStorage.getItem("token") !== null;
}
// const getValue = (document, key) => {
//   if(document == null){
//     return null;
//   }
//   else if(document.key)
// }
const loginCallback = async (params) => {
  // console.log(params);

  if (!params["email"]) {
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

const demoCallback = async (loggedIn, params) => {
  if (loggedIn) {
    // Directly proceed to book the demo
    // askForDemoDetails();
    $("#login").unbind("bookDemoAfterLogin");

    if (params != null) {
      var dd = getDemoDetails();
      if (params["name"] != null) {
        dd.name = params["name"];
      }
      if (params["email"] != null) {
        dd.email = params["email"];
      }
      if (params["prefferedDateTime"] != null) {
        dd.preferredDateTime = params["prefferedDateTime"];
      }
      // console.log(dd);

      setDemoDetails(dd);
    }
    page = "demo";
    // // setPage("ticket-create");
    // state = "name";
    // setState("title");
    setCustomState();

    // displayMessage("Enter your name:", "bot");
    // page = "demo";
    // state = "name";
  } else {
    $("#login").on("bookDemoAfterLogin", async function () {
      await demoCallback();
    });
    await loginCallback(params);
    // Ask the user to log in first
    // displayMessage("Please log in first to book a demo.", "bot");
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
      displayMessage("Ticket Created!! Check your email for details.", "bot");
      callNextCallBack();
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

// const statusCheckCallback = async () => {
//   if (!isUserLoggedIn()) {
//     $("#login").on("statusCheckAfterLogin", async function () {
//       page = "ticket-check";
//       // setPage("ticket-create");
//       state = "id";
//       // setState("title");
//       await statusCheckCallback();
//     });
//     await loginCallback();
//   } else {
//     $("#login").unbind("statusCheckAfterLogin");
//     displayMessage("Enter Ticket Id: ", "bot");
//     page = "ticket-check";
//     state = "id";
//   }
// };
const statusCheckCallback = async (params) => {
  if (!isUserLoggedIn()) {
    $("#login").on("statusCheckAfterLogin", async function () {
      page = "ticket-check";
      state = "id";
      await statusCheckCallback(params);
    });
    await loginCallback(params);
  } else {
    $("#login").unbind("statusCheckAfterLogin");
    console.log(params["ticketId"]);
    if (params["ticketId"] != null) {
      // console.log(params["ticketId"]);

      setId(params["ticketId"]);
      await checkTicketStatus(
        params["ticketId"],
        true,
        localStorage.getItem("token")
      );
      callNextCallBack();
    } else {
      displayMessage("Enter Ticket Id: ", "bot");
      page = "ticket-check";
      state = "id";
    }
  }
};

const updateTicketCallback = async (params) => {
  if (!isUserLoggedIn()) {
    var intents = getIntent(); 
    intents = [{"type": "login", "parameters": {"email": null}}, ...intents];
    setIntent(intents);
    $("#login").on("updateTicketAfterLogin", async function () {
      page = "ticket-update";
      // setPage("ticket-create");
      state = "id";
      // setState("title");
      await updateTicketCallback(params);
    });
    await loginCallback(params);
  } else {
    $("#login").unbind("updateTicketAfterLogin");
    if (params != null) {
      if (params["ticketId"] != null) {
        setId(params["ticketId"]);
      }
      if (params["ticketTitle"] != null) {
        setTitle(params["ticketTitle"]);
      }
      if (params["ticketDescription"] != null) {
        setDesc(params["ticketDescription"]);
      }
    }
    // displayMessage("Enter Ticket Id:", "bot");
    page = "ticket-update";
    // state = "id";
    setCustomState();
  }
};

const deleteTicketCallback = async (params) => {
  if (!isUserLoggedIn()) {
    $("#login").on("deleteTicketAfterLogin", async function () {
      page = "ticket-delete";
      state = "id";
      await deleteTicketCallback(params);
    });
    // console.log(1);

    await loginCallback(params);
  } else {
    // console.log(2);

    $("#login").unbind("deleteTicketAfterLogin");

    if (params["ticketId"] != null) {
      setId(params["ticketId"]);
      await deleteTicket(
        params["ticketId"],
        true,
        localStorage.getItem("token")
      );
      callNextCallBack();
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
  setCustomState,
};
