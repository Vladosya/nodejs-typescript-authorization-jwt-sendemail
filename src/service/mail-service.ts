import nodemailer from "nodemailer";

class MailService {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "jvladosyans@gmail.com",
        pass: "2497vlad",
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: "jvladosyans@gmail.com",
      to,
      subject: `Активация аккаунта на ${process.env.API_URL}`,
      text: "",
      html: `
				<div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${link}">${link}</a>
				</div>
			`,
    });
  }
}

export default new MailService();
