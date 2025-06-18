import { Column } from "@react-email/column";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import React from "react";

import { TailwindConfig } from "@infra/emails/components/tailwind-config";

interface ForgotPasswordEmailProps {
  confirmationCode: string;
}

export default function ForgotPasswordEmail({
  confirmationCode,
}: ForgotPasswordEmailProps) {
  return (
    <Html>
      <TailwindConfig>
        <Section>
          <Row>
            <Column className="font-sans text-center pt-10">
              <Heading as="h1" className="text-2xl leading-[0]">
                Recupere a sua conta
              </Heading>
              <Heading as="h2" className="font-normal text-base text-gray-600">
                Resete a sua senha e volte ao foco 💪!
              </Heading>
            </Column>
          </Row>

          <Row>
            <Column className="text-center pt-10">
              <span className="bg-gray-200 inline-block px-8 py-4 text-3xl font-sans rounded-md font-bold tracking-[16px]">
                {confirmationCode}
              </span>
            </Column>
          </Row>

          <Row>
            <Column className="text-center pt-10">
              <Text className="text-gray-600 font-sans text-sm">
                Se você não solicitou a recuperação de senha, ignore este
                e-mail.
              </Text>
            </Column>
          </Row>
        </Section>
      </TailwindConfig>
    </Html>
  );
}

ForgotPasswordEmail.PreviewProps = {
  confirmationCode: "120171",
};
