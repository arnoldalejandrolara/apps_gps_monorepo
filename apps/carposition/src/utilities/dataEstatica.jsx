
import { v } from "./variables";

import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineBell,
  AiOutlineAlert,
  AiOutlineEnter
} from "react-icons/ai";
import { FaRegMap } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { GoFileSymlinkFile } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSync } from "react-icons/io5";


export const DesplegableUser = [
  {
    text: "Mi perfil",
    icono: <v.iconoUser/>,
    tipo: "miperfil",
  },
  {
    text: "Configuracion",
    icono: <v.iconoSettings/>,
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: <v.iconoCerrarSesion/>,
    tipo: "cerrarsesion",
  },
];



//data SIDEBAR
export const LinksArray = [
  {
    label: "Dashboard",
    icon: <RxDashboard />,
    to: "/dashboard",
  },
  // {
  //   label: "Notificaciones",
  //   icon: <AiOutlineBell />,
  //   to: "/notificaciones",
  // },
  
];

export const LinksArray2 = [
  // {
  //   label: "Mapa",
  //   icon: <FaRegMap />,
  //   to: "/",
  // },
  {
    label: "Reportes",
    icon: <v.iconoreportes />,
    to: "/reportes",
  },
  {
    label: "Cuentas Espejo",
    icon: <IoSync />,
    to: "/cuentas-espejo",
  },
  {
    label: "Configuracion",
    icon: <IoSettingsOutline />,
    to: "/configuracion",
  },
  // {
  //   label: "Puntos de interes",
  //   icon: <v.iconoPuntoInteres />,
  //   to: "/puntos-interes",
  // },
  // {
  //   label: "Geocercas",
  //   icon: <v.iconoGeocerca />,
  //   to: "/geocercas",
  // },

  // {
  //   label: "Eventos",
  //   icon: <AiOutlineAlert />,
  //   to: "/eventos",
  // },
]

export const SecondarylinksArray = [
  {
    label: "Configuración",
    icon: <AiOutlineSetting />,
    to: "/configurar",
  },
  // {
  //   label: "Salir",
  //   icon: <AiOutlineEnter />,
  //   to: "/salir",
  // },
 

];
//temas
export const TemasData = [
  {
    icono: "🌞",
    descripcion: "light",
   
  },
  {
    icono: "🌚",
    descripcion: "dark",
    
  },
];

//data configuracion
export const DataModulosConfiguracion =[
  {
    title:"Productos",
    subtitle:"registra tus productos",
    icono:"https://i.ibb.co/85zJ6yG/caja-del-paquete.png",
    link:"/configurar/productos",
   
  },
  {
    title:"Personal",
    subtitle:"ten el control de tu personal",
    icono:"https://i.ibb.co/5vgZ0fX/hombre.png",
    link:"/configurar/usuarios",
   
  },

  {
    title:"Tu empresa",
    subtitle:"configura tus opciones básicas",
    icono:"https://i.ibb.co/x7mHPgm/administracion-de-empresas.png",
    link:"/configurar/empresa",
    
  },
  {
    title:"Categoria de productos",
    subtitle:"asigna categorias a tus productos",
    icono:"https://i.ibb.co/VYbMRLZ/categoria.png",
    link:"/configurar/categorias",
    
  },
  {
    title:"Marca de productos",
    subtitle:"gestiona tus marcas",
    icono:"https://i.ibb.co/1qsbCRb/piensa-fuera-de-la-caja.png",
    link:"/configurar/marca",
   
  },

]
//tipo usuario
export const TipouserData = [
  {
    descripcion: "empleado",
    icono: "🪖",
  },
  {
    descripcion: "administrador",
    icono: "👑",
  },
];
//tipodoc
export const TipoDocData = [
  {
    descripcion: "Dni",
    icono: "🪖",
  },
  {
    descripcion: "Libreta electoral",
    icono: "👑",
  },
  {
    descripcion: "Otros",
    icono: "👑",
  },
];


export const slides = [
  [
      "Elemento_1",
      "Elemento_2",
  ],
  [
      "Elemento_3",
      "Elemento_4",
  ],
  [
      "Elemento_5",
      "Elemento_6",
      "Elemento_7",
      // "Elemento_8",
      // "Elemento_9",
      // "Elemento_10",
      //  "Elemento_11"
  ]
];

export const filterIcons = {
  "Actualizado": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  "Ordenar": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  ),
};