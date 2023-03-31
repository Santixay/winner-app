const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

module.exports = {
  sendMessage: async (req, res) => {
    try {
      let phone = req.params.phone;
      let message = req.body.message;

      // console.log(phone,message)
      // res.status(200).json({phone,message});
      // return
      if (phone == undefined || message == undefined) {
        res.send({
          status: "error",
          message: "please enter valid phone and message",
        });
      } else {
        try {
          client.isRegisteredUser(`${phone}@c.us`).then((is) => {
            is
              ? client
                  .sendMessage(phone + "@c.us", message)
                  .then((response) => {
                    if (response.id.fromMe) {
                      res.send({
                        status: "ok",
                        message: `Message successfully sent to ${phone}`,
                      });
                    }
                  })
              : res.send({
                  status: "error",
                  message: `${phone} is not a whatsapp user`,
                });
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
