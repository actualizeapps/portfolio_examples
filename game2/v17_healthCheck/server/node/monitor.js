const servers = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];

const emailsToNotify = ['jay1@gmail.com', 'amy3@gmail.com'];
const emailCadenceSec = 600 // 10 min
let lastEmailSent = null;

async function check() {
  for (const server of servers) {
    try {
      const res = await fetch(server + '/health_check');
      if (res.ok) {
        console.log(`[UP] ${server}`);
      } else {
        console.log(`[DOWN] ${server}`);
        sendEmails();
      }
    } catch (err) {
      console.log(`[DOWN] ${server}`);
      sendEmails();
    }
  }
}

function sendEmails() {
    if (lastEmailSent === null || Date.now() - lastEmailSent > emailCadenceSec * 1000) {
        lastEmailSent = Date.now();
        console.log('Sending email to notify: SERVERS ARE DOWN!! ' + emailsToNotify.join(', '));
    }
}

setInterval(check, 2000);
