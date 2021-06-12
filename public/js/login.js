function sessionExpiry() {
  console.log("this is iife");
  window.setInterval(() => {
    let token = window.sessionStorage.getItem("token");
    // if (token)
    //   fetch("http://localhost:4000/checkToken", {
    //     method: "GET",
    //     headers: {
    //       "x-access-token": token,
    //     },
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.expired) {
    //         window.location.href = "/login?message=expired";
    //       }
    //     });
    console.log("interval every 2 sec");
  }, 2000);
}
function postLoginData(event) {
  event.preventDefault();
  const formData = new FormData(document.querySelector("#login-form"));

  fetch("http://localhost:4000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData.entries())),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.auth == true) {
        console.log("before redirect");
        window.location.href =
          "http://localhost:4000/home?token=" +
          data.token +
          "&authentication=" +
          data.auth +
          "&user=" +
          data.user;
        console.log("after redirect");
      } else {
        console.error(data.msg);
      }
    })

    .catch((err) => console.error(err));
  console.log("form-post-completed");
}
