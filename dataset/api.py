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
                            "bone_marrow_donor_2000_dataset_column_E_removed (1).csv")
    if not os.path.exists(csv_path):
        print(f"⚠️  Dataset not found at {csv_path}")
        return pd.DataFrame()

    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip().str.replace(" ", "_")

    rename_map = {
        'donor_age': 'Age',
        'donor_gender': 'Gender',
        'donor_blood_group': 'Blood_Group',
        'donor_name': 'Name',
        'donor_mobile_number': 'Mobile',
        'donor_email': 'Email',
        'donor_weight': 'Weight',
        'HLA_A1_type': 'HLA_A1',
        'HLA_A2_type': 'HLA_A2',
        'HLA_B1_type': 'HLA_B1',
        'HLA_B2_type': 'HLA_B2'
    }
    df = df.rename(columns=rename_map)

    if 'Age' in df.columns:
        df = df.dropna(subset=['Age'])
        df['Age'] = df['Age'].astype(int)

    if 'Weight' in df.columns:
        df['Weight'] = df['Weight'].astype(int)

    if "Donor_ID" not in df.columns:
        df["Donor_ID"] = [f"D{i}" for i in range(len(df))]

    print(f"📊 CSV Data Loaded: {len(df)} donors")
    return df


# ----------------------------------
# LOAD ML MODEL
# ----------------------------------
def load_ml_model():
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              'ml_model.pkl')
    if not os.path.exists(model_path):
        print("⚠️  ML model not found! Run 'python train_model.py' first.")
        return None

    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)

    print(f"🤖 ML Model Loaded: {model_data['model_name']}")
    print(f"   Accuracy: {model_data['accuracy']:.4f}")
    return model_data


donors_df = load_data()
ml_model_data = load_ml_model()


# ----------------------------------
# HELPER: Compute features for ML
# ----------------------------------
def compute_ml_features(recipient, donor):
    """
    Compute the 8 features that the ML model expects
    for a given recipient-donor pair.
    """
    # Blood group match
    rec_blood = recipient.get('bloodGroup', recipient.get('Blood_Group', ''))
    don_blood = donor.get('bloodGroup', donor.get('Blood_Group', ''))
    blood_match = 1 if rec_blood == don_blood else 0

    # HLA matches (locus-specific)
    rec_a1 = str(recipient.get('HLA_A1', ''))
    rec_a2 = str(recipient.get('HLA_A2', ''))
    rec_b1 = str(recipient.get('HLA_B1', ''))
    rec_b2 = str(recipient.get('HLA_B2', ''))

    don_a1 = str(donor.get('HLA_A1', ''))
    don_a2 = str(donor.get('HLA_A2', ''))
    don_b1 = str(donor.get('HLA_B1', ''))
    don_b2 = str(donor.get('HLA_B2', ''))

    hla_a1_match = 1 if rec_a1 and rec_a1 == don_a1 else 0
    hla_a2_match = 1 if rec_a2 and rec_a2 == don_a2 else 0
    hla_b1_match = 1 if rec_b1 and rec_b1 == don_b1 else 0
    hla_b2_match = 1 if rec_b2 and rec_b2 == don_b2 else 0
    total_hla = hla_a1_match + hla_a2_match + hla_b1_match + hla_b2_match

    # Age difference
    rec_age = int(recipient.get('age', recipient.get('Age', 30)))
    don_age = int(donor.get('age', donor.get('Age', 30)))
    age_diff = abs(rec_age - don_age)

    # Donor weight
    weight = int(donor.get('weight', donor.get('Weight', 65)))

    return [blood_match, hla_a1_match, hla_a2_match,
            hla_b1_match, hla_b2_match, total_hla,
            age_diff, weight]


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
            features = compute_ml_features(recipient, donor)
            features_array = np.array([features])

            # Scale features
            features_scaled = scaler.transform(features_array)

            # Predict class
            pred_class = model.predict(features_scaled)[0]
            pred_label = le.inverse_transform([pred_class])[0]

            # Predict probabilities
            pred_proba = model.predict_proba(features_scaled)[0]
            class_probs = {
                le.inverse_transform([i])[0]: round(float(p) * 100, 1)
                for i, p in enumerate(pred_proba)
            }

            # Get confidence (probability of predicted class)
            confidence = round(float(max(pred_proba)) * 100, 1)

            predictions.append({
                'donor_id':     donor.get('_id', donor.get('Donor_ID', '')),
                'suitability':  pred_label,
                'confidence':   confidence,
                'probabilities': class_probs
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
    print("\n" + "=" * 50)
    print("🚀 Starting Flask ML Server on port 5001...")
    print("=" * 50)
    print("   Endpoints:")
    print("   POST /predict      — Rule-based matching")
    print("   POST /ml-predict   — ML-powered prediction")
    print("   GET  /model-info   — Model metadata")
    print("=" * 50 + "\n")
    app.run(port=5001, debug=True)
