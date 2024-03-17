import React from 'react';
import './ColorLegend.css'; // Import CSS file for styling

const ColorLegend = ({ legendItems }) => {
  return (
    <div className="color-legend">
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <span className="color-box" style={{ backgroundColor: item.color }}></span>
          <span className="label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorLegend;