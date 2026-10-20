import json
import warnings
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler, OrdinalEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error
import joblib

warnings.filterwarnings("ignore")

print("Loading dataset...")
csv_path = 'Student Social Media And Mental Health Impact.csv'
df = pd.read_csv(csv_path)

df = df.drop_duplicates()
df['Physical_Activity_Hours'] = df['Physical_Activity_Hours'].clip(lower=0)
df['Study_Hours'] = df['Study_Hours'].clip(lower=0)

top_countries = df['Country'].value_counts().index[:10].tolist()

def group_countries(country):
    if country in top_countries:
        return country
    return 'Other'

df['Grouped_country'] = df['Country'].apply(group_countries)

skew_col = ['Study_Hours']
numerical_cols = [
    'Age', 'Avg_Daily_Usage_Hours', 'Daily_Unlocks', 'Physical_Activity_Hours', 'Sleep_Hours_Per_Night'
]
ordinal_cols = ['Stress_Level']
categorical_cols = [
    'Gender', 'Grouped_country', 'Academic_Level', 'Most_Used_Platform', 'Purpose_Of_Use'
]
feature_col = numerical_cols + ordinal_cols + categorical_cols + skew_col

X = df[feature_col]
y = df['Mental_Health_Score']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.30, random_state=42)
print(f"X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")

skew_pipeline = Pipeline([
    ('log_transform', FunctionTransformer(np.log1p, feature_names_out='one-to-one')),
    ('scaler', StandardScaler())
])

numerical_pipeline = Pipeline([
    ('scaler', StandardScaler())
])

ordinal_pipeline = Pipeline([
    ('encoder', OrdinalEncoder(categories=[['Low', 'Medium', 'High', 'Very High']]))
])

categorical_pipeline = Pipeline([
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer([
    ('skew', skew_pipeline, skew_col),
    ('numerical', numerical_pipeline, numerical_cols),
    ('categorical', categorical_pipeline, categorical_cols),
    ('ordinal', ordinal_pipeline, ordinal_cols)
])

# 1. Linear Regression
print("Training Linear Regression...")
lr_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])
lr_pipeline.fit(X_train, y_train)
lr_pred_test = lr_pipeline.predict(X_test)
lr_pred_train = lr_pipeline.predict(X_train)

lr_metrics = {
    "R2": float(r2_score(y_test, lr_pred_test)),
    "Training_R2": float(r2_score(y_train, lr_pred_train)),
    "MAE": float(mean_absolute_error(y_test, lr_pred_test)),
    "RMSE": float(root_mean_squared_error(y_test, lr_pred_test))
}
print("LR:", lr_metrics)

# 2. Random Forest Default
print("Training Random Forest Default...")
rf_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('random_forest', RandomForestRegressor(random_state=42, n_jobs=-1))
])
rf_pipeline.fit(X_train, y_train)
rf_pred_test = rf_pipeline.predict(X_test)
rf_pred_train = rf_pipeline.predict(X_train)

rf_default_metrics = {
    "R2": float(r2_score(y_test, rf_pred_test)),
    "Training_R2": float(r2_score(y_train, rf_pred_train)),
    "MAE": float(mean_absolute_error(y_test, rf_pred_test)),
    "RMSE": float(root_mean_squared_error(y_test, rf_pred_test))
}
print("RF Default:", rf_default_metrics)

# 3. Random Forest Tuned
print("Tuning Random Forest with RandomizedSearchCV...")
param_grid = {
    "random_forest__n_estimators": [100, 200],
    "random_forest__max_depth": [5, 10, 15],
    "random_forest__min_samples_split": [2, 5, 10],
    "random_forest__min_samples_leaf": [1, 2, 4]
}

random_search = RandomizedSearchCV(
    estimator=rf_pipeline,
    param_distributions=param_grid,
    n_iter=8,
    cv=3,
    scoring="r2",
    random_state=42,
    n_jobs=-1
)
random_search.fit(X_train, y_train)

best_rf = random_search.best_estimator_
rf_tuned_pred_test = best_rf.predict(X_test)
rf_tuned_pred_train = best_rf.predict(X_train)

rf_tuned_metrics = {
    "R2": float(r2_score(y_test, rf_tuned_pred_test)),
    "Training_R2": float(r2_score(y_train, rf_tuned_pred_train)),
    "MAE": float(mean_absolute_error(y_test, rf_tuned_pred_test)),
    "RMSE": float(root_mean_squared_error(y_test, rf_tuned_pred_test)),
    "best_params": {k: int(v) if isinstance(v, (np.integer, int)) else v for k, v in random_search.best_params_.items()}
}
print("RF Tuned:", rf_tuned_metrics)

# Save best model
joblib.dump(best_rf, 'Mental_Health_Model.pkl')
print("Saved Mental_Health_Model.pkl")

# Extract feature importances if possible
rf_model = best_rf.named_steps['random_forest']
prep = best_rf.named_steps['preprocessor']

feature_names = []
try:
    feature_names = list(prep.get_feature_names_out())
    importances = rf_model.feature_importances_.tolist()
    feat_imp = sorted([{"feature": f, "importance": round(imp, 4)} for f, imp in zip(feature_names, importances)], key=lambda x: x["importance"], reverse=True)
except Exception as e:
    print("Could not extract feature importances:", e)
    feat_imp = []

# Model comparison table
comparison = [
    {
        "model": "Linear Regression",
        "r2": round(lr_metrics["R2"], 4),
        "train_r2": round(lr_metrics["Training_R2"], 4),
        "mae": round(lr_metrics["MAE"], 4),
        "rmse": round(lr_metrics["RMSE"], 4)
    },
    {
        "model": "Random Forest (Default)",
        "r2": round(rf_default_metrics["R2"], 4),
        "train_r2": round(rf_default_metrics["Training_R2"], 4),
        "mae": round(rf_default_metrics["MAE"], 4),
        "rmse": round(rf_default_metrics["RMSE"], 4)
    },
    {
        "model": "Random Forest (Tuned)",
        "r2": round(rf_tuned_metrics["R2"], 4),
        "train_r2": round(rf_tuned_metrics["Training_R2"], 4),
        "mae": round(rf_tuned_metrics["MAE"], 4),
        "rmse": round(rf_tuned_metrics["RMSE"], 4)
    }
]

metrics_summary = {
    "comparison": comparison,
    "best_model": "Random Forest (Tuned)",
    "best_params": rf_tuned_metrics["best_params"],
    "top_feature_importances": feat_imp[:12],
    "dataset_size": len(df),
    "features_count": len(feature_col),
    "features_list": feature_col,
    "score_stats": {
        "min": float(df['Mental_Health_Score'].min()),
        "max": float(df['Mental_Health_Score'].max()),
        "mean": float(df['Mental_Health_Score'].mean()),
        "std": float(df['Mental_Health_Score'].std())
    },
    "top_10_countries": top_countries
}

with open('model_evaluation.json', 'w') as f:
    json.dump(metrics_summary, f, indent=2)

print("Saved model_evaluation.json successfully!")
