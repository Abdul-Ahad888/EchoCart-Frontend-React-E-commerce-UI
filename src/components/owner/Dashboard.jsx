import React, { useEffect, useState } from 'react'
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryPie,
  VictoryBar
} from "victory";

export default function Dashboard() {

  const [totalUsers, setTotalUsers] = useState('')
  const [totalOrders, setTotalOrders] = useState('')
  const [totalProducts, setTotalProducts] = useState('')
  const [revenue, setRevenue] = useState('')
  const [sales, setSales] = useState('')
  const [pieData, setPieData] = useState('')
  const [barChart, setBarChart] = useState([])
  const [lineChart, setLineChart] = useState([])

  const [chartSize, setChartSize] = useState({ width: 1200, height: 350 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartSize({ width: 800, height: 500 });
      } else {
        setChartSize({ width: 1200, height: 350 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);




  useEffect(() => {

    const token = localStorage.getItem('authToken')

    const getUser = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/user/total-users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Response Error')
          }
          return res.json()
        })
        .then((data) => {
          setTotalUsers(data.totalUser)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const getOrder = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/order/total-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Response Error')
          }
          return res.json()
        })
        .then((data) => {
          setTotalOrders(data.totalOrders)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const getProducts = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/products/total-products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Response Error')
          }
          return res.json()
        })
        .then((data) => {
          setTotalProducts(data.totalProducts)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const revenue = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/order/revenue', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Response Error')
          }
          return res.json()
        })
        .then((data) => {
          setRevenue(data.revenue)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const getDailyRevenue = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/admin/daily-revenue', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Response Error')
          }
          return res.json()
        })
        .then((data) => {
          setSales(data);
        })
        .catch((err) => console.log(err));
    };

    const orderStatus = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/admin/order-summary', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Response Error')
          }
          return res.json()
        })
        .then((data) => {
          setPieData([
            { x: "Delivered", y: data.delivered },
            { x: "Processing", y: data.processing },
            { x: "Canceled", y: data.canceled }
          ])
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const userCount = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/admin/users-count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Network Responce Error')
          }
          return res.json()
        })
        .then((data) => {
          const total = data.reduce((sum, user) => sum + parseInt(user.count), 0);

          setBarChart(
            data.map(user => ({
              x: user.selectCountry,
              y: Math.round((parseInt(user.count) / total) * 100)
            })))
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const monthlyRevenue = () => {
      fetch('https://echo-cart-back-end.vercel.app/api/v1/admin/monthly-revenue', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            console.log("Network Responce Error")
          }
          return res.json()
        })
        .then((data) => {
          setLineChart(data)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    monthlyRevenue()
    getDailyRevenue()
    revenue()
    getProducts()
    getUser()
    getOrder()
    orderStatus()
    userCount()
  }, [])

  const totalRevenue = revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })



  return (
    <div className="container-fluid">

      <div className="row admin-dashboard-cards gy-3 mt-3 mx-xl-2">
        {/* Total Users */}
        <div className="col-12 col-md-12 col-lg-6 col-xxl-3">
          <div className="dashboard-card users">
            <div className="">
              <i className='fa fa-users'></i>
            </div>
            <div className="card-info">
              <h6>Total Users</h6>
              <h3>{totalUsers}</h3>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-12 col-md-12 col-lg-6 col-xxl-3">
          <div className="dashboard-card revenue">
            <div className="">
              <i className='fa fa-money-check-dollar'></i>
            </div>
            <div className="card-info">
              <h6>Revenue</h6>
              <h3>${totalRevenue}</h3>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="col-12 col-md-12 col-lg-6 col-xxl-3">
          <div className="dashboard-card orders">
            <div className="">
              <i className='fa fa-shopping-bag'></i>
            </div>
            <div className="card-info">
              <h6>Total Orders Placed</h6>
              <h3>{totalOrders}</h3>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="col-12 col-md-12 col-lg-6 col-xxl-3">
          <div className="dashboard-card products">
            <div className="">
              <i className='fa fa-box-open'></i>
            </div>
            <div className="card-info">
              <h6>Total Products</h6>
              <h3>{totalProducts}</h3>
            </div>
          </div>
        </div>
      </div>


      <div className="row">
        <div className="pt-5 mt-2 line-chart col-12" style={{ width: "100%", overflowX: "auto" }}>
          <VictoryChart
            width={chartSize.width}
            height={chartSize.height}
            padding={{ top: 60, bottom: 30, left: 50, right: 30 }}>

            <VictoryLabel
              text="Sales Chart"
              x={50}
              y={10}
              style={{ fontSize: 26, fontWeight: "bold", fill: "#333" }} />

            {/* Gradient Definition */}
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0072ff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0072ff" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>

            {/* X Axis */}
            <VictoryAxis
              tickValues={Array.from({ length: 30 }, (_, i) => i + 1)}
              tickFormat={(t) => {
                const d = new Date(t);
                return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
              }}
              style={{
                axis: { stroke: "#ccc", strokeWidth: 1 },
                ticks: { stroke: "#ccc", size: 4 },
                tickLabels: { fill: "#666", fontSize: 9, padding: 5 },
                grid: { stroke: "#e6e6e6", strokeDasharray: "4,4" },
              }}
            />


            {/* Y Axis */}
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: "#ccc", strokeWidth: 1 },
                ticks: { stroke: "#ccc", size: 4 },
                tickLabels: { fill: "#666", fontSize: 10, padding: 5 },
                grid: { stroke: "#f0f0f0" },
              }}
            />


            {/* Line */}
            <VictoryLine
              data={sales}
              style={{ data: { stroke: "#0072ff", strokeWidth: 3 } }}
            // animate={{ duration: 2000, onLoad: { duration: 2000 } }}
            />

            {/* Area */}
            <VictoryArea
              data={sales}
              style={{ data: { fill: "url(#lineGradient)" } }}
            // animate={{ duration: 2000, onLoad: { duration: 2000 } }}
            />

            {/* Scatter Points with Tooltip */}
            <VictoryScatter
              data={sales}
              size={({ active }) => (active ? 5 : 4)}
              style={{
                data: {
                  fill: ({ active }) => (active ? "#0072ff" : "#fff"),
                  stroke: "#0072ff",
                  strokeWidth: 2,
                  cursor: "pointer",
                },
              }}
              labels={({ datum }) =>
                `Revenue: $${datum.y.toLocaleString()}\nOrders: ${datum.orders}`
              }
              labelComponent={
                <VictoryTooltip
                  cornerRadius={6}
                  pointerLength={8}
                  flyoutPadding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                  flyoutStyle={{
                    fill: "#111",
                    fillOpacity: 0.95,
                    stroke: "#0072ff",
                    strokeWidth: 1,
                    filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.25))",
                  }}
                  style={{ fill: "#fff", fontSize: 12, fontWeight: 600 }}
                />
              }
            />
          </VictoryChart>

        </div>
      </div>


      <div className="row m-lg-4 mt-5 charts">
        <div className="col-12 col-lg-4 my-2">
          <div className="p-3 h-100 d-flex flex-column chart-card" style={{ boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.12)" }}>
            <h3 className="mb-3 fw-semibold text-center pt-3"> Order's Status</h3>
            <i className='fa fa-chart-pie'></i>

            {/* Centered Pie */}
            <div className="d-flex justify-content-center">
              {pieData.length > 0 ? (
                <VictoryPie
                  data={pieData}
                  width={250}
                  height={180}
                  innerRadius={60}
                  padAngle={2}
                  colorScale={["#6BCB77", "#FFD93D", "#FF6B6B"]}
                  labels={({ datum }) => `${datum.x}: ${datum.y}`}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSize: 8 }}
                      cornerRadius={2}
                      flyoutStyle={{ fill: "#ffffff95", stroke: "#00000020" }}
                    />
                  }
                  animate={{ duration: 800 }}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>

            {/* Custom Legend */}
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-3 small">
              <div className="d-flex align-items-center gap-1">
                <span style={{ width: 10, height: 10, background: "#6BCB77", borderRadius: "50%" }}></span>
                <span>Delivered</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span style={{ width: 10, height: 10, background: "#FFD93D", borderRadius: "50%" }}></span>
                <span>Processing</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span style={{ width: 10, height: 10, background: "#FF6B6B", borderRadius: "50%" }}></span>
                <span>Canceled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4 my-2">
          <div className="p-3 h-100 d-flex flex-column chart-card" style={{ boxShadow: "2px 2px 10px rgba(0,0,0,0.12)", height: "350px" }}>
            <h3 className="mb-3 fw-semibold text-center pt-3"> Geographic User's</h3>
            <i className="fa fa-globe"></i>

            {barChart.length > 0 ? (
              <VictoryChart
                domainPadding={{ x: 50, y: 20 }}
                height={350}
                padding={{ left: 60, right: 40, top: 20, bottom: 30 }}
                animate={{ duration: 800 }}
              >
                <VictoryBar
                  data={barChart}
                  barWidth={50}
                  cornerRadius={{ top: 20 }}
                  style={{
                    data: {
                      fill: ({ index }) => {
                        const barColors = [
                          "#4CAF50",  // Soft Green
                          "#3C91E6",  // Calm Blue
                          "#FFD93D",  // Warm Yellow
                          "#FF6B6B",  // Coral Red
                          "#845EC2",  // Soft Purple
                          "#2C73D2",  // Indigo Blue
                          "#00C9A7",  // Aqua Green
                          "#FFC75F",  // Muted Orange
                        ];

                        return barColors[index % barColors.length]
                      }
                    },
                    labels: { fontSize: 12, fill: "#333", fontWeight: 600 },
                  }}
                  labels={({ datum }) => `${datum.y}%`}
                />


                <VictoryAxis
                  style={{
                    tickLabels: { fontSize: 14 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={(t) => `${t}%`}
                  style={{
                    tickLabels: { fontSize: 12 },
                    grid: { stroke: "#ddd", strokeDasharray: "4" },
                  }}
                />
              </VictoryChart>
            ) : (
              <div className="text-center my-auto">Loading...</div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-4 my-2">
          <div className="p-3 h-100 d-flex flex-column chart-card" style={{ boxShadow: "2px 2px 10px rgba(0,0,0,0.12)", height: "350px" }}>
            <h3 className="mb-3 fw-semibold text-center pt-3">Sale's Trend</h3>
            <i className='fa fa-arrow-trend-up'></i>

            <VictoryChart
              height={320}
              padding={{ top: 20, bottom: 40, left: 60, right: 30 }}
              animate={{ duration: 1000 }}
              domainPadding={{ y: 10 }}
            >
              {/* X Axis - Months */}
              <VictoryAxis
                style={{
                  tickLabels: { fontSize: 10, padding: 5 },
                  axis: { stroke: "#ccc" },
                }}
              />

              {/* Y Axis - Revenue */}
              <VictoryAxis
                dependentAxis
                tickFormat={(t) => `$${t}`}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 },
                  grid: { stroke: "#f0f0f0" },
                }}
              />

              {/* Area/Line Chart */}
              <VictoryArea
                data={lineChart} // API result
                interpolation="monotoneX"
                style={{
                  data: {
                    fill: "url(#gradient)",
                    stroke: "#3C91E6",
                    strokeWidth: 2.5,
                  },
                }}
              />

              {/* Gradient */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3C91E6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3C91E6" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              {/* Points + Tooltips */}
              <VictoryScatter
                data={lineChart}
                size={5}
                style={{ data: { fill: "#3C91E6" } }}
                labels={({ datum }) =>
                  `$${datum.y} (${datum.change > 0 ? "+" : ""}${datum.change}%)`
                }
                labelComponent={
                  <VictoryTooltip
                    style={[
                      {
                        fontSize: 12,
                        fontWeight: 500,
                        fill: ({ datum }) =>
                          datum.change > 0 ? "green" : datum.change < 0 ? "red" : "#333"
                      }
                    ]}
                    flyoutStyle={{
                      fill: "#fff",
                      stroke: "#3C91E6",
                      strokeWidth: 1,
                      padding: 12,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.12)"
                    }}
                    cornerRadius={6}
                    pointerLength={8}
                  />
                }
              />
            </VictoryChart>

          </div>
        </div>
      </div>

    </div>
  )
}
