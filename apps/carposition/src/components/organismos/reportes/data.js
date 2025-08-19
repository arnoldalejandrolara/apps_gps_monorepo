const STATUS_ON_DECK = { id: 1, name: "On Deck", color: "blue.300" };
const STATUS_IN_PROGRESS = {
  id: 2,
  name: "In Progress",
  color: "yellow.400",
};
const STATUS_TESTING = { id: 3, name: "Testing", color: "pink.300" };
const STATUS_DEPLOYED = { id: 4, name: "Deployed", color: "green.300" };

export const STATUSES = [
  STATUS_ON_DECK,
  STATUS_IN_PROGRESS,
  STATUS_TESTING,
  STATUS_DEPLOYED,
];

const DATA = [
  {
    task: "Add a New Feature",
    status: STATUS_ON_DECK,
    due: new Date("2023/10/15"),
    notes: "This is a note",
  },
  {
    task: "Write Integration Tests",
    status: STATUS_IN_PROGRESS,
    due: null,
    notes: "Use Jest",
  },
  {
    task: "Add Instagram Integration",
    status: STATUS_DEPLOYED,
    due: null,
    notes: "",
  },
  {
    task: "Cleanup Database",
    status: null,
    due: new Date("2023/02/15"),
    notes: "Remove old data",
  },
  {
    task: "Refactor API Endpoints",
    status: STATUS_TESTING,
    due: null,
    notes: "",
  },
  {
    task: "Add Documentation to API",
    status: null,
    due: new Date("2023/09/12"),
    notes: "Add JS Docs to all endpoints",
  },
  {
    task: "Update NPM Packages",
    status: STATUS_IN_PROGRESS,
    due: null,
    notes: "Upgrade React & Chakra UI",
  },
  {
    task: "Optimize Database Queries",
    status: STATUS_IN_PROGRESS,
    due: null,
    notes: "Optimize slow queries.",
  },
  {
    task: "Implement User Authentication",
    status: STATUS_ON_DECK,
    due: new Date("2023/11/08"),
    notes: "OAuth2 and JWT auth.",
  },
  {
    task: "Design User Interface Mockups",
    status: null,
    due: new Date("2023/09/30"),
    notes: "Create UI mockups.",
  },
  {
    task: "Fix Cross-Browser Compatibility Issues",
    status: STATUS_IN_PROGRESS,
    due: null,
    notes: "Resolve browser issues.",
  },
  {
    task: "Perform Security Audit",
    status: null,
    due: new Date("2023/10/22"),
    notes: "Security audit.",
  },
  {
    task: "Create User Onboarding Tutorial",
    status: STATUS_ON_DECK,
    due: new Date("2023/11/15"),
    notes: "User onboarding guide.",
  },
  {
    task: "Optimize Frontend Performance",
    status: STATUS_IN_PROGRESS,
    due: null,
    notes: "Improve performance.",
  },
  {
    task: "Conduct Code Review",
    status: null,
    due: new Date("2023/10/05"),
    notes: "Code review meeting.",
  },
  {
    task: "Implement Continuous Integration",
    status: STATUS_ON_DECK,
    due: new Date("2023/11/01"),
    notes: "Set up CI/CD pipelines.",
  },
  {
    task: "Migrate to Cloud Hosting",
    status: STATUS_DEPLOYED,
    due: null,
    notes: "Cloud migration.",
  },
  {
    task: "Create User Feedback Survey",
    status: null,
    due: new Date("2023/09/25"),
    notes: "User feedback survey.",
  },
  {
    task: "Update User Documentation",
    status: STATUS_TESTING,
    due: null,
    notes: "Revise documentation.",
  },
  {
    task: "Bug Fixing and QA Testing",
    status: null,
    due: new Date("2023/10/10"),
    notes: "Fix bugs and QA.",
  },
  {
    task: "Implement Mobile App Support",
    status: STATUS_IN_PROGRESS,
    due: null,
    notes: "Add mobile support.",
  },
  {
    task: "Refine User Permission System",
    status: null,
    due: new Date("2023/09/18"),
    notes: "Enhance permissions.",
  },
];



export const registros = [
  {
    "fecha": "2025-05-30T08:15:00Z",
    "unidad": "Camión 01",
    "velocidad": 65,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Norte",
    "coordenadas": {"lat": 19.432608, "lng": -99.133209},
    "odometro": 15340,
    "horometro": 520,
    "detenido": false,
    "direccion": "Av. Insurgentes Sur 1234, CDMX"
  },
  {
    "fecha": "2025-05-30T08:45:00Z",
    "unidad": "Camión 02",
    "velocidad": 0,
    "status_motor": "Apagado",
    "alerta": "Detenido",
    "orientacion": "Este",
    "coordenadas": {"lat": 19.427025, "lng": -99.167665},
    "odometro": 20400,
    "horometro": 780,
    "detenido": true,
    "direccion": "Calle Reforma 456, CDMX"
  },
  {
    "fecha": "2025-05-30T09:30:00Z",
    "unidad": "Pickup 01",
    "velocidad": 42,
    "status_motor": "Encendido",
    "alerta": "Velocidad alta",
    "orientacion": "Sur",
    "coordenadas": {"lat": 19.370172, "lng": -99.180836},
    "odometro": 9800,
    "horometro": 320,
    "detenido": false,
    "direccion": "Av. División del Norte 789, CDMX"
  },
  {
    "fecha": "2025-05-30T10:10:00Z",
    "unidad": "Van 01",
    "velocidad": 30,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Oeste",
    "coordenadas": {"lat": 19.362239, "lng": -99.090232},
    "odometro": 21000,
    "horometro": 1100,
    "detenido": false,
    "direccion": "Av. Tláhuac 321, CDMX"
  },
  {
    "fecha": "2025-05-30T11:00:00Z",
    "unidad": "Camión 03",
    "velocidad": 0,
    "status_motor": "Encendido",
    "alerta": "Puerta abierta",
    "orientacion": "Noreste",
    "coordenadas": {"lat": 19.345984, "lng": -99.157789},
    "odometro": 18560,
    "horometro": 940,
    "detenido": true,
    "direccion": "Calle Lago Mayor 12, CDMX"
  },
  {
    "fecha": "2025-05-30T12:30:00Z",
    "unidad": "Pickup 02",
    "velocidad": 55,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Noroeste",
    "coordenadas": {"lat": 19.406092, "lng": -99.160297},
    "odometro": 11230,
    "horometro": 400,
    "detenido": false,
    "direccion": "Av. Coyoacán 1345, CDMX"
  },
  {
    "fecha": "2025-05-30T13:18:00Z",
    "unidad": "Van 02",
    "velocidad": 38,
    "status_motor": "Encendido",
    "alerta": "Mantenimiento requerido",
    "orientacion": "Sur",
    "coordenadas": {"lat": 19.410019, "lng": -99.119295},
    "odometro": 16890,
    "horometro": 670,
    "detenido": false,
    "direccion": "Calle Universidad 222, CDMX"
  },
  {
    "fecha": "2025-05-30T14:00:00Z",
    "unidad": "Camión 01",
    "velocidad": 20,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Oeste",
    "coordenadas": {"lat": 19.433456, "lng": -99.143210},
    "odometro": 15410,
    "horometro": 523,
    "detenido": false,
    "direccion": "Av. Patriotismo 356, CDMX"
  },
  {
    "fecha": "2025-05-30T15:05:00Z",
    "unidad": "Camión 02",
    "velocidad": 0,
    "status_motor": "Apagado",
    "alerta": "Desconectado",
    "orientacion": "Norte",
    "coordenadas": {"lat": 19.486321, "lng": -99.203456},
    "odometro": 20425,
    "horometro": 785,
    "detenido": true,
    "direccion": "Av. Central 19, CDMX"
  },
  {
    "fecha": "2025-05-30T16:20:00Z",
    "unidad": "Pickup 01",
    "velocidad": 47,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Este",
    "coordenadas": {"lat": 19.372019, "lng": -99.198201},
    "odometro": 9852,
    "horometro": 324,
    "detenido": false,
    "direccion": "Calle Xola 800, CDMX"
  }
  ,
  {
    "fecha": "2025-05-30T16:20:00Z",
    "unidad": "Pickup 01",
    "velocidad": 47,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Este",
    "coordenadas": {"lat": 19.372019, "lng": -99.198201},
    "odometro": 9852,
    "horometro": 324,
    "detenido": false,
    "direccion": "Calle Xola 800, CDMX"
  },
  {
    "fecha": "2025-05-30T16:20:00Z",
    "unidad": "Pickup 01",
    "velocidad": 47,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Este",
    "coordenadas": {"lat": 19.372019, "lng": -99.198201},
    "odometro": 9852,
    "horometro": 324,
    "detenido": false,
    "direccion": "Calle Xola 800, CDMX"
  },
  {
    "fecha": "2025-05-30T16:20:00Z",
    "unidad": "Pickup 01",
    "velocidad": 47,
    "status_motor": "Encendido",
    "alerta": "Ninguna",
    "orientacion": "Este",
    "coordenadas": {"lat": 19.372019, "lng": -99.198201},
    "odometro": 9852,
    "horometro": 324,
    "detenido": false,
    "direccion": "Calle Xola 800, CDMX"
  }
]

export const rowCuentasEspejo = 
[
  {
    "checkbox": false,
    "codigo": "CE-001",
    "creado_por": "juan.perez",
    "nombre": "Cuenta Espejo 1",
    "unidad": "Unidad Norte",
    "expiracion": "2025-12-31",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-002",
    "creado_por": "ana.garcia",
    "nombre": "Cuenta Espejo 2",
    "unidad": "Unidad Sur",
    "expiracion": "2025-11-15",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-003",
    "creado_por": "mario.lopez",
    "nombre": "Cuenta Espejo 3",
    "unidad": "Unidad Este",
    "expiracion": "2025-10-10",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-004",
    "creado_por": "laura.mendez",
    "nombre": "Cuenta Espejo 4",
    "unidad": "Unidad Oeste",
    "expiracion": "2025-09-05",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-005",
    "creado_por": "carlos.ramirez",
    "nombre": "Cuenta Espejo 5",
    "unidad": "Unidad Centro",
    "expiracion": "2026-01-20",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-006",
    "creado_por": "sofia.ruiz",
    "nombre": "Cuenta Espejo 6",
    "unidad": "Unidad Norte",
    "expiracion": "2025-08-18",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-007",
    "creado_por": "fernando.gomez",
    "nombre": "Cuenta Espejo 7",
    "unidad": "Unidad Sur",
    "expiracion": "2026-02-14",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-008",
    "creado_por": "valeria.torres",
    "nombre": "Cuenta Espejo 8",
    "unidad": "Unidad Este",
    "expiracion": "2025-07-30",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-009",
    "creado_por": "daniel.santos",
    "nombre": "Cuenta Espejo 9",
    "unidad": "Unidad Oeste",
    "expiracion": "2026-03-22",
    "options": null
  },
  {
    "checkbox": false,
    "codigo": "CE-010",
    "creado_por": "mariana.morales",
    "nombre": "Cuenta Espejo 10",
    "unidad": "Unidad Centro",
    "expiracion": "2025-06-18",
    "options": null
  }
]

export default DATA;
