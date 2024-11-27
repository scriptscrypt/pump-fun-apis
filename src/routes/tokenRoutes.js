// src/routes/tokenRoutes.js
import express from 'express';
import { SolanaAgentKit } from 'solana-agent-kit';
import { createToken, launchPumpFunTokenHandler } from '../controllers/tokenController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/create-token', upload.single('image'), createToken);
router.post('/launch-pumpfun-token', launchPumpFunTokenHandler);

export default router;