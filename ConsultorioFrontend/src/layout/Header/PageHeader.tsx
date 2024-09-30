import React from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  title: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, children }: Props) => {
  return (
    <Row className="gy-sm-3 gy-3 d-flex justify-content-between ">
      <Col sm={12} md={8} lg={7} className="">
        <h1 className="content-header-title fs-3">{title}</h1>
      </Col>
      <Col
        lg={4}
        md={4}
        className="d-flex justify-content-lg-end align-items-center justify-content-between gap-1"
      >
        {children}
      </Col>
    </Row>
  );
};

export default PageHeader;
