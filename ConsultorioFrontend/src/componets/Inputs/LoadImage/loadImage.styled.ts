import styled from "styled-components";
import { v } from "../../../styles";

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .img-container {
    display: flex;
    aspect-ratio: auto;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
  }
  .input-image-upload {
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0px;
    right: 0;
    width: 38%;
    text-align: center;
    label {
      cursor: pointer;
    }
  }
  .input-image-delete {
    background-size: cover;
    background-position: center;
    position: absolute;
    left:1;
    bottom: 1;
    top:0;
    right: 18%;
    text-align: center;
    font-size: ${v.fontSizeMd};
    cursor: pointer;
    .btn-delete{
      display:flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-position: center;
      background-color: rgb(230,230,230);
      border: none;
      padding:  0.5rem;
      border-radius: 100%;
      height: 30px;
      width: 30px;
      margin: 0;
      &:hover{
        background-color:rgb(215,215,215);
        border: none;
      }
      label{
        display:flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-position: center;
      }
    }
  }
`;
