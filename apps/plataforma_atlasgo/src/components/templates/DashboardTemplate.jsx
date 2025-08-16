import React from 'react';
import styled from 'styled-components';

// Se importa tu componente ya existente
import { StatCard } from '../organismos/grids/StatCard'; 

// Importamos los NUEVOS componentes que crearemos
import { DonutChartCard } from '../organismos/grids/DonutChartCard';
import { AreaInstalledCard } from '../organismos/grids/AreaInstalledCard';
import { ServerUptime } from '../organismos/grids/ServerUptime';
import { PieRetentionUser } from '../organismos/grids/PieRetentionUser';
// Estilos del layout principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  background: #171717;
  box-sizing: border-box;
  color: white;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1400px; 
  margin-left: auto;
  margin-right: auto;
`;

// Contenedores del Grid
const GridItemLarge2 = styled.div`
  background: #1F1F1F; color: white; padding: 20px; border-radius: 12px;
  grid-column: span 1; height: 470px;
`;
const GridItemMedium = styled.div`
  background: #1C252E; color: white; padding: 20px; border-radius: 12px;
  grid-column: span 2; height: 280px;
`;
const GridItemMedium2 = styled.div`
  background: #1F1F1F; color: white; padding: 20px; border-radius: 12px;
  grid-column: span 2; height: 470px;
`;
const GridItemSmall = styled.div`
  background: #1C252E; color: white; padding: 15px; border-radius: 12px;
  grid-column: span 1; height: 280px;
`;


export function DashboardTemplate() {
  // Datos para las tarjetas de estadísticas
  const statsData = [
    { title: 'Total active users', value: 18765, change: 2.6, chartColor: "#34D399", chartData: [{value: 40}, {value: 30}, {value: 50}, {value: 45}, {value: 60}, {value: 70}] },
    { title: 'Total installed', value: 4876, change: 0.2, chartColor: "#60A5FA", chartData: [{value: 20}, {value: 30}, {value: 25}, {value: 45}, {value: 40}, {value: 50}] },
    { title: 'Total downloads', value: 678, change: -0.1, chartColor: "#F97316", chartData: [{value: 30}, {value: 20}, {value: 40}, {value: 10}, {value: 50}, {value: 5}] },
  ];
  
  const donutData = [
    { name: 'Mac', value: 20, color: '#A7F3D0' },      // Verde claro
    { name: 'Window', value: 35, color: '#6EE7B7' }, // Verde medio
    { name: 'iOS', value: 25, color: '#34D399' },    // Verde más oscuro
    { name: 'Android', value: 45, color: '#10B981' },// Verde azulado
  ];

    // --- DATOS PARA EL NUEVO GRÁFICO ---
    const areaInstalledLegend = [
      { name: 'Asia', total: '1.23k', color: '#22C55E' },
      { name: 'Europe', total: '6.79k', color: '#FACC15' },
      { name: 'Americas', total: '1.01k', color: '#67E8F9' },
    ];
  

  const areaInstalledChartData = [
    { name: 'Jan', asia: 5, europe: 8, americas: 5 },
    { name: 'Feb', asia: 18, europe: 18, americas: 17 },
    { name: 'Mar', asia: 13, europe: 15, americas: 14 },
    { name: 'Apr', asia: 8, europe: 10, americas: 9 },
    { name: 'May', asia: 20, europe: 20, americas: 19 },
    { name: 'Jun', asia: 3, europe: 9, americas: 6 },
    { name: 'Jul', asia: 22, europe: 22, americas: 21 },
    { name: 'Aug', asia: 19, europe: 19, americas: 18 },
    { name: 'Sep', asia: 7, europe: 9, americas: 8 },
    { name: 'Oct', asia: 22, europe: 22, americas: 21 },
    { name: 'Nov', asia: 7, europe: 9, americas: 8 },
    { name: 'Dec', asia: 17, europe: 17, americas: 16 },
  ];

   // --- DATOS PARA SERVER UPTIME ---
   const serverUptimeLegend = [
    { name: 'Primary Server', total: '99.92%', color: '#60A5FA' }, // Azul
    { name: 'Backup Server', total: '99.98%', color: '#34D399' }, // Verde
  ];

  const serverUptimeChartData = [
    // Simulación de los últimos 30 días
    { name: 'Day 1', primary: 100, backup: 100 },
    { name: 'Day 2', primary: 100, backup: 100 },
    { name: 'Day 3', primary: 99.8, backup: 100 }, // Pequeña incidencia
    { name: 'Day 4', primary: 100, backup: 100 },
    { name: 'Day 5', primary: 100, backup: 100 },
    { name: 'Day 6', primary: 100, backup: 99.9 },
    { name: 'Day 7', primary: 100, backup: 100 },
    { name: 'Day 8', primary: 100, backup: 100 },
    { name: 'Day 9', primary: 98.5, backup: 100 }, // Incidencia mayor
    { name: 'Day 10', primary: 100, backup: 100 },
    { name: 'Day 11', primary: 100, backup: 100 },
    { name: 'Day 12', primary: 100, backup: 100 },
    { name: 'Day 13', primary: 100, backup: 99.7 },
    { name: 'Day 14', primary: 100, backup: 100 },
    { name: 'Day 15', primary: 100, backup: 100 },
    { name: 'Day 16', primary: 100, backup: 100 },
    { name: 'Day 17', primary: 99.9, backup: 100 },
    { name: 'Day 18', primary: 100, backup: 100 },
    { name: 'Day 19', primary: 100, backup: 100 },
    { name: 'Day 20', primary: 99.6, backup: 99.8 }, // Ambas con incidencias
    { name: 'Day 21', primary: 100, backup: 100 },
    { name: 'Day 22', primary: 100, backup: 100 },
    { name: 'Day 23', primary: 100, backup: 100 },
    { name: 'Day 24', primary: 100, backup: 100 },
    { name: 'Day 25', primary: 100, backup: 99.9 },
    { name: 'Day 26', primary: 100, backup: 100 },
    { name: 'Day 27', primary: 99.2, backup: 100 },
    { name: 'Day 28', primary: 100, backup: 100 },
    { name: 'Day 29', primary: 100, backup: 100 },
    { name: 'Day 30', primary: 100, backup: 100 },
  ];


  const userRetentionData = [
    { name: 'Returning Users', value: 1250, color: '#2563EB' }, // Azul oscuro
    { name: 'New Users', value: 850, color: '#60A5FA' },       // Azul medio
    { name: 'Churned Users', value: 350, color: '#93C5FD' },     // Azul claro
  ];
  


  return (
    <Container>
      <GridContainer>
        {/* Fila 1: Tarjetas de estadísticas (usando tu componente importado) */}
        {statsData.map((stat, index) => (<StatCard key={index} {...stat} />))}
        
        {/* Fila 2: Gráfico de áreas y gráfico de dona */}
        <GridItemLarge2>

        <DonutChartCard
              title="Current download"
              subtitle="Downloaded by operating system"
              data={donutData}
              totalValue="188,245"
            />
        </GridItemLarge2>

        <GridItemMedium2>
        <AreaInstalledCard
            title="Area installed"
            subtitle="(+43%) than last year"
            legendData={areaInstalledLegend}
            chartData={areaInstalledChartData}
          />
        </GridItemMedium2>
        
        {/* Fila 3: Contenedores restantes */}
        <GridItemMedium2>
        <ServerUptime
            title="Server Uptime"
            subtitle="Last 30 days"
            legendData={serverUptimeLegend} 
            chartData={serverUptimeChartData}
          />
        </GridItemMedium2>

        <GridItemLarge2>

        <PieRetentionUser
          title="User Retention"
          subtitle="Categorized by activity"
          data={userRetentionData}
        />

        </GridItemLarge2>



      </GridContainer>
    </Container>
  );
}

export default DashboardTemplate;