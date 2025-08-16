// import React, { useState ,useRef , useEffect} from 'react';
// import { useSelector } from 'react-redux';

// import styled from 'styled-components';
// import { FaSave } from "react-icons/fa";
// import { IoIosArrowBack } from "react-icons/io";
// import CustomSelect from '../../moleculas/CustomeSelect.jsx';
// import { HexColorPicker } from 'react-colorful';
// import CustomInput from '../../moleculas/InputCustome.jsx';
// import Modal from '../../organismos/Modal';
// // import { verificarSim } from '../../../services/DispositivosService';
// // import { saveChip } from '../../../services/ChipsService';

// // import { getClientesList } from '../../../services/ClientesService.js';
// // import { getTiposGPSList, getTiposUnidadesList, getStatusList, getMarcasList, createDispositivo, updateDispositivo } from '../../../services/DispositivosService.js';
// import CarViewer from '../../moleculas/CarViewer.jsx';

// const hexToRGB = (hex) => {
//     // Remover el # si existe
//     hex = hex.replace('#', '');
    
//     // Convertir a RGB
//     const r = parseInt(hex.substring(0, 2), 16);
//     const g = parseInt(hex.substring(2, 4), 16);
//     const b = parseInt(hex.substring(4, 6), 16);
    
//     return { r, g, b };
// };

// const formatDate = (dateString) => {
//     if (!dateString) return '';
//     return dateString.split('T')[0];
// };

// export function CreateViewCE({ onBack, dispositivoData,onSuccess }) { 
//     const [dateRegister, setdateRegister] = useState("");
//     const [imei, setImei] = useState("");
//     const [nombreUnidad, setNombreUnidad] = useState("");
//     const [modelo, setModelo] = useState("");
//     const [anio, setAnio] = useState("");
//     const [placa, setPlaca] = useState("");
//     const [numSerie, setNumSerie] = useState("");
//     const [instalador, setInstalador] = useState("");
//     const [observaciones, setObservaciones] = useState("");
//     const [fechaRegistro, setFechaRegistro] = useState("");

//     const [color, setColor] = useState('#aabbcc');
//     const [pickerOpen, setPickerOpen] = useState(false);
//     const colorChangeTimeoutRef = useRef(null);

//     const [hasError, setHasError] = useState(false);
//     const [hasErrorImei, setHasErrorImei] = useState(false);
//     const [hasErrorNombreUnidad, setHasErrorNombreUnidad] = useState(false);
//     const [hasErrorTipoGPS, setHasErrorTipoGPS] = useState(false);
//     const [hasErrorTipoDisp, setHasErrorTipoDisp] = useState(false);
//     const [hasErrorSimNumber, setHasErrorSimNumber] = useState(false);
//     const [hasErrorStatus, setHasErrorStatus] = useState(false);

//     const pickerRef = useRef(null); // Ref para el picker

//     const { user, token } = useSelector((state) => state.auth);

//     const [clientesOptions, setClientesOptions] = useState([{ value: 0, label: "Selecciona un cliente" }]);
//     const [tipoGPSOptions, setTipoGPSOptions] = useState([{ value: 0, label: "Selecciona un tipo de GPS" }]);
//     const [tipoDispOptions, setTipoDispOptions] = useState([{ value: 0, label: "Selecciona un tipo de unidad" }]);
//     const [statusOptions, setStatusOptions] = useState([{ value: 0, label: "Selecciona un status" }]);
//     const [marcasOptions, setMarcasOptions] = useState([{ value: 0, label: "Selecciona una marca" }]);

//     const [cliente, setCliente] = useState({ value: 0, label: "Selecciona un cliente" });
//     const [tipoGPS, setTipoGPS] = useState({ value: 0, label: "Selecciona un tipo de GPS" });
//     const [tipoDisp, setTipoDisp] = useState({ value: 0, label: "Selecciona un tipo de unidad" });
//     const [status, setStatus] = useState({ value: 0, label: "Selecciona un status" });
//     const [marca, setMarca] = useState({ value: 0, label: "Selecciona una marca" });

//     const [simNumber, setSimNumber] = useState('');
//     const [simCompany, setSimCompany] = useState('');

//     const [showModal, setShowModal] = useState(false);
//     const [simCompanyModal, setSimCompanyModal] = useState({ value: 0, label: "Selecciona una compañia" });

//     const [simId, setSimId] = useState(null);

//     const [modelUrl, setModelUrl] = useState('');

//     const API_URL = import.meta.env.VITE_API_URL_WEB;

//     const companyOptions = [
//         { value: 0, label: "Selecciona una compañia" },
//         { value: 1, label: 'Telcel' },
//         // Añade más compañías según necesites
//     ];

//     // Objeto para trackear cambios
//     const [modifiedFields, setModifiedFields] = useState({});

//     // Función genérica para manejar cambios y trackear modificaciones
//     const handleInputChange = (fieldName, value, setter) => {
//         setter(value);
        
//         // Solo marcamos como modificado si el valor es diferente al original
//         if (dispositivoData) {
//             const originalValue = dispositivoData[fieldName];
//             if (value !== originalValue) {
//                 setModifiedFields(prev => ({ ...prev, [fieldName]: true }));
//             } else {
//                 setModifiedFields(prev => {
//                     const newState = { ...prev };
//                     delete newState[fieldName];
//                     return newState;
//                 });
//             }
//         }
//     };

//     const initialData = async () => {
//         try {
//             const clientes = await getClientesList(token);
//             const clientesOptions = clientes.data.map(cliente => ({
//                 value: cliente.id,
//                 label: cliente.razon_social
//             }));
//             clientesOptions.unshift({ value: 0, label: "Selecciona un cliente" });
//             setClientesOptions(clientesOptions);

//             const tiposGPS = await getTiposGPSList(token);
//             const tiposGPSOptions = tiposGPS.tipos.map(tipoGPS => ({
//                 value: tipoGPS.id,
//                 label: tipoGPS.marca + " " + tipoGPS.modelo
//             }));
//             tiposGPSOptions.unshift({ value: 0, label: "Selecciona un tipo de GPS" });
//             setTipoGPSOptions(tiposGPSOptions);

//             const tiposUnidades = await getTiposUnidadesList(token);
//             const tiposUnidadesOptions = tiposUnidades.tipos.map(tipoUnidad => ({
//                 value: tipoUnidad.id,
//                 label: tipoUnidad.nombre
//             }));
//             tiposUnidadesOptions.unshift({ value: 0, label: "Selecciona un tipo de unidad" });
//             setTipoDispOptions(tiposUnidadesOptions);

//             const statusResponse = await getStatusList(token);
//             const statusOptions = statusResponse.data.map(status => ({
//                 value: status.id,
//                 label: status.nombre
//             }));
//             statusOptions.unshift({ value: 0, label: "Selecciona un status" });
//             setStatusOptions(statusOptions);

//             const marcasResponse = await getMarcasList(token);
//             const marcasOptions = marcasResponse.data.map(marca => ({
//                 value: marca.id,
//                 label: marca.nombre
//             }));
//             marcasOptions.unshift({ value: 0, label: "Selecciona una marca" });
//             setMarcasOptions(marcasOptions);
//         } catch(error) {
//             console.log(error);
//         }   
//     }

//     useEffect(() => {
//         if(token){
//             initialData();
//         }

//         if(dispositivoData){
//             console.log(dispositivoData);
//             setCliente({ value: dispositivoData.id_cliente, label: dispositivoData.cliente });
//             setImei(dispositivoData.imei);
//             setNombreUnidad(dispositivoData.unidad);
//             setTipoGPS({ value: dispositivoData.id_tipo_gps, label: dispositivoData.tipo_gps });
//             setTipoDisp({ value: dispositivoData.id_unidad_tipo, label: dispositivoData.unidad_tipo });
//             setStatus({ value: dispositivoData.id_status, label: dispositivoData.status });
//             setMarca({ value: dispositivoData.id_unidad_marca || 0, label: dispositivoData.unidad_marca || "Selecciona una marca" });
//             setModelo(dispositivoData.unidad_modelo);
//             setNumSerie(dispositivoData.num_serie);
//             setAnio(dispositivoData.unidad_anio);
//             setPlaca(dispositivoData.placa);
//             setInstalador(dispositivoData.instalador);
//             setObservaciones(dispositivoData.observaciones);
//             setFechaRegistro(formatDate(dispositivoData.created_at));

//             setSimNumber(dispositivoData.chip);
//             setSimCompany(dispositivoData.proveedor_telefonico);
//             setSimId(dispositivoData.id_chip);

//             setColor('#' + dispositivoData.unidad_color);

//             const rgb = hexToRGB(dispositivoData.unidad_color);
//             setModelUrl(`${API_URL}/unidades/model3d?type=car&r=${rgb.r}&g=${rgb.g}&b=${rgb.b}`);

//             // Reiniciamos el tracking de cambios cuando cargamos datos nuevos
//             setModifiedFields({});
//         }
//     }, [token, dispositivoData]);

//     // Cierra el picker si se hace clic fuera de él
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (pickerRef.current && !pickerRef.current.contains(event.target)) {
//                 setPickerOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleSubmit = async () => {
//         if (!cliente.value || cliente.value === 0) {
//             setHasError(true);
//         } else {
//             setHasError(false);
//             // alert(`Has seleccionado: ${client}`);
//             // Aquí puedes manejar el envío de información
//         }

//         // if(!dateRegister){
//         //     setHasErrorFecha(true);
//         // }else{
//         //     setHasErrorFecha(false);
//         // }

//         if(!imei){
//             setHasErrorImei(true);
//         }else{
//             setHasErrorImei(false);
//         }

//         console.log("nombreUnidad está vacío?:", !nombreUnidad || nombreUnidad === "");
//         if(!nombreUnidad || nombreUnidad === ""){
//             setHasErrorNombreUnidad(true);
//         }else{
//             setHasErrorNombreUnidad(false);
//         }

//         if(!tipoGPS.value || tipoGPS.value === 0){
//             setHasErrorTipoGPS(true);
//         }else{
//             setHasErrorTipoGPS(false);
//         }

//         if(!tipoDisp.value || tipoDisp.value === 0){
//             setHasErrorTipoDisp(true);
//         }else{
//             setHasErrorTipoDisp(false);
//         }

//         if(!simNumber || simNumber === ""){
//             setHasErrorSimNumber(true);
//         }else{
//             setHasErrorSimNumber(false);
//         }

//         if(!status.value || status.value === 0){
//             setHasErrorStatus(true);
//         }else{
//             setHasErrorStatus(false);
//         }
        
//         if(!dispositivoData) {
//             const body = {
//                 "id_cliente": cliente.value,
//                 "id_tipo_gps": tipoGPS.value,
//                 "imei": imei.replace(/ /g, ''),
//                 "id_chip": simId,
//                 "acc_on": 0,
//                 "acc_off": 0,
//                 "id_tipo": tipoDisp.value,
//                 "nombre": nombreUnidad,
//                 "id_marca": marca.value,
//                 "modelo": modelo,
//                 "anio": anio,
//                 "placa": placa,
//                 "num_serie": numSerie,
//                 "color": color.replace('#', ''),
//                 "chofer": "",
//                 "instalador": instalador,
//                 "observaciones": observaciones,
//                 "id_status": status.value,
//             };

//             try {
//                 const response = await createDispositivo(token, body);
//                 if(response.status === 200 || response.status === 201){
//                     alert("Dispositivo creado correctamente");
//                     setModifiedFields({});
//                     if (onSuccess) onSuccess(); // <-- Esto recarga la tabla
//                     onBack();
//                 }
//             } catch (error) {
//                 alert(error);
//             }
//         } else {
//             // Para actualización, solo enviamos los campos modificados
//             const updatedFields = {};

//             if (modifiedFields.id_cliente) updatedFields.id_cliente = cliente.value;
//             if (modifiedFields.id_tipo_gps) updatedFields.id_tipo_gps = tipoGPS.value;
//             if (modifiedFields.imei) updatedFields.imei = imei.replace(/ /g, '');
//             if (modifiedFields.id_tipo) updatedFields.id_tipo = tipoDisp.value;
//             if (modifiedFields.nombre) updatedFields.nombre = nombreUnidad;
//             if (modifiedFields.id_marca) updatedFields.id_marca = marca.value;
//             if (modifiedFields.modelo) updatedFields.modelo = modelo;
//             if (modifiedFields.anio) updatedFields.anio = anio;
//             if (modifiedFields.placa) updatedFields.placa = placa;
//             if (modifiedFields.num_serie) updatedFields.num_serie = numSerie;
//             if (modifiedFields.color) updatedFields.color = color.replace('#', '');
//             if (modifiedFields.instalador) updatedFields.instalador = instalador;
//             if (modifiedFields.observaciones) updatedFields.observaciones = observaciones;
//             if (modifiedFields.id_status) updatedFields.id_status = status.value;

//             // Solo actualizamos si hay campos modificados
//             if (Object.keys(updatedFields).length > 0) {
//                 try {
//                     const response = await updateDispositivo(token, dispositivoData.imei, updatedFields);
//                     if(response.status === 200) {
//                         alert("Dispositivo actualizado correctamente");
//                         setModifiedFields({}); // Limpiamos el tracking después de actualizar
//                     } else {
//                         alert(response.message);
//                     }
//                 } catch (error) {
//                     alert(error);
//                 }
//             } else {
//                 alert("No hay cambios para guardar");
//             }
//         }
//     };

//     // const handleSimVerification = async (value) => {
//     //     if (!value) return;
        
//     //     try {
//     //         const response = await verificarSim(value, token);
//     //         if (response.exists) {
//     //             setSimNumber(value);
//     //             setSimCompany(response.data.proveedor_nombre);
//     //             setSimId(response.data.id);
//     //         } else {
//     //             setSimNumber(value);
//     //             setShowModal(true);
//     //         }
//     //     } catch (error) {
//     //         console.error('Error al verificar el SIM:', error);
//     //     }
//     // };

//     // const handleSaveNewSim = async () => {
//     //     try {
//     //         // Aquí irá la llamada a la API para guardar el nuevo SIM
//     //         // Por ahora solo actualizamos el estado
//     //         const chip = {
//     //             "id_cliente": cliente.value,
//     //             "id_proveedor": simCompanyModal.value,
//     //             "numero": simNumber
//     //         }

//     //         console.log(chip);

//     //         if(cliente.value > 0){
//     //             let response = await saveChip(token, chip);
//     //             setSimId(response.data.id);
//     //             alert("Chip guardado correctamente");
//     //         } else {
//     //             alert("No se puede guardar el chip, se requiere un cliente");
//     //         }   

//     //         setSimCompany(simCompanyModal.label);
//     //         setShowModal(false);
//     //     } catch (error) {
//     //         console.error('Error al guardar el SIM:', error);
//     //         alert(error.message);
//     //     }
//     // };

//     const handleColorChange = (newColor) => {
//         handleInputChange('color', newColor, setColor);
        
//         // Clear any existing timeout
//         if (colorChangeTimeoutRef.current) {
//             clearTimeout(colorChangeTimeoutRef.current);
//         }

//         // Set a new timeout
//         colorChangeTimeoutRef.current = setTimeout(() => {
//             const rgb = hexToRGB(newColor);
//             setModelUrl(`${API_URL}/unidades/model3d?type=car&r=${rgb.r}&g=${rgb.g}&b=${rgb.b}`);
//         }, 300);
//     };

//     // // Cleanup timeout on unmount
//     // useEffect(() => {
//     //     return () => {
//     //         if (colorChangeTimeoutRef.current) {
//     //             clearTimeout(colorChangeTimeoutRef.current);
//     //         }
//     //     };
//     // }, []);

//     const handleOnBack = () => {
//         setModifiedFields({});
//         onBack();
//     };

//     return (
//         <Container>
//             <Header>
//                 <BackButton onClick={handleOnBack}>
//                     <IoIosArrowBack style={{ marginRight: '5px' }} />
//                     Regresar
//                 </BackButton>
//                 <SaveButton onClick={handleSubmit}>
//                     <FaSave style={{ marginRight: '5px' }} />
//                     Guardar
//                 </SaveButton>
//             </Header>
//             <Content>
//                 <LeftContainer>

//                     <IconWrapper>
//                         <CarViewer modelUrl={modelUrl} />
//                         <ColorInputWrapper>
//                             <Input
//                                 type="text"
//                                 value={color}
//                                 onClick={() => setPickerOpen(!pickerOpen)}
//                                 readOnly
//                             />
//                             {pickerOpen && (
//                                 <PickerWrapper ref={pickerRef}>
//                                     <HexColorPicker 
//                                         color={color} 
//                                         onChange={handleColorChange}
//                                     />
//                                 </PickerWrapper>
//                             )}
//                         </ColorInputWrapper>
//                     </IconWrapper>

//                 </LeftContainer>

//                 <RightContainer>
//                     <Section>
//                         <Title>Datos del GPS</Title>
//                         <SectionContent>
//                             <Column>
                            
//                                 <CustomSelect
//                                     options={clientesOptions}
//                                     selectedOption={cliente}
//                                     setSelectedOption={(option) => handleInputChange('id_cliente', option, setCliente)}
//                                     placeholder={"Cliente"}
//                                     hasError={hasError}
//                                     setHasError={setHasError}
//                                 />

//                                 <CustomInput 
//                                     placeholder="Fecha de registro"
//                                     value={fechaRegistro} 
//                                     onChange={(e) => setFechaRegistro(e.target.value)}
//                                     disabled
//                                 />

//                                 <CustomInput 
//                                     placeholder="Imei" 
//                                     value={imei}
//                                     onChange={(e) => handleInputChange('imei', e.target.value, setImei)}
//                                     hasError={hasErrorImei}
//                                     setHasError={setHasErrorImei}
//                                 />

//                             </Column>
//                             <Column>
//                                 <CustomInput placeholder="Nombre del dispositivo" value={nombreUnidad} onChange={(e) => handleInputChange('nombre', e.target.value, setNombreUnidad)} hasError={hasErrorNombreUnidad} setHasError={setHasErrorNombreUnidad} />
//                                 <CustomSelect
//                                     options={tipoGPSOptions}
//                                     selectedOption={tipoGPS}
//                                     setSelectedOption={(option) => handleInputChange('id_tipo_gps', option, setTipoGPS)}
//                                     placeholder={"Tipo GPS"}
//                                     hasError={hasErrorTipoGPS}
//                                     setHasError={setHasErrorTipoGPS}
//                                 />
//                                 <CustomSelect
//                                     options={tipoDispOptions}
//                                     selectedOption={tipoDisp}
//                                     setSelectedOption={(option) => handleInputChange('id_tipo', option, setTipoDisp)}
//                                     placeholder={"Tipo Unidad"}
//                                     hasError={hasErrorTipoDisp}
//                                     setHasError={setHasErrorTipoDisp}
//                                 />
//                             </Column>
//                         </SectionContent>
//                     </Section>

//                     <Section>
//                         <Title>Datos adicionales del GPS</Title>
//                         <SectionContent>
//                             <Column>
//                                 <CustomInput 
//                                     placeholder="No. SIM" 
//                                     value={simNumber}
//                                     onChange={(e) => setSimNumber(e.target.value)}
//                                     onBlur={(e) => handleSimVerification(e.target.value)}
//                                     hasError={hasErrorSimNumber}
//                                     setHasError={setHasErrorSimNumber}
//                                 />
//                                 <Input 
//                                     placeholder="Compañia SIM" 
//                                     value={simCompany}
//                                     disabled
//                                 />
//                                 <CustomSelect
//                                     options={statusOptions}
//                                     selectedOption={status}
//                                     setSelectedOption={(option) => handleInputChange('id_status', option, setStatus)}
//                                     placeholder={"Status del dispositivo"}
//                                     hasError={hasErrorStatus}
//                                     setHasError={setHasErrorStatus}
//                                 />
//                             </Column>
//                             <Column>
//                                 <Input placeholder="Instalador" value={instalador} onChange={(e) => handleInputChange('instalador', e.target.value, setInstalador)} />
//                                 <Input placeholder="Observaciones" value={observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value, setObservaciones)} />
//                             </Column>
//                         </SectionContent>
//                     </Section>


//                     <Section>
//                         <Title>Informacion de Vehiculo</Title>
//                         <SectionContent>
//                             <Column>
//                                 <CustomSelect
//                                     options={marcasOptions}
//                                     selectedOption={marca}
//                                     setSelectedOption={(option) => handleInputChange('id_marca', option, setMarca)}
//                                     placeholder={"Marca"}
//                                 />
//                                 <Input 
//                                     placeholder="Submarca" 
//                                     value={modelo} 
//                                     onChange={(e) => handleInputChange('modelo', e.target.value, setModelo)} 
//                                 />
//                                 <Input 
//                                     placeholder="No. Serie" 
//                                     value={numSerie} 
//                                     onChange={(e) => handleInputChange('num_serie', e.target.value, setNumSerie)} 
//                                 />

//                             </Column>
//                             <Column>
//                                 <Input 
//                                     placeholder="Año" 
//                                     value={anio} 
//                                     onChange={(e) => handleInputChange('anio', e.target.value, setAnio)} 
//                                 />
//                                 <Input 
//                                     placeholder="Placa" 
//                                     value={placa} 
//                                     onChange={(e) => handleInputChange('placa', e.target.value, setPlaca)} 
//                                 />
//                             </Column>
//                         </SectionContent>
//                     </Section>


                    
//                 </RightContainer>
//             </Content>
//             {showModal && (
//                 <Modal
//                     isOpen={showModal}
//                     onClose={() => setShowModal(false)}
//                     title="Nuevo SIM detectado"
//                     onSave={handleSaveNewSim}
//                 >
//                     <ModalContent>
//                         <p>El número {simNumber} no está registrado. Por favor, selecciona la compañía:</p>
//                         <CustomSelect
//                             options={companyOptions}
//                             selectedOption={simCompanyModal}
//                             setSelectedOption={setSimCompanyModal}
//                             placeholder="Compañía telefonica"
//                         />
//                     </ModalContent>
//                 </Modal>
//             )}
//         </Container>
//     );
// }

// function getColorHue(color) {
//     switch (color) {
//         case 'Negro':
//             return 0;
//         case 'Rojo':
//             return 0;
//         case 'Azul':
//             return 240;
//         case 'Verde':
//             return 120;
//         default:
//             return 0;
//     }
// }

// const PickerWrapper = styled.div`
//     position: absolute;
//     bottom: 80px;
//     left: 0;
//     z-index: 100;
//     background: transparent;
//     border: 1px solid #ccc;
//     border-radius: 4px;
//     // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//     padding: 10px;

//      // Quitar cualquier contorno o borde blanco
//     outline: none; // Elimina el contorno blanco (si existe)
//     border: none;  // Elimina cualquier borde visible
// `;

// const ColorInputWrapper = styled.div`
//     position: relative;
//     margin-top: 20px;
// `;


// const IconWrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 10px;
// `;



// const Container = styled.div`
//     display: flex;
//     flex-direction: column;
//     height: 100vh;
//     padding: 20px 50px;
//     box-sizing: border-box; /* Asegura que el padding no exceda el tamaño */
//     color: white;
// `;

// const Header = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 15px;
// `;

// const BackButton = styled.button`
//     padding: 10px 15px;
//     background-color: transparent;
//     color: white;
//     border: none;
//     border-radius: 8px;
//     cursor: pointer;

//     &:hover {
//         background-color: #28323D;
//     }
// `;

// const SaveButton = styled.button`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding: 10px 15px;
//     background-color: #28a745;
//     color: white;
//     border: none;
//     border-radius: 8px;
//     cursor: pointer;

//     &:hover {
//         background-color: #218838;
//     }
// `;

// const Content = styled.div`
//     display: flex;
//     flex: 1;
//     gap: 40px;
//     overflow: hidden; /* Evita scroll no deseado */
// `;

// const LeftContainer = styled.div`
//     flex: 2;
//     display: flex;
//     justify-content: center;
//     align-items: start;
//     background: #1C252E;
//     border-radius: 8px;
// `;

// const RightContainer = styled.div`
//     flex: 4;
//     display: flex;
//     flex-direction: column;
//     gap: 30px;
//     background: #1C252E;
//     padding: 25px 30px;
//     border-radius: 8px;
//     overflow-y: auto;
//     max-height: calc(100vh - 180px); /* Ajusta la altura máxima */

// `;

// const Section = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
// `;

// const Title = styled.h2`
//     font-size: 13px;
//     color: #637381;
//     font-weight: 500;
// `;

// const SectionContent = styled.div`
//     display: flex;
//     gap: 20px;
// `;

// const Column = styled.div`
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     gap: 25px;
// `;

// const Input = styled.input`
//     padding: 10px;
//     height: 50px;
//     font-size: 13px;
//     border: 1px solid #333D47;
//     border-radius: 8px;
//     outline: none;
//     background: transparent;
//     color: white;

//     &::placeholder {
//         color: #aaa;
//     }

//       &:hover {
//         border-color: #ffffff;
//     }
// `;

// const ModalContent = styled.div`
//     padding: 20px;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;

//     p {
//         color: #fff;
//         font-size: 14px;
//     }
// `;

// export default CreateViewCE;