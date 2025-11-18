#!/usr/bin/env python3
"""
Enhance article.json with complex layout and formatting structures
"""
import json
import re

# Read original article
with open('article.json', 'r') as f:
    article = json.load(f)

# Metadata mappings for each section
SECTION_METADATA = {
    "visual-abstract": {
        "estimatedReadingTime": 5,
        "tags": ["overview", "introduction", "conceptual"],
        "type": "visual-abstract"
    },
    "executive-summaries": {
        "estimatedReadingTime": 10,
        "tags": ["summary", "overview", "accessible"]
    },
    "reading-guide": {
        "estimatedReadingTime": 5,
        "tags": ["navigation", "guide", "overview"]
    },
    "glossary": {
        "estimatedReadingTime": 15,
        "tags": ["reference", "definitions", "terminology"],
        "type": "glossary"
    },
    "chapter-1": {
        "chapterNumber": 1,
        "partNumber": 1,
        "estimatedReadingTime": 25,
        "tags": ["foundations", "philosophy", "examples", "introduction"],
        "keyTakeaways": [
            "Persistence asks 'what prevents things from continuing' rather than 'why does order emerge'",
            "Stable configurations naturally outlast unstable ones",
            "The universe edits instability rather than constructs complexity",
            "The persistence principle appears in everyday phenomena"
        ]
    },
    "chapter-2": {
        "chapterNumber": 2,
        "partNumber": 1,
        "estimatedReadingTime": 30,
        "tags": ["physics", "quantum mechanics", "metaphor", "critical analysis"],
        "keyTakeaways": [
            "Real interference requires Hilbert space, superposition, and phase coherence",
            "Most metaphorical uses of 'interference' lack mathematical rigor",
            "Brain waves are legitimate waves; market 'interference' is just competition"
        ],
        "references": [{
            "id": "feynman-2006",
            "number": 1,
            "text": "Feynman, R. P. (2006). QED: The Strange Theory of Light and Matter. Princeton University Press."
        }]
    },
    "chapter-3": {
        "chapterNumber": 3,
        "partNumber": 2,
        "estimatedReadingTime": 35,
        "tags": ["theory", "axioms", "principles", "analogies"],
        "keyTakeaways": [
            "Conservation laws ensure substrate persistence",
            "Differential persistence: stable things last longer",
            "Persistence is a passive property, not an active force"
        ]
    },
    "chapter-4": {
        "chapterNumber": 4,
        "partNumber": 2,
        "estimatedReadingTime": 30,
        "tags": ["worldview", "philosophy", "comparison", "paradigm shift"],
        "keyTakeaways": [
            "Construction view asks 'why does order emerge?'",
            "Persistence view asks 'what prevents continuation?'",
            "Similar to Copernican and Darwinian revolutions"
        ]
    },
    "chapter-5": {
        "chapterNumber": 5,
        "partNumber": 3,
        "estimatedReadingTime": 35,
        "tags": ["AI", "deep learning", "neural networks", "machine learning"],
        "keyTakeaways": [
            "Loss landscapes have large connected basins (mode connectivity)",
            "Training doesn't construct solutions, it finds persistent states",
            "AI safety is about attractor engineering"
        ],
        "references": [
            {
                "id": "garipov-2018",
                "number": 1,
                "text": "Garipov, T., et al. (2018). Loss surfaces, mode connectivity, and fast ensembling of DNNs."
            },
            {
                "id": "li-2018",
                "number": 2,
                "text": "Li, H., et al. (2018). Visualizing the Loss Landscape of Neural Nets."
            }
        ]
    },
    "chapter-6": {
        "chapterNumber": 6,
        "partNumber": 3,
        "estimatedReadingTime": 25,
        "tags": ["evolution", "biology", "LTEE", "natural selection"],
        "keyTakeaways": [
            "Evolution is persistence in action: stable forms survive",
            "LTEE shows power-law fitness improvements",
            "Life origin: What stops self-sustaining reactions from continuing?"
        ],
        "references": [{
            "id": "lenski-2023",
            "number": 1,
            "text": "Lenski, R. E. (2023). The E. coli Long-Term Evolution Experiment."
        }]
    },
    "chapter-7": {
        "chapterNumber": 7,
        "partNumber": 3,
        "estimatedReadingTime": 25,
        "tags": ["cosmology", "physics", "anthropic principle", "dark matter"],
        "keyTakeaways": [
            "Anthropic principle is survivor bias on cosmic scale",
            "Fine-tuning problem dissolves: we observe persistent configurations",
            "Simpler models (classical dark matter) likely more persistent"
        ],
        "references": [{
            "id": "hui-2021",
            "number": 1,
            "text": "Hui, L. (2021). Wave Dark Matter. Annual Review of Astronomy and Astrophysics."
        }]
    },
    "chapter-8": {
        "chapterNumber": 8,
        "partNumber": 4,
        "estimatedReadingTime": 30,
        "tags": ["critique", "physics envy", "pseudoscience", "methodology"],
        "keyTakeaways": [
            "Physics envy: inappropriate importation of physics concepts",
            "Quantum mind fails: brain too warm and wet for quantum effects",
            "Economic 'quantum' models lack predictive power"
        ]
    },
    "chapter-9": {
        "chapterNumber": 9,
        "partNumber": 4,
        "estimatedReadingTime": 40,
        "tags": ["FAQ", "objections", "defense", "philosophy of science"],
        "keyTakeaways": [
            "Semantics matter: words guide research programs",
            "Persistence unifies attractor dynamics, SOC, natural selection",
            "Conservation laws may be more fundamental than Schrödinger equation"
        ]
    },
    "chapter-10": {
        "chapterNumber": 10,
        "partNumber": 5,
        "estimatedReadingTime": 25,
        "tags": ["toolkit", "practical", "application", "methodology"],
        "keyTakeaways": [
            "Identify what persists, transformation operators, attractors",
            "To change a state: make it less persistent or create deeper attractor",
            "Avoid confusing persistence with desirability"
        ],
        "exercises": [{
            "id": "persistence-worksheet",
            "type": "worksheet",
            "title": "Persistence Analysis Worksheet",
            "difficulty": "orange",
            "description": "Apply the persistence framework to analyze a system"
        }]
    },
    "chapter-11": {
        "chapterNumber": 11,
        "partNumber": 5,
        "estimatedReadingTime": 20,
        "tags": ["resources", "bibliography", "further reading"],
        "keyTakeaways": [
            "Key resources: Gleick's Chaos, Kauffman's At Home in the Universe",
            "Interactive tools: PhET simulations, 3Blue1Brown videos",
            "Santa Fe Institute: leading center for complexity science"
        ]
    },
    "appendices": {
        "estimatedReadingTime": 30,
        "tags": ["technical", "mathematics", "advanced"],
        "type": "appendix"
    },
    "bibliography": {
        "estimatedReadingTime": 20,
        "tags": ["references", "citations", "resources"],
        "type": "bibliography"
    }
}

# Enhanced article structure
enhanced = {
    "title": article["title"],
    "version": "1.0",
    "metadata": {
        "authors": [{
            "name": "Manus AI",
            "role": "Author"
        }],
        "created": "2025-11-18T00:00:00Z",
        "lastModified": "2025-11-18T00:00:00Z",
        "keywords": [
            "persistence", "complexity science", "interference",
            "evolution", "artificial intelligence", "cosmology",
            "philosophy of science", "differential stability",
            "attractor dynamics", "emergent systems"
        ],
        "description": "A fundamental reframing of how we understand order in the universe, proposing that stable configurations persist rather than being actively constructed through emergence.",
        "language": "en",
        "subject": ["Physics", "Biology", "Computer Science", "Philosophy"]
    },
    "settings": {
        "theme": "light",
        "fontSize": "medium",
        "showDifficulty": True,
        "showEstimatedTime": True,
        "enableNavigation": True,
        "enableSearch": True
    },
    "sections": []
}

# Process each section
for section in article["sections"]:
    enhanced_section = dict(section)  # Copy original
    section_id = section["id"]

    # Get metadata for this section
    if section_id in SECTION_METADATA:
        meta = SECTION_METADATA[section_id]

        # Add chapter number and type
        if "chapterNumber" in meta:
            enhanced_section["type"] = "chapter"
            enhanced_section["chapterNumber"] = meta["chapterNumber"]
        if "partNumber" in meta:
            enhanced_section["partNumber"] = meta["partNumber"]
        if "type" in meta:
            enhanced_section["type"] = meta["type"]

        # Add/enhance metadata
        if "metadata" not in enhanced_section:
            enhanced_section["metadata"] = {}

        enhanced_section["metadata"]["estimatedReadingTime"] = meta["estimatedReadingTime"]
        enhanced_section["metadata"]["tags"] = meta["tags"]

        # Add key takeaways
        if "keyTakeaways" in meta:
            enhanced_section["keyTakeaways"] = meta["keyTakeaways"]

        # Add references
        if "references" in meta:
            enhanced_section["references"] = meta["references"]

        # Add exercises
        if "exercises" in meta:
            enhanced_section["exercises"] = meta["exercises"]

    enhanced["sections"].append(enhanced_section)

# Write enhanced version
with open('article.json', 'w') as f:
    json.dump(enhanced, f, indent=2, ensure_ascii=False)

print("✓ Enhanced article.json created")
print(f"✓ Added metadata, version, settings")
print(f"✓ Enhanced {len(enhanced['sections'])} sections")
print(f"✓ Added reading times, tags, key takeaways, references")
