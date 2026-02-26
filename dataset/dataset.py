import streamlit as st
import pandas as pd
import random

# ----------------------------------
# PAGE CONFIG
# ----------------------------------
st.set_page_config(
    page_title="Bone Marrow Donor Recommendation System",
    page_icon="🧬",
    layout="centered"
)

st.title("🧬 Bone Marrow Donor Recommendation System")
st.write("Find suitable donors based on **HLA Type, Age, and Blood Group**")

# ----------------------------------
# LOAD DATA
# ----------------------------------
@st.cache_data
def load_data():
    df = pd.read_csv("bone_marrow_donor_2000_dataset_column_E_removed (1).csv")
    df.columns = df.columns.str.strip().str.replace(" ", "_")

    # Add HLA if missing
    if "HLA_Type" not in df.columns:
        hla_types = [
            "HLA-A*01",
            "HLA-A*02",
            "HLA-B*07",
            "HLA-B*08",
            "HLA-DRB1*15"
        ]
        df["HLA_Type"] = [random.choice(hla_types) for _ in range(len(df))]

    df = df.dropna(subset=["Age", "Blood_Group", "HLA_Type"])
    df["Age"] = df["Age"].astype(int)

    return df

donors = load_data()

# ----------------------------------
# USER INPUT FORM
# ----------------------------------
st.subheader("🔍 Enter Recipient Details")

hla_input = st.selectbox(
    "Select HLA Type",
    sorted(donors["HLA_Type"].unique())
)

blood_input = st.selectbox(
    "Select Blood Group",
    sorted(donors["Blood_Group"].unique())
)

age_input = st.number_input(
    "Enter Recipient Age",
    min_value=1,
    max_value=100,
    value=25
)

top_n = st.slider(
    "Number of Donors to Recommend",
    min_value=1,
    max_value=10,
    value=5
)

# ----------------------------------
# RECOMMENDATION LOGIC
# ----------------------------------
def recommend_donors(hla_type, age, blood_group, top_n):
    filtered = donors[
        (donors["HLA_Type"] == hla_type) &
        (donors["Blood_Group"] == blood_group)
    ].copy()

    if filtered.empty:
        return None

    filtered["Age_Difference"] = abs(filtered["Age"] - age)
    return filtered.sort_values("Age_Difference").head(top_n)

# ----------------------------------
# BUTTON ACTION
# ----------------------------------
if st.button("🔎 Find Donors"):
    results = recommend_donors(hla_input, age_input, blood_input, top_n)

    if results is None:
        st.error("❌ No matching donors found.")
    else:
        st.success("✅ Matching donors found!")
        st.dataframe(results.reset_index(drop=True))
