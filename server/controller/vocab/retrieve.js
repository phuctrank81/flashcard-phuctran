const Words = require('../../model/words');

// Get all vocab
exports.getAll = async (req, res) => {
  try {
    const flashcards = await Words.find();
    console.log(`Fetched ${flashcards.length} words from ielts_vocabulary`);
    res.json(flashcards);
  } catch (error) {
    console.error('❌ Error fetching flashcards:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get vocab by id
exports.getById = async (req, res) => {
  try {
    const flashcard = await Words.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json(flashcard);
  } catch (error) {
    console.error('❌ Error fetching word:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};