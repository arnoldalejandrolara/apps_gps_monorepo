import React, { useState } from 'react';
import styled from 'styled-components';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { FaSave } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";


export function CreateView({ onBack }) {
    const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const mapContainerStyle = {
        width: '100%',
        height: '100%',
    };

    const center = {
        lat: 19.432608, // Latitud de un ejemplo (Ciudad de México)
        lng: -99.133209, // Longitud de un ejemplo (Ciudad de México)
    };

    return (
        <Container>
            <Header>
                <BackButton onClick={onBack}>
                <IoIosArrowBack style={{ marginRight: '5px' }} />
                    Regresar
                    </BackButton>
                <SaveButton>
                <FaSave style={{ marginRight: '5px' }} />
                 Guardar
                 </SaveButton>
            </Header>
            <Content>

                <LeftContainer>
                    <MapWrapper>
                        <LoadScript googleMapsApiKey="AIzaSyBgNmR7s6iIP55wskrCK-735AxUNm1KpU0">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={center}
                                zoom={10}
                            />
                        </LoadScript>
                    </MapWrapper>
                </LeftContainer>

                <RightContainer>
                    <Title>Crear Punto de Interés</Title>
                    <Description>
                        Complete la información necesaria para crear un nuevo punto de interés. Asegúrese de llenar todos los campos obligatorios.
                    </Description>
                    <Separator />
                    <Input placeholder="Nombre del punto de interés" />
                    <Input placeholder="Descripción" />
                    <DropdownWrapper>
                        <Select onClick={() => setIconDropdownOpen(!iconDropdownOpen)}>
                            {selectedIcon || 'Seleccionar Icono'}
                        </Select>
                        {iconDropdownOpen && (
                            <DropdownContainer>
                                <DropdownOption onClick={() => { setSelectedIcon('Icono 1'); setIconDropdownOpen(false); }}>Icono 1</DropdownOption>
                                <DropdownOption onClick={() => { setSelectedIcon('Icono 2'); setIconDropdownOpen(false); }}>Icono 2</DropdownOption>
                                <DropdownOption onClick={() => { setSelectedIcon('Icono 3'); setIconDropdownOpen(false); }}>Icono 3</DropdownOption>
                            </DropdownContainer>
                        )}
                    </DropdownWrapper>
                    <DropdownWrapper>
                        <Select onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}>
                            {selectedType || 'Seleccionar Tipo'}
                        </Select>
                        {typeDropdownOpen && (
                            <DropdownContainer>
                                <DropdownOption onClick={() => { setSelectedType('Tipo 1'); setTypeDropdownOpen(false); }}>Tipo 1</DropdownOption>
                                <DropdownOption onClick={() => { setSelectedType('Tipo 2'); setTypeDropdownOpen(false); }}>Tipo 2</DropdownOption>
                                <DropdownOption onClick={() => { setSelectedType('Tipo 3'); setTypeDropdownOpen(false); }}>Tipo 3</DropdownOption>
                            </DropdownContainer>
                        )}
                    </DropdownWrapper>
                    <Input placeholder="Coordenadas (opcional)" />
                </RightContainer>
            </Content>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100px); /* Ajusta el tamaño según el diseño */
    padding: 20px 50px;
    color: white;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between; /* Botones separados hacia izquierda y derecha */
    align-items: center;
    margin-bottom: 20px;
`;

const BackButton = styled.button`
    padding: 10px 15px;
    background-color: #3d3d3d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: #555555;
    }
`;

const SaveButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 15px;
    background-color: #28a745; /* Botón verde */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }
`;

const Content = styled.div`
    display: flex;
    flex: 1;
    gap: 40px; /* Espaciado entre los dos contenedores */
`;

const LeftContainer = styled.div`
    flex: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2d2d2d; /* Fondo oscuro */
    // padding: 20px;
    border-radius: 8px; /* Bordes redondeados para el contenedor */
`;

const MapWrapper = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 8px; /* Bordes redondeados para el mapa */
    overflow: hidden; /* Asegura que los bordes redondeados se apliquen correctamente */
`;

const RightContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px; /* Espaciado entre los inputs */
    background: #2A2A2A; /* Fondo oscuro */
    padding: 15px 40px;
    border-radius: 8px;
    border: 1px solid #696969; /* Borde gris oscuro */
`;

const Title = styled.h2`
    font-size: 16px;
    color: white;
    font-weight: 500;
`;

const Description = styled.p`
    font-size: 13px;
    color: #D7CD15;
`;

const Separator = styled.hr`
    width: 100%;
    border: none;
    border-top: 1px solid #444;
    margin: 10px 0;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 13px;
    border: 1px solid #696969;
    border-radius: 8px;
    outline: none;
    background: #2d2d2d;
    color: white;

    &::placeholder {
        color: #aaa;
    }
`;

const DropdownWrapper = styled.div`
    position: relative;
`;

const Select = styled.div`
    padding: 10px;
    font-size: 13px;
    border: 1px solid #696969;
    border-radius: 8px;
    outline: none;
    background: #2d2d2d;
    color: white;
    cursor: pointer;
`;

const DropdownContainer = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #3d3d3d;
    border-radius: 8px;
    border: 1px solid #696969;
    z-index: 10;
    margin-top: 5px;
    overflow: hidden;
`;

const DropdownOption = styled.div`
    padding: 10px;
    cursor: pointer;
    font-size: 13px;
    color: white;
    &:hover {
        background: #555555;
    }
`;

export default CreateView;