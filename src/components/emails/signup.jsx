import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function SignupEmail({ firstName }) {
  return (
    <Tailwind>
      <Html>
        <Preview>
          Welcome to FlexFit! Discover all the amazing benefits waiting for you.
        </Preview>
        <Body className="bg-violet-50 py-10">
          <Container className="bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6">
            <Section className="text-center">
              <Row className="w-min">
                <Column className="max-w-min">
                  <Img
                    src={
                      "https://flexfit-xi.vercel.app/_next/image?url=%2Fflexfitlogo.jpg&w=64&q=75"
                    }
                    alt="FlexFit Logo"
                    width="40"
                  />
                </Column>
                <Column className="max-w-min">
                  <Heading>FlexFit</Heading>
                </Column>
              </Row>
              <div className=""></div>
            </Section>
            <Section className="mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Welcome, {firstName}!
              </Text>
              <Text className="text-gray-600  mt-2">
                Thank you for signing up for FlexFit. We&apos;re excited to have
                you on board and can&apos;t wait for you to start your fitness
                journey with us.
              </Text>
            </Section>
            <Section className="mt-4">
              <Text className="text-gray-700">
                As a new member, here are some benefits you can enjoy:
              </Text>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Custom workout plans tailored to your goals.</li>
                <li>Track your daily progress with ease.</li>
                <li>Join a vibrant community of fitness enthusiasts.</li>
                <li>Access meal plans designed by experts.</li>
                <li>Connect with trainers and get professional advice.</li>
              </ul>
            </Section>
            <Section className="text-center mt-6">
              <Text className="text-gray-700">
                We’re here to support you every step of the way. Let’s make your
                fitness goals a reality!
              </Text>
            </Section>
            <Section className="mt-6 text-center">
              <Text className="text-sm text-gray-500">
                If you have any questions, feel free to reach out to our support
                team at{" "}
                <a
                  href="mailto:support@flexfit.com"
                  className="text-blue-500 underline"
                >
                  support@flexfit.com
                </a>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

SignupEmail.PreviewProps = {
  firstName: "John",
};
