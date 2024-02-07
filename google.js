
const functions = require("@google-cloud/functions-framework");
const nodemailer = require("nodemailer");
const { createClient } = require("@libsql/client");

functions.http("sendNotification", async (req, res) => {
    // check if header has auth_token
    if (!req.headers.auth_token) {
        return res.status(401).json({
            statusCode: 401,
            body: "Unauthorized",
        });
    }
    // check if auth_token is valid
    if (req.headers.auth_token !== process.env.AUTH_TOKEN) {
        return res.status(401).json({
            statusCode: 401,
            body: "Unauthorized",
        });
    }
    if (!req.body) {
        return {
            statusCode: 400,
            body: JSON.stringify("No body provided"),
        };
    }

    const body = JSON.parse(req.body);

    // validate body
    if (
        !body.to ||
        !body.from ||
        !body.subject ||
        !body.source ||
        !body.dispatcher ||
        !body.from_name ||
        !body.to_name
    ) {
        return res.send({
            statusCode: 400,
            body: JSON.stringify("Invalid body"),
        });
    }
    //  validate from and to email
    if (
        !body.from.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) ||
        !body.to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
    ) {
        return res.send({
            statusCode: 400,
            body: JSON.stringify("Invalid email"),
        });
    }

    if (body.from === body.to) {
        return res.send({
            statusCode: 400,
            body: JSON.stringify("From and To email cannot be the same"),
        });
    }

    if (body.subject.length > 100) {
        return res.send({
            statusCode: 400,
            body: JSON.stringify(
                "Subject cannot be longer than 100 characters"
            ),
        });
    }
    if (body.text && body.text?.length > 10000) {
        return res.send({
            statusCode: 400,
            body: JSON.stringify("Text cannot be longer than 10000 characters"),
        });
    }
    if (body.html && body.html?.length > 10000) {
        return res.send({
            statusCode: 400,
            body: JSON.stringify("HTML cannot be longer than 10000 characters"),
        });
    }
    const msg = {
        to: body.to,
        from: body.from,
        subject: body.subject,
        text: body.text,
    };

    if (body.html) {
        msg["html"] = body.html;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_POST,
        secure: false, //
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        const tursoClient = createClient({
            url: process.env.TURSO_URL,
            authToken: process.env.TURSO_TOKEN,
        });
        await tursoClient.execute({
            sql: "INSERT INTO notifications (from_user, to_user, subject, text, html, source, dispatcher, from_name, to_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
            args: [
                body.from,
                body.to,
                body.subject,
                body.text ?? "",
                body.html ?? "",
                body.source,
                body.dispatcher,
                body.from_name,
                body.to_name,
            ],
        });

        await transporter.sendMail(msg);

        return res.send({
            statusCode: 200,
            message: "Success",
        });
    } catch (err) {
        return res.send({
            statusCode: 200,
            body: JSON.stringify(err),
        });
    }
});
const response = await handler({
    body: JSON.stringify({
        to: "subashrijal5@gmail.com",
        from: "subash.rijal5@hotmail.com",
        subject: "Test",
        text: "Test",
        html: "<h1>Test</h1>",
        source: "test",
        dispatcher: "test",
        from_name: "Test",
        to_name: "Test",
    }),
});
console.log("🚀 ~ file: app.mjs ~ line 49 ~ handler ~ handler:", response);
