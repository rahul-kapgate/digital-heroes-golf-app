import { resend } from '../lib/resend.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import {
  welcomeTemplate,
  subscriptionTemplate,
  drawResultsTemplate,
  winnerAlertTemplate,
} from './templates.js';

async function send({ to, subject, html }) {
  try {
    const result = await resend.emails.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    logger.info({ to, subject }, 'Email sent');
    return result;
  } catch (err) {
    logger.error({ err, to, subject }, 'Email send failed');
    throw err;
  }
}

export const sendWelcomeEmail = (to, name) =>
  send({
    to,
    subject: 'Welcome to Digital Heroes! 🎉',
    html: welcomeTemplate({ name }),
  });

export const sendSubscriptionConfirmationEmail = (to, name, planType, amount) =>
  send({
    to,
    subject: `Your ${planType} subscription is active!`,
    html: subscriptionTemplate({ name, planType, amount }),
  });

export const sendDrawResultsEmail = (to, name, drawMonth, numbers) =>
  send({
    to,
    subject: `Draw Results for ${drawMonth}`,
    html: drawResultsTemplate({ name, drawMonth, numbers }),
  });

export const sendWinnerAlertEmail = (to, name, matchType, drawMonth) =>
  send({
    to,
    subject: `🎉 You won a ${matchType}!`,
    html: winnerAlertTemplate({ name, matchType, drawMonth }),
  });