import React, { Component } from "react";
import axios from 'axios';

import classnames from "classnames";
import Loading from "components/Loading"
import Panel from "components/Panel"

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";


const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  // must be an arrow function because fo how they handle this context
  // they are designed to alter 'this' in a specifoc way
  //  but because we wrapped the function call in an arrow function
  selectPanel(id){
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
   }

   componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    if (focused) {
      this.setState({ focused });
    }

  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }


  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    // console.log(this.state)
    if (this.state.loading) {
      return <Loading />;
    }
  

    const panels = data.filter(
      panel => this.state.focused === null || this.state.focused === panel.id
     )
     .map(panel => (
      <Panel
        key={panel.id}
        // id={panel.id}
        label={panel.label}
        // value={panel.value}
        value={panel.getValue(this.state)}
        onSelect={event => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;


/*

same component, but twithout classes
it would perform the equivalent behaviour
and return the same value.

function Dashboard(props) {
  const dashboardClasses = classnames("dashboard");
  return <main className={dashboardClasses} />;
}

*/
