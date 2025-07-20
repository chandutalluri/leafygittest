import React from 'react';

interface NutritionData {
  energy_kcal?: number;
  protein?: number;
  total_fat?: number;
  saturated_fat?: number;
  trans_fat?: number;
  carbohydrates?: number;
  total_sugars?: number;
  dietary_fiber?: number;
  sodium?: number;
}

interface KonvaNutritionTableProps {
  width: number;
  height: number;
  nutritionData?: NutritionData;
}

const KonvaNutritionTable: React.FC<KonvaNutritionTableProps> = ({
  width,
  height,
  nutritionData,
}) => {
  // Temporarily return a simple HTML div instead of Konva components
  // This will be replaced with proper Konva implementation once react-konva is available
  return (
    <div
      style={{
        width: width,
        height: height,
        border: '2px solid black',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        backgroundColor: 'white',
        fontSize: '10px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>
        NUTRITION FACTS
      </div>
      <div style={{ borderTop: '2px solid black', paddingTop: '4px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '10px' }}>Per 100g</div>
        <div style={{ fontSize: '8px', fontStyle: 'italic', color: '#666' }}>As per FSSAI standards</div>
      </div>
      {nutritionData && (
        <div style={{ marginTop: '8px', fontSize: '9px' }}>
          <div style={{ backgroundColor: '#f8f8f8', padding: '2px', border: '1px solid black' }}>
            Energy: {nutritionData.energy_kcal || 0} kcal
          </div>
          <div>Protein: {nutritionData.protein || 0}g</div>
          <div>Total Fat: {nutritionData.total_fat || 0}g</div>
          <div>Carbohydrates: {nutritionData.carbohydrates || 0}g</div>
          <div>Sodium: {nutritionData.sodium || 0}mg</div>
        </div>
      )}
      {!nutritionData && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#666',
          fontSize: '10px',
          textAlign: 'center'
        }}>
          Add nutrition data
        </div>
      )}
    </div>
  );
};

export default KonvaNutritionTable;