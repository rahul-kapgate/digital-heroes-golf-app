const wrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; padding: 20px; }
  .card { max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  h1 { color: #10b981; margin-top: 0; }
  .btn { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
  .footer { color: #888; font-size: 12px; text-align: center; margin-top: 30px; }
</style>
</head>
<body>
  <div class="card">
    ${content}
    <p class="footer">Digital Heroes · digitalheroes.co.in</p>
  </div>
</body>
</html>
`;

export const welcomeTemplate = ({ name }) => wrapper(`
  <h1>Welcome, ${name}! 👋</h1>
  <p>Thanks for joining Digital Heroes — where golf meets giving.</p>
  <p>Here's what you can do next:</p>
  <ul>
    <li>Subscribe to start participating in monthly draws</li>
    <li>Enter your golf scores</li>
    <li>Support your chosen charity</li>
  </ul>
  <a href="#" class="btn">Go to Dashboard</a>
`);

export const subscriptionTemplate = ({ name, planType, amount }) => wrapper(`
  <h1>Subscription Active! 💳</h1>
  <p>Hi ${name},</p>
  <p>Your <strong>${planType}</strong> subscription (₹${amount}) is now active.</p>
  <p>You're now eligible for monthly draws and your charity contribution has been recorded.</p>
`);

export const drawResultsTemplate = ({ name, drawMonth, numbers }) => wrapper(`
  <h1>Draw Results: ${drawMonth}</h1>
  <p>Hi ${name},</p>
  <p>The winning numbers were: <strong>${numbers.join(' · ')}</strong></p>
  <p>Better luck next month!</p>
`);

export const winnerAlertTemplate = ({ name, matchType, drawMonth }) => wrapper(`
  <h1>🎉 Congratulations, ${name}!</h1>
  <p>You got a <strong>${matchType}</strong> in the ${drawMonth} draw!</p>
  <p>Please login and upload your score screenshot to verify your win.</p>
  <a href="#" class="btn">Upload Proof</a>
`);