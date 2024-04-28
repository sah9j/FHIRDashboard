import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '../../../src/components/shared/DashboardCard';

// Dynamically import Chart component to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Immunization {
  status: string,
}

// Define the type for the data used in the donut chart
interface DonutChartData {
    name: string;
    value: number;
  }

// Define the type for the data response from the API
interface ApiResponse {
    entry: {
      resource: Immunization;
    }[];
  }

const MonthlyEarnings = () => {
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const primarylight = '#ecf2ff';
    const successlight = theme.palette.success.light;

    const [chartData, setChartData] = useState<DonutChartData[]>([]);
    const [Consents, setConsents] = useState<Immunization[]>([]);


    /* useEffect(() => {
      fetch('http://localhost:8080/fhir/Immunization')
        .then(response => response.json())
        .then((data: { entry: { resource: Immunization }[] }) => {
            console.log(data)
          setConsents(data.entry.map(entry => entry.resource));
        })
        .catch(error => console.error('Error fetching consents:', error));
    }, []); */

    useEffect(() => {
        // Fetch data from the FHIR server
        fetch('http://localhost:8080/fhir/Immunization')
          .then(response => response.json())
          .then((data: ApiResponse) => {
            // Create a dictionary to count occurrences of each status
            const statusCount: Record<string, number> = {};
    
            // Iterate over each entry and count statuses
            data.entry.forEach((entry) => {
              const status = entry.resource.status;
    
              if (status) {
                if (statusCount[status]) {
                  statusCount[status] += 1;
                } else {
                  statusCount[status] = 1;
                }
              }
            });

             // Convert statusCount dictionary to an array for the donut chart
        const donutChartData: DonutChartData[] = Object.entries(statusCount).map(
            ([name, value]) => ({
              name,
              value: value,
            })
          );

          // Update state with the prepared data
        setChartData(donutChartData);
    })
    .catch(error => console.error('Error fetching consents:', error));
}, []);
      
  
    // Count the number of patients by gender
    const genderCounts: { [key: string]: number } = {};
    Consents.forEach(Consents => {
      genderCounts[Consents.status] = (genderCounts[Consents.status] || 0) + 1;
    });
  
  
  

    const optionscolumnchart: any = {
        chart: {
            type: 'donut',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 155,
        },
        colors: [primary, primarylight, '#F9F9FD'],
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: '75%',
                    background: 'transparent',
                },
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
            custom: function({ series, seriesIndex, w }: { series: number[], seriesIndex: number, w: any }) {
                console.log('Data:', Object.keys(genderCounts));
                const statusLabel = chartData[seriesIndex]?.name;
              const value = series[seriesIndex];
              return `<div>${statusLabel}: ${value}</div>`;
          },
        },
        stroke: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        responsive: [
            {
                breakpoint: 991,
                options: {
                    chart: {
                        width: 120,
                    },
                },
            },
        ],
    };

    return (
        <DashboardCard title="Immunization Status">
            <Grid container spacing={3}>
                {/* column */}
                <Grid item xs={7} sm={7}>
                    <Typography variant="h3" fontWeight="700" sx={{ marginBottom: '5rem' }}>
                        100% Completed
                    </Typography>
                    <Stack spacing={1} mt={5} direction="row">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Avatar
                                sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                            ></Avatar>
                            <Typography variant="subtitle2" color="textSecondary">
                                Complete
                            </Typography>
                        </Stack>
                    </Stack>
                </Grid>
                {/* column */}
                <Grid item xs={5} sm={5}>
                    <Chart
                        options={optionscolumnchart}
                        series={chartData.map((data) => data.value)}
                        type="donut"
                        height="150px"
                    />
                </Grid>
            </Grid>
        </DashboardCard>
    );
};

export default MonthlyEarnings;