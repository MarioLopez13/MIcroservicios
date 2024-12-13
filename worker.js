var amqp = require('amqplib/callback_api');
var nodemailer = require('nodemailer');

amqp.connect('amqp://localhost', function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            var emailData = JSON.parse(msg.content.toString());  // Suponiendo que el mensaje es un JSON

            let transporter = nodemailer.createTransport({
                service: 'gmail', // O cualquier otro servicio de correo
                auth: {
                    user: 'tu-email@gmail.com',
                    pass: 'tu-contraseña'
                }
            });

            let mailOptions = {
                from: 'tu-email@gmail.com',
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.body
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log('Error al enviar el correo:', error);
                } else {
                    console.log('Correo enviado: ' + info.response);
                }
            });

            console.log(" [x] Sent email to %s", emailData.to);
            channel.ack(msg);
        }, {
            noAck: false
        });
    });
});
