
import * as nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import logger from "./logger";

let transporter: nodemailer.Transporter;

const initializeEmail = (): void => {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

const loadTemplate = async (templateName: string): Promise<(data: any) => string> => {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
    const template = await fs.readFile(templatePath, 'utf-8');
    return handlebars.compile(template);
};


const sendEmail = async ({ to, subject, template, data }: { to: string, subject: string, template: string, data: any }): Promise<any> => {
    try {
        const compiledTemplate = await loadTemplate(template);
        const html = compiledTemplate(data);

        const result = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });

        logger.info('Email sent successfully', { messageId: result.messageId });
        return result;
    } catch (error) {
        logger.error('Email sending failed:', error);
        throw error;
    }
};


const emailconfig = {
    initializeEmail,
    sendEmail,
}

export default emailconfig;