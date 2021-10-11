//Require Section //
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

//MailChimp API Settings

mailchimp.setConfig({
  apiKey: "35cfef9524b55a962607d3f44d7b81d9-us5",
  server: "us5",
});

//New syntax for Body Parser

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Static Files //
app.use(express.static(__dirname + "/public"));

//Post Request
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;

  //Field Checks
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }
  // Member Addition
  const addMembers = async () => {
    const response = await mailchimp.lists.addListMember("44070a2543", {
      email_address: email,
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
      status: "subscribed",
    });
    console.log(response);
  };
  addMembers()
    .then(
      res.statusCode === 200
        ? res.redirect("/success.html")
        : res.redirect("/fail.html")
    )
    .catch((err) => console.log(err));
});
//Port Details//
const PORT = 5000;
app.listen(PORT, function () {
  console.log(`App started at Port ${PORT}`);
});
