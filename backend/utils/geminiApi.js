const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReadingPassage = async (childAge) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Determine reading level based on age
    let readingLevel = '';
    if (childAge >= 5 && childAge <= 6) {
      readingLevel = 'kindergarten to 1st grade level with simple words and short sentences';
    } else if (childAge >= 7 && childAge <= 8) {
      readingLevel = '2nd to 3rd grade level with basic vocabulary and moderate sentence length';
    } else if (childAge >= 9 && childAge <= 10) {
      readingLevel = '4th to 5th grade level with more complex vocabulary';
    } else {
      readingLevel = '6th to 7th grade level with advanced vocabulary and sentence structures';
    }
    
    const prompt = `Generate a short reading passage appropriate for a child aged ${childAge} years old (${readingLevel}). The passage should be:
    - Exactly 80-120 words long
    - Engaging and interesting for children
    - Educational or entertaining
    - Use appropriate vocabulary for the age group
    - Have clear sentence structure
    - Be about topics like animals, nature, friendship, adventure, or science
    
    Only return the reading passage text, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const passage = response.text();
    
    return passage.trim();
  } catch (error) {
    console.error('Error generating reading passage:', error);
    
    // Fallback passages if API fails
    const fallbackPassages = {
      5: "The little cat likes to play. It runs and jumps in the yard. The cat has soft fur and green eyes. It likes to chase balls and string. At night, the cat sleeps on a warm bed. The cat is happy with its family.",
      6: "Sarah found a beautiful butterfly in her garden. The butterfly had bright orange and black wings. It flew from flower to flower, drinking sweet nectar. Sarah watched quietly so she wouldn't scare it away. The butterfly danced in the sunshine before flying away to find more flowers.",
      7: "Tommy discovered an old treasure map in his grandfather's attic. The map showed a path through the forest to a big oak tree. With his dog Rex, Tommy followed the map carefully. They walked for an hour until they found the tree. Digging beneath it, they found a box full of old coins and a note from grandfather.",
      8: "The dolphin swam gracefully through the crystal blue ocean. It could hold its breath for fifteen minutes while searching for fish. Using echolocation, the dolphin made clicking sounds to navigate and hunt. A group of dolphins is called a pod, and they work together to find food and protect each other from danger.",
      9: "Maria's science experiment involved growing plants in different conditions. She planted seeds in sunny and shady spots, giving some plants more water than others. After two weeks, she observed that plants in sunny areas with moderate water grew the tallest. This taught her how important the right environment is for living things.",
      10: "The ancient library contained thousands of books from around the world. Tall wooden shelves stretched to the ceiling, filled with stories of adventure, mystery, and knowledge. The librarian, Mrs. Johnson, knew where every book belonged. She helped students discover new worlds through reading and encouraged them to explore different subjects.",
      11: "Climate change affects ecosystems worldwide, causing shifts in animal migration patterns and plant growth cycles. Scientists study these changes using satellite technology and field research. They've discovered that polar ice caps are melting faster than expected, raising sea levels and threatening coastal communities around the globe.",
      12: "The space station orbited Earth every ninety minutes, providing astronauts with breathtaking views of our planet. From their unique vantage point, they conducted scientific experiments in microgravity, studying how materials and organisms behave differently in space. Their research contributes to future missions to Mars and beyond."
    };
    
    return fallbackPassages[childAge] || fallbackPassages[8];
  }
};

module.exports = {
  generateReadingPassage
};