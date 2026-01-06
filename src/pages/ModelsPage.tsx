import { Brain, CheckCircle, Loader2, Clock, TrendingUp, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react'
import api from '@/axios'


const mapBackendModel = (model: any, index: number) => ({
  id: index,
  name: model.model_name,
  version: model.version,
  status: model.is_production ? "Production" : "Testing",
  accuracy: Math.round(model.accuracy * 100),
  precision: Math.round(model.precision * 100),
  recall: Math.round(model.recall * 100),
  f1Score: Math.round(model.f1_score * 100),
  trainedOn: new Date(model.created_at).toISOString().split("T")[0],
  trainingTime: model.training_time,
  datasetSize: `${model.sample_count.toLocaleString()} transactions`,
  description: "Model trained for fraud detection", // optional
  features: [], // optional for now
});

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


 useEffect(() => {
  let isMounted = true;

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await api.get("/models");
      const mapped = res.data.map(mapBackendModel);
      if (isMounted) {
        setModels(mapped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchModels();

  return () => {
    isMounted = false;
  };
}, []);


  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
        />
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">ML Models</h1>
        <p className="text-gray-600">
          Overview of all machine learning models used for fraud detection
        </p>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="mb-1">{model.name}</CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    model.status === 'Production'
                      ? 'default'
                      : model.status === 'Testing'
                      ? 'secondary'
                      : 'outline'
                  }
                  className={
                    model.status === 'Production'
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : ''
                  }
                >
                  {model.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Target className="w-4 h-4" />
                    <span>Accuracy</span>
                  </div>
                  <div className="text-gray-900">{model.accuracy}%</div>
                  <Progress value={model.accuracy} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Zap className="w-4 h-4" />
                    <span>Precision</span>
                  </div>
                  <div className="text-gray-900">{model.precision}%</div>
                  <Progress value={model.precision} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Recall</span>
                  </div>
                  <div className="text-gray-900">{model.recall}%</div>
                  <Progress value={model.recall} className="mt-2" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>F1-Score</span>
                  </div>
                  <div className="text-gray-900">{model.f1Score}%</div>
                  <Progress value={model.f1Score} className="mt-2" />
                </div>
              </div>

              {/* Model Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-gray-600 mb-1">Version</div>
                  <div className="text-gray-900">{model.version}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Trained On</div>
                  <div className="text-gray-900">{model.trainedOn}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Training Time</div>
                  <div className="text-gray-900">{model.trainingTime}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-gray-600 mb-1">Dataset Size</div>
                  <div className="text-gray-900">{model.datasetSize}</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="text-gray-600 mb-2">Key Features Used</div>
                <div className="flex flex-wrap gap-2">
                  {model.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Clock className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-gray-900 mb-2">Continuous Model Improvement</h3>
              <p className="text-gray-600">
                Our models are continuously retrained with new data to adapt to evolving fraud patterns. 
                We perform A/B testing before promoting models to production and maintain multiple versions 
                for redundancy and performance optimization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}