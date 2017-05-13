const CloudPrint = require("cloud-print");

module.exports = function (RED) {
  RED.nodes.registerType("cloudprint", function (config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on('input', function (msg) {
      const cred = node.credentials;

      const cp = new CloudPrint({
        service_provider: "google",
        auth: {
          client_id: cred.clientId,
          client_secret: cred.clientSecret,
          redirect_uri: "http://localhost:8080",
          access_token: cred.accessToken,
          refresh_token: cred.refreshToken
        }
      });

      if (!Buffer.isBuffer(msg.payload)) {
        throw new Error("payload is not a buffer");
      }
      if (!msg.contentType) {
        throw new Error("no contentType given");
      }

      cp.print({
        printer_id: cred.printerId,
        title: msg.title || 'nodeRED print',
        content: {
          value: msg.payload,
          options: {
            filename: msg.filename,
            contentType: msg.contentType
          }
        },
        content_type: msg.contentType,
        setting: {}
      }, (err) => {
        if (err) {
          node.error("failed to print", msg);
        } else {
          console.log("successfully printed!");
        }
      });
    });
  }, {
    credentials: {
      printerId: {
        type: "text"
      },
      clientId: {
        type: "text"
      },
      clientSecret: {
        type: "text"
      },
      accessToken: {
        type: "text"
      },
      refreshToken: {
        type: "text"
      }
    }
  });
}
