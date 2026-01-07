import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Loader2, ArrowUpRight, ArrowDownRight, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react'
import api from '@/axios'


export interface HomeData {
  total_transaction: number;
  fraud_detected: number;
  accuracy_rate: number;
  preventation_saved: number;
  fraudulent: number;
  legitimate: number;
  detectionAccuracyData: { name: string, value: any}[];
  model_performance: { model: string; accuracy: number }[];
  recent_detection: {
    id: string;
    amount: string;
    risk: string;
    time: string;
  }[];
  chart_trends: {
    month: string;
    legitimate: number;
    fraud: number;
  }[];
}


const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const formatTimeAgo = (detectionTimeIsoString: string): string => {
  const detectionDate = new Date(detectionTimeIsoString)

  const secondAgo = Math.floor((new Date().getTime() - detectionDate.getTime()) / 1000)

  if(secondAgo < 60) return `${Math.floor(secondAgo)} second ago`;
  if(secondAgo < 3600) return `${Math.floor(secondAgo / 60)} minutes ago`
  if(secondAgo < 86400) return `${Math.floor(secondAgo / 3600)} hour ago`;
  return `${Math.floor(secondAgo / 86400)} days ago`;

}

export default function HomePage() {

	const [data, setData] = useState<HomeData | null>(null)
  const [detectionAccuracyData, setDetectionAccuracyData] = useState([]);

	useEffect(() => {
		async function load() {
			const response = await api.get("/fraud/dashboard")
			setData(response.data);
      console.log("Detection ACCC DATA======+++ ", response.data.detectionAccuracyData)
       setDetectionAccuracyData([
        { name: "True Positive", value: response.data.detectionAccuracyData[0][0] },
        { name: "True Negative", value: response.data.detectionAccuracyData[0][1]},
        { name: "False Positive", value: response.data.detectionAccuracyData[1][0] },
        { name: "False Negative", value: response.data.detectionAccuracyData[1][1] },
      ]);
		}
		load()
	}, [])


  useEffect(()=>{
    const ws = new WebSocket("wss://fraud-api-ehjw.onrender.com/dashboard")
    ws.onopen = ()=>{
      console.log("Connected to WebSocket");
    }

    ws.onmessage = (event)=>{
      const message = JSON.parse(event.data);
      console.log("New transaction:", message);

      setData((prev)=>{
        if(!prev) return prev
         const newTotal = prev.total_transaction + 1;

      // Increment fraud detected if random_forest predicts fraud
      const newFraud = prev.fraud_detected + (message.predictions.random_forest.prediction ? 1 : 0);


      const newRecent = [
        {
          id: message.transaction.txn_id,
          amount: `${message.transaction.amount}$`,
          risk: message.predictions.random_forest.probability > 0.8 ? "High" :
                message.predictions.random_forest.probability > 0.5 ? "Medium" : "Low",
          time: new Date().toISOString()
        },
        ...prev.recent_detection
      ].slice(0, 5);

      return {
        ...prev,
        total_transaction: newTotal,
        fraud_detected: newFraud,
        recent_detection: newRecent
      };
      })
    }

    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error:", err);

  return () => ws.close(); // cleanup on unmount


  }, [])

  // console.log("detectionAccuracyData", detectionAccuracyData)

	if (!data)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
        />
      </div>
    )



	 return (
    <div className="px-5">
      <div className="my-[30px]">
        <h2 className="text-[25px] text-bold">Credit Fraud Detection Dashboard</h2>
        <span className="text-gray-600 text-[16px]">Real-time monitoring and analysis of credit card transaction fraud detection</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Transactions</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p>{data.total_transaction}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Fraud Detected</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <p>{data.fraud_detected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="w-full mt-[50px]">
        <CardHeader>
          <CardTitle>Transaction Trends</CardTitle>
          <CardDescription>Legitimate vs Fraud per month</CardDescription>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.chart_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="legitimate" stroke="#10b981" />
              <Line type="monotone" dataKey="fraud" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="mt-[50px]">
        <CardHeader>
          <CardTitle>Detection Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={detectionAccuracyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}

                fill="#8884d8"
                dataKey="value"
              >
                {detectionAccuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      

      {/* Bar Chart */}
      <Card className="mt-[50px]">
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.model_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Detection */}

      <Card className="mt-[50px] w-full">
        <CardHeader>
          <CardTitle>Recent Detections</CardTitle>
          <CardDescription>Latest fraud detection alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {
            data.recent_detection.map((detection, index) => (
              <div className="flex justify-between items-center mt-[50px] w-full h-[30px]">
                <div>
                  <p>{detection.id}</p>
                  <p>{detection.amount}</p>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <p className={detection.risk == 'High' ? 'p-[10px] bg-red-400 rounded-md' : detection.risk == 'Medium' ? 'p-[10px] bg-orange-600 rounded-md' : 'p-[10px] bg-green-400 rounded-md'}>{detection.risk}</p>
                  <p>
                    {formatTimeAgo(detection.time)}
                  </p>
                </div>
              </div>

            ))
          }
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-[50px] mb-[50px]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-gray-900 mb-2">AI-Powered Fraud Protection</h3>
              <p className="text-gray-600 mb-4">
                Our advanced machine learning models analyze transaction patterns in real-time to identify and prevent fraudulent activities. With an accuracy rate of 98.8%, we protect your business from financial losses while minimizing false positives.
              </p>
              <div className="flex gap-4">
                <div>
                  <div className="text-gray-900">4.2M+</div>
                  <div className="text-gray-600">Transactions Analyzed</div>
                </div>
                <div>
                  <div className="text-gray-900">$12.5M</div>
                  <div className="text-gray-600">Fraud Prevented</div>
                </div>
                <div>
                  <div className="text-gray-900">99.2%</div>
                  <div className="text-gray-600">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}