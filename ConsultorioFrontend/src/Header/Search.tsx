import { useState } from "react"; // Importa useState
import { Button, Form, InputGroup } from "react-bootstrap";

import styled from "styled-components";

import React from "react";
import { theme, v } from "../styles";


const SearchInputStyles = styled.div`
  .search-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .search-input {
    background: ${theme.bg};
    color: ${theme.text};
    transition: all 0.3s;
  }
  .search-form::placeholder {
    transition: all 0.3s;
    color: ${theme.text};
  }
  .search-form {
    background: ${theme.bg};
    color: ${theme.text};
  }
  .search-button {
    border-radius: ${v.borderRadius};
    z-index: 5;
    border: transparent;
    transition: all 0.3s;
  }
  .bi-search {
    font-size: 14px;
  }
`;

interface SearchProps {
  onSearch: (term: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  const handleButtonClick = () => {
    onSearch(searchTerm);
  };

  return (
    <SearchInputStyles className="search-container">
      <InputGroup className="search-input">
        <Form.Control
          className="shadow-sm search-form"
          type="search"
          placeholder="Buscar..."
          value={searchTerm} // Asigna el valor del término de búsqueda al control del formulario
          onChange={(event) => setSearchTerm(event.target.value)} // Actualiza el término de búsqueda en el estado
          onKeyDown={handleInputKeyDown} // Llama a handleInputKeyDown al presionar una tecla
        />
        <Button
          type="button"
          className="shadow-sm search-button"
          onClick={handleButtonClick}
        >
          <i className="bi bi-search"></i>
        </Button>
      </InputGroup>
    </SearchInputStyles>
  );
};

export default Search;
