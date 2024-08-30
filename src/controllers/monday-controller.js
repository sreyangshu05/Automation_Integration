const mondayService = require('../services/monday-service');
const transformationService = require('../services/transformation-service');
const { TRANSFORMATION_TYPES } = require('../constants/transformation');

const { BOARD_ID, ITEM_ID, START_DATE_COLUMN_ID, END_DATE_COLUMN_ID, TIMELINE_COLUMN_ID } = require('../constants/monday');

async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const { itemId, startDate, endDate } = inputFields;

    
    const updatedTimeline = updateTimeline(startDate, endDate);

    
    await mondayService.changeColumnValue(shortLivedToken, BOARD_ID, itemId, TIMELINE_COLUMN_ID, updatedTimeline);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}


function updateTimeline(startDate, endDate) {
  const moment = require('moment');
  const newTimeline = `${moment(startDate).format('YYYY-MM-DD')} - ${moment(endDate).format('YYYY-MM-DD')}`;
  return newTimeline;
}

module.exports = {
  executeAction,
};
