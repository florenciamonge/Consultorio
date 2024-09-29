import React from "react";

interface Props {
  children: React.ReactNode;
  resetCondition?: any; //
  error?: Error | null | boolean | { code: number; message: string };
}

// Interface de state
interface State {
  hasError: boolean;
  resetCondition: any;
}

import styled from "styled-components";

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Middle = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const Inner = styled.div`
  width: 200px;
  margin-right: auto;
  margin-left: auto;
`;

const InnerCircle = styled.div`
  height: 200px;
  border-radius: 50%;
  background-color: #ffffff;
`;

const InnerCircleIcon = styled.i`
  font-size: 4em;
  line-height: 1em;
  float: right;
  width: 1.6em;
  height: 1.6em;
  margin-top: -0.7em;
  margin-right: -0.5em;
  padding: 20px;
  transition: all 0.4s;
  text-align: center;
  color: #f5f5f5 !important;
  border-radius: 50%;
  background-color: #39bbdb;
  box-shadow: 0 0 0 15px #f0f0f0;

  &:hover {
    color: #39bbdb !important;
    background-color: #f5f5f5;
    box-shadow: 0 0 0 15px #39bbdb;
  }
`;

const InnerCircleText = styled.span`
  font-size: 7em;
  font-weight: 700;
  line-height: 1.2em;
  display: block;
  transition: all 0.4s;
  text-align: center;
  color: #e0e0e0;
`;

const InnerStatus = styled.span`
  font-size: 20px;
  display: block;
  margin-top: 20px;
  margin-bottom: 5px;
  text-align: center;
  color: #39bbdb;
`;

const InnerDetail = styled.span`
  line-height: 1.4em;
  display: block;
  margin-bottom: 10px;
  text-align: center;
  color: #999999;
`;

const ErrorPage = styled.div`
  background: #f0f0f0 !important;
`;

export interface ErrorProps {
  errorType: Error | { code: number; message: string } | null; // Tipar la prop errorType
}

// Maneja los errores de mi app y renderiza el componente de error 
export class ErrorBoundary extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false, resetCondition: props.resetCondition
    };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  //Se fija si hay errores nuevamente y actualiza el state
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.resetCondition !== state.resetCondition) { // Es distinto que viene de la prop
      return { hasError: false, resetCondition: props.resetCondition };
    }
    return null;
  }

  render() {
    if (this.state.hasError || this.props.error) {

      return (
        <ErrorPage>
          <Outer>
            <Middle>
              <Inner>
                <InnerCircle>
                  <InnerCircleIcon className="bi-wrench" />
                  <InnerCircleText>{"errorCode"}</InnerCircleText>
                </InnerCircle>
                <InnerStatus>¡Ups! hubo un error</InnerStatus>
                <InnerDetail>
                  Lamentablemente, tenemos problemas para cargar la página que está
                  buscando. Por favor, vuelve en un rato.
                </InnerDetail>
              </Inner>
            </Middle>
          </Outer>
        </ErrorPage>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary