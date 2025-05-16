import { useState } from 'react';

interface PlanDetails {
  name: string;
  duration: string;
  features: string[];
  price: string;
}

const Products = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<PlanDetails | null>(null);
  
  const [currentPlanDetails, setCurrentPlanDetails] = useState<PlanDetails>({
    name: "Trial Period",
    duration: "7 Days",
    features: [
      "Full access to Cloud Telephony features",
      "Limited to 100 minutes",
      "Basic support",
      "Maximum 5 users"
    ],
    price: "Free"
  });

  const [monthlyPlanDetails, setMonthlyPlanDetails] = useState<PlanDetails>({
    name: "Monthly Plan",
    duration: "30 Days",
    features: [
      "Unlimited Cloud Telephony features",
      "Unlimited minutes",
      "24/7 Priority support",
      "Unlimited users",
      "Custom domain integration",
      "Advanced analytics"
    ],
    price: "₹999/month"
  });

  const [halfYearlyPlanDetails, setHalfYearlyPlanDetails] = useState<PlanDetails>({
    name: "Half Yearly Plan",
    duration: "180 Days",
    features: [
      "All Monthly Plan Features",
      "Dedicated Account Manager",
      "Premium Support SLA",
      "Custom Integration Support",
      "Bulk SMS Features",
      "20% Discount on Monthly Rate"
    ],
    price: "₹4,995/6 months"
  });

  const [yearlyPlanDetails, setYearlyPlanDetails] = useState<PlanDetails>({
    name: "Yearly Plan",
    duration: "365 Days",
    features: [
      "All Half Yearly Plan Features",
      "Enterprise Support",
      "Custom Feature Development",
      "Priority Bug Fixes",
      "Yearly Strategy Meeting",
      "30% Discount on Monthly Rate"
    ],
    price: "₹8,390/year"
  });

  const [customPlanDetails, setCustomPlanDetails] = useState<PlanDetails>({
    name: "Custom Plan",
    duration: "Custom Duration",
    features: [
      "Tailored Cloud Telephony Solutions",
      "Customizable Minutes Package",
      "Dedicated Support Team",
      "Custom Integration Development",
      "Personalized Training Sessions",
      "Custom Analytics Dashboard"
    ],
    price: "Contact Sales"
  });

  const handleBack = () => {
    setSelectedPlan(null);
    setIsEditing(false);
    setEditedPlan(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    let planToEdit: PlanDetails;
    
    switch(selectedPlan) {
      case 'monthly':
        planToEdit = monthlyPlanDetails;
        break;
      case 'halfYearly':
        planToEdit = halfYearlyPlanDetails;
        break;
      case 'yearly':
        planToEdit = yearlyPlanDetails;
        break;
      case 'custom':
        planToEdit = customPlanDetails;
        break;
      default:
        planToEdit = currentPlanDetails;
    }
    
    setEditedPlan({ ...planToEdit });
  };

  const handleSave = () => {
    if (editedPlan) {
      switch(selectedPlan) {
        case 'monthly':
          setMonthlyPlanDetails(editedPlan);
          break;
        case 'halfYearly':
          setHalfYearlyPlanDetails(editedPlan);
          break;
        case 'yearly':
          setYearlyPlanDetails(editedPlan);
          break;
        case 'custom':
          setCustomPlanDetails(editedPlan);
          break;
        default:
          setCurrentPlanDetails(editedPlan);
      }
      setIsEditing(false);
      setEditedPlan(null);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (editedPlan) {
      const newFeatures = [...editedPlan.features];
      newFeatures[index] = value;
      setEditedPlan({ ...editedPlan, features: newFeatures });
    }
  };

  // Render plan details based on selected plan
  const getSelectedPlanDetails = (): PlanDetails => {
    switch(selectedPlan) {
      case 'monthly':
        return monthlyPlanDetails;
      case 'halfYearly':
        return halfYearlyPlanDetails;
      case 'yearly':
        return yearlyPlanDetails;
      case 'custom':
        return customPlanDetails;
      default:
        return currentPlanDetails;
    }
  };

  if (selectedPlan) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditing ? `Edit ${getSelectedPlanDetails().name}` : getSelectedPlanDetails().name}
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                      <input
                        type="text"
                        value={editedPlan?.name}
                        onChange={(e) => setEditedPlan(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={editedPlan?.duration}
                        onChange={(e) => setEditedPlan(prev => prev ? { ...prev, duration: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">{getSelectedPlanDetails().name}</h2>
                    <p className="text-sm text-gray-500">Duration: {getSelectedPlanDetails().duration}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditedPlan(null);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Edit Plan
                  </button>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Features:</h3>
              {isEditing ? (
                <div className="space-y-3">
                  {editedPlan?.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {getSelectedPlanDetails().features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                      <span className="ml-2 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-4">
              <div className="text-sm text-gray-500">
                Price: {isEditing ? (
                  <input
                    type="text"
                    value={editedPlan?.price}
                    onChange={(e) => setEditedPlan(prev => prev ? { ...prev, price: e.target.value } : null)}
                    className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-900">{getSelectedPlanDetails().price}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <div className="flex items-center text-sm">
          <span className="text-gray-500 hover:text-gray-700">Home</span>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-900">Products</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-2 px-6 py-3">
            <div className="text-sm font-medium text-gray-900">Product</div>
            <div className="text-right text-sm font-medium text-gray-900">Action</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          <div className="grid grid-cols-2 px-6 py-4 hover:bg-gray-50">
            <div className="text-sm text-gray-900">Trial Period</div>
            <div className="text-right">
              <button 
                onClick={() => setSelectedPlan('trial')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 px-6 py-4 hover:bg-gray-50">
            <div className="text-sm text-gray-900">Monthly Plan</div>
            <div className="text-right">
              <button 
                onClick={() => setSelectedPlan('monthly')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 px-6 py-4 hover:bg-gray-50">
            <div className="text-sm text-gray-900">Half Yearly Plan</div>
            <div className="text-right">
              <button 
                onClick={() => setSelectedPlan('halfYearly')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 px-6 py-4 hover:bg-gray-50">
            <div className="text-sm text-gray-900">Yearly Plan</div>
            <div className="text-right">
              <button 
                onClick={() => setSelectedPlan('yearly')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 px-6 py-4 hover:bg-gray-50">
            <div className="text-sm text-gray-900">Custom Plan</div>
            <div className="text-right">
              <button 
                onClick={() => setSelectedPlan('custom')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

