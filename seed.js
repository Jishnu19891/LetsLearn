require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [
    { category: 'html', title: 'HTML Headings', lesson: '<h1> is the main title tag.',   question: 'What tag is for the largest heading?', answer: 'h1' },
    { category: 'html', title: 'HTML Links',    lesson: '<a> tags link to other pages.', question: 'Which tag creates a hyperlink?',         answer: 'a'  },
    { category: 'css',  title: 'Text Color',    lesson: "The 'color' property affects text.",    question: 'Property to change text color?',       answer: 'color'   },
    { category: 'css',  title: 'Box Model',     lesson: "'padding' is space inside a box.",      question: 'What property adds internal space?',   answer: 'padding' },
    { category: 'js',   title: 'Variables',     lesson: "'let' allows values to change.",        question: 'Keyword to declare a variable?',       answer: 'let'      },
    { category: 'js',   title: 'Functions',     lesson: 'Functions perform tasks.',              question: 'Keyword to start a function?',         answer: 'function' }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Question.deleteMany({});
    await Question.insertMany(questions);

    console.log(`Seeded ${questions.length} questions`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
