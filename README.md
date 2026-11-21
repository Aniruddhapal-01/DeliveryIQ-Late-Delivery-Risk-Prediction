# DeliveryIQ — E-Commerce Late Delivery Risk Prediction

**An end-to-end Machine Learning project to predict late delivery risk in e-commerce orders using the Olist Brazilian E-Commerce dataset.**

DeliveryIQ estimates the probability that an order will be delivered later than its estimated delivery date. The project combines data preprocessing, feature engineering, model evaluation, a trained Machine Learning pipeline, a FastAPI backend, and a web-based frontend.

## Live Demo

- **Frontend:** https://deliveryiq-frontend.onrender.com
- **Backend API:** https://deliveryiq-api-3vic.onrender.com
- **API Documentation:** https://deliveryiq-api-3vic.onrender.com/docs

## Project Overview

Late deliveries can negatively affect customer satisfaction, operational efficiency, and business performance.

DeliveryIQ explores how Machine Learning can help identify potentially delayed orders before delivery, allowing businesses to prioritize orders that may require additional attention.

The application accepts order-related information and returns:

- Estimated late-delivery probability
- Predicted delivery risk
- Prediction status

## Features

- End-to-end Machine Learning workflow
- Data cleaning and preprocessing
- Feature engineering from order, customer, seller, payment, and product information
- Handling of class imbalance
- Random Forest classification
- Classification threshold tuning
- Saved preprocessing and prediction pipeline
- FastAPI backend for real-time inference
- Interactive frontend connected to the deployed API
- Model performance evaluation and visualization

## Machine Learning Workflow

1. **Data Preparation**  
   Cleaned and prepared the Olist e-commerce dataset for analysis and model training.

2. **Feature Engineering**  
   Created meaningful features related to order characteristics, customer and seller locations, payment information, product details, and delivery estimates.

3. **Target Definition**  
   Defined late delivery as an order delivered after its estimated delivery date.

4. **Preprocessing**  
   Built a preprocessing pipeline to handle numerical and categorical features, including imputation, scaling, and encoding.

5. **Model Training**  
   Trained and evaluated a Random Forest classifier.

6. **Model Evaluation**  
   Used precision, recall, F1-score, and confusion matrix to evaluate performance, with particular attention to the minority late-delivery class.

7. **Threshold Tuning**  
   Tuned the classification threshold to better balance the detection of late orders against false alerts.

8. **Deployment**  
   Saved the complete model pipeline and integrated it with a FastAPI backend and web frontend.

## Model Performance

The model was evaluated on a validation dataset.

| Metric | Late Delivery Class |
|---|---:|
| Precision | Approximately 0.31 |
| Recall | Approximately 0.36 |
| F1-score | Approximately 0.33 |

The dataset is imbalanced, with late deliveries representing a smaller proportion of orders. Therefore, accuracy alone is not sufficient to evaluate the model.

The current model identifies a portion of late orders but also produces false-positive alerts. These limitations are important considerations for real-world use.

*These are validation results, not a guarantee of performance on unseen production data.*

## Tech Stack

**Programming and Data Science**
- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn

**Backend**
- FastAPI
- Uvicorn

**Frontend**
- HTML
- CSS
- JavaScript

**Deployment and Tools**
- Git
- GitHub
- Render
- Jupyter Notebook
- VS Code

## Project Structure

```text
DeliveryIQ-Late-Delivery-Risk-Prediction/
│
├── notebooks/
│   └── Olist_Late_Delivery_Prediction.ipynb
│
├── model/
│   └── olist_late_delivery_model.pkl
│
├── backend/
│   ├── __init__.py
│   ├── predictor.py
│   └── main.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── requirements.txt
├── .gitignore
└── README.md
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Aniruddhapal-01/DeliveryIQ-Late-Delivery-Risk-Prediction.git
```

### 2. Navigate to the project directory

```bash
cd DeliveryIQ-Late-Delivery-Risk-Prediction
```

### 3. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the FastAPI backend

```bash
python -m uvicorn backend.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Run the frontend

Open `frontend/index.html` using VS Code Live Server or another local static server.

The frontend is configured to communicate with the deployed API by default. For local backend testing, update the API URL in `frontend/script.js` to:

```javascript
const API_URL = "http://127.0.0.1:8000/predict";
```

## API Endpoint

### Health Check

```http
GET /
```

Returns the API status.

### Model Information

```http
GET /model-info
```

Returns information about the model and its expected input features.

### Prediction

```http
POST /predict
```

Accepts order-related feature values as JSON and returns the prediction result.

## Dataset

This project uses the **Brazilian E-Commerce Public Dataset by Olist**, available on Kaggle.

The raw dataset is not included in this repository because of its size.

Dataset source:

https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

## Limitations and Future Improvements

- Improve recall and precision for late-delivery predictions.
- Explore additional classification algorithms and ensemble methods.
- Add explainability using SHAP.
- Improve prediction result visualization and feature-level explanations.
- Evaluate the model on a more independent test dataset.
- Explore business-oriented risk prioritization and monitoring.

## Disclaimer

DeliveryIQ is an educational and portfolio Machine Learning project. Predictions are estimates based on historical data and should not be treated as guaranteed delivery outcomes or production logistics decisions.

## Author

**Aniruddha Pal**

B.Tech Computer Science and Engineering

GitHub: https://github.com/AniruddhaPal-01

LinkedIn: https://www.linkedin.com/in/aniruddha-pal-b0a888359/

---

If you find this project interesting, feel free to explore the repository and live demo.
