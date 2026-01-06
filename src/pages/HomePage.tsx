import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, Shield, AlertTriangle, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useState, useEffect } from "react"
import api from "@/axios"

/* ---------------- TYPES ---------------- */

type AccuracySlice = {
  name: string
  value: number
}

export interface HomeData {
  total_transaction: number
  fraud_detected: number
  accuracy_rate: number
  preventation_saved: number
  fraudulent: number
  legitimate: number
  detectionAccuracyData: number[][]
  model_performance: { model: string; accuracy: number }[]
  recent_detection: {
    id: string
    amount: string
    risk: string
    time: string
  }[]
  chart_trends: {
    month: string
    legitimate: number
    fraud: number
  }[]
}

/* ---------------- CONSTS ---------------- */

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

const formatTimeAgo = (iso: string): string => {
  const date = new Date(iso)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

/* ---------------- COMPONENT ---------------- */

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null)
  const [detectionAccuracyData, setDetectionAccuracyData] =
    useState<AccuracySlice[]>([])

  /* ----------- API LOAD ----------- */
  useEffect(() => {
    const load = async () => {
      const res = await api.get("/fraud/dashboard")
      setData(res.data)

      setDetectionAccuracyData([
        { name: "True Positive", value: res.data.detectionAccuracyData[0][0] },
        { name: "True Negative", value: res.data.detectionAccuracyData[0][1] },
        { name: "False Positive", value: res.data.detectionAccuracyData[1][0] },
        { name: "False Negative", value: res.data.detectionAccuracyData[1][1] },
      ])
    }

    load()
  }, [])

  /* ----------- WEBSOCKET ----------- */
  useEffect(() => {
    const ws = new WebSocket("http://localhost:8000/dashboard")

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      setData((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          total_transaction: prev.total_transaction + 1,
          fraud_detected:
            prev.fraud_detected +
            (message.predictions.random_forest.prediction ? 1 : 0),
          recent_detection: [
            {
              id: String(message.transaction.txn_id),
              amount: `${message.transaction.amount}$`,
              risk:
                message.predictions.random_forest.probability > 0.8
                  ? "High"
                  : message.predictions.random_forest.probability > 0.5
                  ? "Medium"
                  : "Low",
              time: new Date().toISOString(), // ✅ STRING ONLY
            },
            ...prev.recent_detection,
          ].slice(0, 5),
        }
      })
    }

    return () => ws.close()
  }, [])

  /* ----------- LOADING ----------- */
  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  /* ----------- UI ----------- */
  return (
    <div className="px-5">
      <h2 className="text-2xl mt-6">Credit Fraud Detection Dashboard</h2>

      {/* PIE */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Detection Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={detectionAccuracyData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                }
              >
                {detectionAccuracyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RECENT */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Recent Detections</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recent_detection.map((detection) => (
            <div
              key={detection.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p>{detection.id}</p>
                <p>{detection.amount}</p>
              </div>
              <div className="flex gap-4">
                <span>{detection.risk}</span>
                <span>{formatTimeAgo(detection.time)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* INFO */}
      <Card className="mt-10 mb-10">
        <CardContent className="flex gap-4 pt-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <p className="text-gray-600">
            AI-powered fraud detection protects transactions in real time.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
