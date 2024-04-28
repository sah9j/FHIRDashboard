import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../src/components/shared/DashboardCard';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState, useEffect } from 'react';

interface Patient {
    id: string;
    name: {
      family: string;
      given: string[];
    }[];
    gender: string;
  }


const PatientChart:React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);

    const [genderCounts, setGenderCounts] = useState<{ maleCount: number, femaleCount: number, otherCount: number }>({
      maleCount: 0,
      femaleCount: 0,
      otherCount: 0,
  });

  useEffect(() => {
    async function fetchPatientData() {
        try {
            const response = await fetch('http://localhost:8080/fhir/Patient');
            if (!response.ok) {
                console.log("Failed to fetch patient data")
                throw new Error('Failed to fetch patient data');
            }
            const data = await response.json();

            console.log(data)

            // Check if data and data.entry are defined
          if (!data|| !data.entry) {
            console.error('Data structure is not as expected');
            return;
          }

            // Process patient data to count genders
            let maleCount = 0;
            let femaleCount = 0;
            let otherCount = 0;

            data.entry.forEach((entry: any) => {
                const patient = entry.resource;
                if (patient.gender === 'male') {
                    maleCount++;
                } else if (patient.gender === 'female') {
                    femaleCount++;
                } else {
                    otherCount++;
                }
            });

            // Set the gender counts
            setGenderCounts({ maleCount, femaleCount, otherCount });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    // Fetch patient data when the component mounts
    fetchPatientData();
  }, []);

  /* useEffect(() => {
    fetch('http://localhost:8080/fhir/Patient/')
      .then(response => response.json())
      .then((data: { entry: { resource: Patient }[] }) => {
        setPatients(data.entry.map(entry => entry.resource));
      })
      .catch(error => console.error('Error fetching patients:', error));
  }, []); */

  // Prepare data for the chart
  const chartOptions = {
    chart: {
      type: 'bar' as const,
    },
    xaxis: {
      categories: ["Male","Female","Other"],
    },
  };


  // Data and options for Chart.js
  const chartData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
        {
            label: 'Gender Counts',
            data: [genderCounts.maleCount, genderCounts.femaleCount, genderCounts.otherCount],
            backgroundColor: ['blue', 'pink', 'gray']
        }
    ]
  };

  const chartSeries = [
    {
      name: 'Number of Patients',
      data: [genderCounts.maleCount, genderCounts.femaleCount, genderCounts.otherCount],
    },
  ];

  return (
    <div>
      <h1>Patient Chart</h1>
      {/* <Chart options={chartOptions} series={chartSeries} type="bar" height={400} /> */}
      <Chart options={chartOptions} series={chartSeries} type="bar" height={400} />
    </div>
  );
/* 
    // select
    const [month, setMonth] = React.useState('1');

    const handleChange = (event: any) => {
        setMonth(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // chart
    const optionscolumnchart: any = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
          },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08', '23/08'],
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };
    const seriescolumnchart: any = [
        {
            name: 'Eanings this month',
            data: [355, 390, 300, 350, 390, 180, 355, 390],
        },
        {
            name: 'Expense this month',
            data: [280, 250, 325, 215, 250, 310, 280, 250],
        },
    ];

    return (

        <DashboardCard title="Sales Overview" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={1}>March 2023</MenuItem>
                <MenuItem value={2}>April 2023</MenuItem>
                <MenuItem value={3}>May 2023</MenuItem>
            </Select>
        }>
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    ); */
};

export default PatientChart;
