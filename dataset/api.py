"""
============================================================
🧬 BONE MARROW DONOR MATCH — ML PREDICTION API
============================================================
Flask server that provides:
  1. /predict       — Rule-based donor matching (original)
  2. /ml-predict    — ML-powered compatibility prediction
  3. /model-info    — Returns info about the trained ML model

Runs on port 5001
============================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

# ----------------------------------
# LOAD CSV DATA (for /predict)
# ----------------------------------
def load_data():
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            "synthetic_bone_marrow_donors_500.csv")
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}")
        return pd.DataFrame()

    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip().str.replace(" ", "_")

    rename_map = {
        'age': 'Age',
        'gender': 'Gender',
        'blood_group': 'Blood_Group',
        'name': 'Name',
        'phone': 'Mobile',
        'email': 'Email',
        'weight': 'Weight',
        'HLA_A1': 'HLA_A1',
        'HLA_A2': 'HLA_A2',
        'HLA_B1': 'HLA_B1',
        'HLA_B2': 'HLA_B2'
    }
    df = df.rename(columns=rename_map)

    if 'Weight' not in df.columns:
        df['Weight'] = 70  # Default weight if missing

    if 'Age' in df.columns:
        df = df.dropna(subset=['Age'])
        df['Age'] = df['Age'].astype(int)

    if 'Weight' in df.columns:
        df['Weight'] = df['Weight'].astype(int)

    if "Donor_ID" not in df.columns:
        df["Donor_ID"] = [f"D{i}" for i in range(len(df))]

    print(f"CSV Data Loaded: {len(df)} donors")
    return df


# ----------------------------------
# LOAD ML MODEL
# ----------------------------------
def load_ml_model():
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              'ml_model.pkl')
    if not os.path.exists(model_path):
        print("ML model not found! Run 'python train_model.py' first.")
        return None

    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)

    print(f"ML Model Loaded: {model_data['model_name']}")
    print(f"   Accuracy: {model_data['accuracy']:.4f}")
    return model_data


donors_df = load_data()
ml_model_data = load_ml_model()


# ----------------------------------
# HELPER: Compute features for ML
# ----------------------------------
def compute_ml_features(recipient, donor):
    """
    Compute the features that the ML model expects
    for a given recipient-donor pair.
    Now includes 10 HLA loci.
    """
    # Blood group match
    rec_blood = recipient.get('bloodGroup', recipient.get('Blood_Group', ''))
    don_blood = donor.get('bloodGroup', donor.get('Blood_Group', ''))
    blood_match = 1 if rec_blood == don_blood else 0

    # HLA matches (10 loci)
    hla_loci = [
        'HLA_A1', 'HLA_A2', 'HLA_B1', 'HLA_B2',
        'HLA_C1', 'HLA_C2', 'HLA_DRB1_1', 'HLA_DRB1_2',
        'HLA_DQ1', 'HLA_DQ2'
    ]
    
    hla_matches = []
    total_hla = 0
    
    for locus in hla_loci:
        rec_val = str(recipient.get(locus, '')).strip().replace(":", "").upper()
        don_val = str(donor.get(locus, '')).strip().replace(":", "").upper()
        match = 1 if rec_val and rec_val == don_val else 0
        hla_matches.append(match)
        total_hla += match

    # Age difference
    rec_age = int(recipient.get('age', recipient.get('Age', 30)))
    don_age = int(donor.get('age', donor.get('Age', 30)))
    age_diff = abs(rec_age - don_age)

    # Donor weight
    weight = int(donor.get('weight', donor.get('Weight', 65)))

    # Return list of features
    # Note: If the ML model was trained on 8 features, we still return those for the model,
    # but we will use the total_hla for the new deterministic probability logic.
    return {
        'features': [blood_match] + hla_matches[:4] + [total_hla, age_diff, weight],
        'total_hla': total_hla,
        'blood_match': blood_match
    }


# ============================================================
# ENDPOINT 1: /predict (Original rule-based matching)
# ============================================================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        blood_group = data.get('Blood_Group', '')
        age = int(data.get('Age', 0))
        top_n = int(data.get('Top_N', 10))

        rec_hla = [
            data.get('HLA_A1'), data.get('HLA_A2'),
            data.get('HLA_B1'), data.get('HLA_B2')
        ]
        rec_hla = [h for h in rec_hla if h]

        if donors_df.empty:
            return jsonify({"error": "Dataset not loaded"}), 500

        # 1. Filter by Blood Group
        filtered = donors_df[donors_df["Blood_Group"] == blood_group].copy()
        if filtered.empty:
            return jsonify([])

        # 2. Score
        def calculate_score(row):
            score = 0
            donor_hlas = [str(row.get('HLA_A1', '')), str(row.get('HLA_A2', '')),
                          str(row.get('HLA_B1', '')), str(row.get('HLA_B2', ''))]
            for h in rec_hla:
                if h in donor_hlas:
                    score += 1
            return score

        filtered['Match_Score'] = filtered.apply(calculate_score, axis=1)
        filtered = filtered[filtered['Match_Score'] > 0]
        filtered["Age_Difference"] = abs(filtered["Age"] - age)

        results = filtered.sort_values(
            by=["Match_Score", "Age_Difference"],
            ascending=[False, True]
        ).head(top_n)

        return jsonify(results.to_dict(orient='records'))

    except Exception as e:
        print(f"❌ Error in /predict: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================
# ENDPOINT 2: /ml-predict (ML-powered prediction)
# ============================================================
@app.route('/ml-predict', methods=['POST'])
def ml_predict():
    """
    Accepts recipient data + list of matched donors.
    Runs each donor-recipient pair through the trained ML model.
    Returns suitability prediction + confidence for each donor.

    Expected JSON body:
    {
        "recipient": {
            "bloodGroup": "A+",
            "HLA_A1": "26:01", "HLA_A2": "35:01",
            "HLA_B1": "26:01", "HLA_B2": "35:01",
            "age": 25
        },
        "donors": [
            {
                "_id": "...",
                "bloodGroup": "A+",
                "HLA_A1": "26:01", "HLA_A2": "35:01",
                "HLA_B1": "26:01", "HLA_B2": "35:01",
                "age": 29, "weight": 51
            }
        ]
    }
    """
    try:
        if ml_model_data is None:
            return jsonify({
                "error": "ML model not loaded. Run 'python train_model.py' first."
            }), 500

        data = request.json
        recipient = data.get('recipient', {})
        donors = data.get('donors', [])

        if not donors:
            return jsonify([])

        model = ml_model_data['model']
        scaler = ml_model_data['scaler']
        le = ml_model_data['label_encoder']

        predictions = []

        for donor in donors:
            # Compute features
            comp_data = compute_ml_features(recipient, donor)
            features = comp_data['features']
            total_hla = comp_data['total_hla']
            
            # DEFAULT ML PREDICTION (Fallback)
            try:
                features_array = np.array([features])
                features_scaled = scaler.transform(features_array)
                pred_class = model.predict(features_scaled)[0]
                pred_label = le.inverse_transform([pred_class])[0]
                pred_proba = model.predict_proba(features_scaled)[0]
                confidence = round(float(max(pred_proba)) * 100, 1)
                
                class_probs = {
                    le.inverse_transform([i])[0]: round(float(p) * 100, 1)
                    for i, p in enumerate(pred_proba)
                }
            except Exception as ml_err:
                print(f"ML Fallback error: {ml_err}")
                pred_label = "Low"
                confidence = 0
                class_probs = {"High": 0, "Medium": 0, "Low": 100}

            # OVERRIDE WITH USER'S SPECIFIC HLA RULES
            # Mapping: 7-10 -> High, 4-6 -> Medium, 0-3 -> Low
            # Percentage is always total_hla * 10
            
            if total_hla >= 7:
                suitability = "High"
            elif total_hla >= 4:
                suitability = "Medium"
            else:
                suitability = "Low"
            
            confidence = total_hla * 10

            # UI Requirement: Only show the relevant category
            class_probs = {suitability: float(confidence)}

            predictions.append({
                'donor_id':     donor.get('_id', donor.get('Donor_ID', '')),
                'suitability':  suitability,
                'confidence':   float(confidence),
                'probabilities': class_probs,
                'match_count':  total_hla # Extra info
            })

        return jsonify(predictions)

    except Exception as e:
        print(f"❌ Error in /ml-predict: {e}")
        return jsonify({"error": str(e)}), 500


# ============================================================
# ENDPOINT 3: /model-info (Model metadata)
# ============================================================
@app.route('/model-info', methods=['GET'])
def model_info():
    if ml_model_data is None:
        return jsonify({"error": "No model loaded"}), 500

    return jsonify({
        "model_name":      ml_model_data['model_name'],
        "accuracy":        round(ml_model_data['accuracy'] * 100, 2),
        "feature_columns": ml_model_data['feature_columns'],
        "classes":         list(ml_model_data['label_encoder'].classes_),
        "all_results": {
            k: {
                "accuracy":  round(v['accuracy'] * 100, 2),
                "cv_mean":   round(v['cv_mean'] * 100, 2),
                "cv_std":    round(v['cv_std'] * 100, 2)
            }
            for k, v in ml_model_data['all_results'].items()
        }
    })


# ============================================================
# RUN SERVER
# ============================================================
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print("\n" + "=" * 50)
    print(f"Starting Flask ML Server on port {port}...")
    print("=" * 50)
    print("   Endpoints:")
    print("   POST /predict      — Rule-based matching")
    print("   POST /ml-predict   — ML-powered prediction")
    print("   GET  /model-info   — Model metadata")
    print("=" * 50 + "\n")
    # In production, gunicorn handles the run. This is for local dev.
    app.run(host='0.0.0.0', port=port, debug=False)
