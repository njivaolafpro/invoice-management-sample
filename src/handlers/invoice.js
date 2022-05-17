'use strict';

const shortId = require('shortid');
const path = require('path');

const { createInvoiceSchema } = require("../schemas/invoice");
const { generateInvoicePdf } = require("../utils/pdf-generator");
const { sendGmail } = require("../utils/email-sender");
const { getClientById } = require("../repositories/client");

const log4js = require("log4js");
log4js.configure({
  appenders: { invoiceStory: { type: "file", filename: "containers/stories/invoiceStory-01.log" } },
  categories: { default: { appenders: ["invoiceStory"], level: "error" } }
});

const logger = log4js.getLogger("invoiceStory");
logger.level = 'debug';



const handleCreateInvoice = async (req, res, next) => {
    try {
        await createInvoiceSchema.validateAsync(req.body);

        const logger = log4js.getLogger("invoiceStory");
        logger.trace("Hello, we got a NEW invoice story");

        const { moreDetails, clientId, items, paid, debugMode } = req.body;

        const client = getClientById(clientId);
        const destinationEmail = client.email;
        const { pricePerSession } = client;

        const invoiceId = shortId.generate();
        const invoiceNumber = 'FACT-' + invoiceId + '-' + clientId;

        // Calculate sum per item
        items.forEach(item => {
            item.amountSum = pricePerSession * item.quantity;
            return item;
        })

        // getting subtotal ->
        const subtotal = items.reduce((prev, curr) => {
            return curr.amountSum + prev;
        }, 0);

        const fileName = invoiceNumber + '.pdf'
        const filePath = path.join(__dirname, `../../containers/${fileName}`);


        const invoiceDetails = { client, items, invoiceNumber, paid, subtotal };
        logger.info("The data:", invoiceDetails);
        if (debugMode) {
            logger.debug("It is a debug mode, returning the data");
            return res.send({ success: false, debugMode, data: { invoiceDetails, filePath } });;
        }


        logger.info("It is NOT a debug mode, going to send the email");

        generateInvoicePdf(invoiceDetails, filePath);

        const files = [filePath];

        await sendGmail(
            destinationEmail,
            `
            <!-- HTML Codes by Quackit.com -->
            <!DOCTYPE html>
            <title>Text Example</title>
            <style>
            div.container {
            background-color: #ffffff;
            }
            div.container p {
            font-family: Arial;
            font-size: 14px;
            font-style: normal;
            font-weight: normal;
            text-decoration: none;
            text-transform: none;
            color: #000000;
            background-color: #ffffff;
            }
            </style>

            <div class="container">
            <p>Hello,</p>
            <p></p>
            <p>I hope everything is good from your side. As per our session no. <b>${invoiceNumber}</b> , please find below the invoice.</p>
            <p>Details: ${moreDetails} </p>
            <p>Can you please proceed with the payment ?</p>
            <p>Thanks.</p>
            <p><b>Note -> This is an automatic email.</b>
            <p></p>
            <p>Njiva Olaf Ranaivoson</p>
            <p>Online Coach</p>
            </div>
            
            `,
            `Invoice: ${invoiceNumber}`,
            files
        )


        logger.info("Email has been sent");
        return res.send({ success: true, data: { destinationEmail } });
    } catch (err) {

        logger.error("Some error occured", { message: err.message });
        return res.status(400).send({ message: err.message });
    }
}

module.exports = { handleCreateInvoice }
