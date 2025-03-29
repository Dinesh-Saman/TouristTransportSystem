# ml/predict.py
import sys
import json
import joblib
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

def load_model_artifacts():
    """Load model and preprocessing artifacts"""
    try:
        model = joblib.load('ml/trained_model/recommender.joblib')
        mlb = joblib.load('ml/trained_model/multi_label_binarizer.joblib')
        feature_columns = json.load(open('ml/trained_model/feature_columns.json'))
        return model, mlb, feature_columns
    except Exception as e:
        print(f"Error loading model artifacts: {str(e)}", file=sys.stderr)
        raise

def prepare_features(user_prefs, place_features):
    """Convert inputs to model-ready features"""
    features = {
        'age': user_prefs['age'],
        'gender': user_prefs.get('gender', 'unknown'),
        'climate': user_prefs.get('climate', 'Temperate')
    }
    
    # Multi-label features
    for feature_type in ['place_type', 'hobby', 'health_issues']:
        user_values = user_prefs.get(feature_type, [])
        place_values = place_features.get(feature_type, [])
        combined = list(set(user_values + place_values))
        features[feature_type] = combined
        
    return features

def predict_place_score(model, mlb, features):
    """Generate prediction score for a place"""
    # Convert features to DataFrame
    df = pd.DataFrame([features])
    
    # Apply the same preprocessing as during training
    df = pd.get_dummies(df, columns=['gender', 'climate'])
    
    # Ensure all expected columns are present
    expected_columns = json.load(open('ml/trained_model/feature_columns.json'))
    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0
    
    # Reorder columns to match training
    df = df[expected_columns]
    
    # Get prediction
    score = model.predict_proba(df)[0][1]  # Probability of recommendation
    return float(score * 100)  # Convert to percentage

def main():
    try:
        # Load input data from Node.js
        input_data = json.loads(sys.argv[1])
        user_prefs = input_data['preferences']
        places = input_data['places']
        
        # Load model
        model, mlb, _ = load_model_artifacts()
        
        # Generate predictions
        results = []
        for place in places:
            try:
                features = prepare_features(user_prefs, place['features'])
                score = predict_place_score(model, mlb, features)
                results.append({
                    'placeId': place['id'],
                    'score': score,
                    'name': place['name']
                })
            except Exception as e:
                print(f"Error processing place {place['id']}: {str(e)}", file=sys.stderr)
                continue
                
        # Output results to stdout (will be read by Node.js)
        print(json.dumps(results))
        
    except Exception as e:
        print(f"Prediction failed: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()