const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class MLRecommendationService {
    constructor() {
        // Configure paths
        this.pythonPath = this.getPythonPath();
        this.scriptPath = path.resolve(__dirname, '../ml/predict.py');
        
        // Verify critical files exist
        this.verifyFilesExist();
        
        console.log('[ML Service] Python path:', this.pythonPath);
        console.log('[ML Service] Script path:', this.scriptPath);
    }

    getPythonPath() {
        // Try common Python executable names
        const candidates = [
            'python.exe',    // Windows default
            'python3.exe',   // Windows with multiple versions
            'python',        // Unix-like systems
            'python3'        // Unix-like systems with multiple versions
        ];
        
        // Check which one exists in the system PATH
        for (const candidate of candidates) {
            try {
                const { execSync } = require('child_process');
                execSync(`where ${candidate}`, { stdio: 'ignore' });
                return candidate;
            } catch (e) {
                continue;
            }
        }
        
        throw new Error('Python executable not found in PATH');
    }

    verifyFilesExist() {
        if (!fs.existsSync(this.scriptPath)) {
            const error = new Error(`Python script not found at ${this.scriptPath}`);
            console.error('[ML Service] ERROR:', error.message);
            console.error('[ML Service] Please ensure:');
            console.error('1. The predict.py file exists in the ml/ directory');
            console.error('2. The file has proper read permissions');
            throw error;
        }

        // Verify model files exist (warning only in development)
        const requiredModelFiles = [
            '../ml/trained_model/recommender.joblib',
            '../ml/trained_model/multi_label_binarizer.joblib',
            '../ml/trained_model/feature_columns.json'
        ];

        for (const file of requiredModelFiles) {
            const filePath = path.resolve(__dirname, file);
            if (!fs.existsSync(filePath)) {
                const msg = `Model file not found: ${filePath}`;
                if (process.env.NODE_ENV === 'production') {
                    throw new Error(msg);
                }
                console.warn('[ML Service] WARNING:', msg);
            }
        }
    }

    async getRecommendations(userPrefs, places) {
        return new Promise((resolve, reject) => {
            console.log('[ML Service] Starting recommendation process...');
            
            // 1. Prepare input data with error handling
            let inputData;
            try {
                inputData = {
                    preferences: {
                        age: userPrefs.age,
                        gender: userPrefs.gender || 'unknown',
                        placeType: userPrefs.placeType || [],
                        hobby: userPrefs.hobby || [],
                        climate: userPrefs.climate || 'Temperate',
                        health_issues: [
                            ...(userPrefs.diseases || []),
                            ...(userPrefs.physicalDisorders || [])
                        ]
                    },
                    places: places.map(place => ({
                        id: place._id.toString(),
                        name: place.name,
                        features: this.extractPlaceFeatures(place)
                    }))
                };
            } catch (e) {
                return reject(new Error(`Failed to prepare input data: ${e.message}`));
            }
    
            // 2. Create temp directory if it doesn't exist
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                try {
                    fs.mkdirSync(tempDir);
                } catch (e) {
                    return reject(new Error(`Failed to create temp directory: ${e.message}`));
                }
            }
    
            // 3. Write to temp file
            const tempFilePath = path.join(tempDir, `input_${Date.now()}.json`);
            try {
                fs.writeFileSync(tempFilePath, JSON.stringify(inputData, null, 2));
                console.log(`[ML Service] Input data written to ${tempFilePath}`);
            } catch (e) {
                return reject(new Error(`Failed to write temp file: ${e.message}`));
            }
    
            // 4. Execute Python process
            const pythonProcess = spawn(this.pythonPath, [
                this.scriptPath,
                tempFilePath
            ], {
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: true,
                windowsHide: true,
                timeout: 30000 // 30 second timeout
            });
    
            let stdoutData = '';
            let stderrData = '';
            let processTimeout;
    
            // Set timeout for the Python process
            processTimeout = setTimeout(() => {
                pythonProcess.kill();
                reject(new Error('Python process timed out after 30 seconds'));
            }, 30000);
    
            pythonProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
            });
    
            pythonProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.error('[Python STDERR]', data.toString());
            });
    
            pythonProcess.on('error', (error) => {
                clearTimeout(processTimeout);
                console.error('[ML Service] Process error:', error);
                this.cleanupTempFile(tempFilePath);
                reject(new Error(`Failed to start Python process: ${error.message}`));
            });
    
            pythonProcess.on('close', (code) => {
                clearTimeout(processTimeout);
                this.cleanupTempFile(tempFilePath);
    
                if (code !== 0) {
                    const error = new Error(`Python process exited with code ${code}\n${stderrData}`);
                    console.error('[ML Service]', error.message);
                    return reject(error);
                }
    
                this.processPythonOutput(stdoutData, places, userPrefs)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    
    // Helper method to process Python output
    async processPythonOutput(stdoutData, places, userPrefs) {
        try {
            console.log('[ML Service] Raw Python output:', stdoutData.length > 200 ? 
                stdoutData.substring(0, 200) + '...' : stdoutData);
    
            // Extract JSON from stdout (handling potential debug messages)
            const jsonStart = stdoutData.indexOf('[');
            const jsonEnd = stdoutData.lastIndexOf(']');
            
            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error('Invalid JSON output from Python - no array found');
            }
    
            const jsonString = stdoutData.substring(jsonStart, jsonEnd + 1);
            const results = JSON.parse(jsonString);
            
            // Validate results structure
            if (!Array.isArray(results)) {
                throw new Error('Python output is not an array');
            }
    
            // Map results to places
            const recommendations = places.map(place => {
                const result = results.find(r => r.placeId === place._id.toString());
                if (!result) {
                    console.warn(`[ML Service] No result found for place ${place._id}`);
                    return {
                        ...place.toObject(),
                        mlScore: 0,
                        whyRecommended: 'Not recommended by model'
                    };
                }
    
                return {
                    ...place.toObject(),
                    mlScore: result.score,
                    whyRecommended: this.getRecommendationReason(place, userPrefs)
                };
            }).sort((a, b) => b.mlScore - a.mlScore);
    
            console.log('[ML Service] Generated recommendations successfully');
            return recommendations;
        } catch (error) {
            console.error('[ML Service] Output processing error:', error);
            console.error('[ML Service] Raw output that failed:', stdoutData);
            throw new Error(`Failed to process Python output: ${error.message}`);
        }
    }
    
    // Helper method for temp file cleanup
    cleanupTempFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            console.warn('[ML Service] Failed to clean up temp file:', e.message);
        }
    }

    extractPlaceFeatures(place) {
        return {
            place_type: place.placeType || [],
            hobby: place.suitableFor?.hobbies || [],
            climate: place.suitableFor?.climate || ['Temperate'],
            age_min: place.suitableFor?.ageRange?.min || 0,
            age_max: place.suitableFor?.ageRange?.max || 100,
            health_issues: place.suitableFor?.healthConsiderations?.notRecommendedFor || [],
            facilities: place.suitableFor?.healthConsiderations?.specialFacilities || []
        };
    }

    getRecommendationReason(place, preferences) {
        const reasons = [];
        
        // Age match
        if (place.suitableFor?.ageRange) {
            const { min, max } = place.suitableFor.ageRange;
            if (preferences.age >= min && preferences.age <= max) {
                reasons.push(`Suitable for age ${preferences.age} (range ${min}-${max})`);
            }
        }
        
        // Place type match
        if (preferences.placeType?.length && place.placeType?.length) {
            const matches = preferences.placeType.filter(type => 
                place.placeType.includes(type));
            if (matches.length) {
                reasons.push(`Matches place types: ${matches.join(', ')}`);
            }
        }
        
        // Hobby match
        if (preferences.hobby?.length && place.suitableFor?.hobbies?.length) {
            const matches = preferences.hobby.filter(hobby => 
                place.suitableFor.hobbies.includes(hobby));
            if (matches.length) {
                reasons.push(`Good for hobbies: ${matches.join(', ')}`);
            }
        }
        
        return reasons.length > 0 ? reasons.join('. ') : 'Recommended by our AI model';
    }

    // Fallback for development when model files are missing
    getMockRecommendations(places) {
        console.warn('[ML Service] Using mock recommendations - no model files found');
        return places.map(p => ({
            ...p.toObject(),
            mlScore: Math.random() * 100,
            whyRecommended: 'Mock recommendation for development'
        }));
    }
}

module.exports = new MLRecommendationService();