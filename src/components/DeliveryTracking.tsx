
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DeliveryTrackingProps {
  orderStatus: string;
  orderId: string;
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ orderStatus, orderId }) => {
  const [currentStatus, setCurrentStatus] = useState('');
  
  // Delivery stages
  const stages = [
    { id: 'order-placed', label: 'Order Placed', description: 'Your order has been received' },
    { id: 'processing', label: 'Processing', description: 'Order is being prepared' },
    { id: 'shipped', label: 'Shipped', description: 'Your package is on its way' },
    { id: 'delivered', label: 'Delivered', description: 'Package has been delivered' }
  ];

  // Map order status to tracking stage
  useEffect(() => {
    switch(orderStatus.toLowerCase()) {
      case 'pending':
        setCurrentStatus('order-placed');
        break;
      case 'processing':
        setCurrentStatus('processing');
        break;
      case 'shipped':
        setCurrentStatus('shipped');
        break;
      case 'completed':
        setCurrentStatus('delivered');
        break;
      default:
        setCurrentStatus('order-placed');
    }
  }, [orderStatus]);

  // Calculate stage progress
  const getStageIndex = (stageId: string) => {
    return stages.findIndex(stage => stage.id === stageId);
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <Card className="shadow-md border-yellow-300 mb-8">
      <CardHeader className="bg-yellow-50 border-b border-yellow-200">
        <CardTitle className="text-2xl text-red-600">Delivery Tracking</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Order ID: {orderId}</p>
          <p className="font-medium">Current Status: <span className="text-red-600">{stages.find(s => s.id === currentStatus)?.label}</span></p>
        </div>
        
        <div className="relative mt-8">
          {/* Progress bar */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-1 bg-gray-200 w-full"></div>
          <div 
            className="absolute top-1/2 left-0 transform -translate-y-1/2 h-1 bg-red-600" 
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          ></div>
          
          {/* Stage dots */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-red-600' : 'bg-gray-200'
                    } ${isCurrent ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
                  >
                    {isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`font-medium ${isCurrent ? 'text-red-600' : 'text-gray-700'}`}>{stage.label}</p>
                    <p className="text-xs text-gray-500 max-w-[100px] text-center">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated delivery */}
        <div className="mt-12 pt-4 border-t">
          <p className="font-medium">Estimated Delivery:</p>
          <p className="text-gray-600">
            {currentStatus === 'delivered' ? 
              'Your order has been delivered.' : 
              'Within 3-5 business days'
            }
          </p>
        </div>

        {/* Map placeholder */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-gray-500 mb-2">Delivery Map</p>
          <div className="h-[200px] bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Map view will be available when your order is shipped</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTracking;
