const initMondayClient = require('monday-sdk-js');

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);
    mondayClient.setApiVersion('2024-04');

    const query = `query($itemId: [ID!], $columnId: [String!]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    return response.data.items[0].column_values[0].value;
  } catch (err) {
    console.error(err);
  }
};

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion("2024-01");

    const query = `mutation change_column_value($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};

const updateTimeline = async (token, boardId, itemId, startDateColumnId, endDateColumnId, timelineColumnId) => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion("2024-01");

    
    const startDate = await getColumnValue(token, itemId, startDateColumnId);
    const endDate = await getColumnValue(token, itemId, endDateColumnId);

    
    const timelineValue = {
      from: startDate,
      to: endDate,
    };

    
    const response = await changeColumnValue(token, boardId, itemId, timelineColumnId, timelineValue);
    return response;
  } catch (err) {
    console.error(err);
  }
};


const listenForChanges = async (token, boardId, startDateColumnId, endDateColumnId, timelineColumnId) => {
  try {
    const mondayClient = initMondayClient({ token });
    mondayClient.setApiVersion("2024-01");

    
    const webhookQuery = `mutation create_webhook($boardId: ID!, $columnIds: [String!]) {
      create_webhook(board_id: $boardId, column_ids: $columnIds) {
        id
      }
    }`;
    const webhookVariables = {
      boardId,
      columnIds: [startDateColumnId, endDateColumnId],
    };
    const webhookResponse = await mondayClient.api(webhookQuery, { variables: webhookVariables });
    const webhookId = webhookResponse.data.create_webhook.id;

   
    mondayClient.listen(webhookId, async (event) => {
      if (event.type === "column_value_changed" && (event.columnId === startDateColumnId || event.columnId === endDateColumnId)) {
        // Update the timeline column value when the start date or end date changes
        await updateTimeline(token, boardId, event.itemId, startDateColumnId, endDateColumnId, timelineColumnId);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getColumnValue,
  changeColumnValue,
  updateTimeline,
  listenForChanges,
};
