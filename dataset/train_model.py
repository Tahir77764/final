"""
============================================================
🧬 BONE MARROW DONOR MATCH - ML MODEL TRAINING SCRIPT
============================================================
Trains 3 ML Models:
  1. K-Nearest Neighbors (KNN)
  2. Random Forest Classifier
  3. Logistic Regression

Predicts: Donor-Recipient Compatibility
  → "High"   (blood match + 3-4 HLA matches)
  → "Medium" (blood match + 1-2 HLA matches)
  → "Low"    (no blood match or 0 HLA matches)

Saves the best model to ml_model.pkl
============================================================
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import warnings
warnings.filterwarnings('ignore')


# ============================
# 1. LOAD THE DONOR DATASET
# ============================
print("=" * 60)
print("BONE MARROW DONOR - ML MODEL TRAINING")
print("=" * 60)

csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "synthetic_bone_marrow_donors_500.csv")
df = pd.read_csv(csv_path)
df.columns = df.columns.str.strip().str.replace(" ", "_")

# Rename columns to standard names
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

# Handle missing Weight column
if 'Weight' not in df.columns:
    print("WARNING: Weight column missing. Generating random weights...")
    df['Weight'] = np.random.randint(50, 100, size=len(df))

df['Age'] = df['Age'].astype(int)
df['Weight'] = df['Weight'].astype(int)

print(f"\nLoaded {len(df)} donor records from CSV")
print(f"Columns: {list(df.columns)}")


# ============================
# 2. GENERATE TRAINING DATA
# ============================
# Since we don't have real transplant outcome data,
# we generate synthetic donor-recipient pairs and label
# them based on established medical compatibility rules.
# This is a standard approach in medical ML research when
# real outcome labels are unavailable.

np.random.seed(42)

# Collect all unique HLA values for each locus
hla_loci = ['HLA_A1', 'HLA_A2', 'HLA_B1', 'HLA_B2', 'HLA_C1', 'HLA_C2', 'HLA_DRB1_1', 'HLA_DRB1_2', 'HLA_DQ1', 'HLA_DQ2']
hla_values = {}
for col in hla_loci:
    if col in df.columns:
        hla_values[col] = df[col].unique().tolist()
    else:
        # Generate synthetic values if column missing in basic CSV
        hla_values[col] = [f"{np.random.randint(1, 99):02d}:{np.random.randint(1, 99):02d}" for _ in range(20)]

blood_groups = df['Blood_Group'].unique().tolist()
training_pairs = []

NUM_SAMPLES = 10000
print(f"\nGenerating {NUM_SAMPLES} synthetic donor-recipient training pairs...")

for i in range(NUM_SAMPLES):
    # Pick a random donor from the dataset
    donor = df.sample(1).iloc[0]

    # Randomly decide number of HLA matches (0 to 10)
    target_hla_matches = np.random.randint(0, 11)
    
    rec_data = {'Blood_Group': donor['Blood_Group']}
    
    # Decide if blood matches (90% chance for training variety)
    if np.random.random() > 0.9:
        rec_data['Blood_Group'] = np.random.choice([bg for bg in blood_groups if bg != donor['Blood_Group']])
    
    # Select WHICH loci will match
    matching_loci = np.random.choice(hla_loci, target_hla_matches, replace=False)
    
    # For training the model, we can still use A1, A2, B1, B2 specifically
    # but the user's logic is based on the TOTAL match count.
    hla_matches_dict = {}
    total_hla = 0
    for locus in hla_loci:
        if locus in matching_loci:
            rec_val = donor.get(locus, hla_values[locus][0])
            hla_matches_dict[locus + "_match"] = 1
            total_hla += 1
        else:
            donor_val = donor.get(locus, "")
            options = [v for v in hla_values[locus] if str(v) != str(donor_val)]
            rec_val = np.random.choice(options) if options else "99:99"
            hla_matches_dict[locus + "_match"] = 0

    # ---- Compute Features ----
    blood_match = 1 if rec_data['Blood_Group'] == donor['Blood_Group'] else 0
    age_diff = abs(np.random.randint(18, 70) - int(donor['Age']))
    weight = int(donor['Weight'])

    # ---- Determine Label (matching user's request) ----
    if total_hla >= 7:
        label = "High"
    elif total_hla >= 4:
        label = "Medium"
    else:
        label = "Low"

    training_pair = {
        'blood_match':      blood_match,
        'total_hla_matches': total_hla,
        'age_difference':   age_diff,
        'donor_weight':     weight,
        'label':            label
    }
    # Add individual locus matches for the first 4 (to keep FEATURE_COLS similar if possible)
    training_pair.update({
        'hla_a1_match': hla_matches_dict['HLA_A1_match'],
        'hla_a2_match': hla_matches_dict['HLA_A2_match'],
        'hla_b1_match': hla_matches_dict['HLA_B1_match'],
        'hla_b2_match': hla_matches_dict['HLA_B2_match']
    })
    
    training_pairs.append(training_pair)

train_df = pd.DataFrame(training_pairs)

print(f"Generated {len(train_df)} training pairs\n")
print("Label Distribution:")
for lbl, cnt in train_df['label'].value_counts().items():
    pct = cnt / len(train_df) * 100
    print(f"   {lbl:>6s}: {cnt:>5d}  ({pct:.1f}%)")


# ============================
# 3. PREPARE FEATURES & SPLIT
# ============================
FEATURE_COLS = [
    'blood_match',
    'hla_a1_match', 'hla_a2_match',
    'hla_b1_match', 'hla_b2_match',
    'total_hla_matches',
    'age_difference',
    'donor_weight'
]

X = train_df[FEATURE_COLS]
y = train_df['label']

# Encode labels (High=0, Low=1, Medium=2) — sklearn sorts alphabetically
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Scale features for KNN and Logistic Regression
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train / Test split (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_encoded,
    test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"\nTraining set: {len(X_train)}  |  Test set: {len(X_test)}")
print(f"Label classes: {list(le.classes_)}")


# ============================
# 4. TRAIN ALL 3 MODELS
# ============================
models = {
    'K-Nearest Neighbors (KNN)': KNeighborsClassifier(n_neighbors=5),
    'Random Forest':             RandomForestClassifier(n_estimators=100,
                                                        random_state=42),
    'Logistic Regression':       LogisticRegression(max_iter=1000,
                                                    random_state=42)
}

results = {}
best_model = None
best_accuracy = 0
best_name = ""

print("\n" + "=" * 60)
print("TRAINING ALL 3 MODELS")
print("=" * 60)

for name, model in models.items():
    print(f"\n{'-' * 50}")
    print(f"Training: {name}")
    print(f"{'-' * 50}")

    # Train
    model.fit(X_train, y_train)

    # Predict
    y_pred = model.predict(X_test)

    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    cv_scores = cross_val_score(model, X_scaled, y_encoded, cv=5)

    results[name] = {
        'accuracy':  accuracy,
        'cv_mean':   cv_scores.mean(),
        'cv_std':    cv_scores.std(),
        'model':     model
    }

    print(f"\n   Test Accuracy:        {accuracy:.4f}  ({accuracy*100:.1f}%)")
    print(f"   Cross-Val Accuracy:  {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    print(f"\n   Classification Report:")
    report = classification_report(y_test, y_pred,
                                   target_names=le.classes_)
    print(report)

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model
        best_name = name


# ============================
# 5. FEATURE IMPORTANCE (Random Forest)
# ============================
rf_model = results['Random Forest']['model']
importances = rf_model.feature_importances_

print("\n" + "=" * 60)
print("FEATURE IMPORTANCE (Random Forest)")
print("=" * 60)
for feat, imp in sorted(zip(FEATURE_COLS, importances),
                        key=lambda x: x[1], reverse=True):
    bar = "#" * int(imp * 40)
    print(f"   {feat:<22s}  {imp:.4f}  {bar}")


# ============================
# 6. SAVE BEST MODEL
# ============================
print("\n" + "=" * 60)
print(f"BEST MODEL: {best_name}")
print(f"   Accuracy: {best_accuracy:.4f}  ({best_accuracy*100:.1f}%)")
print("=" * 60)

model_data = {
    'model':           best_model,
    'scaler':          scaler,
    'label_encoder':   le,
    'feature_columns': FEATURE_COLS,
    'model_name':      best_name,
    'accuracy':        best_accuracy,
    'all_results': {
        k: {kk: vv for kk, vv in v.items() if kk != 'model'}
        for k, v in results.items()
    }
}

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                          'ml_model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model_data, f)

print(f"\nModel saved to: {model_path}")


# ============================
# 7. COMPARISON SUMMARY
# ============================
print("\n" + "=" * 60)
print("FINAL MODEL COMPARISON")
print("=" * 60)
print(f"   {'Model':<35s}  {'Accuracy':>8s}  {'CV Mean':>8s}")
print(f"   {'-'*35}  {'-'*8}  {'-'*8}")
for name, res in results.items():
    marker = "  *" if name == best_name else "   "
    print(f" {marker} {name:<33s}  {res['accuracy']:>7.4f}  {res['cv_mean']:>7.4f}")

print("\nTraining complete! Model is ready for predictions.")
print("   Run 'python api.py' to start the ML prediction server.\n")
