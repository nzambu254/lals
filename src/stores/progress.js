import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', {
  state: () => ({
    progressData: {
      totalFlashcards: 0,
      quizAccuracy: null,
      currentLevel: 'Beginner',
      difficultNumbers: []
    }
  }),
  
  getters: {
    // Getter to format quiz accuracy with percentage
    formattedQuizAccuracy: (state) => {
      return state.progressData.quizAccuracy 
        ? `${state.progressData.quizAccuracy}%` 
        : 'N/A';
    },
    
    // Getter to check if user has difficult numbers to review
    hasDifficultNumbers: (state) => {
      return state.progressData.difficultNumbers && 
             state.progressData.difficultNumbers.length > 0;
    },
    
    // Getter for difficulty level based on quiz accuracy
    difficultyLevel: (state) => {
      const accuracy = state.progressData.quizAccuracy;
      if (!accuracy) return 'Unknown';
      if (accuracy >= 90) return 'Expert';
      if (accuracy >= 75) return 'Advanced';
      if (accuracy >= 60) return 'Intermediate';
      return 'Beginner';
    }
  },
  
  actions: {
    updateProgress(newData) {
      this.progressData = { ...this.progressData, ...newData };
    },
    
    // Action to increment flashcard count
    incrementFlashcards(count = 1) {
      this.progressData.totalFlashcards += count;
    },
    
    // Action to update quiz accuracy
    updateQuizAccuracy(accuracy) {
      this.progressData.quizAccuracy = accuracy;
    },
    
    // Action to add difficult numbers
    addDifficultNumbers(numbers) {
      const existingNumbers = this.progressData.difficultNumbers || [];
      const newNumbers = Array.isArray(numbers) ? numbers : [numbers];
      this.progressData.difficultNumbers = [...new Set([...existingNumbers, ...newNumbers])];
    },
    
    // Action to remove difficult numbers (when mastered)
    removeDifficultNumbers(numbers) {
      const numbersToRemove = Array.isArray(numbers) ? numbers : [numbers];
      this.progressData.difficultNumbers = this.progressData.difficultNumbers.filter(
        num => !numbersToRemove.includes(num)
      );
    },
    
    // Action to reset progress
    resetProgress() {
      this.progressData = {
        totalFlashcards: 0,
        quizAccuracy: null,
        currentLevel: 'Beginner',
        difficultNumbers: []
      };
    }
  }
})