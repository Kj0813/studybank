import express from 'express';
import cors from 'cors';
import { readNotes, writeNotes } from './data/helpers.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// FORCE SEED DEMO DATA if empty
async function forceSeed() {
  const notes = await readNotes();
  if (notes.length === 0) {
    const now = Date.now();
    const demo = [
      { id: now, title: "Introduction to Machine Learning", course: "CS 229", content: "Supervised learning: given training data, learn a function h: X to Y.\n\nKey concepts:\n- Hypothesis space\n- Loss function\n- Optimization algorithm\n\nLinear regression: h_theta(x) = theta_0 + theta_1*x_1 + ... + theta_n*x_n\nCost function: J(theta) = (1/2m) sum(h_theta(x^i) - y^i)^2", tags: ["lecture", "math-heavy"], authorId: 101, authorName: "sarah_chen", isPublic: true, createdAt: new Date(now - 86400000 * 2).toISOString(), updatedAt: new Date(now - 86400000 * 2).toISOString() },
      { id: now + 1, title: "Cell Structure & Function", course: "Biology 101", content: "Eukaryotic cells contain membrane-bound organelles:\n\n1. Nucleus -- stores genetic material (DNA)\n2. Mitochondria -- ATP production via cellular respiration\n3. Endoplasmic Reticulum -- protein & lipid synthesis\n4. Golgi Apparatus -- modifies, sorts, packages proteins\n5. Lysosomes -- digestion & waste removal\n\nCell membrane: phospholipid bilayer with embedded proteins.", tags: ["midterm-prep", "diagram-needed"], authorId: 102, authorName: "bio_mike", isPublic: true, createdAt: new Date(now - 86400000 * 5).toISOString(), updatedAt: new Date(now - 86400000).toISOString() },
      { id: now + 2, title: "Supply & Demand Equilibrium", course: "Economics 201", content: "Market equilibrium occurs where Qd = Qs.\n\nShifts in demand:\n- Income increase -> demand shifts right (normal goods)\n- Price of substitute increases -> demand shifts right\n- Taste/preferences change\n\nPrice elasticity of demand:\nEd = (%change Qd) / (%change P)\n\n|Ed| > 1: elastic\n|Ed| < 1: inelastic\n|Ed| = 1: unit elastic", tags: ["exam", "formulas"], authorId: 103, authorName: "econ_jordan", isPublic: true, createdAt: new Date(now - 86400000 * 3).toISOString(), updatedAt: new Date(now - 86400000 * 3).toISOString() },
      { id: now + 3, title: "Shakespeare's Hamlet -- Act 3 Analysis", course: "English Literature", content: "To be, or not to be soliloquy (Act 3, Scene 1):\n\nHamlet contemplates suicide vs. the fear of the unknown afterlife.\n\nKey themes:\n- Mortality & existence\n- Action vs. inaction\n- Corruption (physical & moral)\n\nThe play's the thing / Wherein I'll catch the conscience of the King -- Hamlet uses the play to confirm Claudius's guilt.", tags: ["essay-prep"], authorId: 104, authorName: "lit_anna", isPublic: true, createdAt: new Date(now - 86400000 * 7).toISOString(), updatedAt: new Date(now - 86400000 * 7).toISOString() },
      { id: now + 4, title: "Thermodynamics Laws Summary", course: "Physics 101", content: "Zeroth Law: If A=B and B=C, then A=C (thermal equilibrium).\n\nFirst Law (Conservation of Energy):\ndelta U = Q - W\n\nSecond Law:\nEntropy of isolated system always increases.\ndelta S_universe >= 0\n\nThird Law:\nAs T -> 0 K, entropy of perfect crystal -> 0.", tags: ["cheat-sheet", "finals"], authorId: 105, authorName: "physics_dave", isPublic: true, createdAt: new Date(now - 86400000 * 1).toISOString(), updatedAt: new Date(now - 86400000 * 1).toISOString() },
      { id: now + 5, title: "Data Structures: Binary Search Trees", course: "CS 229", content: "BST Properties:\n- Left subtree contains only nodes with keys LESS than parent\n- Right subtree contains only nodes with keys GREATER than parent\n- Both subtrees must also be BSTs\n\nOperations:\n- Search: O(h) where h is height\n- Insert: O(h)\n- Delete: O(h)\n\nBalanced BST (AVL/Red-Black): h = O(log n)\nUnbalanced: h = O(n) worst case", tags: ["algorithms", "interview"], authorId: 101, authorName: "sarah_chen", isPublic: true, createdAt: new Date(now - 86400000 * 0.5).toISOString(), updatedAt: new Date(now - 86400000 * 0.5).toISOString() },
      { id: now + 6, title: "Photosynthesis Overview", course: "Biology 101", content: "6CO2 + 6H2O + light energy -> C6H12O6 + 6O2\n\nLight-dependent reactions (thylakoid):\n- Photosystem II -> electron transport chain -> Photosystem I\n- ATP and NADPH produced\n\nCalvin Cycle (stroma):\n- Carbon fixation (RuBisCO)\n- Reduction\n- Regeneration of RuBP\n\nC3, C4, and CAM plants adapt to different climates.", tags: ["photosynthesis", "exam"], authorId: 102, authorName: "bio_mike", isPublic: true, createdAt: new Date(now - 86400000 * 0.2).toISOString(), updatedAt: new Date(now - 86400000 * 0.2).toISOString() },
      { id: now + 7, title: "Fiscal vs Monetary Policy", course: "Economics 201", content: "Fiscal Policy (Government):\n- Expansionary: increase gov spending, cut taxes -> AD shifts right\n- Contractionary: decrease gov spending, raise taxes -> AD shifts left\n\nMonetary Policy (Central Bank):\n- Expansionary: lower interest rates, quantitative easing -> investment increases\n- Contractionary: raise interest rates -> reduce inflation\n\nTime lags: recognition, implementation, impact", tags: ["macro", "policy"], authorId: 103, authorName: "econ_jordan", isPublic: true, createdAt: new Date(now - 86400000 * 4).toISOString(), updatedAt: new Date(now - 86400000 * 4).toISOString() }
    ];
    await writeNotes(demo);
    console.log('Demo data seeded');
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(PORT, async () => {
  await forceSeed();
  console.log(`StudyBank API v2 running on http://localhost:${PORT}`);
});