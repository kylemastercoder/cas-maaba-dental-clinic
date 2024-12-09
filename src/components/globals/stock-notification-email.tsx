/* eslint-disable react/no-unescaped-entities */
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

interface NotifyStockProps {
  items: { name: string; remaining: number }[];
}

export const NotifyStock = ({ items }: NotifyStockProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Restock Your Dental Supplies Before They Run Out! - Cas-Maaba Dental
        Clinic
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
              <Text style={heading}>
                Don't Let Low Stock Disrupt Your Practice
              </Text>
            </Column>
          </Section>

          <Section style={informationTable}>
            <Text style={informationTableLabel}>Dear Admin,</Text>
            <Text style={informationTableValue}>
              We noticed that some of your essential dental supplies are running
              low. Staying ahead of your inventory needs is vital to keeping
              your practice running smoothly and ensuring top-quality care for
              your patients.
            </Text>
          </Section>

          <Hr />

          <Section style={informationTable}>
            {items.map((item) => (
              <Row key={item.name}>
                <Column>
                  <Text style={informationTableLabel}>{item.name}: </Text>
                  <Text style={informationTableValue}>
                    Only ({item.remaining}) left in stock
                  </Text>
                </Column>
              </Row>
            ))}
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

export const NotifyStockHTML = (props: NotifyStockProps) =>
  render(<NotifyStock {...props} />, {
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
