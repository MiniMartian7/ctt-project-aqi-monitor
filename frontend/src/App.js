import React from 'react'
import './App.css'
import {useEffect} from 'react'
import {useState} from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const App = () => {
  const [entry, setEntry] = useState({
      pm2_5: null,
      VOC_index: null,
      temperature: null,
      humidity: null
    });
  const [entries, setEntries] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState({}); 
  const [loading, setLoading] = useState(false); // Introduce loading state

  const handleValueChange = (e) => {
    setEntry(prev=>({...prev, [e.target.name]: e.target.value}))
  }

  const handleAddClick = async e =>{
    //e.preventDefault()
    if (
    entry.pm2_5 !== null &&
    entry.VOC_index !== null &&
    entry.temperature !== null &&
    entry.humidity !== null
    ) {
      try{
        await axios.post("http://localhost:8800/", entry);
      }catch(err){
        console.log(err)
      }
    }
    else {
      window.alert('Some properties in entry are null. Please fill in all values.');
    }
  }

  useEffect(()=>{
    const fetchAllEntries = async ()=>{
      try{
        const res = await axios.get("http://localhost:8800/")
        setEntries(res.data)
        console.log(res)

        const labels = entries.map((entry, index) => `Entry ${index + 1}`);
        setChartLabels(labels);

        // Update datasets based on fetched entries
        const datasets = {
          labels: labels,
          datasets: [
            {
              label: 'PM 2.5',
              data: entries.map((entry) => entry['pm2_5']),
              fill: false,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
            },
            {
              label: 'VOC index',
              data: entries.map((entry) => entry['VOC_index']),
              fill: false,
              backgroundColor: 'rgba(, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
            },
            {
              label: 'Temperature',
              data: entries.map((entry) => entry['temperature']),
              fill: false,
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86,d 1)',
            },
            {
              label: 'Humidity',
              data: entries.map((entry) => entry['humidity']),
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
            },
          ],
          options: {
            scales: {
              x: {
                type: 'category', // Set the x-axis as a category scale
              },
              y: {
                // Configuration for the y-axis
                 beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  font: {
                    size: 14,
                  },
                },
              },
              title: {
                display: true,
                text: 'Air Quality Data',
                font: {
                  size: 20,
                },
              },
            },
          },
        };

        // Set the entries in state
        setChartData(datasets);
        setLoading(true); // Data has arrived, set loading to true
      }catch(err){
        setLoading(false); // Data issue, set loading to false
        console.log(err)
      }
    }
    fetchAllEntries()
  },[handleAddClick])
  

  const handleDeleteClick = async (id) => {
    try{
      await axios.delete("http://localhost:8800/"+id);
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="app-container">
      <form className="input-container" onSubmit={handleAddClick}>
        <div className="input-row">
          <label htmlFor="pm2_5">PM2_5:</label>
          <input
            type="text"
            placeholder="PM2_5"
            name="pm2_5"
            id="pm2_5"
            onChange={handleValueChange}
          />
        </div>

        <div className="input-row">
          <label htmlFor="VOC_index">VOC Index:</label>
          <input
            type="text"
            placeholder="VOC Index"
            name="VOC_index"
            id="VOC_index"
            onChange={handleValueChange}
          />
        </div>

        <div className="input-row">
          <label htmlFor="temperature">Temperature:</label>
          <input
            type="text"
            placeholder="Temperature"
            name="temperature"
            id="temperature"
            onChange={handleValueChange}
          />
        </div>

        <div className="input-row">
          <label htmlFor="humidity">Humidity:</label>
          <input
            type="text"
            placeholder="Humidity"
            name="humidity"
            id="humidity"
            onChange={handleValueChange}
          />
        </div>

        <button className="add-button" type="submit">Add</button>
      </form>


      <div className="chart-container">
        { !loading ? (
          <div className="loading-screen">
            <p>Loading...</p>
          </div>
        ) : (
          <Line data={chartData} />
        )}
      </div>

      <div className="entries-container">
        <table>
          <thead>
            <tr>
              <th>PM2_5</th>
              <th>VOC Index</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.pm2_5}</td>
                  <td>{entry.VOC_index}</td>
                  <td>{entry.temperature}</td>
                  <td>{entry.humidity}</td>
                  <td>
                    <button className="delete-button" onClick={()=>handleDeleteClick(entry.id)}>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
