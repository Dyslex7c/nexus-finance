# Goal-Based Savings Predictor using ML (Linear Regression)
# Assumes MongoDB collections: 'income_<user_id>' and 'expenses_<user_id>'

from flask import Flask, request, jsonify
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import joblib

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client['test']

# Helper function to fetch data from MongoDB
def fetch_user_data(user_id):
    income_collection = db["incomes"]
    expense_collection = db["expenses"]

    income_data = pd.DataFrame(list(income_collection.find()))
    expense_data = pd.DataFrame(list(expense_collection.find()))

    if income_data.empty or expense_data.empty:
        return None, None

    # Ensure both collections have 'month' and 'amount' fields
    income_data = income_data[['month', 'amount']].rename(columns={'amount': 'income'})
    expense_data = expense_data[['month', 'amount']].rename(columns={'amount': 'expense'})

    # Merge on month
    merged = pd.merge(income_data, expense_data, on='month')
    merged['savings'] = merged['income'] - merged['expense']

    return merged[['month']], merged['savings']

# Train model for a specific user
def train_model(user_id):
    X, y = fetch_user_data(user_id)
    if X is None or y is None or len(X) < 3:
        return None

    # Convert months to integers (0, 1, 2, ...)
    X_encoded = np.arange(len(X)).reshape(-1, 1)

    model = LinearRegression()
    model.fit(X_encoded, y)

    # Save model for the user
    joblib.dump(model, f"model_{user_id}.pkl")
    return model

# Predict future month to buy a product
@app.route("/predict_goal", methods=["POST"])
def predict_goal():
    data = request.get_json()
    user_id = data['user_id']
    goal_price = float(data['goal_price'])

    try:
        model = joblib.load(f"model_{user_id}.pkl")
    except:
        model = train_model(user_id)
        if model is None:
            return jsonify({"error": "Not enough data to train model."}), 400

    # Predict savings for next months
    future_months = np.array(range(12)).reshape(-1, 1) + len(fetch_user_data(user_id)[0])
    predicted_savings = model.predict(future_months)

    # Accumulate until we can afford the goal
    total_saving = 0
    months_needed = 0
    for saving in predicted_savings:
        if saving < 0:
            continue  # skip if model predicts negative saving
        total_saving += saving
        months_needed += 1
        if total_saving >= goal_price:
            break

    if total_saving < goal_price:
        return jsonify({"message": "Goal not achievable within 12 months based on current savings pattern."}), 400

    today = datetime.today()
    target_date = today + timedelta(days=30 * months_needed)
    monthly_saving = round(goal_price / months_needed, 2)

    return jsonify({
        "months_needed": months_needed,
        "monthly_saving_needed": monthly_saving,
        "target_date": target_date.strftime("%B %Y")
    })

if __name__ == '__main__':
    app.run(debug=True)