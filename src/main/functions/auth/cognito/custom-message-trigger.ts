import { render } from '@react-email/render';
import { CustomMessageTriggerEvent } from 'aws-lambda';

import ForgotPasswordEmail from '@infra/emails/templates/forgot-password';

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const confirmationCode = event.request.codeParameter;

    const html = await render(ForgotPasswordEmail({ confirmationCode }));

    event.response.emailSubject = '🍏 foodiary | Recupere a sua conta!';
    event.response.emailMessage = html;
  }

  return event;
}
