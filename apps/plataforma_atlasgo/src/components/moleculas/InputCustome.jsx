import React from 'react';
import styled from 'styled-components';
import { RiErrorWarningLine } from "react-icons/ri";
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import esLocale from "date-fns/locale/es";

// --------------------
// Dark theme for MUI
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            paper: "#181818",
            default: "red",
        },
        text: {
            primary: "#fff",
            secondary: "#a9a9a9"
        },
        primary: {
            main: "#696969"
        }
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: "#202020",
                    color: "#fff",
                },
                input: {
                    color: "#fff",
                    caretColor: "#fff"
                },
                adornedEnd: {
                    color: "#fff"
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: "#696969"
                },
                root: {
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'red'
                    }
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: "#fff"
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#a9a9a9"
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: "#181818",
                    color: "#fff"
                },
            }
        },
        // <<< BACKDROP MÁS TRANSPARENTE >>>
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(30, 30, 30, 0.05)" // mucho más transparente, apenas visible
                }
            }
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    color: "#fff",
                }
            }
        }
    }
});
// --------------------

// Convierte "DD/MM/AAAA HH:mm" a Date
function stringToDate(str) {
    if (!str) return null;
    const [datePart, timePart] = str.split(' ');
    if (!datePart) return null;
    const [day, month, year] = datePart.split('/');
    if (!day || !month || !year) return null;
    let hours = 0, minutes = 0;
    if (timePart) {
        [hours, minutes] = timePart.split(':').map(Number);
    }
    const date = new Date(year, Number(month) - 1, day, hours, minutes);
    return isNaN(date) ? null : date;
}

// Convierte Date a "DD/MM/AAAA HH:mm"
function dateToString(date) {
    if (!(date instanceof Date) || isNaN(date)) return '';
    const d = date.toLocaleDateString('es-ES');
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${d} ${h}:${m}`;
}

// Hook para detectar mobile
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = React.useState(
        typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
    );
    React.useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= breakpoint);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);
    return isMobile;
}

const CustomInput = ({
    placeholder,
    value,
    onChange,
    onBlur,
    type = 'text',
    hasError = false,
    setHasError,
    disabled = false
}) => {
    const isMobile = useIsMobile();

    const handleChange = (e) => {
        let inputValue = e.target.value;

        if (type === 'date') {
            inputValue = inputValue.replace(/[^0-9 :]/g, '');
            if (inputValue.length > 2) {
                inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
            }
            if (inputValue.length > 5) {
                inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5, 9);
            }
            if (inputValue.length > 10) {
                inputValue = inputValue.slice(0, 10) + ' ' + inputValue.slice(10);
            }
            if (inputValue.length > 13) {
                inputValue = inputValue.slice(0, 13) + ':' + inputValue.slice(13, 15);
            }
            inputValue = inputValue.slice(0, 16);

            const event = { ...e, target: { ...e.target, value: inputValue } };
            onChange(event);
        } else {
            onChange(e);
        }

        if (hasError && setHasError) {
            setHasError(false);
        }
    };

    // --- MUI DateTime Picker ---
    if (type === 'date') {
        const dateValue = value ? stringToDate(value) : null;
        const PickerComponent = isMobile ? MobileDateTimePicker : DateTimePicker;
        const pickerProps = isMobile
            ? {
                slotProps: {
                    textField: {
                        label: placeholder,
                        error: hasError,
                        helperText: hasError ? 'Fecha inválida' : undefined,
                        sx: {
                            width: '100%',
                            input: { color: "#fff" }, // texto input blanco
                            svg: { color: "#fff" }, // icono blanco
                        },
                        InputLabelProps: { style: { color: "#a9a9a9" } }, // placeholder gris
                    },
                    dialog: {
                        sx: {
                            zIndex: 3001,
                            background: "#181818",
                            color: "#fff"
                        },
                    }
                }
            }
            : {
                slotProps: {
                    textField: {
                        label: placeholder,
                        error: hasError,
                        helperText: hasError ? 'Fecha inválida' : undefined,
                        sx: {
                            width: '100%',
                            input: { color: "#fff" },
                            svg: { color: "#fff" },
                        },
                        InputLabelProps: { style: { color: "#a9a9a9" } },
                    },
                    popper: {
                        sx: { zIndex: 3000 },
                    }
                }
            };

        return (
            <InputWrapper>
                <InputWrapperInner>
                    <ThemeProvider theme={darkTheme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                            <PickerComponent
                                value={dateValue}
                                onChange={(newValue) => {
                                    if (onChange) {
                                        const dateString = dateToString(newValue);
                                        onChange({ target: { value: dateString } });
                                    }
                                    if (hasError && setHasError) setHasError(false);
                                }}
                                onBlur={onBlur}
                                disabled={disabled}
                                format="dd/MM/yyyy HH:mm"
                                {...pickerProps}
                            />
                        </LocalizationProvider>
                    </ThemeProvider>
                    {hasError && (
                        <ErrorIcon>
                            <RiErrorWarningLine style={{ fontSize: "20px", color: "red" }} />
                        </ErrorIcon>
                    )}
                </InputWrapperInner>
            </InputWrapper>
        );
    }

    // --- Input normal ---
    return (
        <InputWrapper>
            <InputWrapperInner>
                <Placeholder $isActive={!!value}>
                    {placeholder}
                </Placeholder>
                <StyledInput
                    type={type}
                    value={value ?? ""}
                    onChange={handleChange}
                    onBlur={onBlur}
                    $hasError={hasError}
                    disabled={disabled}
                />
                {hasError && (
                    <ErrorIcon>
                        <RiErrorWarningLine style={{ fontSize: "20px", color: "red" }} />
                    </ErrorIcon>
                )}
            </InputWrapperInner>
        </InputWrapper>
    );
};

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const InputWrapperInner = styled.div`
    position: relative;
    height: 50px;
`;

const StyledInput = styled.input`
    width: 100%;
    height: 100%;
    background: #202020;
    color: white;
    border-radius: 8px;
    border: 1px solid ${({ $hasError }) => ($hasError ? "red" : "#696969")};
    padding: 12px;
    font-size: 13px;
    outline: none;

    &:hover {
        border-color: #ffffff;
    }

    &:disabled {
        color: #696969;
        background: rgba(160, 160, 160, 0.15);
        cursor: not-allowed;
    }
`;

const Placeholder = styled.span`
    position: absolute;
    left: 12px;
    top: ${({ $isActive }) => ($isActive ? "-10px" : "50%")};
    transform: translateY(${({ $isActive }) => ($isActive ? "0" : "-50%")});
    font-size: ${({ $isActive }) => ($isActive ? "11px" : "13px")};
    font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
    color: ${({ $isActive }) => ($isActive ? "#a9a9a9" : "#696969")};
    transition: all 0.3s ease;
    background-color: #202020;
    padding: ${({ $isActive }) => ($isActive ? "0 5px" : "0")};
    pointer-events: none;
`;

const ErrorIcon = styled.div`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
`;

export default CustomInput;