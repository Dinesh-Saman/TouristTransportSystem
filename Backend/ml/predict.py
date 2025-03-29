import sys
import json
import os
import traceback
import joblib
import numpy as np

def load_model_artifacts():
    """Load all required model artifacts"""
    try:
        model = joblib.load('ml/trained_model/recommender.joblib')
        mlb_place = joblib.load('ml/trained_model/mlb_place_type.joblib')
        mlb_hobby = joblib.load('ml/trained_model/mlb_hobby.joblib')
        mlb_health = joblib.load('ml/trained_model/mlb_health_issues.joblib')
        with open('ml/trained_model/feature_columns.json', 'r') as f:
            feature_columns = json.load(f)
        return model, mlb_place, mlb_hobby, mlb_health, feature_columns
    except Exception as e:
        raise ValueError(f"Error loading model artifacts: {str(e)}")

def prepare_features(user_prefs, place_features, mlb_place, mlb_hobby, mlb_health, feature_columns):
    """Convert inputs to model-ready features"""
    # Initialize feature vector with zeros
    feature_vector = np.zeros(len(feature_columns))
    
    # Set numerical features
    age_idx = feature_columns.index('age')
    feature_vector[age_idx] = user_prefs['age']
    
    # Transform and set multi-label features
    try:
        # Place types
        place_encoded = mlb_place.transform([place_features['place_type']])[0]
        for i, val in enumerate(mlb_place.classes_):
            col_name = f"place_type_{val}"
            if col_name in feature_columns:
                idx = feature_columns.index(col_name)
                feature_vector[idx] = place_encoded[i]
        
        # Hobbies
        hobby_encoded = mlb_hobby.transform([user_prefs['hobby']])[0]
        for i, val in enumerate(mlb_hobby.classes_):
            col_name = f"hobby_{val}"
            if col_name in feature_columns:
                idx = feature_columns.index(col_name)
                feature_vector[idx] = hobby_encoded[i]
        
        # Health issues
        health_encoded = mlb_health.transform([user_prefs['health_issues']])[0]
        for i, val in enumerate(mlb_health.classes_):
            col_name = f"health_issues_{val}"
            if col_name in feature_columns:
                idx = feature_columns.index(col_name)
                feature_vector[idx] = health_encoded[i]
    
    except ValueError as e:
        print(f"Warning: Unknown categories found: {str(e)}", file=sys.stderr)
    
    # Set single-value categoricals (gender, climate)
    gender_col = f"gender_{user_prefs.get('gender', 'unknown')}"
    if gender_col in feature_columns:
        feature_vector[feature_columns.index(gender_col)] = 1
        
    climate_col = f"climate_{user_prefs.get('climate', 'Tropical')}"
    if climate_col in feature_columns:
        feature_vector[feature_columns.index(climate_col)] = 1
    
    return feature_vector

def main():
    try:
        # 1. Load model artifacts
        model, mlb_place, mlb_hobby, mlb_health, feature_columns = load_model_artifacts()
        
        # 2. Verify input file exists
        if len(sys.argv) < 2:
            raise ValueError("No input file provided")
            
        input_file = sys.argv[1]
        if not os.path.exists(input_file):
            raise FileNotFoundError(f"Input file not found: {input_file}")

        # 3. Read input data
        with open(input_file, 'r', encoding='utf-8') as f:
            input_data = json.load(f)
        
        # 4. Process each place
        results = []
        for place in input_data['places']:
            try:
                # Prepare features
                features = prepare_features(
                    input_data['preferences'],
                    place['features'],
                    mlb_place,
                    mlb_hobby,
                    mlb_health,
                    feature_columns
                )
                
                # Predict
                score = model.predict_proba([features])[0][1] * 100  # Probability of recommendation
                
                results.append({
                    "placeId": place['id'],
                    "score": round(float(score), 1),
                    "name": place['name']
                })
            except Exception as e:
                print(f"Error processing place {place['id']}: {str(e)}", file=sys.stderr)
                continue
        
        # 5. Output results
        print(json.dumps(results))
        
    except Exception as e:
        print(f"Prediction failed: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()