import { loginCallback } from "./Callbacks.js";
import { displayMessage } from "./Chatbot.js";
const apiBaseUrl = "https://localhost:7127/api";
const createTicket = async (title, desc, isUserLoggedIn, token) => {
  if (!isUserLoggedIn) {
    alert("Login required!");
    loginCallback();
  } else {
    // loadJwtToken();
    await $.ajax({
      type: "POST",
      url: apiBaseUrl + "/Ticket",
      data: JSON.stringify({
        Title: title,
        Description: desc,
      }),
      headers: {
        Authorization: "Bearer " + token,
      },
      // dataType: "dataType",
      contentType: "application/json",
      success: function (response) {
        console.log(response);
      },
    });
  }
};

const checkTicketStatus = async (id, isUserLoggedIn, token) => {
  if (!isUserLoggedIn) {
    alert("Login required!");
    loginCallback();
  } else {
    // loadJwtToken();
    await $.ajax({
      type: "GET",
      url: apiBaseUrl + "/Ticket?id=" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
      // dataType: "dataType",
      contentType: "application/json",
      success: function (response) {
        // console.log(response);
        var status = response.status;

        if (status == 0) {
          status = "Open";
        } else if (status == 1) {
          status = "InProgress";
        } else if (status == 2) {
          status = "Resolved";
        } else {
          status = "Closed";
        }
        // console.log(
        //   // `Title: ${response.title}
        //   // Description: ${response.description}
        //   // CreatedAt: ${response.createdAt}
        //   `Status: ${status}`
        // );

        displayMessage(
          // `Title: ${response.title}
          // Description: ${response.description}
          // CreatedAt: ${response.createdAt}
          response.id == -1 ? "Ticket doesn't exist" : `Status: ${status}`,
          "bot"
        );
      },
    });
  }
};

const updateTicket = async (id, title, desc, isUserLoggedIn, token) => {
  if (!isUserLoggedIn) {
    alert("Login required!");
    loginCallback();
  } else {
    $.ajax({
      type: "POST",
      url: apiBaseUrl + "/Ticket/UpdateStatus",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: JSON.stringify({
        id: id,
        title: title,
        description: desc,
      }),
      // dataType: "dataType",
      contentType: "application/json",
      success: function (response) {
        console.log(response);
      },
    });
  }
};

const deleteTicket = async (id, isUserLoggedIn, token) => {
  if (!isUserLoggedIn) {
    alert("Login required!");
    loginCallback();
  } else {
    $.ajax({
      type: "DELETE",
      url: apiBaseUrl + "/Ticket?id=" + id,
      headers: {
        Authorization: "Bearer " + token,
      },
      // data: JSON.stringify({
      //   id: id,
      //   title: title,
      //   description: desc,
      // }),
      // dataType: "dataType",
      contentType: "application/json",
      success: function (response) {
        console.log(response);
      },
    });
  }
};

export { createTicket, checkTicketStatus, updateTicket, deleteTicket };
