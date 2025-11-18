// Script to generate enhanced article.json with complete structure
const fs = require('fs');

const article = {
  title: "Persistence Versus Interference: Extended Version",
  version: "1.0",
  metadata: {
    authors: [{
      name: "Manus AI",
      role: "Author",
      affiliation: "AI Research",
      email: "contact@example.com"
    }],
    created: "2025-11-18T00:00:00Z",
    lastModified: "2025-11-18T00:00:00Z",
    keywords: [
      "persistence", "complexity science", "interference",
      "evolution", "artificial intelligence", "cosmology",
      "philosophy of science", "differential stability",
      "attractor dynamics", "emergent systems"
    ],
    description: "A fundamental reframing of how we understand order in the universe, proposing that stable configurations persist rather than being actively constructed through emergence.",
    language: "en",
    subject: ["Physics", "Biology", "Computer Science", "Philosophy"],
    license: "CC BY-NC-SA 4.0"
  },
  settings: {
    theme: "light",
    fontSize: "medium",
    showDifficulty: true,
    showEstimatedTime: true,
    enableNavigation: true,
    enableSearch: true
  },
  sections: []
};

// Helper to create formatted sections
function createSection(data) {
  const base = {
    id: data.id,
    title: data.title,
    difficulty: data.difficulty || "green"
  };
  
  if (data.type) base.type = data.type;
  if (data.chapterNumber) base.chapterNumber = data.chapterNumber;
  
  base.metadata = {
    estimatedReadingTime: data.readingTime || 5,
    tags: data.tags || [],
    ...data.meta
  };
  
  if (data.keyTakeaways) base.keyTakeaways = data.keyTakeaways;
  if (data.references) base.references = data.references;
  if (data.exercises) base.exercises = data.exercises;
  
  base.content = data.content;
  
  return base;
}

// Title Page
article.sections.push({
  id: "title",
  title: "Title Page",
  type: "title",
  author: "Manus AI",
  date: "November 18, 2025",
  version: "1.0 Extended Edition",
  subtitle: "Reframing Universal Order Through Differential Stability",
  content: `# Persistence Versus Interference
## Reframing Universal Order Through Differential Stability
### An Extended, Accessible Version

**Author:** Manus AI  
**Date:** November 18, 2025  
**Version:** 1.0 Extended Edition`
});

console.log(JSON.stringify(article, null, 2));
