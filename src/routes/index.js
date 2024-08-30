const router = require('express').Router();
const mondayRoutes = require('./monday');

router.use(mondayRoutes);

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

router.post('/update-timeline', function (req, res) {
  const { startDate, endDate } = req.body;
  updateTimeline(startDate, endDate);
  res.json({ message: 'Timeline updated successfully' });
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

function updateTimeline(startDate, endDate) {
  console.log(`Updating timeline with new start date: ${startDate} and end date: ${endDate}`);
}

module.exports = router;