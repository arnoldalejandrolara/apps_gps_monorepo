export const ROUTES = {
    route1: [
        [-97.860900, 22.279267],
        [-97.864403, 22.278461],
        [-97.865380, 22.278161],
        [-97.865396, 22.275079],
        [-97.862619, 22.275134],
        [-97.862569, 22.275908],
        [-97.856866, 22.275927],
        [-97.856377, 22.275397],
        [-97.858075, 22.271174],
        [-97.853479, 22.269702],
        [-97.855268, 22.267378]
        // ...existing ROUTE coordinates...
    ],
    route2: [
        [-97.879090, 22.320516],
        [-97.878544, 22.320543],
        [-97.878537, 22.319633],
        [-97.877702, 22.319667],
        [-97.878450, 22.317260],
        [-97.876602, 22.317257],
        [-97.876313, 22.317322],
        [-97.874340, 22.317316],
        [-97.873442, 22.317177],
        [-97.870244, 22.317167]
        // ...existing ROUTE_2 coordinates...
    ]
};

export const vehicles = [
    {
        id: 'vehicle1',
        model: 'Toyota Corolla',
        route: ROUTES.route1,
        speed: 50,
        color: [255, 0, 0],  // RGB
        info: {
            año: '2022',
            placas: 'ABC-1234',
            modelo: 'Toyota Corolla',
            color: 'Rojo'
        }
    },
    {
        id: 'vehicle2',
        model: 'Ford Ranger',
        route: ROUTES.route2,
        speed: 40,
        color: [0, 0, 255],  // RGB
        info: {
            año: '2023',
            placas: 'XYZ-5678',
            modelo: 'Ford Ranger',
            color: 'Azul'
        }
    }
];