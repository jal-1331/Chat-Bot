const apiBaseUrl = "https://localhost:7127/api";
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
  var res = "";

  await $.ajax({
    type: "GET",
    url: apiBaseUrl + "/Auth/VerifyOtp?otp=" + otp,
    headers: {
      Authorization: "Bearer " + token,
    },
    // data: "data",
    //   contentType: "application/json",
    success: function (response) {
      console.log(response);
      // displayMessage("Login successfull", "bot");
      // token = response;
      res = response;
    },
  });
  return res;
};

export { LoginViaOtp, VerifyOtp };
