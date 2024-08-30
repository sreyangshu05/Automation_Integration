// Assume you have a Timeline component and a data model for events/tasks
class Timeline {
  constructor(events) {
    this.events = events;
  }
}

class Event {
  constructor(id, startDate, endDate) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  setStartDate(newStartDate) {
    this.startDate = newStartDate;
    timeline.updateTimeline(this.startDate, this.endDate);
  }

  setEndDate(newEndDate) {
    this.endDate = newEndDate;
    
    timeline.updateTimeline(this.startDate, this.endDate);
  }
}

const event = new Event(1, '2022-01-01', '2022-01-31');
const timeline = new Timeline([event]);

document.addEventListener('change', (e) => {
  if (e.target.id === 'start-date' || e.target.id === 'end-date') {
    const newStartDate = document.getElementById('start-date').value;
    const newEndDate = document.getElementById('end-date').value;
    event.setStartDate(newStartDate);
    event.setEndDate(newEndDate);
  }
});