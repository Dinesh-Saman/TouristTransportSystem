// services/recommendationService.js
const MLRecommendService = require('./mlRecommendService');

class RecommendationService {

  static async getHybridRecommendations(packagePlaces, userPreferences) {
    // Get rule-based scores
    const ruleBased = this.getRecommendedPlaces(packagePlaces, userPreferences);
    
    // Get ML predictions
    const mlResults = await MLRecommendService.getMLRecommendations(
      userPreferences, 
      packagePlaces
    );
    
    // Combine scores (60% ML, 40% rules)
    return mlResults.map(place => {
      const ruleScore = ruleBased.find(p => p._id.equals(place._id))?.suitabilityScore || 0;
      return {
        ...place,
        combinedScore: (place.mlScore * 0.6) + (ruleScore * 0.4),
        ruleScore,
        mlScore: place.mlScore
      };
    }).sort((a, b) => b.combinedScore - a.combinedScore);
  }

    static getRecommendedPlaces(packagePlaces, userPreferences) {
      return packagePlaces.map(place => {
        const score = this.calculateSuitabilityScore(place, userPreferences);
        return { ...place.toObject(), suitabilityScore: score };
      })
      .filter(place => place.suitabilityScore > 0)
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    }
  
    static calculateSuitabilityScore(place, preferences) {
      let score = 0;
  
      // Age matching (20% weight)
      if (place.suitableFor.ageRange) {
        const ageMin = place.suitableFor.ageRange.min || 0;
        const ageMax = place.suitableFor.ageRange.max || 100;
        
        if (preferences.age >= ageMin && preferences.age <= ageMax) {
          score += 20;
        } else {
          // Partial score based on how close to the range
          const ageDiff = Math.max(
            ageMin - preferences.age, 
            preferences.age - ageMax, 
            0
          );
          const ageRange = ageMax - ageMin;
          const penalty = Math.min(20, (ageDiff / (ageRange || 1)) * 20);
          score += (20 - penalty);
        }
      }
  
      // Gender matching (10% weight)
      if (!place.suitableFor.genderNeutral && preferences.gender) {
        // Some places might be gender-specific (like certain religious sites)
        // In most cases, places are gender-neutral
        score += 5; // Reduced weight for gender-specific places
      } else {
        score += 10; // Full points for gender-neutral places
      }
  
      // Place type matching (20% weight)
      if (preferences.placeType && preferences.placeType.length > 0) {
        const matchingTypes = place.placeType.filter(type => 
          preferences.placeType.includes(type));
        score += (matchingTypes.length / preferences.placeType.length) * 20;
      } else {
        score += 10; // Half points if no preference specified
      }
  
      // Hobby matching (20% weight)
      if (preferences.hobby && preferences.hobby.length > 0) {
        const matchingHobbies = place.suitableFor.hobbies.filter(hobby => 
          preferences.hobby.includes(hobby));
        score += (matchingHobbies.length / preferences.hobby.length) * 20;
      } else {
        score += 10; // Half points if no hobby specified
      }
  
      // Climate matching (10% weight)
      if (preferences.climate && place.suitableFor.climate) {
        if (place.suitableFor.climate.includes(preferences.climate)) {
          score += 10;
        }
      } else {
        score += 5; // Half points if no climate preference
      }
  
      // Health considerations (20% weight - negative impact)
      if (preferences.diseases || preferences.physicalDisorders) {
        const healthIssues = [
          ...(preferences.diseases || []),
          ...(preferences.physicalDisorders || [])
        ];
        
        const problematicConditions = place.suitableFor.healthConsiderations?.notRecommendedFor || [];
        const specialFacilities = place.suitableFor.healthConsiderations?.specialFacilities || [];
        
        const matchingProblems = healthIssues.filter(issue => 
          problematicConditions.includes(issue));
        
        const matchingFacilities = healthIssues.filter(issue => {
          // Map conditions to facilities (this could be more sophisticated)
          const conditionToFacility = {
            'Back Pain': 'Rest Areas',
            'Knee Pain': 'Elevators',
            'Asthma': 'Medical Support'
          };
          return specialFacilities.includes(conditionToFacility[issue]);
        });
        
        const problemScore = (matchingProblems.length / healthIssues.length) * 15;
        const facilityBonus = (matchingFacilities.length / healthIssues.length) * 5;
        
        score -= problemScore;
        score += facilityBonus;
      }
  
      return Math.max(0, Math.min(100, Math.round(score)));
    }
  }
  
  module.exports = RecommendationService;