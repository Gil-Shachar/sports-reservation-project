// //#region : Imported Modules
// import React, { useState, useEffect, useRef } from 'react';
// import Reportsstyles from './AdminReports.module.css';
// import html2canvas from 'html2canvas';
// import {
//   PieChart,
//   Pie,
//   Tooltip,
//   BarChart,
//   XAxis,
//   YAxis,
//   Legend,
//   CartesianGrid,
//   Bar,
//   Cell,
// } from 'recharts';
// //#endregion

// //#region : Admin Reports Function
// const AdminReports = () => {
//   //#region :  State variables and refs
//   const [chartData, setChartData] = useState(null);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const chartRef = useRef(null);
//   //#endregion

//   //#region : Function to handle downloading the chart as an image
//   const handleDownloadImage = () => {
//     if (chartRef.current) {
//       html2canvas(chartRef.current).then((canvas) => {
//         const link = document.createElement('a');
//         link.href = canvas.toDataURL('image/png');
//         link.download = 'chart.png';
//         link.click();
//       });
//     }
//   };
//   //#endregion

//   //#region :   // Fetch report data when the component mounts
//   useEffect(() => {
//     fetchReportData();
//   }, []);
//   //#endregion

//   //#region :Function to fetch report data
//   const fetchReportData = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/adminReports', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ startDate, endDate }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data);
//         setChartData(data);
//       } else {
//         console.error('Error fetching report data');
//       }
//     } catch (error) {
//       console.error('Error fetching report data', error);
//     }
//   };
//   //#endregion

//   //#region :Function to generate the report
//   const handleGenerateReport = () => {
//     fetchReportData();
//   };
//   //#endregion

//   //#region : Data variables for charts
//   const gameTypeData = chartData ? chartData.gameTypeData : [];
//   const courtTypeData = chartData ? chartData.courtTypeData : [];
//   const timeRangeData = chartData ? chartData.timeRangeData : [];
//   const gameTypeColors = ['blue', 'lightblue']; // Blue and Green
//   const courtTypeColors = ['blue', 'lightblue']; // Blue and Green
//   const timeRangeColors = [
//     'blue',
//     'lightblue',
//     'green',
//     'yellow',
//     'orange',
//     'red',
//     'purple',
//   ]; // Colors for time ranges
//   //#endregion

//   //#region : Render the component JSX
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <h1 className={Reportsstyles.reportsh1}>Admin Reports</h1>
//       <div className={Reportsstyles.reportsscrooler}>
//         <div className={Reportsstyles.reportsdateinputs}>
//           {/* Input fields for start and end dates */}
//           <label>Start Date:</label>
//           <input
//             type='date'
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//           <label>End Date:</label>
//           <input
//             type='date'
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//           {/* Buttons for generating report and downloading chart image */}
//           <button
//             className={Reportsstyles.reportsbtn}
//             onClick={handleGenerateReport}
//           >
//             Generate Report
//           </button>
//           <button
//             className={Reportsstyles.reportsbtn}
//             onClick={handleDownloadImage}
//           >
//             Download Chart Image
//           </button>
//         </div>
//         <div className={Reportsstyles.reportContainer}>
//           <div ref={chartRef} className={Reportsstyles.reportschartRef}>
//             {/* Game Type and Court Type charts */}
//             <div className={Reportsstyles.gametypeContainer}>
//               <div className={Reportsstyles.barchart}>
//                 <h2>Game Type</h2>
//                 <BarChart
//                   width={800}
//                   height={400}
//                   data={gameTypeData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   {/* X and Y axes, Tooltip, and Legend */}
//                   <XAxis dataKey='game_type' />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <CartesianGrid strokeDasharray='3 3' />
//                   <Bar dataKey='game_type_count'>
//                     {/* Custom colors for bars */}
//                     {gameTypeData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={gameTypeColors[index % gameTypeColors.length]}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </div>
//               <div className={Reportsstyles.piechart}>
//                 <h2>Game Type Disrtibution</h2>
//                 <PieChart width={500} height={400}>
//                   <Pie
//                     dataKey='game_type_count'
//                     isAnimationActive={false}
//                     data={gameTypeData}
//                     cx={200}
//                     cy={200}
//                     outerRadius={80}
//                     label
//                   >
//                     {/* Custom colors for pie slices */}
//                     {gameTypeData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={gameTypeColors[index % courtTypeColors.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </div>
//             </div>
//             {/* Court Type and Time Range charts */}
//             <div className={Reportsstyles.courttypeContainer}>
//               <div className={Reportsstyles.barchart}>
//                 <h2>Court Type</h2>
//                 <BarChart
//                   width={800}
//                   height={400}
//                   data={courtTypeData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   {/* X and Y axes, Tooltip, and Legend */}
//                   <XAxis dataKey='court_type' />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <CartesianGrid strokeDasharray='3 3' />
//                   <Bar dataKey='court_type_count'>
//                     {courtTypeData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={courtTypeColors[index % courtTypeColors.length]}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </div>
//               <div className={Reportsstyles.piechart}>
//                 <h2>Court Type Distribution</h2>
//                 <PieChart width={400} height={400}>
//                   <Pie
//                     dataKey='court_type_count'
//                     isAnimationActive={false}
//                     data={courtTypeData}
//                     cx={200}
//                     cy={200}
//                     outerRadius={80}
//                     label
//                   >
//                     {/* Custom colors for pie slices */}
//                     {courtTypeData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={courtTypeColors[index % courtTypeColors.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </div>
//             </div>
//             {/* Time Range charts */}
//             <div className={Reportsstyles.timerangeContainer}>
//               <div className={Reportsstyles.barchart}>
//                 <h2>Time Range</h2>
//                 <BarChart
//                   width={900}
//                   height={400}
//                   data={timeRangeData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   {/* X and Y axes, Tooltip, and Legend */}
//                   <XAxis dataKey='time_range' />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <CartesianGrid strokeDasharray='3 3' />
//                   <Bar dataKey='order_count'>
//                     {timeRangeData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={timeRangeColors[index % timeRangeColors.length]}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </div>
//               <div className={Reportsstyles.piechart}>
//                 <h2>Time Range Distribution</h2>
//                 <PieChart width={400} height={400}>
//                   <Pie
//                     dataKey='order_count'
//                     isAnimationActive={false}
//                     data={timeRangeData}
//                     cx={200}
//                     cy={200}
//                     outerRadius={80}
//                     label
//                   >
//                     {/* Custom colors for pie slices */}
//                     {timeRangeData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={timeRangeColors[index % timeRangeColors.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
//   //#endregion
// };
// //#endregion
// export default AdminReports;
import React, { useState, useEffect, useRef } from 'react';
import Reportsstyles from './AdminReports.module.css';
import html2canvas from 'html2canvas';
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar,
  Cell,
} from 'recharts';

const AdminReports = () => {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartRef = useRef(null);

  const handleDownloadImage = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
      });
    }
  };
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await fetch('http://localhost:8000/adminReports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setChartData(data);
      } else {
        console.error('Error fetching report data');
      }
    } catch (error) {
      console.error('Error fetching report data', error);
    }
  };

  const handleGenerateReport = () => {
    fetchReportData();
  };

  const gameTypeData = chartData ? chartData.gameTypeData : [];
  const courtTypeData = chartData ? chartData.courtTypeData : [];
  const timeRangeData = chartData ? chartData.timeRangeData : [];
  const gameTypeColors = ['blue', 'lightblue']; // Blue and Green
  const courtTypeColors = ['blue', 'lightblue']; // Blue and Green
  const timeRangeColors = [
    'blue',
    'lightblue',
    'green',
    'yellow',
    'orange',
    'red',
    'purple',
  ]; // Colors for time ranges

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className={Reportsstyles.reportsh1}>Admin Reports</h1>
      <div className={Reportsstyles.reportsscrooler}>
        <div className={Reportsstyles.reportsdateinputs}>
          <label>Start Date:</label>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className={Reportsstyles.reportsbtn}
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
          <button
            className={Reportsstyles.reportsbtn}
            onClick={handleDownloadImage}
          >
            Download Chart Image
          </button>
        </div>
        <div className={Reportsstyles.reportContainer}>
          <div ref={chartRef} className={Reportsstyles.reportschartRef}>
            <div className={Reportsstyles.gametypeContainer}>
              <div className={Reportsstyles.barchart}>
                <h2>Game Type</h2>
                <BarChart
                  width={800}
                  height={400}
                  data={gameTypeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey='game_type' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Bar dataKey='game_type_count'>
                    {gameTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={gameTypeColors[index % gameTypeColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div className={Reportsstyles.piechart}>
                <h2>Game Type Disrtibution</h2>
                <PieChart width={500} height={400}>
                  <Pie
                    dataKey='game_type_count'
                    isAnimationActive={false}
                    data={gameTypeData}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    label
                  >
                    {gameTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={gameTypeColors[index % courtTypeColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
            <div className={Reportsstyles.courttypeContainer}>
              <div className={Reportsstyles.barchart}>
                <h2>Court Type</h2>
                <BarChart
                  width={800}
                  height={400}
                  data={courtTypeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey='court_type' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Bar dataKey='court_type_count'>
                    {courtTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={courtTypeColors[index % courtTypeColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div className={Reportsstyles.piechart}>
                <h2>Court Type Distribution</h2>
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey='court_type_count'
                    isAnimationActive={false}
                    data={courtTypeData}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    label
                  >
                    {courtTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={courtTypeColors[index % courtTypeColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
            <div className={Reportsstyles.timerangeContainer}>
              <div className={Reportsstyles.barchart}>
                <h2>Time Range</h2>
                <BarChart
                  width={800}
                  height={400}
                  data={timeRangeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey='time_range' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray='3 3' />
                  <Bar dataKey='order_count'>
                    {timeRangeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={timeRangeColors[index % timeRangeColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
              <div className={Reportsstyles.piechart}>
                <h2>Time Range Distribution</h2>
                <PieChart width={400} height={400}>
                  <Pie
                    dataKey='order_count'
                    isAnimationActive={false}
                    data={timeRangeData}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    label
                  >
                    {timeRangeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={timeRangeColors[index % timeRangeColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
