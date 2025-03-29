import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import MultiLabelBinarizer
import joblib
import json
from collections import defaultdict

def ensure_dir_exists(path):
    """Ensure directory exists, create if it doesn't"""
    os.makedirs(path, exist_ok=True)

def generate_synthetic_data():
    """Generate better synthetic data with meaningful patterns"""
    np.random.seed(42)
    num_samples = 5000
    
def generate_synthetic_data():
    """Generate better synthetic data with meaningful patterns"""
    np.random.seed(42)
    num_samples = 25000
    
    place_info = {
        'Temple of the Tooth': {
            'types': ['Religious', 'Historical'],
            'best_for': ['Sightseeing', 'Photography'],
            'climate': 'Tropical',
            'age_range': (10, 80),
            'health_warnings': ['Back Pain']
        },
        'Royal Botanical Gardens': {
            'types': ['Historical'],
            'best_for': ['Photography', 'Relaxation'],
            'climate': 'Tropical',
            'age_range': (0, 100),
            'health_warnings': []
        },
        'Mirissa Beach': {
            'types': ['Beach'],
            'best_for': ['Surfing', 'Relaxation'],
            'climate': 'Tropical',
            'age_range': (10, 70),
            'health_warnings': ['Asthma']
        },
        'Commonwealth War Cemetery': {
            'types': ['Historical'],
            'best_for': ['Photography'],
            'climate': 'Tropical',
            'age_range': (10, 80),
            'health_warnings': []
        },
        'Peradeniya University': {
            'types': ['Educational', 'Historical'],
            'best_for': ['Sightseeing'],
            'climate': 'Tropical',
            'age_range': (15, 80),
            'health_warnings': []
        },
        'Udawattakele Forest Reserve': {
            'types': ['Nature'],
            'best_for': ['Hiking', 'Photography'],
            'climate': 'Tropical',
            'age_range': (10, 70),
            'health_warnings': ['Asthma']
        },
        'Ceylon Tea Museum': {
            'types': ['Historical', 'Educational'],
            'best_for': ['Sightseeing'],
            'climate': 'Tropical',
            'age_range': (10, 80),
            'health_warnings': []
        },
        'Kandy Lake': {
            'types': ['Nature'],
            'best_for': ['Relaxation', 'Photography'],
            'climate': 'Tropical',
            'age_range': (0, 80),
            'health_warnings': []
        },
        'Hanthana Mountain Range': {
            'types': ['Nature'],
            'best_for': ['Hiking', 'Photography'],
            'climate': 'Tropical',
            'age_range': (15, 65),
            'health_warnings': ['Back Pain', 'Asthma']
        },
        'Gadaladeniya Temple': {
            'types': ['Religious', 'Historical'],
            'best_for': ['Photography', 'Sightseeing'],
            'climate': 'Tropical',
            'age_range': (10, 80),
            'health_warnings': ['Back Pain']
        },
        'Bahirawakanda Vihara Buddha Statue': {
            'types': ['Religious'],
            'best_for': ['Photography', 'Sightseeing'],
            'climate': 'Tropical',
            'age_range': (10, 80),
            'health_warnings': ['Back Pain']
        }
    }
    
    data = []
    for _ in range(num_samples):
        age = np.random.randint(5, 80)
        gender = np.random.choice(['male', 'female', 'other'])
        place = np.random.choice(list(place_info.keys()))
        info = place_info[place]
        
        # Adjust probability based on age suitability
        age_min, age_max = info['age_range']
        age_prob = 1.0 if age_min <= age <= age_max else 0.3
        
        if np.random.random() < age_prob:
            data.append({
                'age': age,
                'gender': gender,
                'place_type': info['types'],
                'hobby': [np.random.choice(info['best_for'])],
                'climate': info['climate'],
                'health_issues': info['health_warnings'] if np.random.random() < 0.3 else [],
                'selected_place': place
            })
    
    return pd.DataFrame(data)

def preprocess_data(df):
    """Convert categorical data to numerical features"""
    # Initialize MultiLabelBinarizer for each multi-label column
    mlbs = {
        'place_type': MultiLabelBinarizer(),
        'hobby': MultiLabelBinarizer(),
        'health_issues': MultiLabelBinarizer()
    }
    
    # Fit and transform each multi-label column
    processed_dfs = []
    for col, mlb in mlbs.items():
        # Fit on all possible values
        unique_values = set()
        for values in df[col]:
            unique_values.update(values)
        mlb.fit([list(unique_values)])
        
        # Transform the column
        encoded = mlb.transform(df[col])
        encoded_df = pd.DataFrame(encoded, columns=[f"{col}_{v}" for v in mlb.classes_])
        processed_dfs.append(encoded_df)
        
        # Save the fitted binarizer
        joblib.dump(mlb, f'ml/trained_model/mlb_{col}.joblib')
    
    # Handle single-value categoricals
    df = pd.get_dummies(df, columns=['gender', 'climate'])
    
    # Combine all features
    processed = pd.concat([df.drop(['place_type', 'hobby', 'health_issues'], axis=1)] + processed_dfs, axis=1)
    
    return processed

def train_model():
    try:
        ensure_dir_exists('ml/dataset')
        ensure_dir_exists('ml/trained_model')
        
        print("Generating synthetic data...")
        df = generate_synthetic_data()
        df.to_csv('ml/dataset/recommendation_data.csv', index=False)
        
        print("Preprocessing data...")
        processed = preprocess_data(df)
        X = processed.drop('selected_place', axis=1)
        y = processed['selected_place']
        
        print("Saving feature columns...")
        with open('ml/trained_model/feature_columns.json', 'w') as f:
            json.dump(list(X.columns), f)
        
        print("Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("Training model...")
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=15,
            class_weight='balanced',
            random_state=42,
            verbose=1
        )
        model.fit(X_train, y_train)
        
        print("\nModel evaluation:")
        print(classification_report(y_test, model.predict(X_test)))
        
        print("Saving model...")
        joblib.dump(model, 'ml/trained_model/recommender.joblib')
        
        print("\nTraining completed successfully!")
        print("Saved artifacts:")
        print("- recommender.joblib (model)")
        print("- mlb_place_type.joblib (multi-label binarizer)")
        print("- mlb_hobby.joblib (multi-label binarizer)")
        print("- mlb_health_issues.joblib (multi-label binarizer)")
        print("- feature_columns.json (feature order)")
        
    except Exception as e:
        print(f"\nError during training: {str(e)}")
        raise

if __name__ == '__main__':
    train_model()