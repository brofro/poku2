// src/components/Card.js
import React from 'react';
import { ATK_ICON, HP_ICON } from '../constants';

const Card = ({ name, img, atk, hp }) => {
  return (
    <div className="card">
      <div className="card-image-container">
        <img src={img} alt={name} className="card-image" />
      </div>
      <div className="card-info">
        <div className="card-name">{name}</div>
        <div className="card-stats">
          <div className="card-stat">
            <img src={ATK_ICON} alt="Attack" className="stat-icon" />
            <span>{atk}</span>
          </div>
          <div className="card-stat">
            <img src={HP_ICON} alt="Health" className="stat-icon" />
            <span>{hp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;