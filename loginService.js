const apiBaseUrl = "https://localhost:7127/api";
import { displayMessage } from "./Chatbot.js";
// import { setState} from "./Callbacks.js";
const LoginViaOtp = async (email) => {
  var tkn = "";
  await $.ajax({
    type: "GET",
    url: apiBaseUrl + "/Auth/LoginViaOtp?toEmail=" + email,
    // data: "data",
    //   contentType: "application/json",
    success: function (response) {
      // console.log(response);
      tkn = response.toString();
      localStorage.setItem("token", tkn);
    //   token = tkn;
      // console.log(tkn);

      return tkn;
    },
    error: function (e) {
      console.log(e);
    },
  });
};

const VerifyOtp = async (otp, token) => {
  return new Promise((resolve, reject) => {
  // var res = "";

   $.ajax({
    type: "GET",
    url: apiBaseUrl + "/Auth/VerifyOtp?otp=" + otp,
    headers: {
      Authorization: "Bearer " + token,
    },
    // data: "data",
    //   contentType: "application/json",
    success: function (response) {
      console.log(response);
      
      // token = response;
      // res = response;
      if (response == 0) {
        // displayMessage("Wrong OTP! Enter OTP Again.", "bot");
        resolve(0);
      } else {
        // displayMessage("OTP verified!", "bot");
        resolve(1);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error verifying OTP:", error);
      reject(error);
    },
  });
});
  
};

export { LoginViaOtp, VerifyOtp };
