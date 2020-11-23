import React from 'react';
import Layout from '../components/layout'
import LoadingOverlay from 'react-loading-overlay';
import Notifications, { notify } from 'react-notify-toast';
import Datetime from 'react-datetime';
var moment = require('moment');
import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official'


class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beginningDate: new Date(),
      endingDate: new Date(),
      loadingOverlay : false,
      monthOptions : {
        title: {
          text: "Enquiries"
        },
        xAxis: {
          categories: [],
        },
        tooltip: {
          crosshairs: [true,true],
          formatter: function() {
            return 'The enquiries on <b>' + this.x + '</b> is <b>' + this.y + '</b>.';
        }
        },
        yAxis: {
          categories: [],
          title: {
                      text: 'Enquiries Received'
                  }
        },
        series: [{
          data: [],
           name:"Date"
        }]
        },
    };

    this.show = notify.createShowQueue();
  }



  async componentDidMount() {
    this.submit(); 
  }

  handleDateChange = (event, type) => {
    var date = new Date(event._d);
    console.log(type);
    this.setState({
      [type]: date
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  getDate(date)
  {
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    return `${d}/${parseInt(m)+1}/${y}`;
  }

  submit = async (e) => {
    try {
        this.setState({loadingOverlay : true});
        var beginning = moment(this.getDate(this.state.beginningDate) + '00:00', 'DD-MM-YYYYLT');
        var ending = moment(this.getDate(this.state.endingDate) + '23:59', 'DD-MM-YYYYLT');

        beginning=beginning.toISOString();
        ending=ending.toISOString();

        const url = "http://localhost:4000/api/get-messages";
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ beginning, ending })
          }).then(function(response) {
              return response.json();
            });
            this.setState({loadingOverlay : false});
            if (response.success==true) {
                console.log('response.data',response.data);
              this.show(response.message,'success', 5000);
              this.saleByMonth(response.data);
            } else {
                this.show(response.message,'error', 5000);
            }
        }catch (error) {
            this.setState({loadingOverlay : false});
            this.show(error.message,'error', 5000);
        } 

  }


  async saleByMonth(result)
  {

    Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        return dat;
    }
 
    function getDates(startDate, stopDate) {
       var dateArray = new Array();
       var currentDate = startDate;
       while (currentDate <= stopDate) {
         dateArray.push(currentDate)
         currentDate = currentDate.addDays(1);
       }
       return dateArray;
     }
 
    var dateArray = getDates(this.state.beginningDate, this.state.endingDate);
    
    var enquiries = []
    var dates = []
    dateArray.map((value, index) => {
        enquiries[index] = 0 ;
        var date = this.getDate(value)
        dates.push(date);
        
    console.log(value);
      var monthDate = new Date(value.getFullYear(),value.getMonth(),value.getDate());
       result.map((resultValue, resultIndex) => {
          var date = new Date(resultValue.created)
          var resultDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        if(monthDate.getTime() === resultDate.getTime())
        {
            enquiries[index] = parseInt(enquiries[index]) + 1;
        }
      })
    })

    var monthOptions = this.state.monthOptions;
    monthOptions.series[0].data = enquiries
    monthOptions.xAxis.categories = dates
    this.setState({monthOptions: monthOptions});

  }


  render() {
    return (
        <LoadingOverlay
        active={this.state.loadingOverlay}
        spinner
        text='Processing...'>
        <Layout title="Analytics">
            <Notifications options={{ zIndex: 300, top: '0px' }} />
            <div className="container">
                <div className="analyticscontainer">
                    <div className="row ">
                        <div className="col-md-2 col-2 col-xl-2">
                            <Datetime 
                            timeFormat={false}
                            closeOnSelect={true}
                            onChange={(e) => this.handleDateChange(e, 'beginningDate')}
                            name="beginningDate"
                            inputProps={{id: "beginningDate",readOnly:true}}
                            value={this.state.beginningDate}
                            />
                        </div>
                        <div className="col-md-2 col-2 col-xl-2">
                            <Datetime 
                            timeFormat={false}
                            closeOnSelect={true}
                            onChange={(e) => this.handleDateChange(e, 'endingDate')}
                            name="endingDate"
                            inputProps={{id: "endingDate",readOnly:true}}
                            value={this.state.endingDate}
                            />
                        </div>
                    
                    

                    <button onClick={(e) => this.submit(e)}>Submit</button>
                </div>
            
                

                <div className="card-body">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.monthOptions}
                        allowChartUpdate = { true }
                        updateArgs = { [true, true, true] }
                    />
                    </div>
                </div>
            </div>

        </Layout>
      </LoadingOverlay>
    );
  }
}

export default Analytics;