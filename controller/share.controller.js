const ShareModel = require("../model/share.model");
const nodemailer = require("nodemailer");

const connection = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const getEmailTemplate = (link) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Filemoon - File Shared</title>
  </head>

  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td align="center" style="background:#2563eb;padding:30px;">
                <h1 style="margin:0;color:#ffffff;font-size:32px;">🌙 Filemoon</h1>
                <p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">
                  Best file sharing platform
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px 35px;">
                <h2 style="margin:0 0 15px;color:#111827;">Your file is ready!</h2>

                <p style="margin:0 0 25px;color:#4b5563;line-height:24px;">
                  Someone has shared a file with you using <strong>Filemoon</strong>.
                  Click below to download it securely.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                  <tr>
                    <td style="padding:18px;">
                      <p style="margin:0;font-size:13px;color:#6b7280;">Expires On</p>
                      <p style="margin:6px 0;font-size:16px;color:#111827;">
                        {{EXPIRY_DATE}}
                      </p>
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:30px 0;">
                      <a href="${link}"
                         style="background:#2563eb;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:8px;font-weight:bold;display:inline-block;">
                        Download File
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-weight:bold;color:#111827;">Filemoon</p>
                <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">
                  Best file sharing platform
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
};

const shareFile = async (req, res) => {
  try {
    const { email, fileId } = req.body;
    const link = `${process.env.DOMAIN}/api/file/download/${fileId}`;
    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Filemoon - New File Received Alert!",
      html: getEmailTemplate(link),
    };

    await connection.sendMail(options);
    res.status(200).json({ message: "EMAIL SENT" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { shareFile };
