import { StepResource, StepAssessment } from '../types';

export function generateResourcesForStep(stepId: string, stepTitle: string, pathTitle: string): StepResource[] {
  const cleanTitle = stepTitle.toLowerCase();
  
  // Construct topic-specific search & watch URLs for YouTube and Google
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${stepTitle} ${pathTitle} tutorial guide`)}`;
  const googleArticleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${stepTitle} ${pathTitle} comprehensive article guide`)}`;
  const mdnSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${stepTitle} documentation reference`)}`;

  if (cleanTitle.includes('python') || cleanTitle.includes('code') || cleanTitle.includes('programm')) {
    return [
      {
        id: `${stepId}-res-video-1`,
        stepId,
        title: `${stepTitle} - Full Video Masterclass & Code Along`,
        type: 'video',
        url: youtubeSearchUrl,
        providerName: 'YouTube / freeCodeCamp',
        estimatedMinutes: 20,
        status: 'not_started',
      },
      {
        id: `${stepId}-res-article-1`,
        stepId,
        title: `Deep Dive Article: Core Architecture & Best Practices in ${stepTitle}`,
        type: 'article',
        url: 'https://realpython.com',
        providerName: 'Real Python / Google Article',
        estimatedMinutes: 12,
        status: 'not_started',
        articleContent: {
          summary: `An essential deep-dive article breaking down standard syntax, memory architecture, and modular coding patterns for ${stepTitle} in modern software engineering.`,
          keyTakeaways: [
            'Understand how code structures execute in memory and optimize execution speed.',
            'Master modular design patterns and standard library conventions.',
            'Avoid common anti-patterns like global state mutation and silent exception swallowing.',
            'Apply clean code formatting guidelines (PEP8) to maintain scalable repositories.'
          ],
          fullArticleText: `### Mastering ${stepTitle}: Architecture & Engineering Principles

In modern software development, **${stepTitle}** forms the foundation for reliable, scalable software applications. Whether you are building web services, AI models, or automated data pipelines, adhering to standard engineering practices ensures your code is both maintainable and performant.

#### 1. Fundamental Syntax & Execution Pipeline
Code written in modern high-level languages undergoes parsing, compilation into bytecode, and execution within a virtual runtime environment. Clean variable scoping, explicit function definitions, and strong typing prevent subtle runtime defects.

#### 2. Memory Scoping & Clean Design
Always aim for deterministic memory scoping:
- Prefer pure functions without side effects.
- Leverage context managers for file I/O and database transactions.
- Keep function scope focused on a single responsibility (Single Responsibility Principle).

#### 3. Real-World Industry Application
When deploying ${stepTitle} in production environments, error handling and structured logging become paramount. Use explicit exception hierarchy and pass clean telemetry logs to monitoring services.`,
          caseStudyTitle: `Case Study: Production Refactoring at Scale`,
          caseStudyText: `A leading tech enterprise refactored its core data pipeline using clean modular ${stepTitle} principles, reducing execution latency by 42% and eliminating unhandled runtime crashes.`
        }
      },
      {
        id: `${stepId}-res-video-2`,
        stepId,
        title: `${stepTitle} - Practical Live Problem Solving`,
        type: 'video',
        url: youtubeSearchUrl,
        providerName: 'YouTube / TechWithTim',
        estimatedMinutes: 15,
        status: 'not_started',
      },
      {
        id: `${stepId}-res-article-2`,
        stepId,
        title: `${stepTitle} - Official Syntax Documentation & Reference`,
        type: 'article',
        url: mdnSearchUrl,
        providerName: 'Python Docs / Google Search',
        estimatedMinutes: 10,
        status: 'not_started',
        articleContent: {
          summary: `Official technical reference article detailing method signatures, standard library interfaces, and exception handling for ${stepTitle}.`,
          keyTakeaways: [
            'Review parameter signatures and default return types.',
            'Understand built-in module efficiency and complexity guarantees.'
          ],
          fullArticleText: `### Syntax Reference Guide: ${stepTitle}\n\nComprehensive technical reference for parameters, methods, and error handling...`
        }
      },
    ];
  }

  if (cleanTitle.includes('design') || cleanTitle.includes('ui') || cleanTitle.includes('ux') || cleanTitle.includes('figma')) {
    return [
      {
        id: `${stepId}-res-video-1`,
        stepId,
        title: `${stepTitle} - Design Systems & Layout Masterclass Video`,
        type: 'video',
        url: youtubeSearchUrl,
        providerName: 'YouTube / Figma Academy',
        estimatedMinutes: 18,
        status: 'not_started',
      },
      {
        id: `${stepId}-res-article-1`,
        stepId,
        title: `Design Strategy Article: Typography, Grid Hierarchy & Tokens in ${stepTitle}`,
        type: 'article',
        url: googleArticleUrl,
        providerName: 'Smashing Magazine / Google',
        estimatedMinutes: 10,
        status: 'not_started',
        articleContent: {
          summary: `A practical design guide covering optical alignment, baseline grid systems, color contrast ratios, and design token architectures.`,
          keyTakeaways: [
            'Establish mathematical typographic scales (1.25x ratio) for instant visual hierarchy.',
            'Ensure WCAG AA contrast compliance (minimum 4.5:1 ratio) for all body copy.',
            'Eliminate nested container noise by relying on spatial padding rhythm.',
            'Structure reusable component tokens for fast engineering handoffs.'
          ],
          fullArticleText: `### Visual Design Systems & Interaction Standards: ${stepTitle}

Crafting intuitive user interfaces requires a blend of mathematical precision and optical refinement. When working on **${stepTitle}**, design decisions directly influence user engagement, accessibility, and retention.

#### 1. Typographic Contrast & Visual Rhythm
Type is the backbone of user interfaces. Never rely on arbitrary font sizing. Define explicit scale steps (e.g. 12px, 14px, 16px, 20px, 28px, 36px) and maintain consistent baseline line-height (1.5x for body, 1.2x for display headers).

#### 2. Spatial Hierarchy & Padding Rules
Ensure outer container padding always equals or exceeds inner element spacing. Use tighter groupings for closely related labels and generous negative space between structural modules.

#### 3. Color & Accessible Neutrals
Avoid harsh pure black (#000000) or default unstyled surfaces. Inject 2-5% saturation into neutral grays to create cohesive atmospheric warmth or crisp coolness.`,
          caseStudyTitle: `Case Study: Universal Design Accessibility Audit`,
          caseStudyText: `By enforcing strict WCAG AA contrast ratios and standard design tokens in ${stepTitle}, a global product team increased user completion rates by 28% across mobile devices.`
        }
      },
      {
        id: `${stepId}-res-video-2`,
        stepId,
        title: `${stepTitle} - Prototyping & Motion Breakdown`,
        type: 'video',
        url: youtubeSearchUrl,
        providerName: 'YouTube / DesignCourse',
        estimatedMinutes: 15,
        status: 'not_started',
      },
      {
        id: `${stepId}-res-article-2`,
        stepId,
        title: `UI Grid Layout & Responsive Breakpoints Article`,
        type: 'article',
        url: 'https://refactoringui.com',
        providerName: 'UX Design Institute & Google',
        estimatedMinutes: 12,
        status: 'not_started',
        articleContent: {
          summary: `Comprehensive reference article on responsive grid layouts, breakpoints, and fluid container sizing.`,
          keyTakeaways: [
            'Design mobile-first layouts using fluid container widths (max-w-7xl mx-auto).',
            'Enforce touch target minimums of 44x44px for mobile interactions.',
            'Use responsive breakpoints (sm, md, lg) for structural bento grid expansion.'
          ],
          fullArticleText: `### Responsive Layout Engineering Guidelines\n\nCreating interfaces that adapt seamlessly across devices requires a solid layout grid strategy...`
        }
      },
    ];
  }

  if (cleanTitle.includes('sql') || cleanTitle.includes('data') || cleanTitle.includes('database')) {
    return [
      {
        id: `${stepId}-res-video-1`,
        stepId,
        title: `${stepTitle} - SQL Queries & Relational Database Essentials Video`,
        type: 'video',
        url: youtubeSearchUrl,
        providerName: 'YouTube / Khan Academy',
        estimatedMinutes: 22,
        status: 'not_started',
      },
      {
        id: `${stepId}-res-article-1`,
        stepId,
        title: `Data Architecture Article: Relational Schema & Indexing in ${stepTitle}`,
        type: 'article',
        url: googleArticleUrl,
        providerName: 'Data Engineering Quarterly / Google',
        estimatedMinutes: 14,
        status: 'not_started',
        articleContent: {
          summary: `A comprehensive data article covering SQL normalization, ACID transaction guarantees, indexing strategies, and query performance tuning.`,
          keyTakeaways: [
            'Understand B-Tree indexing and compound key strategies for fast data lookup.',
            'Apply Third Normal Form (3NF) to eliminate data redundancy.',
            'Analyze execution query plans (EXPLAIN ANALYZE) to eliminate full table scans.',
            'Leverage connection pooling and transaction boundaries to support concurrent reads.'
          ],
          fullArticleText: `### Database Engineering & Query Optimization: ${stepTitle}

Data architecture is the foundational spine of modern applications. In **${stepTitle}**, structuring data correctly ensures high availability, data integrity, and fast sub-millisecond query responses.

#### 1. Relational Modeling & Normalization
Designing clean table schemas requires identifying primary keys, foreign key constraints, and multi-record relationships (1:1, 1:N, M:N).

#### 2. Query Tuning & Indexing
Unindexed queries force relational engines to perform full sequential scans across millions of rows. Creating targeted indexes on frequently filtered columns dramatically reduces I/O load.`,
          caseStudyTitle: `Case Study: High-Throughput Database Optimization`,
          caseStudyText: `Optimizing schema indexes and query joins in ${stepTitle} reduced average API query execution time from 850ms down to 14ms.`
        }
      },
      {
        id: `${stepId}-res-video-2`,
        stepId,
        title: `${stepTitle} - Database Tuning & Live Exercises`,
        type: 'video',
        url: youtubeSearchUrl,
        providerName: 'YouTube / Traversy Media',
        estimatedMinutes: 18,
        status: 'not_started',
      },
    ];
  }

  // General field fallback (Healthcare, Business, Law, Science, General)
  return [
    {
      id: `${stepId}-res-video-1`,
      stepId,
      title: `${stepTitle} - Overview & Core Principles Video`,
      type: 'video',
      url: youtubeSearchUrl,
      providerName: 'YouTube / Educational Series',
      estimatedMinutes: 15,
      status: 'not_started',
    },
    {
      id: `${stepId}-res-article-1`,
      stepId,
      title: `Industry Deep Dive Article: Masterclass Guide to ${stepTitle}`,
      type: 'article',
      url: googleArticleUrl,
      providerName: 'Harvard Business Review & Google Search',
      estimatedMinutes: 12,
      status: 'not_started',
      articleContent: {
        summary: `An authoritative industry reading guide breaking down foundational principles, real-world case studies, and actionable techniques for ${stepTitle} in ${pathTitle}.`,
        keyTakeaways: [
          `Master core industry standards and fundamental concepts of ${stepTitle}.`,
          'Analyze real-world case studies and execution frameworks.',
          'Identify key risk factors and best practices for domain mastery.',
          'Formulate actionable steps to apply these principles directly to your career roadmap.'
        ],
        fullArticleText: `### Industry Masterclass Guide: ${stepTitle}

Welcome to the comprehensive reading guide on **${stepTitle}** in **${pathTitle}**. Mastering these core concepts will prepare you for professional excellence and practical real-world execution.

#### 1. Foundational Core Principles
Every field has non-negotiable core pillars. In ${stepTitle}, understanding the underlying mechanisms allows you to diagnose complex situations, innovate responsibly, and communicate clearly with peers.

#### 2. Systematic Problem Solving
Break complex challenges into manageable, measurable phases:
- **Phase A**: Information gathering and domain diagnosis.
- **Phase B**: Formulating hypothesis and evaluating evidence.
- **Phase C**: Iterative execution, measurement, and refinement.

#### 3. Real-World Case Studies & Career Impact
Professionals who excel in ${stepTitle} stand out by combining theoretical knowledge with hands-on practice. Reviewing real-world industry benchmarks equips you to make high-impact decisions.`,
        caseStudyTitle: `Case Study: Strategic Excellence in ${pathTitle}`,
        caseStudyText: `Applying systematic ${stepTitle} methodologies enabled industry leaders to streamline operational workflows and achieve 35% higher efficiency in real-world scenarios.`
      }
    },
    {
      id: `${stepId}-res-video-2`,
      stepId,
      title: `${stepTitle} - Real-World Case Study Breakdown Video`,
      type: 'video',
      url: youtubeSearchUrl,
      providerName: 'YouTube / Khan Academy',
      estimatedMinutes: 12,
      status: 'not_started',
    },
    {
      id: `${stepId}-res-article-2`,
      stepId,
      title: `${stepTitle} - Essential Reading & Academic Notes`,
      type: 'article',
      url: googleArticleUrl,
      providerName: 'Academic Resource Network & Google Search',
      estimatedMinutes: 15,
      status: 'not_started',
      articleContent: {
        summary: `Academic reading list and industry case studies for ${stepTitle}.`,
        keyTakeaways: [
          'Review peer-reviewed literature and standardized documentation.',
          'Extract core terminology and framework definitions.'
        ],
        fullArticleText: `### Academic & Industry Case Notes for ${stepTitle}\n\nEssential reading covering foundational literature and key operational models...`
      }
    },
  ];
}


export function generateDefaultAssessment(stepId: string, stepTitle: string, pathTitle: string): StepAssessment {
  return {
    stepId,
    stepTitle,
    questions: [
      {
        id: `${stepId}-q1`,
        question: `What is the primary goal or fundamental concept behind "${stepTitle}" in ${pathTitle}?`,
        options: [
          `To establish core foundational knowledge and standardized practices for ${stepTitle}`,
          `To replace all existing tools with unverified alternatives`,
          `To bypass step-by-step learning without testing results`,
          `To hide execution logic from end users`
        ],
        correctIndex: 0,
        explanation: `Foundational mastery in ${stepTitle} requires clear understanding of standard core principles before moving forward.`
      },
      {
        id: `${stepId}-q2`,
        question: `Which approach represents best practice when applying ${stepTitle}?`,
        options: [
          `Skipping documentation and working randomly`,
          `Modular, step-by-step problem breakdown and iterative testing`,
          `Memorizing formulas without practical hands-on application`,
          `Relying entirely on external defaults without validation`
        ],
        correctIndex: 1,
        explanation: `Iterative execution and modular problem breakdown ensure resilient and verifiable skills.`
      },
      {
        id: `${stepId}-q3`,
        question: `How do you confirm that you have mastered ${stepTitle}?`,
        options: [
          `By opening a link once without reviewing it`,
          `By demonstrating practical application through exercises, quizzes, or a working project challenge`,
          `By assuming completion without checking understanding`,
          `By waiting for automated certificate issuance`
        ],
        correctIndex: 1,
        explanation: `True mastery in PathVerse is verified when you can successfully pass assessments or submit a working practical project.`
      }
    ],
    practicalChallenge: {
      title: `Practical Challenge: ${stepTitle} Hands-on Build`,
      description: `Put your learning from "${stepTitle}" into practice. Write a short explanation, working code snippet, or step-by-step solution demonstrating how you implemented this concept.`,
      starterInstructions: `Describe your implementation or paste your solution code below. Gemini AI will evaluate your work against key standards in ${pathTitle}.`,
      evaluationCriteria: [
        'Correct usage of core principles',
        'Clarity and structure of solution',
        'Practical real-world applicability'
      ]
    }
  };
}
