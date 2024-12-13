var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';
        var emailData = {
            to: process.argv[2],      // Destinatario
            subject: process.argv[3], // Asunto
            body: process.argv.slice(4).join(' ') || "Cuerpo del correo"
        };

        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), {
            persistent: true
        });
        console.log(" [x] Sent email data: '%s'", JSON.stringify(emailData));
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});
