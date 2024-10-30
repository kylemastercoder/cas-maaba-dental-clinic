import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  render,
} from "@react-email/components";

import * as React from "react";

import { format } from "date-fns";

interface NotifyEmailProps {
  date: Date;
  name: string;
  title: string;
  description: string;
  followUpDate: string;
}

export const NotifyEmail = ({
  date,
  name,
  title,
  description,
  followUpDate,
}: NotifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Follow-up Appointment Reminder - Cas-Maaba Dental Clinic
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Column>
              <Img
                src={`https://digital-affinity.s3.us-east-1.amazonaws.com/logo-icon.png`}
                width="150"
                height="150"
                alt="Cas-Maaba Dental Clinic"
              />
            </Column>

            <Column align="right" style={tableCell}>
              <Text style={heading}>Follow-up Appointment Notification</Text>
              <Text style={informationTableLabel}>
                {format(date, "dd MMM yyyy")}
              </Text>
            </Column>
          </Section>

          <Section style={informationTable}>
            <Text style={informationTableLabel}>Dear {name},</Text>
            <Text style={informationTableValue}>
              We hope this email finds you well. This is a reminder for your
              follow-up appointment at Cas-Maaba Dental Clinic. Below are the
              details:
            </Text>
          </Section>

          <Hr />

          <Section style={informationTable}>
            <Row>
              <Column>
                <Text style={informationTableLabel}>Appointment Title:</Text>
                <Text style={informationTableValue}>{title}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={informationTableLabel}>
                  Appointment Description:
                </Text>
                <Text style={informationTableValue}>{description}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={informationTableLabel}>Follow-up Date:</Text>
                <Text style={informationTableValue}>
                  {format(followUpDate, "dd MMM yyyy")}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={informationTableLabel}>Clinic Address:</Text>
                <Text style={informationTableValue}>
                  2nd Floor, Lot 4A, Hi-Precision Diagnostics Plus Building,
                  Aguinaldo Highway, Pasong Tala, Zone IV, Dasmariñas, Cavite,
                  Dasmariñas, Philippines
                </Text>
              </Column>
            </Row>
          </Section>

          <Text style={footerLinksWrapper}>
            <Link href="#">Account Settings</Link> •{" "}
            <Link href="#">Terms of Sale</Link> •{" "}
            <Link href="#">Privacy Policy </Link>
          </Text>
          <Text style={footerCopyright}>
            Copyright © 2024 Cas-Maaba Dental Clinic. <br />{" "}
            <Link href="#">All rights reserved</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const NotifyEmailHTML = (props: NotifyEmailProps) =>
  render(<NotifyEmail {...props} />, {
    pretty: true,
  });

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "660px",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "28px",
  fontWeight: "300",
  color: "#888888",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
  marginTop: "12px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const footerLinksWrapper = {
  margin: "8px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};

const footerCopyright = {
  margin: "25px 0 0 0",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "rgb(102,102,102)",
};
