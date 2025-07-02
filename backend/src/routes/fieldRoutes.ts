import { Router } from 'express';
import { FieldController } from '../controllers/fieldController';

const router = Router();
const fieldController = new FieldController();

// Field routes
router.post('/', (req, res) => fieldController.createField(req, res));
router.get('/', (req, res) => fieldController.getAllFields(req, res));
router.put('/:id', (req, res) => fieldController.updateField(req, res));
router.delete('/:id', (req, res) => fieldController.deleteField(req, res));
router.get('/:id/weather', (req, res) => fieldController.getWeatherForField(req, res));

export default router; 