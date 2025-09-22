import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { FaPlus, FaCheck, FaPaperPlane, FaChevronDown, FaTimes, FaCar, FaSearch } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";

// --- Datos de ejemplo ---
const initialUnitsData = [
    { id: 1, name: 'AVEO K38-ATU', isSelected: true },
    { id: 2, name: 'SENTRA A45-BDE', isSelected: false },
    { id: 3, name: 'NP300 C12-FGH', isSelected: false },
    { id: 4, name: 'VERSA D98-JKL', isSelected: false },
    { id: 5, name: 'TIDA E54-MNO', isSelected: false },
    { id: 6, name: 'HILUX F21-PQR', isSelected: false },
    { id: 7, name: 'JETTA G76-STU', isSelected: false },
];

const allPermissionsConfig = {
    administrar: [ { key: 'usuarios', label: 'Usuarios' }, { key: 'dispositivos', label: 'Dispositivos' }, { key: 'geocercas', label: 'Geocercas' }, { key: 'puntos_interes', label: 'Puntos de Interes' }, { key: 'rutas', label: 'Rutas' }, { key: 'cuenta_espejo', label: 'Cuenta Espejo' }, { key: 'grupos', label: 'Grupos' }, ],
    comandos: [ { key: 'solicitar_posicion', label: 'Solicitar Posición' }, { key: 'bloqueo_motor', label: 'Bloqueo de Motor' }, ],
    opciones: [ { key: 'acceso_historial', label: 'Acceso al Historial' }, { key: 'ver_alertas', label: 'Ver Alertas' }, ],
};

// --- Componente de Interruptor (Toggle) ---
function ToggleSwitch({ label, checked, onChange }) {
    return ( <ToggleWrapper> <span>{label}</span> <SwitchLabel> <input type="checkbox" checked={checked} onChange={onChange} /> <Slider /> </SwitchLabel> </ToggleWrapper> );
}

// --- Componente Modal para Unidades ---
function UnitsModal({ units, onToggleUnit, onSelectAll, onClose }) {
    const anyUnitSelected = units.some(unit => unit.isSelected);

    // NUEVO: Estado para el input de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // NUEVO: Lógica para filtrar unidades
    const filteredUnits = units.filter(unit =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h4>Seleccionar Unidades</h4>
                    <CloseButton onClick={onClose}><IoClose /></CloseButton>
                </ModalHeader>
                <ModalBody>
                     <SubActions>
                        {/* NUEVO: Input de búsqueda */}
                        <SearchWrapper>
                            <SearchIcon />
                            <ModalSearchInput 
                                type="text"
                                placeholder="Buscar unidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchWrapper>

                        <ActionButton 
                            onClick={() => onSelectAll(!anyUnitSelected)}
                            $type={anyUnitSelected ? 'secondary' : 'primary'}
                        >
                            {anyUnitSelected ? 'Ninguno' : 'Todos'}
                        </ActionButton>
                    </SubActions>
                    <UnitList>
                        {/* CAMBIO: Se mapean las unidades filtradas */}
                        {filteredUnits.map(unit => (
                            <UnitItem key={unit.id} $isSelected={unit.isSelected} onClick={() => onToggleUnit(unit.id)}>
                                <span>{unit.name}</span>
                                <UnitButton $isSelected={unit.isSelected}>
                                    {unit.isSelected ? <FaCheck /> : <FaPlus />}
                                </UnitButton>
                            </UnitItem>
                        ))}
                    </UnitList>
                </ModalBody>
                <ModalFooter>
                    {/* NUEVO: Botón para regresar/cancelar */}
                    <ActionButton onClick={onClose} $type="secondary">Regresar</ActionButton>
                    <ActionButton onClick={onClose} $type="success">Aceptar</ActionButton>
                </ModalFooter>
            </ModalContent>
        </ModalBackdrop>
    );
}


// --- Componente Principal de Permisos (Modificado) ---
export function PermisosUser({ user, onSave }) {
    const [units, setUnits] = useState(initialUnitsData);
    const [permissions, setPermissions] = useState({ ver_alertas: true, usuarios: true });
    const [openSections, setOpenSections] = useState({ administrar: true });
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- MANEJADORES ---
    const handleToggleUnit = (unitId) => setUnits(p => p.map(u => u.id === unitId ? { ...u, isSelected: !u.isSelected } : u));
    const handleSelectAllUnits = (select) => setUnits(p => p.map(u => ({ ...u, isSelected: select })));
    const handleTogglePermission = (key) => setPermissions(p => ({ ...p, [key]: !p[key] }));
    const handleToggleSection = (category) => setOpenSections(p => ({ ...p, [category]: !p[category] }));
    
    const handleSetAllPermissions = (value) => {
        const allKeys = Object.values(allPermissionsConfig).flat().map(p => p.key);
        const newPermissions = {};
        allKeys.forEach(key => { newPermissions[key] = value; });
        setPermissions(newPermissions);
    };

    const handleSubmit = () => {
        const selectedUnits = units.filter(unit => unit.isSelected);
        console.log("Datos a enviar:", { userId: user?.id, units: selectedUnits, permissions });
        alert("Permisos guardados (revisa la consola para ver los datos)");
    };

    // --- LÓGICA PARA BOTONES Y CONTADORES ---
    const anyPermissionSelected = Object.values(allPermissionsConfig).flat().map(p => p.key).some(key => permissions[key]);
    const selectedUnitsCount = units.filter(u => u.isSelected).length;

    return (
        <>
            <Wrapper>
                {isMobile && (
                    <MobileUnitSelector onClick={() => setIsModalOpen(true)}>
                        <FaCar />
                        <span>Unidades Seleccionadas ({selectedUnitsCount})</span>
                        <FaChevronDown />
                    </MobileUnitSelector>
                )}

                <ContentGrid $isMobile={isMobile}>
                    {!isMobile && (
                        <Column>
                            <SubActions>
                                <ActionButton 
                                    onClick={() => handleSelectAllUnits(selectedUnitsCount === 0)}
                                    $type={selectedUnitsCount > 0 ? 'secondary' : 'primary'}
                                >
                                    {selectedUnitsCount > 0 ? 'Ninguno' : 'Todos'}
                                </ActionButton>
                            </SubActions>
                            <UnitList>
                                {units.map(unit => (
                                    <UnitItem key={unit.id} $isSelected={unit.isSelected} onClick={() => handleToggleUnit(unit.id)}>
                                        <span>{unit.name}</span>
                                        <UnitButton $isSelected={unit.isSelected}>
                                            {unit.isSelected ? <FaCheck /> : <FaPlus />}
                                        </UnitButton>
                                    </UnitItem>
                                ))}
                            </UnitList>
                        </Column>
                    )}
                    
                    <Column>
                        <Actions>
                            <ActionButton 
                                onClick={() => handleSetAllPermissions(!anyPermissionSelected)}
                                $type={anyPermissionSelected ? 'secondary' : 'primary'}
                            >
                                {anyPermissionSelected ? 'Permisos: Ninguno' : 'Permisos: Todos'}
                            </ActionButton>
                            <ActionButton onClick={handleSubmit} $type="success">
                                <FaPaperPlane /> Enviar
                            </ActionButton>
                        </Actions>
                        
                        {Object.entries(allPermissionsConfig).map(([category, items]) => {
                            const totalCount = items.length;
                            const selectedCount = items.filter(item => permissions[item.key]).length;

                            return (
                                <PermissionSection key={category}>
                                    <AccordionHeader onClick={() => handleToggleSection(category)}>
                                        <CategoryTitle>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                            <PermissionCount>({selectedCount}/{totalCount})</PermissionCount>
                                        </CategoryTitle>
                                        <ChevronIcon $isOpen={!!openSections[category]} />
                                    </AccordionHeader>
                                    
                                    {openSections[category] && (
                                        <PermissionBody>
                                            {items.map(item => (
                                                <ToggleSwitch
                                                    key={item.key}
                                                    label={item.label}
                                                    checked={!!permissions[item.key]}
                                                    onChange={() => handleTogglePermission(item.key)}
                                                />
                                            ))}
                                        </PermissionBody>
                                    )}
                                </PermissionSection>
                            );
                        })}
                    </Column>
                </ContentGrid>
            </Wrapper>
            
            {isMobile && isModalOpen && ReactDOM.createPortal(
                <UnitsModal 
                    units={units}
                    onToggleUnit={handleToggleUnit}
                    onSelectAll={handleSelectAllUnits}
                    onClose={() => setIsModalOpen(false)}
                />,
                document.body
            )}
        </>
    );
}


// --- Estilos ---
const Wrapper = styled.div`
    padding: 20px; background-color: #fff; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #333; display: flex; flex-direction: column; height: 100%; overflow: hidden;
    @media (max-width: 768px) { padding: 15px; }
`;
const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: ${({ $isMobile }) => $isMobile ? '1fr' : '1fr 1fr'};
    gap: 40px; flex-grow: 1; min-height: 0;
`;
const Column = styled.div`
    display: flex; flex-direction: column; min-height: 0; overflow-y: auto; padding-right: 10px;
`;
const UnitList = styled.div`
    display: flex; flex-direction: column; gap: 10px; flex-grow: 1;
`;
const UnitItem = styled.div`
    display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border: 1px solid #e9ecef;
    border-radius: 6px; cursor: pointer; transition: all 0.2s ease-in-out;
    background-color: ${({ $isSelected }) => $isSelected ? '#d4edda' : '#f8f9fa'};
    border-color: ${({ $isSelected }) => $isSelected ? '#c3e6cb' : '#e9ecef'};
    &:hover { border-color: ${({ $isSelected }) => $isSelected ? '#b1dfbb' : '#ced4da'}; transform: translateY(-2px); }
`;
const UnitButton = styled.div`
    width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: white; font-size: 16px; transition: background-color 0.2s;
    background-color: ${({ $isSelected }) => $isSelected ? '#28a745' : '#6c757d'};
`;
const PermissionSection = styled.div`
    margin-bottom: 10px; border-bottom: 1px solid #e9ecef; &:last-child { border-bottom: none; }
`;
const AccordionHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 10px 0;
`;
const CategoryTitle = styled.h4`
    font-weight: 600; font-size: 15px; color: #212529; margin: 0; display: flex; align-items: center; gap: 8px;
`;
const PermissionCount = styled.span`
    font-weight: 500; font-size: 12px; color: #6c757d;
`;
const ChevronIcon = styled(FaChevronDown)`
    transition: transform 0.3s ease; transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;
const PermissionBody = styled.div`
    padding: 10px 5px 15px 5px;
`;

const SubActions = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 15px; /* Más espacio */
    align-items: center;
    /* CAMBIO: Distribuye el espacio entre el input y el botón */
    justify-content: space-between;
`;

const Actions = styled.div`
    display: flex; justify-content: flex-end; gap: 10px; padding-bottom: 15px;
    margin-bottom: 15px; border-bottom: 1px solid #dee2e6; flex-shrink: 0;
`;
const ActionButton = styled.button`
    padding: 8px 16px; border-radius: 6px; border: none; font-size: 13px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px; transition: background-color 0.2s;
    min-width: 90px;
    ${({ $type }) => $type === 'primary' && css` background-color: #007bff; color: white; &:hover { background-color: #0056b3; } `}
    ${({ $type }) => $type === 'secondary' && css` background-color: #6c757d; color: white; &:hover { background-color: #5a6268; } `}
    ${({ $type }) => $type === 'success' && css` background-color: #28a745; color: white; &:hover { background-color: #218838; } `}
`;
const ToggleWrapper = styled.div`
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
    span { font-size: 14px; color: #495057; }
`;
const SwitchLabel = styled.label`
    position: relative; display: inline-block; width: 44px; height: 24px;
    input { opacity: 0; width: 0; height: 0; }
`;
const Slider = styled.span`
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc;
    transition: .4s; border-radius: 24px;
    &:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
    background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + & { background-color: #28a745; }
    input:checked + &:before { transform: translateX(20px); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const MobileUnitSelector = styled.button`
    display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 12px 15px;
    margin-bottom: 20px; border: 1px solid #ced4da; border-radius: 8px; background-color: #fff;
    font-size: 14px; font-weight: 500; color: #495057; cursor: pointer; text-align: left;
    span { flex-grow: 1; margin-left: 10px; }
`;
const ModalBackdrop = styled.div`
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.8);
    display: flex; justify-content: center; align-items: center; z-index: 9999;
    animation: ${fadeIn} 0.3s ease-out;
`;
const ModalContent = styled.div`
    background-color: #f8f9fa; width: 100%; height: 100%; max-width: none; max-height: none;
    border-radius: 0; display: flex; flex-direction: column; overflow: hidden;
    z-index: 9999; box-shadow: none;
`;
const ModalHeader = styled.div`
    padding: 15px 20px; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between;
    align-items: center; background-color: #fff; flex-shrink: 0;
    h4 { margin: 0; font-size: 16px; font-weight: 500; color: #343a40; }
`;
const CloseButton = styled.button`
    background: transparent; border: none; font-size: 20px; color: #6c757d; cursor: pointer; padding: 0;
    line-height: 1;
    &:hover { color: #343a40; }
`;
const ModalBody = styled.div`
    padding: 20px; overflow-y: auto; flex-grow: 1;
`;

const ModalFooter = styled.div`
    padding: 15px 20px;
    border-top: 1px solid #dee2e6;
    display: flex;
    /* CAMBIO: Distribuye los botones en los extremos */
    justify-content: space-between;
    background-color: #fff;
    flex-shrink: 0;
`;

// --- NUEVOS ESTILOS PARA LA BÚSQUEDA DENTRO DEL MODAL ---
const SearchWrapper = styled.div`
    position: relative;
    width: 60%; /* Ocupa una parte del espacio */
`;

const SearchIcon = styled(FaSearch)`
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #adb5bd;
    font-size: 14px;
`;

const ModalSearchInput = styled.input`
    width: 100%;
    padding: 8px 12px 8px 35px; /* Padding para el ícono */
    border-radius: 6px;
    border: 1px solid #dee2e6;
    background-color: #fff;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    &:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
`;