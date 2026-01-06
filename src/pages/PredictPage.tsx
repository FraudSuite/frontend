import { useState } from "react";
import api from "../axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Transaction type with all columns
interface Transaction {
  time: number;
  amount: number;
  v1: number;
  v2: number;
  v3: number;
  v4: number;
  v5: number;
  v6: number;
  v7: number;
  v8: number;
  v9: number;
  v10: number;
  v11: number;
  v12: number;
  v13: number;
  v14: number;
  v15: number;
  v16: number;
  v17: number;
  v18: number;
  v19: number;
  v20: number;
  v21: number;
  v22: number;
  v23: number;
  v24: number;
  v25: number;
  v26: number;
  v27: number;
  v28: number;
  merchantCategory: string;
  cardType: string;
  location: string;
}



export default function PredictPage() {
  const [result, setResult] = useState({
    prediction: '',
    confidence: '',
    riskScore: '',
    factors: []

  })
  const [formData, setFormData] = useState<Transaction>({
  time: 0,
  amount: 0,
  v1: 0,
  v2: 0,
  v3: 0,
  v4: 0,
  v5: 0,
  v6: 0,
  v7: 0,
  v8: 0,
  v9: 0,
  v10: 0,
  v11: 0,
  v12: 0,
  v13: 0,
  v14: 0,
  v15: 0,
  v16: 0,
  v17: 0,
  v18: 0,
  v19: 0,
  v20: 0,
  v21: 0,
  v22: 0,
  v23: 0,
  v24: 0,
  v25: 0,
  v26: 0,
  v27: 0,
  v28: 0,
  merchantCategory: "",
  cardType: "",
  location: ""
});


const fillMockData = () => {
  setFormData({
    time: 45000,
    amount: 1234.56,
    v1: 0.12,
    v2: -0.45,
    v3: 0.67,
    v4: -0.23,
    v5: 0.89,
    v6: 0.11,
    v7: -0.34,
    v8: 0.56,
    v9: -0.78,
    v10: 0.22,
    v11: -0.33,
    v12: 0.44,
    v13: -0.55,
    v14: 0.66,
    v15: -0.77,
    v16: 0.88,
    v17: -0.99,
    v18: 0.11,
    v19: -0.12,
    v20: 0.23,
    v21: -0.34,
    v22: 0.45,
    v23: -0.56,
    v24: 0.67,
    v25: -0.78,
    v26: 0.89,
    v27: -0.91,
    v28: 0.10,
    merchantCategory: "online",
    cardType: "credit",
    location: "New York, USA"
  });
};




  const [results, setResults] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/predict", formData);
      console.log(response.data.results)
      setResult({
        prediction: response.data.results.prediction === 1 ? "Fraudulent" : "Legitimate",
        confidence: Math.floor(response.data.results.probability * 100).toString(),
        riskScore: Math.floor(response.data.results.probability * 100).toString(),
        factors: response.data.results.factors || []
      });
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Fraud Prediction</h1>
        <p className="text-gray-600">
          Enter transaction details to predict potential fraud
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Fill in the transaction information for fraud detection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Transaction Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="1234.56"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time (seconds from midnight)</Label>
                    <Input
                      id="time"
                      type="number"
                      placeholder="54321"
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Category Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="merchantCategory">Merchant Category</Label>
                    <Select 
                      value={formData.merchantCategory}
                      onValueChange={(value) => handleChange('merchantCategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                        <SelectItem value="gas">Gas Station</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="online">Online Shopping</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cardType">Card Type</Label>
                    <Select 
                      value={formData.cardType}  
                      onValueChange={(value) => handleChange('cardType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="debit">Debit</SelectItem>
                        <SelectItem value="prepaid">Prepaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Transaction Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, Country"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    required
                  />
                </div>

                {/* PCA Features */}
                <div>
                  <Label className="mb-2 block">PCA Features (V1-V5)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Array.from({ length: 28 }, (_, i)=>`v${i+1}`).map((v)=>(
                      <div key={v}>
                        <Label htmlFor={v} className="text-gray-600">{v.toUpperCase()}</Label>
                        <Input
                          id={v}
                          type="number"
                          step="0.00001"
                          placeholder="0.0"
                          value={formData[v as keyof typeof formData]}
                          onChange={(e) => handleChange(v, parseFloat(e.target.value))}
                        />
          
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 mt-2">
                    Principal Component Analysis features from the original dataset
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Predict Fraud
                    </>
                  )}
                </Button>

              </form>
             
            </CardContent>
             <Button 
                  type="button" 
                  variant="outline" 
                  onClick={fillMockData}
                  className="mb-4 w-full"
                >
                  Fill with Mock Data
              </Button>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Prediction Result</CardTitle>
              <CardDescription>Real-time fraud detection analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Submit a transaction to see the prediction results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Prediction Badge */}
                  <Alert className={result.prediction === 'Fraudulent' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
                    <div className="flex items-center gap-2">
                      {result.prediction === 'Fraudulent' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      <AlertDescription className={result.prediction === 'Fraudulent' ? 'text-red-900' : 'text-green-900'}>
                        <span className="block mb-1">
                          Transaction is <strong>{result.prediction}</strong>
                        </span>
                      </AlertDescription>
                    </div>
                  </Alert>

                  {/* Metrics */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Confidence</span>
                      <span className="text-gray-900">{result.confidence}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Risk Score</span>
                      <span className={`${parseFloat(result.riskScore) > 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {result.riskScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <h4 className="text-gray-900 mb-2">Key Factors</h4>
                    <ul className="space-y-2">
                      {result.factors.map((factor: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setResult(null)}
                  >
                    Clear Result
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>API Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                <code className="text-green-400 text-sm">
                  POST /predict
                </code>
              </div>
              <p className="text-gray-600 mt-3">
                Replace the mock prediction with your actual backend endpoint in the code.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

