import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  TrendingUp, 
  Users, 
  Package, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Truck, 
  MapPin, 
  Calendar, 
  Award,
  AlertCircle,
  HelpCircle,
  Camera,
  Image as ImageIcon,
  Volume2,
  Leaf
} from 'lucide-react';
import { predictCropPrice, AI_PRICE_MODEL_VERSION } from '../services/aiPriceEngine';
import { getDemandForecast } from '../services/demandForecastEngine';
import { saveCropToDatabase } from '../services/dbService';
import { resolveCropImage } from '../services/cropImageResolver';

export default function FarmerPortal({
  user,
  crops,
  onAddCrop,
  orders,
  onAcceptOrder,
  onRejectOrder,
  buyers,
  onOpenChat,
  onOpenSupplyChain,
  t
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State in Kilograms (kg) and ₹/kg with dynamic crop image
  const [formData, setFormData] = useState({
    cropName: "Tomato",
    variety: "Abhinav Hybrid F1",
    quantityKg: 5000,
    grade: "Grade A",
    location: user?.location || "Nashik, Maharashtra",
    harvestDate: new Date().toISOString().split('T')[0],
    expectedPriceKg: 24.5,
    image: resolveCropImage("Tomato"),
    description: "Firm crimson harvest, graded and packed in 25kg crates."
  });

  // Live AI Prediction state
  const [livePrediction, setLivePrediction] = useState(null);

  useEffect(() => {
    const pred = predictCropPrice({
      cropName: formData.cropName,
      grade: formData.grade,
      location: formData.location,
      harvestDate: formData.harvestDate,
      quantityKg: Number(formData.quantityKg) || 1000
    });
    setLivePrediction(pred);
  }, [formData.cropName, formData.grade, formData.location, formData.quantityKg, formData.harvestDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Dynamically update image when cropName changes
      if (name === 'cropName') {
        updated.image = resolveCropImage(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guarantee dynamic realistic agricultural image matching the entered crop name
    const dynamicImage = resolveCropImage(formData.cropName);

    const newCrop = {
      id: `crop_${Date.now()}`,
      farmerId: user?.id || "farmer_1",
      farmerName: user?.name || "Rameshwar Patil",
      farmerPhone: "+91 98231 44521",
      farmerRating: 4.9,
      farmerLocation: formData.location,
      cropName: formData.cropName,
      variety: formData.variety,
      quantityKg: Number(formData.quantityKg),
      grade: formData.grade,
      location: formData.location,
      harvestDate: formData.harvestDate,
      expectedPriceKg: Number(formData.expectedPriceKg),
      aiPredictedPriceKg: livePrediction ? livePrediction.predictedPrice : 24.5,
      aiMinPriceKg: livePrediction ? livePrediction.minPrice : 22.0,
      aiMaxPriceKg: livePrediction ? livePrediction.maxPrice : 26.5,
      aiConfidence: livePrediction ? livePrediction.confidenceScore : 94,
      aiModel: AI_PRICE_MODEL_VERSION,
      availabilityStatus: t.available_tag || "Available",
      image: dynamicImage,
      description: formData.description,
      isOrganic: formData.grade === "Grade A",
      totalBids: 0
    };

    // Execute real HTTP fetch POST request to save to database
    await saveCropToDatabase(newCrop);

    onAddCrop(newCrop);
    setShowAddModal(false);
  };

  const myCrops = crops.filter(c => c.farmerId === (user?.id || "farmer_1"));
  const myOrders = orders.filter(o => o.farmerId === (user?.id || "farmer_1"));
  const activeCropDemand = getDemandForecast(myCrops[0]?.cropName || "Tomato");

  const listenToAiAdvice = (crop) => {
    const price = crop.expectedPriceKg || 25;
    const aiPrice = crop.aiPredictedPriceKg || 25;
    const speech = `Namaste ${user?.name || 'Kisan'}! For your ${crop.cropName} (${crop.variety}) harvest of ${crop.quantityKg?.toLocaleString() || 1000} kilograms, your asking price is ₹${price} per kilogram. Our AI model computes a fair benchmark of ₹${aiPrice} per kilogram. Direct buyers in your mandi corridor are actively seeking this quality.`;
    window.dispatchEvent(new CustomEvent('agri-voice-speak', { detail: { text: speech } }));
  };

  return (
    <div style={{ padding: '24px 0 40px 0' }}>
      <div className="container">
        
        {/* Header Title & Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>{t.farmer_workspace || "Farmer Workspace"}</h2>
              <span className="tag tag-green">{t.verified_grower || "Verified Grower #4128"}</span>
            </div>
            <p className="text-subtle" style={{ marginTop: '4px', fontSize: '0.9rem' }}>
              {t.welcome_back || "Welcome back"}, <strong>{user?.name || 'Rameshwar Patil'}</strong> • {t.mandi_label || "Mandi"}: {user?.location || 'Nashik, Maharashtra'}
            </p>
          </div>

          <button 
            className="btn btn-accent"
            onClick={() => setShowAddModal(true)}
            id="btn-add-crop"
            style={{ fontWeight: 700 }}
          >
            <PlusCircle size={18} />
            <span>{t.add_crop_btn || "Add Crop Listing"}</span>
          </button>
        </div>

        {/* Top Operational Metrics */}
        <div className="grid-3" style={{ marginBottom: '28px' }}>
          
          <div className="swiss-card">
            <div className="swiss-card-header">
              <span className="text-mono" style={{ color: 'var(--text-muted)' }}>
                {t.harvest_inventory || "HARVEST INVENTORY"}
              </span>
              <Package size={18} color="var(--agri-green)" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {myCrops.reduce((sum, c) => sum + (c.quantityKg || c.quantity * 100 || 0), 0).toLocaleString()} kg
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {myCrops.length} {t.active_crop_lots || "active crop lots at regional farm gates"}
            </p>
          </div>

          <div className="swiss-card" style={{ borderLeft: '4px solid var(--harvest-amber)' }}>
            <div className="swiss-card-header">
              <span className="text-mono" style={{ color: 'var(--harvest-amber)', fontWeight: 700 }}>
                {t.demand_radar_header || "DEMAND RADAR"}: {activeCropDemand.cropName.toUpperCase()}
              </span>
              <TrendingUp size={18} color="var(--harvest-amber)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {activeCropDemand.forecastDemand}
              </span>
              <span className="tag tag-amber" style={{ fontSize: '0.75rem' }}>
                {activeCropDemand.changePercent} {t.next_7_days || "Next 7 Days"}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {activeCropDemand.demandDriver}
            </p>
          </div>

          <div className="swiss-card" style={{ borderLeft: '4px solid var(--agri-green)' }}>
            <div className="swiss-card-header">
              <span className="text-mono" style={{ color: 'var(--agri-green)', fontWeight: 700 }}>
                {t.dispatches_logistics || "DISPATCHES & LOGISTICS"}
              </span>
              <Truck size={18} color="var(--agri-green)" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {myOrders.length} {t.contracts_count || "Contracts"}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {myOrders.filter(o => o.status === 'In Transit').length} {t.in_transit_note || "In highway transit with verified logistics"}
            </p>
          </div>

        </div>

        {/* Main Grid: Listings (Left) + Buyers & Orders (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '24px'
        }}>
          
          {/* Left Column: Crop Listings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3>{t.your_active_listings || "Your Active Crop Listings"}</h3>
              <span className="text-mono" style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {myCrops.length} {t.active_lots_tag || "Active Lots"}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myCrops.map(crop => {
                const qtyKg = crop.quantityKg || crop.quantity * 100 || 1000;
                const priceKg = crop.expectedPriceKg || (crop.expectedPrice ? (crop.expectedPrice / 100).toFixed(1) : 24.5);
                const aiPriceKg = crop.aiPredictedPriceKg || (crop.aiPredictedPrice ? (crop.aiPredictedPrice / 100).toFixed(1) : 24.8);
                const aiMinKg = crop.aiMinPriceKg || (crop.aiMinPrice ? (crop.aiMinPrice / 100).toFixed(1) : 22.0);
                const aiMaxKg = crop.aiMaxPriceKg || (crop.aiMaxPrice ? (crop.aiMaxPrice / 100).toFixed(1) : 26.5);
                
                // Dynamic realistic crop image matching the crop name
                const cropImg = resolveCropImage(crop.cropName) || crop.image;

                return (
                  <div key={crop.id} className="swiss-card" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                      
                      {/* Dynamic Realistic Agricultural Image */}
                      <div style={{
                        width: '110px',
                        height: '105px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundColor: 'var(--bg-subtle)'
                      }}>
                        <img 
                          src={cropImg} 
                          alt={crop.cropName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>
                              {crop.cropName} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>({crop.variety})</span>
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span className="tag tag-green">{crop.grade}</span>
                              <span className="tag tag-neutral">
                                <MapPin size={11} /> {crop.location}
                              </span>
                              <span className="tag tag-neutral">
                                <Calendar size={11} /> {t.harvest_prefix || "Harvest:"} {crop.harvestDate}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <span className="tag tag-green">
                              {crop.availabilityStatus || t.available_tag || "Available"}
                            </span>
                            <span className="text-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                              APMC Grade: {crop.qualityGrade || "Grade A"}
                            </span>
                          </div>
                        </div>

                        {/* Price Details in kg and ₹/kg */}
                        <div style={{
                          marginTop: '14px',
                          padding: '10px 14px',
                          backgroundColor: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                          gap: '10px',
                          border: '1px solid var(--border-light)'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                              {t.qty_available || "Quantity Available"}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                              {qtyKg.toLocaleString()} kg
                            </span>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                              {t.your_asking_rate || "Your Asking Rate"}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                              ₹{priceKg} / kg
                            </span>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <TrendingUp size={12} color="var(--agri-green)" />
                              <span style={{ fontSize: '0.725rem', color: 'var(--agri-green)', fontWeight: 600 }}>
                                {t.fair_range || "Mandi Fair Range"}
                              </span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--agri-green)' }}>
                              ₹{aiPriceKg}
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                {' '}(₹{aiMinKg} - ₹{aiMaxKg}/kg)
                              </span>
                            </span>
                          </div>

                          <div>
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block' }}>
                              {t.model_accuracy || "Model Accuracy"}
                            </span>
                            <span className="tag tag-green" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                              {crop.aiConfidence}% {t.verified_status || "Verified"}
                            </span>
                          </div>
                        </div>

                        {/* Voice Advisory Action */}
                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => listenToAiAdvice(crop)}
                            title="Hear AI market advisory in Tara's mild voice"
                          >
                            <Volume2 size={13} color="var(--agri-green)" />
                            <span>Ask Tara About This Harvest</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Matched Buyers & Orders */}
          <div>
            
            <div className="swiss-card" style={{ marginBottom: '20px' }}>
              <div className="swiss-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--agri-green)" />
                  <h4 style={{ margin: 0 }}>{t.recommended_buyers || "Recommended Buyers"}</h4>
                </div>
                <span className="tag tag-green" style={{ fontSize: '0.65rem' }}>{t.ai_matching || "AI Matching"}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {buyers.map(buyer => (
                  <div key={buyer.id} style={{
                    padding: '12px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{buyer.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {buyer.type} • {buyer.location}
                        </div>
                      </div>
                      <span className="tag tag-green" style={{ fontSize: '0.65rem' }}>
                        {t.match_percent || "96% Match"}
                      </span>
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '0.775rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{t.demand_label || "Demand:"} </span>
                      <strong>{buyer.lookingFor.join(', ')}</strong> ({buyer.preferredVolume})
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenChat(buyer)}
                        style={{ width: '100%' }}
                      >
                        <MessageSquare size={13} color="var(--crypto-blue)" />
                        <span>{t.encrypted_chat_btn || "Encrypted Chat"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="swiss-card">
              <div className="swiss-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} />
                  <h4 style={{ margin: 0 }}>{t.incoming_orders || "Incoming Orders"}</h4>
                </div>
                <span className="tag tag-amber" style={{ fontSize: '0.65rem' }}>
                  {myOrders.length} {t.orders_count_tag || "Orders"}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myOrders.map(order => (
                  <div key={order.id} style={{
                    padding: '12px',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="text-mono" style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                        {order.id}
                      </span>
                      <span className={`tag ${order.status === 'In Transit' ? 'tag-amber' : 'tag-green'}`}>
                        {order.status === 'In Transit' ? (t.status_in_transit || order.status) : (t.status_delivered || order.status)}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {order.cropName}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                      {t.buyer_label || "Buyer:"} <strong>{order.buyerName}</strong>
                    </div>

                    <div style={{ 
                      marginTop: '6px', 
                      padding: '6px 10px', 
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.775rem',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{(order.quantityKg || order.quantity * 100).toLocaleString()} kg @ ₹{order.unitPriceKg || (order.unitPrice / 100).toFixed(1)}/kg</span>
                      <strong style={{ color: 'var(--agri-green)' }}>₹{order.totalAmount.toLocaleString()}</strong>
                    </div>

                    <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenSupplyChain(order)}
                        style={{ flex: 1 }}
                      >
                        <Truck size={13} />
                        <span>{t.track_route_btn || "Track Route"}</span>
                      </button>

                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => onOpenChat({ id: order.buyerId, companyName: order.buyerName })}
                      >
                        <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Add Crop Listing Modal (using kg and ₹/kg with dynamic realistic crop photo) */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={20} color="var(--agri-green)" />
                <h3 style={{ margin: 0 }}>{t.add_crop_title || "Add New Crop Listing"}</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                
                {/* Dynamic Realistic Image Preview Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src={resolveCropImage(formData.cropName)} 
                      alt={formData.cropName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--agri-green)' }}>
                      {t.crop_preview_label || "Realistic Crop Photo (Auto-detected):"}
                    </span>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>
                      {formData.cropName || "Crop"}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      High-definition agricultural photo automatically matched to your crop
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">{t.crop_name_label || "Crop Name (Type any custom crop)"}</label>
                    <input 
                      type="text"
                      list="crop-suggestions"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleInputChange}
                      placeholder={t.crop_name_placeholder || "e.g. Tomato, Mango, Rice, Onion, Cardamom..."}
                      className="form-input"
                      required
                      autoComplete="off"
                    />
                    <datalist id="crop-suggestions">
                      <option value="Tomato" />
                      <option value="Onion" />
                      <option value="Potato" />
                      <option value="Wheat" />
                      <option value="Basmati Rice" />
                      <option value="Mango" />
                      <option value="Banana" />
                      <option value="Apple" />
                      <option value="Green Chilli" />
                      <option value="Cotton" />
                      <option value="Maize" />
                      <option value="Soybean" />
                      <option value="Turmeric" />
                      <option value="Ginger" />
                      <option value="Cardamom" />
                      <option value="Garlic" />
                      <option value="Carrot" />
                      <option value="Cabbage" />
                      <option value="Cauliflower" />
                      <option value="Peas" />
                      <option value="Mustard" />
                      <option value="Groundnut" />
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.variety_label || "Variety"}</label>
                    <input 
                      type="text"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">{t.quality_grade_label || "Quality Grade"}</label>
                    <select 
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="Grade A">{t.grade_a || "Grade A (Premium / Export)"}</option>
                      <option value="Grade B">{t.grade_b || "Grade B (Standard Market)"}</option>
                      <option value="Grade C">{t.grade_c || "Grade C (Processing / Bulk)"}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.qty_kg_label || "Quantity (in Kilograms - kg)"}</label>
                    <input 
                      type="number"
                      name="quantityKg"
                      min="10"
                      value={formData.quantityKg}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {t.qty_kg_hint || "e.g., 5,000 kg = 5 Tons"}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">{t.mandi_location_label || "Farm / Mandi Location"}</label>
                    <input 
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.harvest_date_label || "Harvest Date"}</label>
                    <input 
                      type="date"
                      name="harvestDate"
                      value={formData.harvestDate}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.expected_rate_label || "Your Expected Selling Price (₹ per kg)"}</label>
                  <input 
                    type="number"
                    step="0.1"
                    name="expectedPriceKg"
                    value={formData.expectedPriceKg}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g. 24.50"
                    required
                  />
                </div>

                {/* Real-time AI Decision Support Box with Model Name */}
                {livePrediction && (
                  <div style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--agri-green-subtle)',
                    border: '1px solid var(--agri-green-border)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TrendingUp size={16} color="var(--agri-green)" />
                        <strong style={{ fontSize: '0.875rem' }}>
                          {t.realtime_guidance || "APMC Mandi Price Guidance"}
                        </strong>
                      </div>
                      <span className="text-mono" style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>
                        APMC Mandi Benchmark
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--agri-green)' }}>
                        ₹{livePrediction.predictedPrice} / kg
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {t.suggested_range || "Suggested Range:"} <strong>₹{livePrediction.minPrice} – ₹{livePrediction.maxPrice} / kg</strong>
                      </span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Live mandi guidance rate based on APMC arrivals and seasonal benchmark.
                    </p>
                  </div>
                )}

              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  {t.cancel_btn || "Cancel"}
                </button>
                <button 
                  type="submit" 
                  className="btn btn-green"
                  id="btn-submit-crop"
                >
                  {t.publish_crop_btn || "Publish Listing (kg)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
