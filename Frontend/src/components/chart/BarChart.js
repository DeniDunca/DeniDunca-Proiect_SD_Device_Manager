import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from "../../utils/Card";
import {useEffect, useState} from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};

const labels = [ '00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00',
                '06:00:00', '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00',
                '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00',
                '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const BarChart = (props) => {
    const [graphData, setGraphData] = useState([]);
    let datasets = [];

    useEffect(() => {
        console.log(props.values);

        let labels = [];
        for(const key in props.values){
            if(!labels.includes( props.values[key].deviceId)){
               labels.push(props.values[key].deviceId);
            }
        }

        for(const label in labels){
            datasets.push({
                label: labels[label],
                data: //Array.apply(0, Array(24)).map(function () {}),
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                backgroundColor: `rgba(${getRandomInt(255)}, 99, 132, 0.5)`
            })
        }

        //for(const key in datasets){
            for(const value in props.values){
                if(datasets[0].label === props.values[value].deviceId){
                    const position = parseInt(props.values[value].hour.slice(0,2));
                    datasets[0].data[position] += parseInt(props.values[value].energyConsumption);
                }
            }
        //}
        console.log(datasets);
        setGraphData(datasets);
    },[props.values])

    const data = {
        labels,
        datasets: graphData,
    };
    return (
        <Card>
            <Bar options={options} data={data} />
        </Card>
    );
}
export default BarChart;