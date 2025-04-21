from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
import joblib
import certifi

app = Flask(__name__)
CORS(app)

# MongoDB connection with certifi for SSL verification
client = MongoClient("mongodb+srv://rit007:HInvB6lzobHltSSE@dulcet.a62sz.mongodb.net/?retryWrites=true&w=majority&appName=dulcet", tlsCAFile=certifi.where())
db = client["test"]
income_collection = db["incomes"]
expenses_collection = db["expenses"]

@app.route('/')
def index():
    return "💡 AI-Powered Saving Tips API is running."

@app.route('/check-expense/<user_id>', methods=['GET'])
def check_expense(user_id):
    # Fetch income document
    income_doc = income_collection.find_one({"userId": user_id})
    
    # Fetch all expense documents for this user
    expense_docs = expenses_collection.find({"userId": user_id})
    
    if not income_doc:
        return jsonify({"error": "User income data not found"}), 404

    # Get income amount
    income = income_doc.get("amount")
    
    # Create an array of all expense amounts for this user
    expenses = []
    for expense in expense_docs:
        if "amount" in expense:
            expenses.append(expense["amount"])
    if income is None or not expenses:
        return jsonify({"error": "Incomplete user data"}), 400

    # Train the model
    X_train = [[income]] * len(expenses)
    y_train = expenses
    model = LinearRegression()
    model.fit(X_train, y_train)
    joblib.dump(model, 'model.pkl')

    # Predict and generate alert
    predicted_expense = model.predict([[income]])[0]

    if sum(expenses) > 0.9 * income:
        alert = "Your expense is NOT in a safe range."
    else:
        alert = "Your expense is in a safe range."

    return jsonify({
        "user_id": user_id,
        "alert": alert
    })

if __name__ == '__main__':
    app.run(debug=True)