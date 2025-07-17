const express = require('express');
const router  = express.Router();
const fetch   = (...args) => import('node-fetch').then(m => m.default(...args));

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;
const FRONT_URL      = process.env.FRONT_URL || 'http://localhost:3000';

router.get('/', (req, res) => res.render('prompts/generator'));

router.post('/mini', async (req, res) => {
  try {
    const intention = req.body.messages?.[1]?.content || '';
    const payload = {
      model: 'moonshotai/kimi-k2:free',
      messages: [
        {
          role: 'system',
          content: `Tu es un **prompt-engineur expert**.  
Transforme l’intention de l’utilisateur en **prompt parfait** à copier dans n’importe quelle IA.  
Retourne UNIQUEMENT le prompt final, structuré ainsi :  
Rôle : …  
Tâche : …  
Ton : …  
Format : …  
Contraintes : …  
Aucune explication, aucune exécution, aucun résultat, aucune IA narrative.`
        },
        { role: 'user', content: intention }
      ],
      temperature: 0.5,
      max_tokens: 350
    };


    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONT_URL || 'http://localhost:3000',
        'X-Title': 'Mini-IA Prompt'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const prompt = data.choices?.[0]?.message?.content || 'Erreur de génération';
    res.json({ choices: [{ message: { content: prompt } }] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur IA' });
  }
});

// /grade – auto-note
router.post('/grade', async (req, res) => {
  const { prompt } = req.body;
  const grade = await askKimi(`Évalue ce prompt sur 5 critères (note /10, 1 phrase) :\n${prompt}`);
  res.json({ grade });
});


// /mini – déjà existant, on le garde



module.exports = router;
